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

namespace Cook4Me.Api.Core.Aggregates
{
    public enum Transporters
    {
        None,
        Ups,
        Dhl
    }

    public class OrderAggregateParcel
    {
        public string Id { get; set; }
        public double EstimatedPrice { get; set; }
        public Transporters Transporter { get; set; }

        #region Buyer information

        public string BuyerName { get; set; }
        public string BuyerAddressLine { get; set; }
        public string BuyerCity { get; set; }
        public string BuyerCountryCode { get; set; }
        public int BuyerPostalCode { get; set; }

        #endregion

        #region Seller information

        public string SellerName { get; set; }
        public string SellerAddressLine { get; set; }
        public string SellerCity { get; set; }
        public string SellerCountryCode { get; set; }
        public int SellerPostalCode { get; set; }

        #endregion

        #region Parcel shop

        public string ParcelShopId { get; set; }
        public string ParcelShopName { get; set; }
        public double ParcelShopLatitude { get; set; }
        public double ParcelShopLongitude { get; set; }
        public string ParcelShopAddressLine { get; set; }
        public string ParcelShopCity { get; set; }
        public string ParcelShopCountryCode { get; set; }
        public int ParcelShopPostalCode { get; set; }

        #endregion

        public string OrderId { get; set; }
    }
}
