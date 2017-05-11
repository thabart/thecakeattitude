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

using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Core.Results;
using Cook4Me.Api.EF.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.EF.Repositories
{
    internal class ServiceRepository : IServiceRepository
    {
        private readonly CookDbContext _context;

        public ServiceRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<SearchServiceResult> Search(SearchServiceParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Service> services = _context.Services
                .Include(p => p.Images)
                .Include(p => p.Tags)
                .Include(p => p.Shop)
                .Include(p => p.Comments);
            if (!string.IsNullOrWhiteSpace(parameter.ShopId))
            {
                services = services.Where(p => p.ShopId == parameter.ShopId);
            }

            if (parameter.NorthEast != null && parameter.SouthWest != null)
            {
                services = services.Where(p => p.Shop.Latitude >= parameter.SouthWest.Latitude && p.Shop.Latitude <= parameter.NorthEast.Latitude
                    && p.Shop.Longitude >= parameter.SouthWest.Longitude && p.Shop.Longitude <= parameter.NorthEast.Longitude);
            }

            if (!string.IsNullOrWhiteSpace(parameter.Name))
            {
                services = services.Where(p => p.Name.ToLowerInvariant().Contains(parameter.Name.ToLowerInvariant()));
            }

            if (parameter.FromDateTime != null && parameter.ToDateTime != null)
            {
                services = services.Where(p => p.Occurrence != null && p.Occurrence.StartDate < parameter.ToDateTime);
            }

            services.OrderByDescending(s => s.UpdateDateTime);
            var result = new SearchServiceResult
            {
                TotalResults = await services.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };

            if (parameter.IsPagingEnabled)
            {
                services = services.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await services.Select(s => s.ToAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        public async Task<SearchServiceOccurrenceResult> Search(SearchServiceOccurrenceParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.ServiceOccurrenceDay> services = _context.ServiceOccurrenceDays
                .Include(p => p.ServiceOccurrence).ThenInclude(p => p.Service).ThenInclude(p => p.Images)
                .Include(p => p.ServiceOccurrence).ThenInclude(p => p.Service).ThenInclude(p => p.Tags)
                .Include(p => p.ServiceOccurrence).ThenInclude(p => p.Service).ThenInclude(p => p.Shop)
                .Include(p => p.ServiceOccurrence).ThenInclude(p => p.Service).ThenInclude(p => p.Comments);
            if (!string.IsNullOrWhiteSpace(parameter.ShopId))
            {
                services = services.Where(p => p.ServiceOccurrence.Service.ShopId == parameter.ShopId);
            }

            if (parameter.NorthEast != null && parameter.SouthWest != null)
            {
                services = services.Where(p => p.ServiceOccurrence.Service.Shop.Latitude >= parameter.SouthWest.Latitude && p.ServiceOccurrence.Service.Shop.Latitude <= parameter.NorthEast.Latitude
                    && p.ServiceOccurrence.Service.Shop.Longitude >= parameter.SouthWest.Longitude && p.ServiceOccurrence.Service.Shop.Longitude <= parameter.NorthEast.Longitude);
            }

            if (!string.IsNullOrWhiteSpace(parameter.Name))
            {
                services = services.Where(p => p.ServiceOccurrence.Service.Name.ToLowerInvariant().Contains(parameter.Name.ToLowerInvariant()));
            }

            var lines = new List<ServiceResultLine>();
            var fromDay = (int)parameter.FromDateTime.DayOfWeek;
            var toDay = (int)parameter.ToDateTime.DayOfWeek;
            var fromDate = parameter.FromDateTime.Date;
            var toDate = parameter.ToDateTime.Date;
            var tmp = toDate - fromDate;
            var totalDays = tmp.Days;
            var nbDays = tmp.Days;
            var days = new List<string>();
            if (fromDay + nbDays <= 6)
            {
                for (var i = fromDay; i <= fromDay + nbDays; i++)
                {
                    days.Add(i.ToString());
                }
            }
            else
            {
                for(var i = fromDay; i <= 6; i++)
                {
                    nbDays--;
                    days.Add(i.ToString());
                }

                var diff = fromDay - nbDays;
                if (diff < 0)
                {
                    diff = fromDay;
                }

                for (var i = 0; i < fromDay; i++)
                {
                    days.Add(i.ToString());
                }
            }

            
            var occurrences = await services
                .Where(p => p.ServiceOccurrence.StartDate < toDate && days.Contains(p.DayId))
                .ToListAsync().ConfigureAwait(false);
            var nbWeeks = Math.Ceiling((decimal)totalDays / (decimal)7);
            var remainingDays = totalDays;
            for (var i = 0; i < nbWeeks; i++)
            {
                var fromDateTime = fromDate.AddDays(i * 7);
                var max = (remainingDays < 7) ? remainingDays : 6;
                var mapping = new Dictionary<string, DateTime>();
                var nextDateTime = fromDate.AddDays(i * 7 + max + 1);
                for (var y = 0; y <= max; y++)
                {
                    var newDateTime = fromDate.AddDays(i * 7 + y);
                    mapping.Add(((int)newDateTime.DayOfWeek).ToString(), newDateTime);
                }

                foreach (var occurrence in occurrences)
                {
                    if (!mapping.Keys.Contains(occurrence.DayId) 
                        || nextDateTime < occurrence.ServiceOccurrence.StartDate
                        || fromDateTime > occurrence.ServiceOccurrence.EndDate)
                    {
                        continue;
                    }

                    lines.Add(occurrence.ServiceOccurrence.Service.ToAggregate(occurrence.ServiceOccurrence, mapping[occurrence.DayId]));
                }

                remainingDays -= 7;
            }

            var result = new SearchServiceOccurrenceResult
            {
                TotalResults = lines.Count(),
                StartIndex = parameter.StartIndex
            };

            if (parameter.IsPagingEnabled)
            {
                lines = lines.Skip(parameter.StartIndex).Take(parameter.Count).ToList();
            }

            lines = lines.OrderBy(l => l.StartDateTime).ToList();
            result.Content = lines;
            return result;
        }
    }
}
