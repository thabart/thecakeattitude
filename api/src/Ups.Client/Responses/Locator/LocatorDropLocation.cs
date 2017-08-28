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
using Ups.Client.Common;

namespace Ups.Client.Responses.Locator
{
    public class LocatorDropLocation
    {
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.LocationId)]
        public string LocationId { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.OriginOrDestination)]
        public string OriginOrDestination { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.Ivr)]
        public IntegratedVoiceResponseInformation Ivr { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.Geocode)]
        public Geocode Geocode { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.AddressKeyFormat)]
        public AddressKeyFormatType AddressKeyFormat { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.PhoneNumber)]
        public string PhoneNumber { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.FaxNumber)]
        public string FaxNumber { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.EmailAddress)]
        public string EmailAddress { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.LocationAttribute)]
        public LocationAttribute LocationAttribute { get; set; }
        // [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.Distance)]
        // public string Distance { get; set; }
        // [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.SpecialInstructions)]
        // public string Distance { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.LatestGroundDropOffTime)]
        public string LatestGroundDropOffTime { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.LatestAirDropOffTime)]
        public string LatestAirDropOffTime { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.AdditionalChargeIndicator)]
        public string AdditionalChargeIndicator { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.StandardHoursOfOperation)]
        public string StandardHoursOfOperation { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.NonStandardHoursOfOperation)]
        public string NonStandardHoursOfOperation { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.WillCallHoursOfOperation)]
        public string WillCallHoursOfOperation { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.Number)]
        public string Number { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.HomePageURL)]
        public string HomePageURL { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.Comments)]
        public string Comments { get; set; }
        // [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.AdditionalComments)]
        // public string AdditionalComments { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.Disclaimer)]
        public string Disclaimer { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.Slic)]
        public string Slic { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.Timezone)]
        public string Timezone { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.FacilityType)]
        public string FacilityType { get; set; }
        // [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.OperatingHours)]
        // public string OperatingHours { get; set; }
        // [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.LocalizedInstruction)]
        // public string LocalizedInstruction { get; set; }
        // [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.PromotionInformation)]
        // public string PromotionInformation { get; set; }
        // [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.SortCode)]
        // public string SortCode { get; set; }
        // [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.ServiceOfferingList)]
        // public string ServiceOfferingList { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.DisplayPhoneNumberIndicator)]
        public string DisplayPhoneNumberIndicator { get; set; }
        // [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.AccessPointInformation)]
        // public string AccessPointInformation { get; set; }
        // [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.LocationImage)]
        // public string LocationImage { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.LocationNewIndicator)]
        public string LocationNewIndicator { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.PromotionalLinkURL)]
        public string PromotionalLinkURL { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.FeaturedRank)]
        public string FeaturedRank { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorDropLocationNames.WillCallLocationIndicator)]
        public string WillCallLocationIndicator { get; set; }
    }
}
