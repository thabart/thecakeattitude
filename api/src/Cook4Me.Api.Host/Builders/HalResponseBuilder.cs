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

using Cook4Me.Api.Host.Dtos;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Cook4Me.Api.Host.Builders
{
    public interface IHalResponseBuilder
    {
        IHalResponseBuilder AddLinks(Action<HalLinksBuilder> callback);
        IHalResponseBuilder AddEmbedded(Action<HalEmbeddedBuilder> callback);
        JObject Build();
    }

    public class HalLinksBuilder
    {
        private readonly JObject _linksObject;
        private readonly Dictionary<string, JArray> _otherItems;
        private JArray _items;

        public HalLinksBuilder(JObject linksObject)
        {
            _otherItems = new Dictionary<string, JArray>();
            _linksObject = linksObject;
        }

        public HalLinksBuilder AddSelf(string href)
        {
            if (string.IsNullOrWhiteSpace(href))
            {
                throw new ArgumentNullException(nameof(href));
            }

            _linksObject.Add(Constants.DtoNames.HalResponse.Self, href);
            return this;
        }

        public HalLinksBuilder AddItem(Link link)
        {
            if (link == null)
            {
                throw new ArgumentNullException(nameof(link));
            }

            if (_items == null)
            {
                _items = new JArray();
                _linksObject.Add(Constants.DtoNames.HalResponse.Items, _items);
            }

            _items.Add(BuildLink(link));
            return this;
        }

        public HalLinksBuilder AddOtherItem(string itemName, Link link)
        {
            if (string.IsNullOrWhiteSpace(itemName))
            {
                throw new ArgumentNullException(nameof(itemName));
            }

            if (link == null)
            {
                throw new ArgumentNullException(nameof(link));
            }

            var kvp = _otherItems.FirstOrDefault(o => o.Key == itemName);
            if (kvp.Equals(default(KeyValuePair<string, JArray>)) || kvp.Value == null)
            {
                var arr = new JArray();
                _otherItems.Add(itemName, arr);
                kvp = _otherItems.First(o => o.Key == itemName);
                _linksObject.Add(itemName, arr);
            }

            kvp.Value.Add(BuildLink(link));
            return this;
        }

        public HalLinksBuilder AddLink(string name, Link link)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentNullException(nameof(name));
            }

            if (link == null)
            {
                throw new ArgumentNullException(nameof(link));
            }

            var jObj = BuildLink(link);
            _linksObject.Add(name, jObj);
            return this;
        }

        private static JObject BuildLink(Link link)
        {
            var jObj = new JObject();
            jObj.Add(new JProperty(Constants.DtoNames.HalLink.Href, link.Href));
            if (!string.IsNullOrWhiteSpace(link.Name))
            {
                jObj.Add(new JProperty(Constants.DtoNames.HalLink.Name, link.Name));
            }

            if (link.Templated)
            {
                jObj.Add(new JProperty(Constants.DtoNames.HalLink.Templated, "true"));
            }

            return jObj;
        }
    }

    public class HalEmbeddedBuilder
    {
        private readonly JArray _embeddedObject;

        public HalEmbeddedBuilder(JArray embeddedObject)
        {
            _embeddedObject = embeddedObject;
        }

        public HalEmbeddedBuilder AddObject(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            _embeddedObject.Add(jObj);
            return this;
        }

        public HalEmbeddedBuilder AddObject(JObject jObj, Action<HalLinksBuilder> callback)
        {
            if (callback == null)
            {
                throw new ArgumentNullException(nameof(callback));
            }

            var result = AddObject(jObj);
            var linksObj = new JObject();
            var builder = new HalLinksBuilder(linksObj);
            callback(builder);
            jObj.Add(Constants.DtoNames.HalResponse.Links, linksObj);
            return this;
        }
    }

    internal class HalResponseBuilder : IHalResponseBuilder
    {
        private JObject _linkObjects;
        private JArray _embeddedObjects;
        private HalLinksBuilder halLinkBuilder;
        private HalEmbeddedBuilder halEmbeddedBuilder;

        public HalResponseBuilder()
        {
            _linkObjects = new JObject();
            _embeddedObjects = new JArray();
            halLinkBuilder = new HalLinksBuilder(_linkObjects);
            halEmbeddedBuilder = new HalEmbeddedBuilder(_embeddedObjects);
        }

        public IHalResponseBuilder AddLinks(Action<HalLinksBuilder> callback)
        {
            if (callback == null)
            {
                throw new ArgumentNullException(nameof(callback));
            }

            callback(halLinkBuilder);
            return this;
        }

        public IHalResponseBuilder AddEmbedded(Action<HalEmbeddedBuilder> callback)
        {
            if (callback == null)
            {
                throw new ArgumentNullException(nameof(callback));
            }
            
            callback(halEmbeddedBuilder);
            return this;
        }

        public JObject Build()
        {
            var result = new JObject();
            if (_linkObjects != null)
            {
                result.Add(Constants.DtoNames.HalResponse.Links, _linkObjects);
            }

            if (_embeddedObjects != null)
            {
                if (_embeddedObjects.Count == 1)
                {
                    result.Add(Constants.DtoNames.HalResponse.Embedded, _embeddedObjects.First);
                }
                else
                {
                    result.Add(Constants.DtoNames.HalResponse.Embedded, _embeddedObjects);
                }
            }

            return result;
        }
    }
}
