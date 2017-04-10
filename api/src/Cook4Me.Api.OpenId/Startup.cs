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

using Cook4Me.Api.OpenId.Builders;
using Cook4Me.Api.OpenId.Extensions;
using Cook4Me.Api.OpenId.Parsers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using SimpleIdentityServer.DataAccess.SqlServer;
using SimpleIdentityServer.Host;
using System.Net.Http;

namespace Cook4Me.Api.OpenId
{
    public class Startup
    {
        private readonly IdentityServerOptions _options;
        public IConfigurationRoot Configuration { get; set; }
        
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
            _options = new IdentityServerOptions
            {
                Logging = new LoggingOptions
                {
                    ElasticsearchOptions = new ElasticsearchOptions
                    {
                        IsEnabled = false
                    },
                    FileLogOptions = new FileLogOptions
                    {
                        IsEnabled = false
                    }
                },
                DataSource = new DataSourceOptions
                {
                    OpenIdDataSourceType = DataSourceTypes.InMemory,
                    IsOpenIdDataMigrated = false,
                    EvtStoreDataSourceType = DataSourceTypes.InMemory,
                    IsEvtStoreDataMigrated = false
                },
                IsDeveloperModeEnabled = false,
                Authenticate = new AuthenticateOptions
                {
                    CookieName = Constants.CookieName
                }
            };
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // 1. Add the dependencies needed to enable CORS
            services.AddCors(options => options.AddPolicy("AllowAll", p => p.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()));
            // 2. Add the dependencies to run ASP.NET MVC
            services.AddMvc();
            // 3. Add authentication dependencies & configure it.
            services.AddAuthentication(opts => opts.SignInScheme = Constants.CookieName);
            services.AddAuthorization(opts =>
            {
                opts.AddPolicy("Connected", policy => policy.RequireAssertion((ctx) => {
                    return ctx.User.Identity != null && ctx.User.Identity.AuthenticationType == Constants.CookieName;
                }));
            });
            // 3. Add other dependencies.
            RegisterDependencies(services);
            // 4. Add SimpleIdentityServer.
            services.AddSimpleIdentityServer(_options);
        }

        public void Configure(IApplicationBuilder app,
            IHostingEnvironment env,
            ILoggerFactory loggerFactory)
        {
            // 1. Display status code page
            app.UseStatusCodePages();
            // 2. Enable CORS
            app.UseCors("AllowAll");
            // 3. Use static files
            app.UseStaticFiles();
            // 4. Enable cookie authentication.
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationScheme = Constants.ExternalCookieName
            });
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationScheme = Constants.CookieName
            });
            var dataProtectionProvider = app.ApplicationServices.GetService<IDataProtectionProvider>();
            var dataProtector = dataProtectionProvider.CreateProtector(
                typeof(Startup).FullName, "CourierProvider", "v1");
            app.UseOAuthAuthentication(GetFacebookOptions(dataProtector));
            // 5. Use SimpleIdentityServer
            app.UseSimpleIdentityServer(_options, loggerFactory);
            // 6. Launch ASP.NET MVC
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" });
            });
            // 7. Populate the data
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var simpleIdentityServerContext = serviceScope.ServiceProvider.GetService<SimpleIdentityServerContext>();
                simpleIdentityServerContext.Database.EnsureCreated();
                simpleIdentityServerContext.EnsureSeedData();
            }
        }

        private static void RegisterDependencies(IServiceCollection services)
        {
            services.AddTransient<IRequestBuilder, RequestBuilder>();
        }

        private static OAuthOptions GetFacebookOptions(IDataProtector protector)
        {
            var facebookOpts = new OAuthOptions
            {
                ClientId = "203605726782977",
                ClientSecret = "3eab7b3374ae1ed5728b06342bc25422",
                AuthenticationScheme = "Facebook",
                DisplayName = "Facebook",
                ClaimsIssuer = "Facebook",
                SignInScheme = Constants.ExternalCookieName,
                CallbackPath = "/signin-facebook",
                AuthorizationEndpoint = "https://www.facebook.com/v2.6/dialog/oauth",
                TokenEndpoint = "https://graph.facebook.com/v2.6/oauth/access_token",
                UserInformationEndpoint = "https://graph.facebook.com/v2.6/me",
                StateDataFormat = new PropertiesDataFormat(protector),
                Events = new OAuthEvents
                {
                    OnCreatingTicket = async context =>
                    {
                        var endpoint = QueryHelpers.AddQueryString(context.Options.UserInformationEndpoint, "access_token", context.AccessToken);
                        var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
                        request.Headers.Add("User-Agent", "SimpleIdentityServer");
                        request.Headers.Add("Authorization", "Bearer " + context.AccessToken);
                        var response = await context.Backchannel.SendAsync(request, context.HttpContext.RequestAborted);
                        response.EnsureSuccessStatusCode();
                        var payload = JObject.Parse(await response.Content.ReadAsStringAsync());
                        var claims = FacebookClaimsParser.Process( payload);
                        foreach (var claim in claims)
                        {
                            context.Identity.AddClaim(claim);
                        }
                    }
                }
            };
            facebookOpts.Scope.Add("email");
            facebookOpts.Scope.Add("public_profile");
            return facebookOpts;
        }
    }
}
