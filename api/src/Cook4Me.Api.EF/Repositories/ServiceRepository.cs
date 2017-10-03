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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Core.Results;
using Cook4Me.Api.EF.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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

        public async Task<ServiceAggregate> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var record = await _context.Services
                .Include(p => p.Images)
                .Include(p => p.Tags).ThenInclude(t => t.Tag)
                .Include(p => p.Shop)
                .Include(p => p.Occurrence).ThenInclude(o => o.Days)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(s => s.Id == id).ConfigureAwait(false);
            if (record == null)
            {
                return null;
            }

            return record.ToAggregate();
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
                .Include(p => p.Occurrence).ThenInclude(o => o.Days)
                .Include(p => p.Comments);
            if (parameter.ShopIds != null && parameter.ShopIds.Any())
            {
                services = services.Where(p => parameter.ShopIds.Contains(p.ShopId));
            }

            if (parameter.ShopCategoryIds != null && parameter.ShopCategoryIds.Any())
            {
                services = services.Where(p => parameter.ShopCategoryIds.Contains(p.Shop.CategoryId));
            }

            if (parameter.Tags != null && parameter.Tags.Any())
            {
                services = services.Where(s => s.Tags.Count() > 0 && s.Tags.Any(t => parameter.Tags.Contains(t.TagName)));
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
                var days = GetDays(parameter.FromDateTime.Value, parameter.ToDateTime.Value);
                services = services.Where(p => p.Occurrence != null && p.Occurrence.StartDate <= parameter.FromDateTime && p.Occurrence.EndDate >= parameter.ToDateTime && p.Occurrence.Days.Any(d => days.Contains(d.DayId)));
            }

            if (parameter.Orders != null)
            {
                foreach (var order in parameter.Orders)
                {
                    services = Order(order, "total_score", s => s.TotalScore, services);
                    services = Order(order, "average_score", s => s.AverageScore, services);
                    services = Order(order, "price", s => s.NewPrice, services);
                    services = Order(order, "update_datetime", s => s.UpdateDateTime, services);
                    services = Order(order, "create_datetime", s => s.CreateDateTime, services);
                }
            }

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

        public async Task<SearchServiceCommentsResult> Search(SearchServiceCommentParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }


            IQueryable<Models.Comment> comments = _context.Comments;
            if (!string.IsNullOrWhiteSpace(parameter.ServiceId))
            {
                comments = comments.Where(c => parameter.ServiceId == c.ServiceId);
            }

            if (!string.IsNullOrWhiteSpace(parameter.Subject))
            {
                comments = comments.Where(c => c.Subject == parameter.Subject);
            }

            var result = new SearchServiceCommentsResult
            {
                TotalResults = await comments.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };

            comments = comments
                .OrderByDescending(c => c.UpdateDateTime);
            if (parameter.IsPagingEnabled)
            {
                comments = comments.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await comments.Select(c => c.ToAggregateService()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        public async Task<bool> Update(ServiceAggregate serviceAggregate)
        {
            if (serviceAggregate == null)
            {
                throw new ArgumentNullException(nameof(serviceAggregate));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = await _context.Services.Include(s => s.Comments).FirstOrDefaultAsync(s => s.Id == serviceAggregate.Id).ConfigureAwait(false);
                    if (record == null)
                    {
                        return false;
                    }

                    record.AverageScore = serviceAggregate.AverageScore;
                    record.Description = serviceAggregate.Description;
                    record.Name = serviceAggregate.Name;
                    record.NewPrice = serviceAggregate.NewPrice;
                    record.Price = serviceAggregate.Price;
                    record.ShopId = serviceAggregate.ShopId;
                    record.TotalScore = serviceAggregate.TotalScore;
                    record.UpdateDateTime = serviceAggregate.UpdateDateTime;
                    var comments = serviceAggregate.Comments == null ? new List<ServiceComment>() : serviceAggregate.Comments;
                    var commentIds = comments.Select(c => c.Id);
                    // Update the comments
                    if (record.Comments != null)
                    {
                        var commentsToUpdate = record.Comments.Where(c => commentIds.Contains(c.Id));
                        var commentsToRemove = record.Comments.Where(c => !commentIds.Contains(c.Id));
                        var existingCommentIds = record.Comments.Select(c => c.Id);
                        var commentsToAdd = comments.Where(c => !existingCommentIds.Contains(c.Id));
                        foreach (var commentToUpdate in commentsToUpdate)
                        {
                            var comment = comments.First(c => c.Id == commentToUpdate.Id);
                            commentToUpdate.Score = comment.Score;
                            commentToUpdate.Subject = comment.Subject;
                            commentToUpdate.UpdateDateTime = comment.UpdateDateTime;
                            commentToUpdate.Content = comment.Content;
                        }

                        foreach (var commentToRemove in commentsToRemove)
                        {
                            _context.Comments.Remove(commentToRemove);
                        }

                        foreach (var commentToAdd in commentsToAdd)
                        {
                            var rec = new Models.Comment
                            {
                                Id = commentToAdd.Id,
                                Content = commentToAdd.Content,
                                Score = commentToAdd.Score,
                                CreateDateTime = commentToAdd.CreateDateTime,
                                ServiceId = serviceAggregate.Id,
                                UpdateDateTime = commentToAdd.UpdateDateTime,
                                Subject = commentToAdd.Subject
                            };
                            _context.Comments.Add(rec);
                        }
                    }

                    await _context.SaveChangesAsync().ConfigureAwait(false);
                    transaction.Commit();
                    return true;
                }
                catch
                {
                    transaction.Rollback();
                    return false;
                }
            }
        }

        public async Task<bool> Add(ServiceAggregate serviceAggregate)
        {
            if (serviceAggregate == null)
            {
                throw new ArgumentNullException(nameof(serviceAggregate));
            }

            try
            {
                var record = serviceAggregate.ToModel();
                var tags = new List<Models.ServiceTag>();
                if (serviceAggregate.Tags != null && serviceAggregate.Tags.Any()) // Add tags
                {
                    var tagNames = serviceAggregate.Tags;
                    var connectedTags = _context.Tags.Where(t => tagNames.Any(tn => t.Name == tn));
                    foreach (var connectedTag in connectedTags)
                    {
                        tags.Add(new Models.ServiceTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = connectedTag.Name,
                            ServiceId = serviceAggregate.Id
                        });
                    }

                    var connectedTagNames = (await connectedTags.Select(t => t.Name).ToListAsync().ConfigureAwait(false));
                    foreach (var notExistingTagName in tagNames.Where(tn => !connectedTagNames.Contains(tn)))
                    {
                        var newTag = new Models.Tag
                        {
                            Name = notExistingTagName,
                            Description = notExistingTagName
                        };
                        _context.Tags.Add(newTag);
                        tags.Add(new Models.ServiceTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = notExistingTagName,
                            ServiceId = serviceAggregate.Id,
                            Tag = newTag
                        });
                    }
                }

                if (serviceAggregate.PartialImagesUrl != null && serviceAggregate.PartialImagesUrl.Any()) // Add images
                {
                    record.Images = serviceAggregate.PartialImagesUrl.Select(i =>
                        new Models.ServiceImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = i
                        }
                    ).ToList();
                }

                if (serviceAggregate.Occurrence != null) // Add occurrence.
                {
                    var days = new List<Models.ServiceOccurrenceDay>();
                    if (serviceAggregate.Occurrence.Days != null)
                    {
                        days = serviceAggregate.Occurrence.Days.Select(d => new Models.ServiceOccurrenceDay
                        {
                            Id = Guid.NewGuid().ToString(),
                            DayId = ((int)d).ToString()
                        }).ToList();
                    }
                    record.Occurrence = new Models.ServiceOccurrence
                    {
                        Id = serviceAggregate.Occurrence.Id,
                        StartDate = serviceAggregate.Occurrence.StartDate,
                        EndDate = serviceAggregate.Occurrence.EndDate,
                        StartTime = serviceAggregate.Occurrence.StartTime,
                        EndTime = serviceAggregate.Occurrence.EndTime,
                        Days = days
                    };
                }

                record.Tags = tags;
                _context.Services.Add(record);
                await _context.SaveChangesAsync().ConfigureAwait(false);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private static IQueryable<Models.Service> Order<TKey>(OrderBy orderBy, string key, Expression<Func<Models.Service, TKey>> keySelector, IQueryable<Models.Service> products)
        {
            if (string.Equals(orderBy.Target, key, StringComparison.CurrentCultureIgnoreCase))
            {
                if (orderBy.Method == OrderByMethods.Ascending)
                {
                    return products.OrderBy(keySelector);
                }

                return products.OrderByDescending(keySelector);
            }

            return products;
        }

        private IEnumerable<string> GetDays(DateTime fromDateTime, DateTime toDateTime)
        {
            var fromDay = (int)fromDateTime.DayOfWeek;
            var fromDate = fromDateTime.Date;
            var toDate = toDateTime.Date;
            var tmp = toDate - fromDate;
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
                for (var i = fromDay; i <= 6; i++)
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

            return days;
        }
    }
}
