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
        internal class PayResponseEnvelope
        {
            public string Timestamp { get; set; }
            public string Ack { get; set; }
            public string CorrelationId { get; set; }
            public string Build { get; set; }
        }

        internal class PayResponse
        {
            public PayResponseEnvelope Envelope { get; set;}
            public string PayKey { get; set; }
            public string PaymentExecStatus { get; set; }
        }

        [Fact]
        public async Task Execute_Payment()
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
            var primaryReceiver = new JObject();
            primaryReceiver.Add("amount", "14");
            primaryReceiver.Add("email", "habarthierry-facilitator@hotmail.fr");
            primaryReceiver.Add("primary", "true");
            receivers.Add(primaryReceiver);
            var firstReceiver = new JObject();
            firstReceiver.Add("amount", "1.00");
            firstReceiver.Add("email", "habarthierry@first-receiver.fr");
            firstReceiver.Add("primary", "false");
            receivers.Add(firstReceiver);
            var secondReceiver = new JObject();
            secondReceiver.Add("amount", "10.00");
            secondReceiver.Add("email", "habarthierry@second-receiver.fr");
            secondReceiver.Add("primary", "false");
            receivers.Add(secondReceiver);
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

            var result = await client.SendAsync(request);
            var responseObj = JObject.Parse(await result.Content.ReadAsStringAsync());
            var paymentResponse = GetPayResponse(responseObj);


            string s = "";
            // 2. Retrieve the "payKey" and redirect the user to the following URL : https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=<Your-preapproval-key>
            // 3. Retrieve information about the payment : https://developer.paypal.com/docs/classic/adaptive-payments/ht_ap-basicChainedPayment-curl-etc/
        }

        private static PayResponse GetPayResponse(JObject jObj)
        {
            return new PayResponse
            {
                PayKey = jObj.GetValue("payKey").ToString(),
                PaymentExecStatus = jObj.GetValue("paymentExecStatus").ToString()
            };
        }
    }
}
