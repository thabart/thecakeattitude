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

using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Core.Results;
using Cook4Me.Api.EF.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.EF.Repositories
{
    internal class CommentRepository : ICommentRepository
    {
        private readonly CookDbContext _context;

        public CommentRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(Comment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            try
            {
                _context.Comments.Add(comment.ToModel());
                await _context.SaveChangesAsync().ConfigureAwait(false);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<Comment> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == id).ConfigureAwait(false);
            if (comment == null)
            {
                return null;
            }

            return comment.ToDomain();
        }

        public async Task<SearchCommentsResult> Search(SearchCommentsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Comment> comments = _context.Comments;
            if (!string.IsNullOrWhiteSpace(parameter.ShopId))
            {
                comments = comments.Where(c => parameter.ShopId == c.ShopId);
            }

            if (!string.IsNullOrWhiteSpace(parameter.Subject))
            {
                comments = comments.Where(c => c.Subject == parameter.Subject);
            }

            var result = new SearchCommentsResult
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
                
            result.Content = await comments.Select(c => c.ToDomain()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        public async Task<bool> Remove(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = await _context.Comments.FirstOrDefaultAsync(c => c.Id == id).ConfigureAwait(false);
                    if (record == null)
                    {
                        transaction.Commit();
                        return false;
                    }

                    _context.Comments.Remove(record);
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
