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
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Cook4Me.Api.EF.Repositories
{
    internal class MessageRepository : IMessageRepository
    {
        private readonly CookDbContext _context;

        public MessageRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(MessageAggregate message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = message.ToModel();
                    _context.Messages.Add(record);
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

        public async Task<MessageAggregate> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var result = await _context.Messages.Include(n => n.JoinedFiles).Include(n => n.JoinedFiles).FirstOrDefaultAsync(n => n.Id == id).ConfigureAwait(false);
            if (result == null)
            {
                return null;
            }

            return result.ToAggregate();
        }

        public async Task<SearchMessagesResult> Search(SearchMessagesParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Message> messages = _context.Messages.Include(n => n.JoinedFiles);
            if (!string.IsNullOrWhiteSpace(parameter.ProductId))
            {
                messages = messages.Where(m => m.ProductId == parameter.ProductId);
            }

            if (!string.IsNullOrWhiteSpace(parameter.ServiceId))
            {
                messages = messages.Where(m => m.ServiceId == parameter.ServiceId);
            }

            if (!string.IsNullOrWhiteSpace(parameter.ParentId))
            {
                messages = messages.Where(m => m.ParentId == parameter.ParentId);
            }

            if (parameter.IsParent != null)
            {
                if (parameter.IsParent.Value)
                {
                    messages = messages.Where(m => m.ParentId == null);
                }
                else
                {
                    messages = messages.Where(m => m.ParentId != null);
                }
            }

            if (!string.IsNullOrWhiteSpace(parameter.From))
            {
                messages = messages.Where(m => m.From == parameter.From);
            }

            if (!string.IsNullOrWhiteSpace(parameter.To))
            {
                messages = messages.Where(m => m.To == parameter.To);
            }

            if (parameter.IsRead != null)
            {
                messages = messages.Where(m => m.IsRead == parameter.IsRead.Value);
            }

            if (parameter.OrderBy != null)
            {
                foreach (var orderBy in parameter.OrderBy)
                {
                    messages = Order(orderBy, "create_datetime", s => s.CreateDateTime, messages);
                }
            }

            var result = new SearchMessagesResult
            {
                TotalResults = await messages.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };

            messages = messages.OrderByDescending(c => c.CreateDateTime);
            if (parameter.IsPagingEnabled)
            {
                messages = messages.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await messages.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        private static IQueryable<Models.Message> Order<TKey>(OrderBy orderBy, string key, Expression<Func<Models.Message, TKey>> keySelector, IQueryable<Models.Message> messages)
        {
            if (string.Equals(orderBy.Target, key, StringComparison.CurrentCultureIgnoreCase))
            {
                if (orderBy.Method == OrderByMethods.Ascending)
                {
                    return messages.OrderBy(keySelector);
                }

                return messages.OrderByDescending(keySelector);
            }

            return messages;
        }
    }
}
