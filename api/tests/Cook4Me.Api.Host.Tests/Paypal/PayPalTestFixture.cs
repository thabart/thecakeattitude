using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Cook4Me.Api.Host.Tests.Paypal
{
    public class PayPalTestFixture
    {
        [Fact]
        public async Task When_Create_Pay()
        {
            // 1. Create the PAYMENT.
            // ARRANGE
            var client = new HttpClient();
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            var jObj = new JObject();
            jObj.Add("actionType", "PAY");
            jObj.Add("currencyCode", "USD");
            var receiverList = new JObject();
            var receivers = new JArray();
            var receiver = new JObject();
            receiver.Add("amount", "1.00");
            receiver.Add("email", "habarthierry-buyer@hotmail.fr");
            receivers.Add(receiver);
            receiverList.Add("receiver", receivers);
            jObj.Add("receiverList", receiverList);
            jObj.Add("returnUrl", "http://localhost:3000");
            jObj.Add("cancelUrl", "http://localhost:3000");
            var requestEnv = new JObject();
            requestEnv.Add("errorLanguage", "en_US");
            requestEnv.Add("detailLevel", "ReturnAll");
            jObj.Add("requestEnvelope", requestEnv);

            var content = new StringContent(jObj.ToString(), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = content,
                RequestUri = new Uri("https://svcs.sandbox.paypal.com/AdaptivePayments/Pay")
            };
            
            request.Headers.Add("X-PAYPAL-SECURITY-USERID", "habarthierry-facilitator_api1.hotmail.fr");
            request.Headers.Add("X-PAYPAL-SECURITY-PASSWORD", "QR76ZK58CT5V3U5H");
            request.Headers.Add("X-PAYPAL-SECURITY-SIGNATURE", "AFcWxV21C7fd0v3bYYYRCpSSRl31ATZo.aofsYM-AmE4KLVXlU7rl.aL");
            request.Headers.Add("X-PAYPAL-REQUEST-DATA-FORMAT", "JSON");
            request.Headers.Add("X-PAYPAL-RESPONSE-DATA-FORMAT", "JSON");
            request.Headers.Add("X-PAYPAL-APPLICATION-ID", "APP-80W284485P519543T");

            try
            {
                var result = await client.SendAsync(request);
                var c = await result.Content.ReadAsStringAsync();
                var tmp = "";
            }
            catch (Exception ex)
            {
                string s = "";
            }
        }
    }
}
