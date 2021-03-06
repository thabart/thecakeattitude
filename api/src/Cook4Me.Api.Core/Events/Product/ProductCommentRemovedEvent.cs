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

using Cook4Me.Api.Core.Bus;

namespace Cook4Me.Api.Core.Events.Product
{
    public class ProductCommentRemovedEvent : Event
    {
        public string Id { get; set; }
        public string ProductId { get; set; }
        public double AverageScore { get; set; }
        public string ShopId { get; set; }
        public int NbComments { get; set; }
    }
}
