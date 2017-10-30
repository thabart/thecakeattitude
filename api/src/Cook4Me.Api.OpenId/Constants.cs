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

namespace Cook4Me.Api.OpenId
{
    public static class Constants
    {
        public const string CookieName = "Cook4MeOpenIdCookie";
        public const string ExternalCookieName = "ExternalCook4MeOpenIdCookie";
        public const string SumUpClientId = "WmHaR9DdeX83Vs3ULFd8UPtB4fDP";
        public const string SumUpClientSecret = "ddbd6de1beb66337604569a3572084e9513301430812fa605cd8e4e037c6b63a";
        public const string BaseSumupApi = "https://api.sumup.com";

        public static class RouteNames
        {
            public const string Users = "users";
            public const string UserClaims = "claims";
            public const string Confirm = "confirm";
            public const string Image = "image";
            public const string PublicClaims = "{id}/public";
            public const string BulkPublicClaims = "bulk/public";
            public const string CreditCard = "creditcard";
        }

        public static class ErrorMessages
        {
            public const string ErrorOccuredWhileTryingToUpdateTheUser = "an error occured while trying to update the user";
            public const string SubjectDoesntExist = "the subject doesn't exist";
            public const string ErrorOccuredWhileTryingToUpdatePicture = "an error occured while trying to update the picture";
        }

        public static class Claims
        {
            public const string MobilePhoneNumber = "mobile_phone_number";
            public const string HomePhoneNumber = "home_phone_number";
            public const string GooglePlaceId = "google_place_id";
            public const string BannerImage = "banner_image";
            public const string PaypalEmail = "paypal_email";
            public const string Figure = "figure";
        }

        public static class Dtos
        {
            public static class ResourceOwner
            {
                public const string Claims = "claims";
                public const string Password = "password";
                public const string IsLocalAccount = "is_local_account";
            }

            public static class UpdateCreditCard
            {
                public const string Name = "name";
                public const string Number = "number";
                public const string ExpiryYear = "expiry_year";
                public const string ExpiryMonth = "expiry_month";
                public const string Cvv = "cvv";
            }

            public static class UpdateClaim
            {
                public const string Name = "name";
                public const string Picture = "picture";
                public const string StreetAddress = "street_address";
                public const string Locality = "locality";
                public const string PostalCode = "postal_code";
                public const string Country = "country";
                public const string Email = "email";
                public const string PhoneNumber = "phone_number";
                public const string Password = "password";
            }

            public static class SearchResourceOwner
            {
                public const string Subjects = "subs";
            }
        }
    }
}
