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

using System;
using System.Threading.Tasks;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Core.Results;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Cook4Me.Api.EF.Extensions;
using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.EF.Models;

namespace Cook4Me.Api.EF.Repositories
{
    internal class NotificationRepository : INotificationRepository
    {
        private readonly CookDbContext _context;

        public NotificationRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(NotificationAggregate notification)
        {
            if (notification == null)
            {
                throw new ArgumentNullException(nameof(notification));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = notification.ToModel();
                    _context.Notifications.Add(record);
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

        public async Task<NotificationAggregate> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var result = await _context.Notifications.Include(n => n.Parameters).FirstOrDefaultAsync(n => n.Id == id).ConfigureAwait(false);
            if (result == null)
            {
                return null;
            }

            return result.ToAggregate();
        }

        public async Task<GetNotificationStatusResult> Search(GetNotificationStatusParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Notification> notifications = _context.Notifications.Include(n => n.Parameters);
            if (!string.IsNullOrWhiteSpace(parameter.To))
            {
                notifications = notifications.Where(n => n.To == parameter.To);
            }

            if (parameter.StartDate != null)
            {
                notifications = notifications.Where(n => n.CreatedDateTime >= parameter.StartDate);
            }

            if (parameter.EndDate != null)
            {
                notifications = notifications.Where(n => n.CreatedDateTime <= parameter.EndDate);
            }

            return new GetNotificationStatusResult
            {
                NbRead = await notifications.Where(n => n.IsRead).CountAsync().ConfigureAwait(false),
                NbUnread = await notifications.Where(n => !n.IsRead).CountAsync().ConfigureAwait(false)
            };
        }

        public async Task<SearchNotificationsResult> Search(SearchNotificationsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Notification> notifications = _context.Notifications.Include(n => n.Parameters);
            if (!string.IsNullOrWhiteSpace(parameter.From))
            {
                notifications = notifications.Where(n => n.From == parameter.From);
            }

            if (!string.IsNullOrWhiteSpace(parameter.To))
            {
                notifications = notifications.Where(n => n.To == parameter.To);
            }

            if (parameter.StartDateTime != null)
            {
                notifications = notifications.Where(n => n.CreatedDateTime >= parameter.StartDateTime);
            }

            if (parameter.EndDateTime != null)
            {
                notifications = notifications.Where(n => n.CreatedDateTime <= parameter.EndDateTime);
            }

            if (parameter.IsRead != null)
            {
                notifications = notifications.Where(n => n.IsRead == parameter.IsRead);
            }

            notifications = notifications.OrderByDescending(n => n.CreatedDateTime);
            var result = new SearchNotificationsResult
            {
                TotalResults = await notifications.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };
            notifications = notifications.Skip(parameter.StartIndex).Take(parameter.Count);
            result.Content = await notifications.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        public async Task<bool> Update(NotificationAggregate notification)
        {
            if (notification == null)
            {
                throw new ArgumentNullException(nameof(notification));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == notification.Id).ConfigureAwait(false);
                    if (record == null)
                    {
                        transaction.Rollback();
                        return false;
                    }

                    record.IsRead = notification.IsRead;
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
    }
}
