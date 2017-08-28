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

#if NET
using System.Net;
#endif
using System.Net.Http;

namespace Ups.Client.Factories
{
    public interface IHttpClientFactory
    {
        HttpClient GetHttpClient();
    }

    public class HttpClientFactory : IHttpClientFactory
    {
        public HttpClient GetHttpClient()
        {
            var httpHandler = new HttpClientHandler();
#if NET
            ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
#else
            httpHandler.ServerCertificateCustomValidationCallback = (_, __, ___, ____) => true;
#endif
            return new HttpClient(httpHandler);
        }
    }
}
