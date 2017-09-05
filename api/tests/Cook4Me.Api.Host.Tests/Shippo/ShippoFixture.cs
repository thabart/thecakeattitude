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

using Shippo;
using System.Collections;
using System.Collections.Generic;
using Xunit;

namespace Cook4Me.Api.Host.Tests.Shippo
{
    public class ShippoFixture
    {
        [Fact]
        public void Test()
        {
            var resource = new APIResource("shippo_live_c436088fca4e8ddee7df15da1c46458777e9d687");

            // Create address (from)
            var fromAdr = new Hashtable();
            fromAdr.Add("name", "Mr. Thierry Habart");
            fromAdr.Add("street1", "223 avenue des croix du feu");
            fromAdr.Add("city", "BRUXELLES");
            fromAdr.Add("zip", "1020");
            fromAdr.Add("country", "BE");
            fromAdr.Add("phone", "0485350536");
            fromAdr.Add("email", "habarthierry@hotmail.fr");

            var fromAddress = resource.CreateAddress(fromAdr);

            // Create address (to)
            var toAdr = new Hashtable();
            toAdr.Add("name", "Mr. Donabedian David");
            toAdr.Add("street1", "rue solleveld 20");
            toAdr.Add("city", "BRUXELLES");
            toAdr.Add("zip", "1200");
            toAdr.Add("country", "BE");
            toAdr.Add("phone", "0485350536");
            toAdr.Add("email", "davidonab@hotmail.fr");

            var toAddress = resource.CreateAddress(toAdr);
            
            // Create a parcel (colis)
            var parcel = new Hashtable();
            parcel.Add("length", 5);
            parcel.Add("width", 5);
            parcel.Add("height", 5);
            parcel.Add("distance_unit", "cm");
            parcel.Add("weight", 2);
            parcel.Add("mass_unit", "kg");

            var p = resource.CreateParcel(parcel);

            // Create shippment.
            var shippment = new Hashtable();
            var lstParcels = new List<string> { p.ObjectId };
            shippment.Add("address_to", toAddress.ObjectId);
            shippment.Add("address_from", fromAddress.ObjectId);
            shippment.Add("object_purpose", "PURCHASE");
            shippment.Add("parcels", lstParcels);
            shippment.Add("insurance_currency", "EUR");
            shippment.Add("insurance_amount", 0);
            shippment.Add("submission_type", "DROPOFF");
            shippment.Add("submission_date", "2017-09-04T23:59:50+00:00");
            var ship = resource.CreateShipment(shippment);

            // Get rates
            var rates = resource.GetShippingRatesSync(ship.ObjectId);
            string s = "";
        }
    }
}
