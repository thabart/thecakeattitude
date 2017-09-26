#region copyright
// Copyright 2017 Habart Thierry
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
#endregion

using Cook4Me.Api.Core;
using Cook4Me.Api.EF;
using Cook4Me.Api.Handlers;
using Cook4Me.Api.Host.Authentications;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;
using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Hubs;
using Cook4Me.Api.Host.Operations.Announcement;
using Cook4Me.Api.Host.Operations.Dhl;
using Cook4Me.Api.Host.Operations.Messages;
using Cook4Me.Api.Host.Operations.Notifications;
using Cook4Me.Api.Host.Operations.Orders;
using Cook4Me.Api.Host.Operations.Product;
using Cook4Me.Api.Host.Operations.Services;
using Cook4Me.Api.Host.Operations.Shop;
using Cook4Me.Api.Host.Operations.ShopCategory;
using Cook4Me.Api.Host.Operations.Tag;
using Cook4Me.Api.Host.Operations.Ups;
using Cook4Me.Api.Host.Validators;
using Cook4Me.Common;
using Dhl.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Openid.Client;
using SimpleIdentityServer.Oauth2Instrospection.Authentication;
using Ups.Client;

namespace Cook4Me.Api.Host
{
    public class Startup
    {
        private static bool _isInitialized = false;
        public IConfigurationRoot Configuration { get; set; }
        
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // 1. Add the dependencies needed to enable CORS
            services.AddCors(options => options.AddPolicy("AllowAll", p => p.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()));
            // 2. Add the dependencies to run ASP.NET MVC
            services.AddMvc();
            // 3. Add authorization rule.
            services.AddAuthorization(opts =>
            {
                opts.AddPolicy("Connected", policy => policy.RequireAssertion((ctx) => ctx.User != null && ctx.User.Identity != null && ctx.User.Identity.IsAuthenticated));
            });
            // 4. Add signal-r
            services.AddSignalR(options =>
            {
                options.Hubs.EnableDetailedErrors = true;
            });
            // 4. Add other dependencies.
            RegisterDependencies(services, Configuration);
        }

        public void Configure(IApplicationBuilder app,
            IHostingEnvironment env,
            ILoggerFactory loggerFactory)
        {
            var introspectUrl = Configuration["Introspect:Url"];
            var clientId = Configuration["Introspect:ClientId"];
            var clientSecret = Configuration["Introspect:ClientSecret"];
            loggerFactory.AddConsole().AddDebug();
            // 1. Display status code page
            app.UseStatusCodePages();
            // 2. Enable CORS
            app.UseCors("AllowAll");
            // 3. Use static files
            app.UseStaticFiles();
            // 4. Authenticate SignalR request
            app.UseJwtSignalRAuthentication();
            // 5. Authenticate the request with OAUTH2.0 introspection endpoint.
            app.UseAuthenticationWithIntrospection(new Oauth2IntrospectionOptions
            {
                InstrospectionEndPoint = introspectUrl,
                ClientId = clientId,
                ClientSecret = clientSecret
            });
            // 6. Use static files
            app.UseStaticFiles();
            // 7. Migrate the data.
            if (!_isInitialized)
            {
                using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
                {
                    var simpleIdentityServerContext = serviceScope.ServiceProvider.GetService<CookDbContext>();
                    var isTstMode = serviceScope.ServiceProvider.GetService<ISettingsProvider>().IsTstMode();
                    simpleIdentityServerContext.Database.EnsureCreated();
                    simpleIdentityServerContext.EnsureSeedData(isTstMode);
                    _isInitialized = true;
                }
            }

            // 8. Launch Signal-R
            app.UseSignalR<RawConnection>("/raw-connection");
            app.UseSignalR();
            // 9. Launch ASP.NET MVC
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "addSub",
                    template: "{controller}/{id}/{action}/{subid}",
                    defaults: new { controller = "Home", action = "Index" });
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }

        private static void RegisterDependencies(IServiceCollection services, IConfigurationRoot configuration)
        {
            var settingsProvider = new SettingsProvider
            {
                BaseOpenidUrl = configuration["baseOpenid"],
                BaseWebsite = configuration["baseWebsite"],
                PaypalClientId = configuration["Paypal:ClientId"],
                PaypalClientSecret = configuration["Paypal:ClientSecret"],
                PaypalEmail = configuration["Paypal:email"],
                TstMode = true,
                UpsLicenseNumber = configuration["Ups:LicenseNumber"],
                UpsPassword = configuration["Ups:Password"],
                UpsUsername = configuration["Ups:Username"]
            };

            services.AddSingleton(typeof(ISettingsProvider), settingsProvider);
            services.AddCookForMeStoreInMemory()
                .AddCommon()
                .AddOpenidClient()
                .AddUpsClient()
                .AddDhlClient()
                .AddPaypalClient()
                .AddCore()
                .AddHandlers();
            services.AddTransient<IResponseBuilder, ResponseBuilder>();
            services.AddTransient<IRequestBuilder, RequestBuilder>();
            services.AddTransient<IHalResponseBuilder, HalResponseBuilder>();
            services.AddTransient<IGetOrderLabelValidator, GetOrderLabelValidator>();
            services.AddTransient<IRemoveServiceCommentValidator, RemoveServiceCommentValidator>();
            services.AddTransient<IAddShopValidator, AddShopValidator>();
            services.AddTransient<IUpdateShopValidator, UpdateShopValidator>();
            services.AddTransient<IAddCommentValidator, AddCommentValidator>();
            services.AddTransient<IRemoveShopCommentValidator, RemoveShopCommentValidator>();
            services.AddTransient<IRemoveProductCommentValidator, RemoveProductCommentValidator>();
            services.AddTransient<IRemoveClientServiceValidator, RemoveClientServiceValidator>();
            services.AddTransient<IAddClientServiceValidator, AddClientServiceValidator>();
            services.AddTransient<IUpdateNotificationValidator, UpdateNotificationValidator>();
            services.AddTransient<ICancelOrderValidator, CancelOrderValidator>();
            services.AddTransient<IRemoveShopValidator, RemoveShopValidator>();
            services.AddTransient<IAddProductValidator, AddProductValidator>();
            services.AddTransient<IAddServiceValidator, AddServiceValidator>();
            services.AddTransient<IAddMessageValidator, AddMessageValidator>();
            services.AddTransient<IUpdateOrderValidator, UpdateOrderValidator>();
            services.AddTransient<IRemoveOrderValidator, RemoveOrderValidator>();
            services.AddTransient<IAddOrderLineValidator, AddOrderLineValidator>();
            services.AddTransient<ICancelOrderOperation, CancelOrderOperation>();
            services.AddTransient<IAcceptOrderTransactionValidator, AcceptOrderTransactionValidator>();
            services.AddTransient<IPurchaseOrderLabelValidator, PurchaseOrderLabelValidator>();
            services.AddTransient<IConfirmOrderLabelPurchaseValidator, ConfirmOrderLabelPurchaseValidator>();
            services.AddTransient<IGetPaymentDetailsValidator, GetPaymentDetailsValidator>();
            services.AddTransient<IControllerHelper, ControllerHelper>();
            services.AddTransient<IAddShopOperation, AddShopOperation>();
            services.AddTransient<IAddShopCommentOperation, AddShopCommentOperation>();
            services.AddTransient<IGetShopOperation, GetShopOperation>();
            services.AddTransient<IGetShopsOperation, GetShopsOperation>();
            services.AddTransient<ISearchShopsOperation, SearchShopsOperation>();
            services.AddTransient<IGetMineShopsOperation, GetMineShopsOperation>();
            services.AddTransient<ISearchParcelShopLocationsOperation, SearchParcelShopLocationsOperation>();
            services.AddTransient<IRemoveShopCommentOperation, RemoveShopCommentOperation>();
            services.AddTransient<ISearchShopCommentsOperation, SearchShopCommentsOperation>();
            services.AddTransient<ISearchProductsOperation, SearchProductsOperation>();
            services.AddTransient<ISearchTagsOperation, SearchTagsOperation>();
            services.AddTransient<IGetAllTagsOperation, GetAllTagsOperation>();
            services.AddTransient<IGetAllShopCategoriesOperation, GetAllShopCategoriesOperation>();
            services.AddTransient<IGetShopCategoryOperation, GetShopCategoryOperation>();
            services.AddTransient<IGetParentShopCategoriesOperation, GetParentShopCategoriesOperation>();
            services.AddTransient<IGetShopCategoryMapOperation, GetShopCategoryMapOperation>();
            services.AddTransient<IGetProductOperation, GetProductOperation>();
            services.AddTransient<ISearchProductCommentsOperation, SearchProductCommentsOperation>();
            services.AddTransient<IAddProductCommentOperation, AddProductCommentOperation>();
            services.AddTransient<IRemoveProductCommentOperation, RemoveProductCommentOperation>();
            services.AddTransient<ISearchServiceOccurrencesOperation, SearchServiceOccurrencesOperation>();
            services.AddTransient<ISearchServicesOperation, SearchServicesOperation>();
            services.AddTransient<IGetServiceOperation, GetServiceOperation>();
            services.AddTransient<ISearchServiceCommentsOperation, SearchServiceCommentsOperation>();
            services.AddTransient<IAddServiceCommentOperation, AddServiceCommentOperation>();
            services.AddTransient<IRemoveServiceCommentOperation, RemoveServiceCommentOperation>();
            services.AddTransient<IGetClientServiceOperation, GetClientServiceOperation>();
            services.AddTransient<IDeleteClientServiceOperation, DeleteClientServiceOperation>();
            services.AddTransient<IAddClientServiceOperation, AddClientServiceOperation>();
            services.AddTransient<ISearchClientServicesOperation, SearchClientServicesOperation>();
            services.AddTransient<IGetMineClientServicesOperation, GetMineClientServicesOperation>();
            services.AddTransient<ISearchMineShopsOperation, SearchMineShopsOperation>();
            services.AddTransient<IGetNotificationStatusOperation, GetNotificationStatusOperation>();
            services.AddTransient<ISearchMessagesOperation, SearchMessagesOperation>();
            services.AddTransient<IGetPaymentDetailsOperation, GetPaymentDetailsOperation>();
            services.AddTransient<IAddMessageOperation, AddMessageOperation>();
            services.AddTransient<IGetMessageOperation, GetMessageOperation>();
            services.AddTransient<IUpdateShopOperation, UpdateShopOperation>();
            services.AddTransient<IAddProductOperation, AddProductOperation>();
            services.AddTransient<IDeleteShopOperation, DeleteShopOperation>();
            services.AddTransient<IAddServiceOperation, AddServiceOperation>();
            services.AddTransient<IGetRatingsOperation, GetRatingsOperation>();
            services.AddTransient<IGetOrderLabelOperation, GetOrderLabelOperation>();
            services.AddTransient<IGetUpsServicesOperation, GetUpsServicesOperation>();
            services.AddTransient<IGetOrderStatusOperation, GetOrderStatusOperation>();
            services.AddTransient<IUpdateNotificationOperation, UpdateNotificationOperation>();
            services.AddTransient<ISearchNotificationsOperation, SearchNotificationsOperation>();
            services.AddTransient<IConfirmOrderLabelPurchaseOperation, ConfirmOrderLabelPurchaseOperation>();
            services.AddTransient<IUpdateOrderOperation, UpdateOrderOperation>();
            services.AddTransient<ISearchOrdersOperation, SearchOrdersOperation>();
            services.AddTransient<IGetLocationsOperation, GetLocationsOperation>();
            services.AddTransient<IGetOrderOperation, GetOrderOperation>();
            services.AddTransient<IDeleteOrderOperation, DeleteOrderOperation>();
            services.AddTransient<IAddOrderLineOperation, AddOrderLineOperation>();
            services.AddTransient<IPurchaseLabelOperation, PurchaseLabelOperation>();
            services.AddTransient<IConfirmOrderPurchaseOperation, ConfirmOrderPurchaseOperation>();
            services.AddTransient<IGetOrderTransactionOperation, GetOrderTransactionOperation>();
            services.AddTransient<IPurchaseUpsLabelOperation, PurchaseUpsLabelOperation>();
            services.AddTransient<ISearchDhlCapabalitiesOperation, SearchDhlCapabalitiesOperation>();
            services.AddTransient<ISearchMineClientServices, SearchMineClientServices>();
            services.AddTransient<IServiceCommentEnricher, ServiceCommentEnricher>();
            services.AddTransient<IShopEnricher, ShopEnricher>();
            services.AddTransient<IProductCommentEnricher, ProductCommentEnricher>();
            services.AddTransient<IShopCommentEnricher, ShopCommentEnricher>();
            services.AddTransient<IOrderEnricher, OrderEnricher>();
            services.AddTransient<IProductEnricher, ProductEnricher>();
            services.AddTransient<ITagEnricher, TagEnricher>();
            services.AddTransient<IShopCategoryEnricher, ShopCategoryEnricher>();
            services.AddTransient<IMapEnricher, MapEnricher>();
            services.AddTransient<IServiceOccurrenceEnricher, ServiceOccurrenceEnricher>();
            services.AddTransient<IServiceEnricher, ServiceEnricher>();
            services.AddTransient<IClientServiceEnricher, ClientServiceEnricher>();
            services.AddTransient<INotificationEnricher, NotificationEnricher>();
            services.AddTransient<IMessageEnricher, MessageEnricher>();
            services.AddSingleton<IHandlersInitiator, HandlersInitiator>();
            services.AddSingleton<ShopEventsHandler>();
            services.AddSingleton<ProductEventsHandler>();
            services.AddSingleton<ServiceEventsHandler>();
            services.AddSingleton<ClientServiceEventsHandler>();
            services.AddSingleton<MessageEventsHandler>();
            services.AddSingleton<Handlers.NotificationEventsHandler>();
            services.AddSingleton<OrderEventsHandler>();
        }
    }
}
