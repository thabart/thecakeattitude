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

using System.Xml.Serialization;
using Ups.Client.Responses.Rating;

namespace Ups.Client.Responses.Ship
{
    public class ShipmentCharges
    {
        [XmlElement(ElementName = Constants.DtoNames.ShipmentChargesNames.RateChart)]
        public string RateChart { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentChargesNames.BaseServiceCharge)]
        public RatingCharges BaseServiceCharge { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentChargesNames.TransportationCharges)]
        public RatingCharges TransportationCharges { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentChargesNames.ServiceOptionsCharges)]
        public RatingCharges ServiceOptionsCharges { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentChargesNames.TotalCharges)]
        public RatingCharges TotalCharges { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentChargesNames.TotalChargesWithTaxes)]
        public RatingCharges TotalChargesWithTaxes { get; set; }
    }
}
