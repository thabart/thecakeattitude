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

namespace Ups.Client
{
    public static class Constants
    {
        public const string TstBaseUrl = "https://wwwcie.ups.com";
        public const string PrdBaseUrl = "https://onlinetools.ups.com";

        public static class DtoNames
        {
            public static class TrackShipmentPackageActivityStatusResponseNames
            {
                public const string StatusType = "StatusType";
                public const string StatusCode = "StatusCode";
            }

            public static class TrackShipmentPackageActivityResponseNames
            {
                public const string Status = "Status";
                public const string Date = "Date";
                public const string Time = "Time";
            }

            public static class TrackShipmentPackageResponseNames
            {
                public const string Activity = "Activity";
            }

            public static class TrackShipmentResponseNames
            {
                public const string Package = "Package";
            }

            public static class TrackResponseNames
            {
                public const string Response = "Response";
                public const string Shipment = "Shipment";
            }

            public static class TrackRequestNames
            {
                public const string Request = "Request";
                public const string TrackingNumber = "TrackingNumber";
            }

            public static class VoidShipmentResponseNames
            {
                public const string Response = "Response";
            }

            public static class VoidShipmentRequestNames
            {
                public const string Request = "Request";
                public const string ShipmentIdentificationNumber = "ShipmentIdentificationNumber";
            }

            public static class PackageResultsNames
            {
                public const string TrackingNumber = "TrackingNumber";
                public const string ServiceOptionsCharges = "ServiceOptionsCharges";
                public const string LabelImage = "LabelImage";
            }

            public static class LabelRecoveryResponseNames
            {
                public const string Response = "Response";
                public const string ShipmentIdentificationNumber = "ShipmentIdentificationNumber";
                public const string LabelResults = "LabelResults";
            }

            public static class LabelResultsNames
            {
                public const string TrackingNumber = "TrackingNumber";
                public const string LabelImage = "LabelImage";
                public const string Receipt = "Receipt";
            }

            public static class LabelImageNames
            {
                public const string LabelImageFormat = "LabelImageFormat";
                public const string GraphicImage = "GraphicImage";
                public const string HTMLImage = "HTMLImage";
            }

            public static class ReceiptNames
            {
                public const string Image = "Image";
            }

            public static class ImageNames
            {
                public const string ImageFormat = "ImageFormat";
                public const string GraphicImage = "GraphicImage";
            }

            public static class LabelRecoveryRequestNames
            {
                public const string Request = "Request";
                public const string TrackingNumber = "TrackingNumber";
            }

            public static class ShipmentConfirmResponseNames
            {
                public const string Response = "Response";
                public const string ShipmentCharges = "ShipmentCharges";
                public const string ShipmentIdentificationNumber = "ShipmentIdentificationNumber";
                public const string MIDualReturnShipmentKey = "MIDualReturnShipmentKey";
                public const string ShipmentDigest = "ShipmentDigest";
            }

            public static class ShipmentChargesNames
            {
                public const string RateChart = "RateChart";
                public const string BaseServiceCharge = "BaseServiceCharge";
                public const string TransportationCharges = "TransportationCharges";
                public const string ServiceOptionsCharges = "ServiceOptionsCharges";
                public const string TaxCharges = "TaxCharges";
                public const string TotalCharges = "TotalCharges";
                public const string TotalChargesWithTaxes = "TotalChargesWithTaxes";

            }

            public static class LabelSpecificationNames
            {
                public const string LabelPrintMethod = "LabelPrintMethod";
                public const string HTTPUserAgent = "HTTPUserAgent";
                public const string LabelImageFormat = "LabelImageFormat";
            }

            public static class PaymentInformationNames
            {
                public const string Prepaid = "Prepaid";
            }

            public static class PrepaidNames
            {
                public const string BillShipper = "BillShipper";
            }

            public static class BillShipperNames
            {
                public const string AccountNumber = "AccountNumber";
                public const string CreditCard = "CreditCard";
                public const string AlternatePaymentMethod = "AlternatePaymentMethod";
            }

            public static class CreditCardNames
            {
                public const string Type = "Type";
                public const string Number = "Number";
                public const string ExpirationDate = "ExpirationDate";
                public const string SecurityCode = "SecurityCode";
                public const string Address = "Address";
            }

            public static class ShipmentServiceOptionsNames
            {
                public const string Notification = "Notification";
            }

            public static class NotificationNames
            {
                public const string NotificationCode = "NotificationCode";
                public const string EMailMessage = "EMailMessage";
                public const string Locale = "Locale";
            }

            public static class EMailMessageNames
            {
                public const string EMailAddress = "EMailAddress";
            }

            public static class LocaleNames
            {
                public const string Language = "Language";
                public const string Dialect = "Dialect";
            }

            public static class RatedShipmentNames
            {
                public const string Service = "Service";
                public const string TransportationCharges = "TransportationCharges";
                public const string ServiceOptionsCharges = "ServiceOptionsCharges";
                public const string TotalCharges = "TotalCharges";
                public const string RatedShipmentWarning = "RatedShipmentWarning";
            }

            public static class RatingChargesNames
            {
                public const string CurrencyCode = "CurrencyCode";
                public const string MonetaryValue = "MonetaryValue";
            }

            public static class RatingServiceSelectionResponseNames
            {
                public const string Response = "Response";
                public const string RatedShipment = "RatedShipment";
            }

            public static class DimensionsNames
            {
                public const string UnitOfMeasurement = "UnitOfMeasurement";
                public const string Length = "Length";
                public const string Width = "Width";
                public const string Height = "Height";
            }

            public static class PackageNames
            {
                public const string PackagingType = "PackagingType";
                public const string Dimensions = "Dimensions";
                public const string PackageWeight = "PackageWeight";
            }

            public static class ShipperNames
            {
                public const string Name = "Name";
                public const string CompanyName = "CompanyName";
                public const string PhoneNumber = "PhoneNumber";
                public const string ShipperNumber = "ShipperNumber";
                public const string Address = "Address";
            }

            public static class ShipNames
            {
                public const string Name = "Name";
                public const string Address = "Address";
                public const string AttentionName = "AttentionName";
                public const string CompanyName = "CompanyName";
            }

            public static class AlternateDeliveryAddressNames
            {
                public const string Name = "Name";
                public const string AttentionName = "AttentionName";
                public const string UPSAccessPointID = "UPSAccessPointID";
                public const string Address = "Address";
            }

            public static class AvailableLocationAttributeNames
            {
                public const string OptionType = "OptionType";
                public const string OptionCode = "OptionCode";
            }

            public static class LocationImageNames
            {
                public const string SecureURL = "SecureURL";
                public const string NonSecureURL = "NonSecureURL";
            }

            public static class AccessPointInformationNames
            {
                public const string PublicAccessPointId = "PublicAccessPointID";
                public const string ImageUrl = "ImageURL";
                public const string BusinessClassificationList = "BusinessClassificationList";
                public const string AccessPointStatus = "AccessPointStatus";
                public const string FacilitySlic = "FacilitySLIC";
                public const string Availability = "Availability";
                public const string PrivateNetworkList = "PrivateNetworkList";
            }

            public static class BusinessClassificationListNames
            {
                public const string BusinessClassification = "BusinessClassification";
            }

            public static class BusinessClassificationNames
            {
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class AccessPointStatusNames
            {
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class AvailabilityNames
            {
                public const string ShippingAvailability = "ShippingAvailability";
                public const string DcrAvailability = "DCRAvailability";
            }

            public static class ShippingAvailabilityNames
            {
                public const string AvailableIndicator = "AvailableIndicator";
                public const string UnavailableReason = "UnavailableReason";
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class DcrAvailabilityNames
            {
                public const string AvailableIndicator = "AvailableIndicator";
                public const string UnavailableReason = "UnavailableReason";
            }

            public static class UnavailableReasonNames
            {
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class PrivateNetworkListNames
            {
                public const string PrivateNetwork = "PrivateNetwork";
            }

            public static class PrivateNetworkNames
            {
                public const string NetworkId = "NetworkID";
                public const string NetworkDescription = "NetworkDescription";
            }

            public static class ServiceOfferingListNames
            {
                public const string ServiceOffering = "ServiceOffering";
            }

            public static class ServiceOfferingNames
            {
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class SortCodeNames
            {
                public const string HubSortCode = "HubSortCode";
                public const string FreightSortFacilityCode = "FreightSortFacilityCode";
            }

            public static class ShipperType
            {
                public const string Name = "Name";
                public const string AttentionName = "AttentionName";
                public const string TaxIdentificationNumber = "TaxIdentificationNumber";
                public const string Phone = "Phone";
                public const string ShipperNumber = "ShipperNumber";
                public const string FaxNumber = "FaxNumber";
                public const string Address = "Address";
            }

            public static class PromotionInformationNames
            {
                public const string Locale = "Locale";
                public const string Promotion = "Promotion";
            }

            public static class LocalizedInstructionNames
            {
                public const string Locale = "Locale";
                public const string Last50ftInstruction = "Last50ftInstruction";
            }

            public static class Phone
            {
                public const string Number = "Number";
                public const string Extension = "Extension";
            }

            public static class Shipment
            {
                public const string Description = "Description";
                public const string Shipper = "Shipper";
                public const string ShipTo = "ShipTo";
                public const string ShipFrom = "ShipFrom";
                public const string PaymentInformation = "PaymentInformation";
                public const string Service = "Service";
                public const string Package = "Package";
            }

            public static class BillShipperType
            {
                public const string AccountNumber = "AccountNumber";
            }

            public static class ShipmentChargeType
            {
                public const string Type = "Type";
                public const string BillShipper = "BillShipper";
            }

            public static class PaymentInfoType
            {
                public const string ShipmentCharge = "ShipmentCharge";
            }

            public static class ServiceTypeNames
            {
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class PackageType
            {
                public const string Description = "Description";
                public const string Packaging = "Packaging";
                public const string Dimensions = "Dimensions";
                public const string PackageWeight = "PackageWeight";
            }

            public static class PackageDimensionType
            {
                public const string UnitOfMeasurement = "UnitOfMeasurement";
                public const string Length = "Length";
                public const string Width = "Width";
                public const string Height = "Height";
            }

            public static class LabelSpecificationType
            {
                public const string LabelImageFormat = "LabelImageFormat";
                public const string HttpUserAgent = "HTTPUserAgent";
            }

            // Common.
            public static class UpsSecurityNames
            {
                public const string UserNameToken = "UsernameToken";
                public const string ServiceAccessToken = "ServiceAccessToken";
            }

            public static class UsernameTokenTypeNames
            {
                public const string Username = "Username";
                public const string Password = "Password";
            }

            public static class AccessRequestTypeNames
            {
                public const string AccessLicenseNumber = "AccessLicenseNumber";
                public const string UserId = "UserId";
                public const string Password = "Password";
            }

            public static class ServiceAccessTokenNames
            {
                public const string AccessLicenseNumber = "AccessLicenseNumber";
            }

            public static class RequestTypeNames
            {
                public const string RequestAction = "RequestAction";
                public const string RequestOption = "RequestOption";
                public const string TransactionReferenceType = "TransactionReferenceType";
            }

            public static class TransactionReferenceTypeNames
            {
                public const string CustomerContext = "CustomerContext";
                public const string XpciVersion = "XpciVersion";
            }

            public static class AddressTypeNames
            {
                public const string AddressLine = "AddressLine";
                public const string City = "City";
                public const string StateProvinceCode = "StateProvinceCode";
                public const string PostalCode = "PostalCode";
                public const string CountryCode = "CountryCode";
            }

            public static class AddressKeyFormatTypeNames
            {
                public const string AddressLine = "AddressLine";
                public const string PoliticalDivision1 = "PoliticalDivision1";
                public const string PoliticalDivision2 = "PoliticalDivision2";
                public const string PoliticalDivision3 = "PoliticalDivision3";
                public const string CountryCode = "CountryCode";
                public const string ConsigneeName = "ConsigneeName";
                public const string PostcodePrimaryLow = "PostcodePrimaryLow";
                public const string PostcodeExtendedLow = "PostcodeExtendedLow";
            }

            public static class AddressNames
            {
                public const string AddressLine1 = "AddressLine1";
                public const string City = "City";
                public const string PostalCode = "PostalCode";
                public const string CountryCode = "CountryCode";
            }

            public static class UnitOfMeasurementTypeNames
            {
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class PackageWeightTypeNames
            {
                public const string UnitOfMeasurement = "UnitOfMeasurement";
                public const string Weight = "Weight";
            }

            public static class StructuredPhoneNumberTypeNames
            {
                public const string StructuredPhoneNumberType = "StructuredPhoneNumberType";
                public const string PhoneLineNumber = "PhoneLineNumber";
            }

            public static class GeocodeNames
            {
                public const string Latitude = "Latitude";
                public const string Longitude = "Longitude";
            }

            public static class TypeParameterNames
            {
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class OptionCodeNames
            {
                public const string Category = "Category";
                public const string Code = "Code";
                public const string Description = "Description";
                public const string Name = "Name";
                public const string TransportationPickUpSchedule = "TransportationPickUpSchedule";

            }

            // Locator.
            public static class LocatorRequestNames
            {
                public const string Security = "AccessRequest";
                public const string Body = "LocatorRequest";
            }

            public static class LocatorRequestBodyNames
            {
                public const string Request = "Request";
                public const string Address = "OriginAddress";
                public const string Translate = "Translate";
                public const string UnitOfMeasurement = "UnitOfMeasurement";
                public const string LocationID = "LocationID";
            }

            public static class LocatorOriginAddressNames
            {
                public const string PhoneNumber = "PhoneNumber";
                public const string Address = "AddressKeyFormat";
            }

            // Locator response
            public static class ResponseBodyNames
            {
                public const string TransactionReference = "TransactionReference";
                public const string ResponseStatusCode = "ResponseStatusCode";
                public const string ResponseStatusDescription = "ResponseStatusDescription";
                public const string Error = "Error";
            }

            public static class LocatorResponseNames
            {
                public const string LocatorResponse = "LocatorResponse";
                public const string Response = "Response";
                public const string AllowAllConfidenceLevels = "AllowAllConfidenceLevels";
                public const string Geocode = "Geocode";
                public const string SearchResults = "SearchResults";
            }

            public static class LocatorSearchResultsNames
            {
                public const string GeocodeCandidate = "GeocodeCandidate";
                public const string Disclaimer = "Disclaimer";
                public const string DropLocation = "DropLocation";
                public const string AvailableLocationAttributes = "AvailableLocationAttributes";
                public const string ActiveAvailableAccessPointIndicator = "ActiveAvailableAccessPointIndicator";
            }

            public static class IntegratedVoiceResponseInformationNames
            {
                public const string PhraseId = "PhraseID";
                public const string TextToSpeechIndicator = "TextToSpeechIndicator";
            }

            public static class LocationAttributeNames
            {
                public const string OptionType = "OptionType";
                public const string OptionCode = "OptionCode";
            }

            public static class LocatorDropLocationNames
            {
                public const string LocationId = "LocationID";
                public const string OriginOrDestination = "OriginOrDestination";
                public const string Ivr = "IVR";
                public const string Geocode = "Geocode";
                public const string AddressKeyFormat = "AddressKeyFormat";
                public const string PhoneNumber = "PhoneNumber";
                public const string FaxNumber = "FaxNumber";
                public const string EmailAddress = "EMailAddress";
                public const string LocationAttribute = "LocationAttribute";
                public const string Distance = "Distance";
                public const string SpecialInstructions = "SpecialInstructions";
                public const string LatestGroundDropOffTime = "LatestGroundDropOffTime";
                public const string LatestAirDropOffTime = "LatestAirDropOffTime";
                public const string AdditionalChargeIndicator = "AdditionalChargeIndicator";
                public const string StandardHoursOfOperation = "StandardHoursOfOperation";
                public const string NonStandardHoursOfOperation = "NonStandardHoursOfOperation";
                public const string WillCallHoursOfOperation = "WillCallHoursOfOperation";
                public const string Number = "Number";
                public const string HomePageURL = "HomePageURL";
                public const string Comments = "Comments";
                public const string AdditionalComments = "AdditionalComments";
                public const string Disclaimer = "Disclaimer";
                public const string Slic = "SLIC";
                public const string Timezone = "Timezone";
                public const string FacilityType = "FacilityType";
                public const string OperatingHours = "OperatingHours";
                public const string LocalizedInstruction = "LocalizedInstruction";
                public const string PromotionInformation = "PromotionInformation";
                public const string SortCode = "SortCode";
                public const string ServiceOfferingList = "ServiceOfferingList";
                public const string DisplayPhoneNumberIndicator = "DisplayPhoneNumberIndicator";
                public const string AccessPointInformation = "AccessPointInformation";
                public const string LocationImage = "LocationImage";
                public const string PromotionalLinkURL = "PromotionalLinkURL";
                public const string LocationNewIndicator = "LocationNewIndicator";
                public const string FeaturedRank = "FeaturedRank";
                public const string WillCallLocationIndicator = "WillCallLocationIndicator";
            }

            public static class OperatingHoursNames
            {
                public const string StandardHours = "StandardHours";
            }

            public static class StandardHoursNames
            {
                public const string HoursType = "HoursType";
                public const string DayOfWeek = "DayOfWeek";
            }

            public static class DayOfWeekNames
            {
                public const string Day = "Day";
                public const string OpenHours = "OpenHours";
                public const string CloseHours = "CloseHours";
                public const string LatestDropOffHours = "LatestDropOffHours";
                public const string PrepHours = "PrepHours";
                public const string ClosedIndicator = "ClosedIndicator";
                public const string Open24HoursIndicator = "Open24HoursIndicator";
            }

            public static class TransportationPickUpScheduleNames
            {
                public const string PickUp = "PickUp";
            }

            public static class PickUpNames
            {
                public const string DayOfWeek = "DayOfWeek";
                public const string PickUpDetails = "PickUpDetails";
                public const string PickUpTime = "PickUpTime";
                public const string NoPickUpIndicator = "NoPickUpIndicator";
            }

            public static class DistanceNames
            {
                public const string Value = "Value";
                public const string UnitOfMeasurement = "UnitOfMeasurement";
            }

            public static class SpecialInstructionsNames
            {
                public const string Segment = "Segment";
            }

            public static class LocatorGeocodeCandidateNames
            {
                public const string AddressKeyFormat = "AddressKeyFormat";
                public const string Geocode = "Geocode";
                public const string LandmarkName = "LandmarkName";
            }

            public static class ErrorResponseNames
            {
                public const string ErrorSeverity = "ErrorSeverity";
                public const string ErrorCode = "ErrorCode";
                public const string ErrorDescription = "ErrorDescription";
                public const string MinimumRetrySeconds = "MinimumRetrySeconds";
                public const string ErrorLocation = "ErrorLocation";
                public const string ErrorDigest = "ErrorDigest";
            }

            public static class ErrorLocationNames
            {
                public const string ErrorLocationElementName = "ErrorLocationElementName";
                public const string ErrorLocationAttributeName = "ErrorLocationAttributeName";
            }

            public static class AdditionalCommentsNames
            {
                public const string CommentType = "CommentType";
            }

            public static class CommentTypeNames
            {
                public const string Code = "Code";
                public const string Text = "Text";
            }

            // Shipment.
            public static class ShipmentRequestNames
            {
                public const string Security = "UPSSecurity";
                public const string Body = "ShipmentRequest";
            }

            public static class ShipmentRequestBodyNames
            {
                public const string Request = "Request";
                public const string Shipment = "Shipment";
                public const string LabelSpecification = "LabelSpecification";
            }

            public static class RatingServiceSelectionRequestNames
            {
                public const string Request = "Request";
                public const string PickupType = "PickupType";
                public const string CustomerClassification = "CustomerClassification";
                public const string Shipment = "Shipment";
            }

            public static class RatingServiceSelectionRequestBodyNames
            {
                public const string RequestAction = "RequestAction";
                public const string RequestOption = "RequestOption";
                public const string SubVersion = "SubVersion";
                public const string TransactionReference = "TransactionReference";
            }

            public static class PickupTypeNames
            {
                public const string Code = "Code";
            }

            public static class CustomerClassificationNames
            {
                public const string Code = "Code";
            }

            public static class ShipmentNames
            {
                public const string AlternateDeliveryAddress = "AlternateDeliveryAddress";
                public const string Shipper = "Shipper";
                public const string ShipTo = "ShipTo";
                public const string ShipFrom = "ShipFrom";
                public const string Service = "Service";
                public const string ShipmentIndicationType = "ShipmentIndicationType";
                public const string Package = "Package";
                public const string PaymentInformation = "PaymentInformation";
                public const string ShipmentServiceOptions = "ShipmentServiceOptions";
            }

            public static class ShipmentConfirmRequestNames
            {
                public const string Request = "Request";
                public const string Shipment = "Shipment";
                public const string LabelSpecification = "LabelSpecification";
            }

            public static class ShipmentAcceptRequestNames
            {
                public const string Request = "Request";
                public const string ShipmentDigest = "ShipmentDigest";
            }

            public static class ShipmentAcceptResponseNames
            {
                public const string Response = "Response";
                public const string ShipmentResults = "ShipmentResults";
            }

            public static class ShipmentResultsNames
            {
                public const string ShipmentCharges = "ShipmentCharges";
                public const string BillingWeight = "BillingWeight";
                public const string ShipmentIdentificationNumber = "ShipmentIdentificationNumber";
                public const string PackageResults = "PackageResults";
            }
        }
    }
}
