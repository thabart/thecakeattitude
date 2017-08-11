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

using Cook4Me.Api.EF.Mappings;
using Cook4Me.Api.EF.Models;
using Microsoft.EntityFrameworkCore;

namespace Cook4Me.Api.EF
{
    public class CookDbContext : DbContext
    {
        public CookDbContext(DbContextOptions dbContextOptions):base(dbContextOptions)
        {
        }

        public virtual DbSet<Shop> Shops { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Map> Maps { get; set; }
        public virtual DbSet<Tag> Tags { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<ShopTag> ShopTags { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<ProductCategory> ProductCategories { get; set; }
        public virtual DbSet<Filter> Filters { get; set; }
        public virtual DbSet<FilterValue> FilterValues { get; set; }
        public virtual DbSet<ProductPromotion> Promotions { get; set; }
        public virtual DbSet<Service> Services { get; set; }
        public virtual DbSet<ServiceOccurrence> ServiceOccurrences { get; set; }
        public virtual DbSet<ServiceOccurrenceDay> ServiceOccurrenceDays { get; set; }
        public virtual DbSet<ServiceDay> ServiceDays { get; set; }
        public virtual DbSet<ClientService> ClientServices { get; set; }
        public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.AddCategory()
                .AddShopMapping()
                .AddMapMapping()
                .AddTagMapping()
                .AddShopTagMapping()
                .AddPaymentMethod()
                .AddComment()
                .AddFilter()
                .AddFilterValue()
                .AddProductCategory()
                .AddProductFilter()
                .AddProductImage()
                .AddProduct()
                .AddProductTag()
                .AddProductPromotion()
                .AddService()
                .AddServiceImage()
                .AddServiceTag()
                .AddServiceOccurrence()
                .AddServiceOccurrenceDay()
                .AddServiceAddDayMapping()
                .AddAnnouncement()
                .AddNotification()
                .AddNotificationParameter()
                .AddMessageJoinedFileMappingMapping()
                .AddMessageMapping();
        }
    }
}
