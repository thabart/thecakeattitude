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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Bus;
using System.Linq;
using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Core.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class ShopHandler : Handles<AddShopCommand>
    {
        private readonly IShopRepository _shopRepository;

        public ShopHandler(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public void Handle(AddShopCommand message)
        {
            IEnumerable<ShopPaymentMethod> paymentMethods = null;
            if (message.PaymentMethods != null)
            {
                paymentMethods = message.PaymentMethods.Select(m => new ShopPaymentMethod
                {
                    Id = m.Id,
                    Iban = m.Iban,
                    Method = (ShopPaymentMethods)m.Method
                });
            }

            var aggregate = new ShopAggregate
            {
                Id = message.Id,
                Subject = message.Subject,
                Name = message.Name,
                Description = message.Description,
                BannerImage = message.BannerImage,
                ProfileImage = message.ProfileImage,
                MapName = message.MapName,
                CategoryId = message.CategoryId,
                PlaceId = message.PlaceId,
                StreetAddress = message.StreetAddress,
                PostalCode = message.PostalCode,
                Locality = message.Locality,
                Country = message.Country,
                GooglePlaceId = message.GooglePlaceId,
                Longitude = message.Longitude,
                Latitude = message.Latitude,
                ShopRelativePath = message.ShopRelativePath,
                UndergroundRelativePath = message.UndergroundRelativePath,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime,
                ShopPaymentMethods = paymentMethods,
                TagNames = message.TagNames
            };
            _shopRepository.Add(aggregate);
        }
    }
}
