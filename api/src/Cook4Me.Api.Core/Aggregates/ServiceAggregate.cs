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

using System;
using System.Linq;
using System.Collections.Generic;

namespace Cook4Me.Api.Core.Aggregates
{
    public class ServiceAggregate
    {
        public string Id { get; set; }
        public string ShopId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int TotalScore { get; set; }
        public double AverageScore { get; set; }
        public DateTime CreateDateTime { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public ServiceAggregateOccurrence Occurrence { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public IEnumerable<string> PartialImagesUrl { get; set; }
        public ICollection<ServiceComment> Comments { get; set; }

        public void AddComment(ServiceComment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            Comments.Add(comment);
            TotalScore += comment.Score;
            if (Comments.Count() != 0)
            {
                AverageScore = Math.Round(((double)TotalScore / (double)Comments.Count()), 3);
            }
        }

        public void RemoveComment(ServiceComment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            Comments.Remove(comment);
            TotalScore -= comment.Score;
            if (Comments.Count() != 0)
            {
                AverageScore = Math.Round(((double)TotalScore / (double)Comments.Count()), 3);
            }
            else
            {
                AverageScore = 0;
            }
        }
    }
}
