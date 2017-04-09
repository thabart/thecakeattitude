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

using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.EF.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Cook4Me.Api.EF
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCookForMeStoreSqlServer(this IServiceCollection serviceCollection, string connectionString)
        {
            if (serviceCollection == null)
            {
                throw new ArgumentNullException(nameof(serviceCollection));
            }

            RegisterServices(serviceCollection);
            serviceCollection.AddEntityFramework()
                .AddDbContext<CookDbContext>(options =>
                    options.UseSqlServer(connectionString));
            return serviceCollection;
        }

        public static IServiceCollection AddCookForMeStoreSqlLite(this IServiceCollection serviceCollection, string connectionString)
        {
            if (serviceCollection == null)
            {
                throw new ArgumentNullException(nameof(serviceCollection));
            }

            RegisterServices(serviceCollection);
            serviceCollection.AddEntityFramework()
                .AddDbContext<CookDbContext>(options =>
                    options.UseSqlite(connectionString));
            return serviceCollection;
        }

        public static IServiceCollection AddCookForMeStorePostGre(this IServiceCollection serviceCollection, string connectionString)
        {
            if (serviceCollection == null)
            {
                throw new ArgumentNullException(nameof(serviceCollection));
            }

            RegisterServices(serviceCollection);
            serviceCollection.AddEntityFramework()
                .AddDbContext<CookDbContext>(options =>
                    options.UseNpgsql(connectionString));
            return serviceCollection;
        }

        public static IServiceCollection AddCookForMeStoreInMemory(this IServiceCollection serviceCollection)
        {
            if (serviceCollection == null)
            {
                throw new ArgumentNullException(nameof(serviceCollection));
            }

            RegisterServices(serviceCollection);
            serviceCollection.AddEntityFramework()
                .AddDbContext<CookDbContext>((options => options.UseInMemoryDatabase().ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))));
            return serviceCollection;
        }


        private static void RegisterServices(IServiceCollection serviceCollection)
        {
            serviceCollection.AddTransient<IShopRepository, ShopRepository>();
            serviceCollection.AddTransient<IUserRepository, UserRepository>();
            serviceCollection.AddTransient<ICategoryRepository, CategoryRepository>();
        }
    }
}
