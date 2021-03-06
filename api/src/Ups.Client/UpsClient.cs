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

using Cook4Me.Common;
using Cook4Me.Common.Factories;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using Ups.Client.Common;
using Ups.Client.Params;
using Ups.Client.Params.Locator;
using Ups.Client.Params.Shipment;
using Ups.Client.Requests.LabelRecovery;
using Ups.Client.Requests.Rating;
using Ups.Client.Requests.Shipment;
using Ups.Client.Requests.Track;
using Ups.Client.Requests.Void;
using Ups.Client.Responses.LabelRecovery;
using Ups.Client.Responses.Locator;
using Ups.Client.Responses.Rating;
using Ups.Client.Responses.Ship;
using Ups.Client.Responses.Track;
using Ups.Client.Responses.Void;

namespace Ups.Client
{
    public interface IUpsClient
    {
        Task<LocatorResponse> GetLocations(GetLocationsParameter parameter);
        Task<RatingServiceSelectionResponse> GetRatings(GetUpsRatingsParameter parameter);
        Task<ShipmentConfirmResponse> ConfirmShip(ConfirmShipParameter parameter);
        Task<ShipmentAcceptResponse> AcceptShip(AcceptShipParameter parameter);
        Task<LabelRecoveryResponse> GetLabel(GetLabelParameter parameter);
        Task<VoidShipmentResponse> Cancel(string shipmentIdentificationNumber, UpsCredentials credentials);
        Task<TrackResponse> Track(string trackingNumber, UpsCredentials credentials);
    }

    internal class UpsClient : IUpsClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ISettingsProvider _settingsProvider;
        private string _locationUrl;
        private string _rateUrl;
        private string _shipConfirmUrl;
        private string _labelRecovery;
        private string _shipAcceptUrl;
        private string _voidUrl;
        private string _trackUrl;
        private Dictionary<UpsServices, string> _mappingServices = new Dictionary<UpsServices, string>
        {
            { UpsServices.UpsStandard, "011" },
            { UpsServices.UpsAccessPointEconomy, "070" }
        };

        public UpsClient(IHttpClientFactory httpClientFactory, ISettingsProvider settingsProvider)
        {
            _httpClientFactory = httpClientFactory;
            _settingsProvider = settingsProvider;
            var baseUrl = settingsProvider.IsTstMode() ? Constants.TstBaseUrl : Constants.PrdBaseUrl;
            _locationUrl = $"{baseUrl}/ups.app/xml/Locator";
            _rateUrl = $"{baseUrl}/ups.app/xml/Rate";
            _shipConfirmUrl = $"{baseUrl}/ups.app/xml/ShipConfirm";
            _labelRecovery = $"{baseUrl}/ups.app/xml/LabelRecovery";
            _shipAcceptUrl = $"{baseUrl}/ups.app/xml/ShipAccept";
            _voidUrl = $"{baseUrl}/ups.app/xml/Void";
            _trackUrl = $"{baseUrl}/ups.app/xml/Track";
        }

        public async Task<VoidShipmentResponse> Cancel(string shipmentIdentificationNumber, UpsCredentials credentials)
        {
            if (shipmentIdentificationNumber == null)
            {
                throw new ArgumentNullException(nameof(shipmentIdentificationNumber));
            }

            if (credentials == null)
            {
                throw new ArgumentNullException(nameof(credentials));
            }
            
            var client = _httpClientFactory.GetHttpClient();
            var security = new AccessRequestType
            {
                AccessLicenseNumber =credentials.LicenseNumber,
                Password = credentials.Password,
                UserId = credentials.UserName
            };
            var request = new VoidShipmentRequest
            {
                Request = new RequestType
                {
                    RequestAction = "1",
                    TransactionReferenceType = new TransactionReference
                    {
                        CustomerContext = "Your Test Case Summary Description",
                        XpciVersion = "1.0014"
                    }
                },
                ShipmentIdentificationNumber = shipmentIdentificationNumber
            };

            var serializerSecurity = new XmlSerializer(typeof(AccessRequestType));
            var serializerBody = new XmlSerializer(typeof(VoidShipmentRequest));
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
                RequestUri = new Uri(_voidUrl)
            };
            var serializedContent = await client.SendAsync(req).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            var deserializer = new XmlSerializer(typeof(LocatorResponse));
            using (TextReader reader = new StringReader(res))
            {
                return (VoidShipmentResponse)deserializer.Deserialize(reader);
            }
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
                        Code = _mappingServices.First(kvp => kvp.Key == parameter.UpsService).Value
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

        public async Task<ShipmentConfirmResponse> ConfirmShip(ConfirmShipParameter parameter)
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
                        Code = _mappingServices.First(kvp => kvp.Key == parameter.UpsService).Value,
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
                RequestUri = new Uri(_shipConfirmUrl)
            };
            var serializedContent = await client.SendAsync(req).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            var deserializer = new XmlSerializer(typeof(ShipmentConfirmResponse));
            using (TextReader reader = new StringReader(res))
            {
                return (ShipmentConfirmResponse)deserializer.Deserialize(reader);
            }
        }

        public async Task<ShipmentAcceptResponse> AcceptShip(AcceptShipParameter parameter)
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
            var request = new ShipmentAcceptRequest
            {
                Request = new RequestType
                {
                    RequestAction = "ShipAccept",
                    TransactionReferenceType = new TransactionReference
                    {
                        CustomerContext = "Your Test Case Summary Description",
                        XpciVersion = "1.0014"
                    }
                },
                ShipmentDigest = parameter.ShipmentDigest
            };

            var serializerSecurity = new XmlSerializer(typeof(AccessRequestType));
            var serializerBody = new XmlSerializer(typeof(ShipmentAcceptRequest));
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
                RequestUri = new Uri(_shipAcceptUrl)
            };
            var serializedContent = await client.SendAsync(req).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            var deserializer = new XmlSerializer(typeof(ShipmentAcceptResponse));
            using (TextReader reader = new StringReader(res))
            {
                return (ShipmentAcceptResponse)deserializer.Deserialize(reader);
            }
        }

        public async Task<LabelRecoveryResponse> GetLabel(GetLabelParameter parameter)
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
            var request = new LabelRecoveryRequest
            {
                Request = new RequestType
                {
                    RequestAction = "LabelRecovery",
                    TransactionReferenceType = new TransactionReference
                    {
                        CustomerContext = "Your Test Case Summary Description",
                        XpciVersion = "1.0014"
                    }
                },
                TrackingNumber = parameter.TrackingNumber
            };


            var serializerSecurity = new XmlSerializer(typeof(AccessRequestType));
            var serializerBody = new XmlSerializer(typeof(LabelRecoveryRequest));
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
                RequestUri = new Uri(_labelRecovery)
            };
            var serializedContent = await client.SendAsync(req).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            var deserializer = new XmlSerializer(typeof(LabelRecoveryResponse));
            using (TextReader reader = new StringReader(res))
            {
                return (LabelRecoveryResponse)deserializer.Deserialize(reader);
            }
        }

        public async Task<TrackResponse> Track(string trackingNumber, UpsCredentials credentials)
        {
            if (string.IsNullOrWhiteSpace(trackingNumber))
            {
                throw new ArgumentNullException(nameof(trackingNumber));
            }

            if (credentials == null)
            {
                throw new ArgumentNullException(nameof(credentials));
            }

            var client = _httpClientFactory.GetHttpClient();
            var security = new AccessRequestType
            {
                AccessLicenseNumber = credentials.LicenseNumber,
                Password = credentials.Password,
                UserId = credentials.UserName
            };
            var request = new TrackRequest
            {
                Request = new RequestType
                {
                    RequestAction = "Track",
                    RequestOption = "activity",
                    TransactionReferenceType = new TransactionReference
                    {
                        CustomerContext = "Your Test Case Summary Description",
                        XpciVersion = "1.0014"
                    }
                },
                TrackingNumber = trackingNumber
            };

            var serializerSecurity = new XmlSerializer(typeof(AccessRequestType));
            var serializerBody = new XmlSerializer(typeof(TrackRequest));
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
                RequestUri = new Uri(_trackUrl)
            };
            var serializedContent = await client.SendAsync(req).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            var deserializer = new XmlSerializer(typeof(TrackResponse));
            using (TextReader reader = new StringReader(res))
            {
                return (TrackResponse)deserializer.Deserialize(reader);
            }
        }
    }
}
