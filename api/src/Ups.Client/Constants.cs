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
        public static class DtoNames
        {
            public static class UpsSecurity
            {
                public const string UserNameToken = "UsernameToken";
                public const string ServiceAccessToken = "ServiceAccessToken";
            }

            public static class UsernameToken
            {
                public const string Username = "Username";
                public const string Password = "Password";
            }

            public static class ServiceAccessToken
            {
                public const string AccessLicenseNumber = "AccessLicenseNumber";
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

            public static class Address
            {
                public const string AddressLine = "AddressLine";
                public const string City = "City";
                public const string StateProvinceCode = "StateProvinceCode";
                public const string PostalCode = "PostalCode";
                public const string CountryCode = "CountryCode";
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

            public static class ServiceType
            {
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class PackagingType
            {
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class ShipUnitOfMeasurementType
            {
                public const string Code = "Code";
                public const string Description = "Description";
            }

            public static class PackageWeightType
            {
                public const string UnitOfMeasurement = "UnitOfMeasurement";
                public const string Weight = "Weight";
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

            public static class ShipmentRequestBody
            {
                public const string Request = "Request";
                public const string Shipment = "Shipment";
                public const string LabelSpecification = "LabelSpecification";
            }

            public static class ShipmentRequest
            {
                public const string Security = "UPSSecurity";
                public const string Body = "ShipmentRequest";
            }
        }
    }
}
