﻿#region copyright
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

using Cook4Me.Api.EF.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace Cook4Me.Api.EF.Mappings
{
    internal static class ProductMapping
    {
        public static ModelBuilder AddProduct(this ModelBuilder modelBuilder)
        {
            if (modelBuilder == null)
            {
                throw new ArgumentNullException(nameof(modelBuilder));
            }

            modelBuilder.Entity<Product>()
                .ToTable("products")
                .HasKey(s => s.Id);
            modelBuilder.Entity<Product>()
                .HasMany(s => s.Images)
                .WithOne(s => s.Product)
                .HasForeignKey(s => s.ProductId);
            modelBuilder.Entity<Product>()
                .HasMany(s => s.Comments)
                .WithOne(s => s.Product)
                .HasForeignKey(s => s.ProductId);
            modelBuilder.Entity<Product>()
                .HasMany(s => s.Tags)
                .WithOne(s => s.Product)
                .HasForeignKey(s => s.ProductId);
            modelBuilder.Entity<Product>()
                .HasMany(s => s.Filters)
                .WithOne(s => s.Product)
                .HasForeignKey(s => s.ProductId);
            modelBuilder.Entity<Product>()
                .HasMany(p => p.Messages)
                .WithOne(p => p.Product)
                .HasForeignKey(p => p.ProductId);
            modelBuilder.Entity<Product>()
                .HasMany(a => a.OrderLines)
                .WithOne(a => a.Product)
                .HasForeignKey(a => a.ProductId);
            return modelBuilder;
        }
    }
}
