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


using SimpleIdentityServer.DataAccess.SqlServer;
using SimpleIdentityServer.DataAccess.SqlServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Cook4Me.Api.OpenId.Extensions
{
    public static class SimpleIdentityServerContextExtensions
    {
        public static void EnsureSeedData(this SimpleIdentityServerContext context)
        {
            InsertClaims(context);
            InsertScopes(context);
            InsertTranslations(context);
            InsertResourceOwners(context);
            InsertJsonWebKeys(context);
            InsertClients(context);
            context.SaveChanges();
        }

        private static void InsertClaims(SimpleIdentityServerContext context)
        {
            if (!context.Claims.Any())
            {
                context.Claims.AddRange(new[] {
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject, IsIdentifier = true },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.FamilyName },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.GivenName },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.MiddleName },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.NickName },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.PreferredUserName },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Profile },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.WebSite },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Gender },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.BirthDate },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.ZoneInfo },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Locale },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.UpdatedAt },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Email },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.EmailVerified },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Address },
                    new Claim { Code = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Role },
                    new Claim { Code = Constants.Claims.MobilePhoneNumber },
                    new Claim { Code = Constants.Claims.HomePhoneNumber },
                    new Claim { Code = Constants.Claims.GooglePlaceId },
                    new Claim { Code = Constants.Claims.BannerImage }
                });
            }
        }

        private static void InsertScopes(SimpleIdentityServerContext context)
        {
            if (!context.Scopes.Any())
            {
                context.Scopes.AddRange(new[] {
                    new Scope
                    {
                        Name = "openid",
                        IsExposed = true,
                        IsOpenIdScope = true,
                        IsDisplayedInConsent = true,
                        Description = "access to the openid scope",
                        Type = ScopeType.ProtectedApi
                    },
                    new Scope
                    {
                        Name = "profile",
                        IsExposed = true,
                        IsOpenIdScope = true,
                        Description = "Access to the profile",
                        ScopeClaims = new List<ScopeClaim>
                        {
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.FamilyName },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.GivenName },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.MiddleName },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.NickName },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.PreferredUserName },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Profile },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.WebSite },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Gender },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.BirthDate },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.ZoneInfo },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Locale },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.UpdatedAt },
                            new ScopeClaim { ClaimCode = Constants.Claims.BannerImage }
                        },
                        Type = ScopeType.ResourceOwner,
                        IsDisplayedInConsent = true
                    },
                    new Scope
                    {
                        Name = "email",
                        IsExposed = true,
                        IsOpenIdScope = true,
                        IsDisplayedInConsent = true,
                        Description = "Access to the email",
                        ScopeClaims = new List<ScopeClaim>
                        {
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Email },
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.EmailVerified }
                        },
                        Type = ScopeType.ResourceOwner
                    },
                    new Scope
                    {
                        Name = "address",
                        IsExposed = true,
                        IsOpenIdScope = true,
                        IsDisplayedInConsent = true,
                        Description = "Access to the address",
                        ScopeClaims = new List<ScopeClaim>
                        {
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Address },
                            new ScopeClaim { ClaimCode = Constants.Claims.GooglePlaceId }
                        },
                        Type = ScopeType.ResourceOwner
                    },
                    new Scope
                    {
                        Name = "phone",
                        IsExposed = true,
                        IsOpenIdScope = true,
                        IsDisplayedInConsent = true,
                        Description = "Access to the phone",
                        ScopeClaims = new List<ScopeClaim>
                        {
                            new ScopeClaim { ClaimCode = Constants.Claims.MobilePhoneNumber },
                            new ScopeClaim { ClaimCode = Constants.Claims.HomePhoneNumber }
                        },
                        Type = ScopeType.ResourceOwner
                    },
                    new Scope
                    {
                        Name = "role",
                        IsExposed = true,
                        IsOpenIdScope = false,
                        IsDisplayedInConsent = true,
                        Description = "Access to your roles",
                        ScopeClaims = new List<ScopeClaim>
                        {
                            new ScopeClaim { ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Role }
                        },
                        Type = ScopeType.ResourceOwner
                    }
                });
            }
        }

        private static void InsertTranslations(SimpleIdentityServerContext context)
        {
            if (!context.Translations.Any())
            {
                context.Translations.AddRange(new[] {
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.ApplicationWouldLikeToCode,
                        Value = "the client {0} would like to access"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.IndividualClaimsCode,
                        Value = "individual claims"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.LoginCode,
                        Value = "Login"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.PasswordCode,
                        Value = "Password"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.UserNameCode,
                        Value = "Username"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.ConfirmCode,
                        Value = "Confirm"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.CancelCode,
                        Value = "Cancel"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.LoginLocalAccount,
                        Value = "Login with your local account"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.LoginExternalAccount,
                        Value = "Login with your external account"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.LinkToThePolicy,
                        Value = "policy"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.Tos,
                        Value = "Terms of Service"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.SendCode,
                        Value = "Send code"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.Code,
                        Value = "Code"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.EditResourceOwner,
                        Value = "Edit resource owner"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.YourName,
                        Value = "Your name"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.YourPassword,
                        Value = "Your password"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.Email,
                        Value = "Email"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.YourEmail,
                        Value = "Your email"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.TwoAuthenticationFactor,
                        Value = "Two authentication factor"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.UserIsUpdated,
                        Value = "User has been updated"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.SendConfirmationCode,
                        Value = "Send a confirmation code"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.Phone,
                        Value = "Phone"
                    },
                    new Translation
                    {
                        LanguageTag = "en",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.HashedPassword,
                        Value = "Hashed password"
                    },
                    // Swedish
                    new Translation
                    {
                        LanguageTag = "se",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.ApplicationWouldLikeToCode,
                        Value = "tillämpning {0} skulle vilja:"
                    },
                    new Translation
                    {
                        LanguageTag = "se",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.IndividualClaimsCode,
                        Value = "enskilda anspråk"
                    },
                    new Translation
                    {
                        LanguageTag = "se",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.LoginCode,
                        Value = "Logga in"
                    },
                    new Translation
                    {
                        LanguageTag = "se",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.PasswordCode,
                        Value = "Lösenord"
                    },
                    new Translation
                    {
                        LanguageTag = "se",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.UserNameCode,
                        Value = "Användarnamn"
                    },
                    new Translation
                    {
                        LanguageTag = "se",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.ConfirmCode,
                        Value = "bekräfta"
                    },
                    new Translation
                    {
                        LanguageTag = "se",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.CancelCode,
                        Value = "annullera"
                    },
                    // French                
                    new Translation
                    {
                        LanguageTag = "fr",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.ApplicationWouldLikeToCode,
                        Value = "L'application veut accéder à:"
                    },
                    new Translation
                    {
                        LanguageTag = "fr",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.IndividualClaimsCode,
                        Value = "Les claims"
                    },
                    new Translation
                    {
                        LanguageTag = "fr",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.LoginCode,
                        Value = "S'authentifier"
                    },
                    new Translation
                    {
                        LanguageTag = "fr",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.PasswordCode,
                        Value = "Mot de passe"
                    },
                    new Translation
                    {
                        LanguageTag = "fr",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.UserNameCode,
                        Value = "Nom d'utilisateur"
                    },
                    new Translation
                    {
                        LanguageTag = "fr",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.ConfirmCode,
                        Value = "confirmer"
                    },
                    new Translation
                    {
                        LanguageTag = "fr",
                        Code = SimpleIdentityServer.Core.Constants.StandardTranslationCodes.CancelCode,
                        Value = "annuler"
                    }
                });
            }
        }

        private static void InsertResourceOwners(SimpleIdentityServerContext context)
        {
            if (!context.ResourceOwners.Any())
            {
                context.ResourceOwners.AddRange(new[]
                {
                    new ResourceOwner
                    {
                        Id = Guid.NewGuid().ToString(),
                        Claims = new List<ResourceOwnerClaim>
                        {
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject,
                                Value = "administrator"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name,
                                Value = "Thierry Habart"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture,
                                Value = "http://localhost:5001/img/thabart.jpg"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Address,
                                Value = "{ street_address: '223 avenue des croix du feu', locality: 'Belgium', postal_code: '1020', country: 'BE' }"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Email,
                                Value = "habarthierry@hotmail.fr"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = Constants.Claims.MobilePhoneNumber,
                                Value = "0485350536"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = Constants.Claims.HomePhoneNumber,
                                Value = "0485350536"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = Constants.Claims.GooglePlaceId,
                                Value = "ChIJQdeO0VXCw0cReXpimsXR89g"
                            }
                        },
                        Password = ComputeHash("password"),
                        IsLocalAccount = true
                    },
                    new ResourceOwner
                    {
                        Id = Guid.NewGuid().ToString(),
                        Claims = new List<ResourceOwnerClaim>
                        {
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject,
                                Value = "laetitia"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name,
                                Value = "Laetitia Buyse"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture,
                                Value = "http://localhost:5001/img/laetitia.jpg"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Address,
                                Value = "{ street_address: '223 avenue des croix du feu', locality: 'Belgium', postal_code: '1020', country: 'BE' }"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Email,
                                Value = "laetitiabuyse@hotmail.fr"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = Constants.Claims.MobilePhoneNumber,
                                Value = "0485350536"
                            },
                            new ResourceOwnerClaim
                            {
                                Id = Guid.NewGuid().ToString(),
                                ClaimCode = Constants.Claims.HomePhoneNumber,
                                Value = "0485350536"
                            }
                        },
                        Password = ComputeHash("password"),
                        IsLocalAccount = true
                    }
                });
            }
        }

        private static void InsertJsonWebKeys(SimpleIdentityServerContext context)
        {
            if (!context.JsonWebKeys.Any())
            {
                var serializedRsa = string.Empty;
#if NET46
                using (var provider = new RSACryptoServiceProvider())
                {
                    serializedRsa = provider.ToXmlString(true);
                }
#else
                using (var rsa = new RSAOpenSsl())
                {
                    serializedRsa = rsa.ToXmlString(true);
                }
#endif

                context.JsonWebKeys.AddRange(new[]
                {
                    new JsonWebKey
                    {
                        Alg = AllAlg.RS256,
                        KeyOps = "0,1",
                        Kid = "1",
                        Kty = KeyType.RSA,
                        Use = Use.Sig,
                        SerializedKey = serializedRsa,
                    },
                    new JsonWebKey
                    {
                        Alg = AllAlg.RSA1_5,
                        KeyOps = "2,3",
                        Kid = "2",
                        Kty = KeyType.RSA,
                        Use = Use.Enc,
                        SerializedKey = serializedRsa,
                    }
                });
            }
        }

        private static void InsertClients(SimpleIdentityServerContext context)
        {
            if (!context.Clients.Any())
            {
                context.Clients.AddRange(new[]
                {
                    // Game application.
                    new Client
                    {
                        ClientId = "game",
                        ClientName = "Game application",
                        ClientSecrets = new List<ClientSecret>
                        {
                            new ClientSecret
                            {
                                Id = Guid.NewGuid().ToString(),
                                Type = SecretTypes.SharedSecret,
                                Value = "game"
                            }
                        },
                        TokenEndPointAuthMethod = TokenEndPointAuthenticationMethods.client_secret_post,
                        LogoUri = "http://img.over-blog-kiwi.com/1/47/73/14/20150513/ob_06dc4f_chiot-shiba-inu-a-vendre-prix-2015.jpg",
                        ClientScopes = new List<ClientScope>
                        {
                            new ClientScope
                            {
                                ScopeName = "openid"
                            },
                            new ClientScope
                            {
                                ScopeName = "role"
                            },
                            new ClientScope
                            {
                                ScopeName = "profile"
                            },
                            new ClientScope
                            {
                                ScopeName = "email"
                            },
                            new ClientScope
                            {
                                ScopeName = "phone"
                            },
                            new ClientScope
                            {
                                ScopeName = "address"
                            }
                        },
                        GrantTypes = "1,4",
                        ResponseTypes = "0,1,2",
                        IdTokenSignedResponseAlg = "RS256",
                        ApplicationType = ApplicationTypes.web,
                        RedirectionUrls = "http://localhost:3000/callback"
                    },
                    // Game application.
                    new Client
                    {
                        ClientId = "website",
                        ClientName = "Website application",
                        ClientSecrets = new List<ClientSecret>
                        {
                            new ClientSecret
                            {
                                Id = Guid.NewGuid().ToString(),
                                Type = SecretTypes.SharedSecret,
                                Value = "website"
                            }
                        },
                        TokenEndPointAuthMethod = TokenEndPointAuthenticationMethods.client_secret_post,
                        LogoUri = "http://img.over-blog-kiwi.com/1/47/73/14/20150513/ob_06dc4f_chiot-shiba-inu-a-vendre-prix-2015.jpg",
                        ClientScopes = new List<ClientScope>
                        {
                            new ClientScope
                            {
                                ScopeName = "openid"
                            },
                            new ClientScope
                            {
                                ScopeName = "role"
                            },
                            new ClientScope
                            {
                                ScopeName = "profile"
                            },
                            new ClientScope
                            {
                                ScopeName = "email"
                            },
                            new ClientScope
                            {
                                ScopeName = "phone"
                            },
                            new ClientScope
                            {
                                ScopeName = "address"
                            }
                        },
                        GrantTypes = "1,4",
                        ResponseTypes = "0,1,2",
                        IdTokenSignedResponseAlg = "RS256",
                        ApplicationType = ApplicationTypes.web,
                        RedirectionUrls = "http://localhost:3000"
                    },
                    // Shopping API.
                    new Client
                    {
                        ClientId = "shopping_api",
                        ClientName = "Shopping API",
                        ClientSecrets = new List<ClientSecret>
                        {
                            new ClientSecret
                            {
                                Id = Guid.NewGuid().ToString(),
                                Type = SecretTypes.SharedSecret,
                                Value = "shopping_api"
                            }
                        },
                        TokenEndPointAuthMethod = TokenEndPointAuthenticationMethods.client_secret_post,
                        LogoUri = "http://img.over-blog-kiwi.com/1/47/73/14/20150513/ob_06dc4f_chiot-shiba-inu-a-vendre-prix-2015.jpg",
                        ClientScopes = new List<ClientScope>
                        {
                            new ClientScope
                            {
                                ScopeName = "openid"
                            },
                            new ClientScope
                            {
                                ScopeName = "profile"
                            }
                        },
                        GrantTypes = "3",
                        ResponseTypes = "0,1,2",
                        IdTokenSignedResponseAlg = "RS256",
                        ApplicationType = ApplicationTypes.native
                    }
                });
            }
        }

        private static string ComputeHash(string entry)
        {
            using (var sha256 = SHA256.Create())
            {
                var entryBytes = Encoding.UTF8.GetBytes(entry);
                var hash = sha256.ComputeHash(entryBytes);
                return BitConverter.ToString(hash).Replace("-", string.Empty);
            }
        }
    }
}
