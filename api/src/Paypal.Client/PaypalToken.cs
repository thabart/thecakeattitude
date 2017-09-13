

using System;

namespace Paypal.Client
{
    public class PaypalToken
    {
        public string AccessToken { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string ApplicationId { get; set; }
        public string Scope { get; set; }
        public int AccessTokenExpirationInSeconds { get; set; }
        public DateTime AccessTokenLastCreationDate { get; set; }
    }
}
