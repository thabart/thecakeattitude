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

namespace Cook4Me.Api.EF.Repositories
{
    internal class NotificationRepository : INotificationRepository
    {
        private readonly CookDbContext _context;

        public NotificationRepository(CookDbContext context)
        {
            _context = context;
        }

        public Task<SearchNotificationsResult> Search(SearchNotificationsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Notification> notifications = _context.Notifications;
            if (!string.IsNullOrWhiteSpace(parameter.From))
            {
                notifications = notifications.Where(n => n.From == parameter.From);
            }

            if (!string.IsNullOrWhiteSpace(parameter.To))
            {
                notifications = notifications.Where(n => n.To == parameter.To));
            }

            if (parameter.StartDateTime != null)
            {
                notifications = notifications.Where(n => n.CreatedDateTime >= parameter.StartDateTime);
            }

            if (parameter.EndDateTime != null)
            {
                notifications = notifications.Where(n => n.CreatedDateTime <= parameter.EndDateTime);
            }

            return null;
        }
    }
}
