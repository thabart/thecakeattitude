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

using System.Xml.Serialization;
using Ups.Client.Common;

namespace Ups.Client.Common
{
    public class Shipment
    {
        [XmlElement(ElementName = Constants.DtoNames.ShipmentNames.AlternateDeliveryAddress)]
        public AlternateDeliveryAddress AlternateDeliveryAddress { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentNames.Shipper)]
        public Shipper Shipper { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentNames.ShipTo)]
        public Ship ShipTo { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentNames.ShipFrom)]
        public Ship ShipFrom { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentNames.PaymentInformation)]
        public PaymentInformation PaymentInformation { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentNames.Service)]
        public TypeParameter Service { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentNames.ShipmentIndicationType)]
        public TypeParameter ShipmentIndicationType { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentNames.Package)]
        public Package Package { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ShipmentNames.ShipmentServiceOptions)]
        public ShipmentServiceOptions ShipmentServiceOptions { get; set; }
    }
}
