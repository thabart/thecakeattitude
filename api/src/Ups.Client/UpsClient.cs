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

using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using Ups.Client.Common;
using Ups.Client.Factories;
using Ups.Client.Params;
using Ups.Client.Params.Locator;
using Ups.Client.Params.Shipment;
using Ups.Client.Requests.Rating;
using Ups.Client.Responses.Locator;
using Ups.Client.Responses.Rating;
using Ups.Client.Responses.Ship;

namespace Ups.Client
{
    public interface IUpsClient
    {
        Task<LocatorResponse> GetLocations(GetLocationsParameter parameter);
        Task<RatingServiceSelectionResponse> GetRatings(GetUpsRatingsParameter parameter);
        Task<ShipmentConfirmResponse> GetShip(ShipParameter parameter);
    }

    internal class UpsClient : IUpsClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string _locationUrl = "https://onlinetools.ups.com/ups.app/xml/Locator";
        private const string _rateUrl = "https://onlinetools.ups.com/ups.app/xml/Rate";
        private const string _shipUrl = "https://onlinetools.ups.com/ups.app/xml/ShipConfirm ";

        public UpsClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<LocatorResponse> GetLocations(GetLocationsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (parameter.Address == null)
            {
                throw new ArgumentNullException(nameof(parameter.Address));
            }

            if (parameter.Credentials == null)
            {
                throw new ArgumentNullException(nameof(parameter.Credentials));
            }

            var client = _httpClientFactory.GetHttpClient();
            var request = new LocatorRequest
            {
                Security = new AccessRequestType
                {
                    AccessLicenseNumber = parameter.Credentials.LicenseNumber,
                    Password = parameter.Credentials.Password,
                    UserId = parameter.Credentials.UserName
                },
                Body = new LocatorRequestBody
                {
                    Request = new RequestType
                    {
                        RequestAction = "Locator",
                        RequestOption = "1",
                        TransactionReferenceType = new TransactionReference
                        {
                            CustomerContext = "Your Test Case Summary Description",
                            XpciVersion = "1.0014"
                        }
                    },
                    Address = new LocatorOriginAddress
                    {
                        PhoneNumber = new StructuredPhoneNumberType(),
                        Address = new AddressKeyFormat
                        {
                            AddressLine = parameter.Address.AddressLine,
                            PoliticalDivision2 = parameter.Address.City,
                            CountryCode = parameter.Address.Country,
                            PostcodePrimaryLow = parameter.Address.PostalCode
                        }
                    },
                    Translate = new TranslateType
                    {
                        LanguageCode = "ENG"
                    },
                    UnitOfMeasurement = new UnitOfMeasurement
                    {
                        Code = "KM"
                    }
                }
            };

            var serializerSecurity = new XmlSerializer(typeof(AccessRequestType));
            var serializerBody = new XmlSerializer(typeof(LocatorRequestBody));
            var xmlSecurity = "";
            var xmlBody = "";
            using (var sww = new StringWriter())
            {
                using (var writer = XmlWriter.Create(sww))
                {
                    serializerSecurity.Serialize(writer, request.Security);
                    xmlSecurity = sww.ToString();
                }
            }

            using (var sww = new StringWriter())
            {
                using (var writer = XmlWriter.Create(sww))
                {
                    serializerBody.Serialize(writer, request.Body);
                    xmlBody = sww.ToString();
                }
            }

            var xml = xmlSecurity + "" + xmlBody;
            var body = new StringContent(xml);
            var req = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = body,
                RequestUri = new Uri(_locationUrl)
            };
            var serializedContent = await client.SendAsync(req).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            var deserializer = new XmlSerializer(typeof(LocatorResponse));
            using (TextReader reader = new StringReader(res))
            {
                return (LocatorResponse)deserializer.Deserialize(reader);
            }
        }

        public async Task<RatingServiceSelectionResponse> GetRatings(GetUpsRatingsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (parameter.Credentials == null)
            {
                throw new ArgumentNullException(nameof(parameter.Credentials));
            }

            var client = _httpClientFactory.GetHttpClient();
            var security = new AccessRequestType
            {
                AccessLicenseNumber = parameter.Credentials.LicenseNumber,
                Password = parameter.Credentials.Password,
                UserId = parameter.Credentials.UserName
            };
            var request = new RatingServiceSelectionRequest
            {
                Request = new RatingServiceSelectionRequestBody
                {
                    RequestAction = "Rate",
                    RequestOption = "Rate",
                    TransactionReference = new TransactionReference
                    {
                        CustomerContext = "Your Test Case Summary Description",
                        XpciVersion = "1.0014"
                    }
                },
                Shipment = new Shipment
                {
                    Service = new TypeParameter
                    {
                        Code = "070",
                        Description = "UPS Access Point™ Economy"
                    },
                    ShipmentIndicationType = new TypeParameter
                    {
                        Code = "02",
                        Description = "UPS Access Point™ Delivery"
                    },
                    Package = new Package
                    {
                        PackagingType = new TypeParameter
                        {
                            Code = "02"
                        }
                    }
                }
            };

            if (parameter.AlternateDeliveryAddress != null)
            {
                request.Shipment.AlternateDeliveryAddress = new AlternateDeliveryAddress
                {
                    Name = parameter.AlternateDeliveryAddress.Name
                };

                if (parameter.AlternateDeliveryAddress.Address != null)
                {
                    request.Shipment.AlternateDeliveryAddress.Address = new Address
                    {
                        AddressLine1 = parameter.AlternateDeliveryAddress.Address.AddressLine,
                        City = parameter.AlternateDeliveryAddress.Address.City,
                        CountryCode = parameter.AlternateDeliveryAddress.Address.Country,
                        PostalCode = parameter.AlternateDeliveryAddress.Address.PostalCode
                    };
                }
            }

            if (parameter.Shipper != null)
            {
                request.Shipment.Shipper = new Shipper
                {
                    Name = parameter.Shipper.Name,
                    ShipperNumber = parameter.Shipper.ShipperNumber
                };

                if (parameter.Shipper.Address != null)
                {
                    request.Shipment.Shipper.Address = new Address
                    {
                        AddressLine1 = parameter.Shipper.Address.AddressLine,
                        City = parameter.Shipper.Address.City,
                        CountryCode = parameter.Shipper.Address.Country,
                        PostalCode = parameter.Shipper.Address.PostalCode
                    };
                }
            }

            if (parameter.ShipTo != null)
            {
                request.Shipment.ShipTo = new Ship
                {
                    Name = parameter.Shipper.Name,
                };

                if (parameter.ShipTo.Address != null)
                {
                    request.Shipment.ShipTo.Address = new Address
                    {
                        AddressLine1 = parameter.ShipTo.Address.AddressLine,
                        City = parameter.ShipTo.Address.City,
                        CountryCode = parameter.ShipTo.Address.Country,
                        PostalCode = parameter.ShipTo.Address.PostalCode
                    };
                }
            }

            if (parameter.ShipFrom != null)
            {
                request.Shipment.ShipFrom = new Ship
                {
                    Name = parameter.Shipper.Name,
                };

                if (parameter.ShipFrom.Address != null)
                {
                    request.Shipment.ShipFrom.Address = new Address
                    {
                        AddressLine1 = parameter.ShipFrom.Address.AddressLine,
                        City = parameter.ShipFrom.Address.City,
                        CountryCode = parameter.ShipFrom.Address.Country,
                        PostalCode = parameter.ShipFrom.Address.PostalCode
                    };
                }
            }

            if (parameter.Package != null)
            {
                request.Shipment.Package.Dimensions = new Dimensions
                {
                    UnitOfMeasurement = new UnitOfMeasurement
                    {
                        Code = "CM",
                        Description = "cm"
                    },
                    Length = parameter.Package.Length,
                    Height = parameter.Package.Height,
                    Width = parameter.Package.Width
                };
                request.Shipment.Package.PackageWeight = new PackageWeight
                {
                    UnitOfMeasurement = new UnitOfMeasurement
                    {
                        Code = "KGS",
                        Description = "kgs"
                    },
                    Weight = parameter.Package.Weight
                };
            }

            var serializerSecurity = new XmlSerializer(typeof(AccessRequestType));
            var serializerBody = new XmlSerializer(typeof(RatingServiceSelectionRequest));
            var xmlSecurity = "";
            var xmlBody = "";
            using (var sww = new StringWriter())
            {
                using (var writer = XmlWriter.Create(sww))
                {
                    serializerSecurity.Serialize(writer, security);
                    xmlSecurity = sww.ToString();
                }
            }

            using (var sww = new StringWriter())
            {
                using (var writer = XmlWriter.Create(sww))
                {
                    serializerBody.Serialize(writer, request);
                    xmlBody = sww.ToString();
                }
            }

            var xml = xmlSecurity + "" + xmlBody;
            var body = new StringContent(xml);
            var req = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = body,
                RequestUri = new Uri(_rateUrl)
            };
            var serializedContent = await client.SendAsync(req).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            var deserializer = new XmlSerializer(typeof(RatingServiceSelectionResponse));
            using (TextReader reader = new StringReader(res))
            {
                return (RatingServiceSelectionResponse)deserializer.Deserialize(reader);
            }
        }

        public async Task<ShipmentConfirmResponse> GetShip(ShipParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (parameter.Credentials == null)
            {
                throw new ArgumentNullException(nameof(parameter.Credentials));
            }

            var client = _httpClientFactory.GetHttpClient();
            var security = new AccessRequestType
            {
                AccessLicenseNumber = parameter.Credentials.LicenseNumber,
                Password = parameter.Credentials.Password,
                UserId = parameter.Credentials.UserName
            };
            var request = new ShipmentConfirmRequest
            {
                Request = new RequestType
                {
                    RequestAction = "ShipConfirm",
                    RequestOption = "validate",
                    TransactionReferenceType = new TransactionReference
                    {
                        CustomerContext = "Your Test Case Summary Description",
                        XpciVersion = "1.0014"
                    }
                },
                Shipment = new Shipment
                {
                    PaymentInformation = new PaymentInformation
                    {
                        Prepaid = new Prepaid
                        {
                            BillShipper = new BillShipper
                            {
                                AlternatePaymentMethod = "01"
                            }
                        }
                    },
                    Service = new TypeParameter
                    {
                        Code = "070",
                        Description = "UPS Access Point™ Economy"
                    },
                    ShipmentIndicationType = new TypeParameter
                    {
                        Code = "02",
                        Description = "UPS Access Point™ Delivery"
                    },
                    ShipmentServiceOptions = new ShipmentServiceOptions
                    {
                        Notification = new List<Notification>
                        {
                            new Notification
                            {
                                NotificationCode = "012",
                                EMailMessage = new EMailMessage
                                {
                                    EMailAddress = parameter.EmailAddress
                                },
                                Locale = new Locale
                                {
                                    Language = "ENG",
                                    Dialect = "GB"
                                }
                            },
                            new Notification
                            {
                                NotificationCode = "013",
                                EMailMessage = new EMailMessage
                                {
                                    EMailAddress = parameter.EmailAddress
                                },
                                Locale = new Locale
                                {
                                    Language = "ENG",
                                    Dialect = "GB"
                                }
                            }
                        }
                    }
                },
                LabelSpecification = new LabelSpecification
                {
                    LabelPrintMethod = new TypeParameter
                    {
                        Code = "GIF",
                        Description = "gif file"
                    },
                    LabelImageFormat = new TypeParameter
                    {
                        Code = "GIF",
                        Description = "gif file"
                    },
                    HTTPUserAgent = "Mozilla/4.5"
                }
            };

            if (parameter.AlternateDeliveryAddress != null)
            {
                request.Shipment.AlternateDeliveryAddress = new AlternateDeliveryAddress
                {
                    Name = parameter.AlternateDeliveryAddress.Name
                };

                if (parameter.AlternateDeliveryAddress.Address != null)
                {
                    request.Shipment.AlternateDeliveryAddress.Address = new Address
                    {
                        AddressLine1 = parameter.AlternateDeliveryAddress.Address.AddressLine,
                        City = parameter.AlternateDeliveryAddress.Address.City,
                        CountryCode = parameter.AlternateDeliveryAddress.Address.Country,
                        PostalCode = parameter.AlternateDeliveryAddress.Address.PostalCode
                    };
                }
            }

            if (parameter.Shipper != null)
            {
                request.Shipment.Shipper = new Shipper
                {
                    Name = parameter.Shipper.Name,
                    ShipperNumber = parameter.Shipper.ShipperNumber
                };

                if (parameter.Shipper.Address != null)
                {
                    request.Shipment.Shipper.Address = new Address
                    {
                        AddressLine1 = parameter.Shipper.Address.AddressLine,
                        City = parameter.Shipper.Address.City,
                        CountryCode = parameter.Shipper.Address.Country,
                        PostalCode = parameter.Shipper.Address.PostalCode
                    };
                }
            }

            if (parameter.ShipTo != null)
            {
                request.Shipment.ShipTo = new Ship
                {
                    Name = parameter.ShipTo.Name,
                    AttentionName = parameter.ShipTo.AttentionName,
                    CompanyName = parameter.ShipTo.CompanyName
                };

                if (parameter.ShipTo.Address != null)
                {
                    request.Shipment.ShipTo.Address = new Address
                    {
                        AddressLine1 = parameter.ShipTo.Address.AddressLine,
                        City = parameter.ShipTo.Address.City,
                        CountryCode = parameter.ShipTo.Address.Country,
                        PostalCode = parameter.ShipTo.Address.PostalCode
                    };
                }
            }

            if (parameter.ShipFrom != null)
            {
                request.Shipment.ShipFrom = new Ship
                {
                    Name = parameter.ShipFrom.Name,
                    AttentionName = parameter.ShipFrom.AttentionName,
                    CompanyName = parameter.ShipFrom.CompanyName
                };

                if (parameter.ShipFrom.Address != null)
                {
                    request.Shipment.ShipFrom.Address = new Address
                    {
                        AddressLine1 = parameter.ShipFrom.Address.AddressLine,
                        City = parameter.ShipFrom.Address.City,
                        CountryCode = parameter.ShipFrom.Address.Country,
                        PostalCode = parameter.ShipFrom.Address.PostalCode
                    };
                }
            }

            if (parameter.Package != null)
            {
                request.Shipment.Package = new Package
                {
                    PackagingType = new TypeParameter
                    {
                        Code = "02",
                        Description = "Emballage personnalisé"
                    },
                    Dimensions = new Dimensions
                    {
                        UnitOfMeasurement = new UnitOfMeasurement
                        {
                            Code = "CM",
                            Description = "cm"
                        },
                        Length = parameter.Package.Length,
                        Height = parameter.Package.Height,
                        Width = parameter.Package.Width
                    },
                    PackageWeight = new PackageWeight
                    {
                        UnitOfMeasurement = new UnitOfMeasurement
                        {
                            Code = "KGS",
                            Description = "kgs"
                        },
                        Weight = parameter.Package.Weight
                    }
                };
            }

            if (parameter.PaymentInformation != null)
            {
                request.Shipment.PaymentInformation = new PaymentInformation
                {
                    Prepaid = new Prepaid
                    {
                        BillShipper = new BillShipper
                        {
                            CreditCard = new CreditCard
                            {
                                ExpirationDate = parameter.PaymentInformation.ExpirationDate,
                                Number = parameter.PaymentInformation.Number,
                                SecurityCode = parameter.PaymentInformation.SecurityCode,
                                Type = parameter.PaymentInformation.Type
                            }
                        }
                    }
                };

                if (parameter.PaymentInformation.Address != null)
                {
                    request.Shipment.PaymentInformation.Prepaid.BillShipper.CreditCard.Address = new Address
                    {
                        AddressLine1 = parameter.PaymentInformation.Address.AddressLine,
                        City = parameter.PaymentInformation.Address.City,
                        CountryCode = parameter.PaymentInformation.Address.Country,
                        PostalCode = parameter.PaymentInformation.Address.PostalCode
                    };
                }
            }

            var serializerSecurity = new XmlSerializer(typeof(AccessRequestType));
            var serializerBody = new XmlSerializer(typeof(ShipmentConfirmRequest));
            var xmlSecurity = "";
            var xmlBody = "";
            using (var sww = new StringWriter())
            {
                using (var writer = XmlWriter.Create(sww))
                {
                    serializerSecurity.Serialize(writer, security);
                    xmlSecurity = sww.ToString();
                }
            }

            using (var sww = new StringWriter())
            {
                using (var writer = XmlWriter.Create(sww))
                {
                    serializerBody.Serialize(writer, request);
                    xmlBody = sww.ToString();
                }
            }

            var xml = xmlSecurity + "" + xmlBody;
            var body = new StringContent(xml);
            var req = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = body,
                RequestUri = new Uri(_shipUrl)
            };
            var serializedContent = await client.SendAsync(req).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            var deserializer = new XmlSerializer(typeof(ShipmentConfirmResponse));
            using (TextReader reader = new StringReader(res))
            {
                return (ShipmentConfirmResponse)deserializer.Deserialize(reader);
            }
        }
    }
}
