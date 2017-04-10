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
using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.EF.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Cook4Me.Api.EF.Repositories
{
    internal class UserRepository : IUserRepository
    {
        private readonly CookDbContext _context;

        public UserRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(User user)
        {
            try
            {
                var record = user.ToModel();
                _context.Users.Add(record);
                await _context.SaveChangesAsync().ConfigureAwait(false);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> Update(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            try
            {
                using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
                {
                    var record = await _context.Users.FirstOrDefaultAsync(u => u.Id == user.Id).ConfigureAwait(false);
                    if (record == null)
                    {
                        return false;
                    }

                    record.City = user.City;
                    record.Email = user.Email;
                    record.IsSeller = user.IsSeller;
                    record.PhoneNumber = user.PhoneNumber;
                    record.PostalCode = user.PostalCode;
                    record.Pseudo = user.Pseudo;
                    record.StreetAddress = user.StreetAddress;
                    record.StreetNumber = user.StreetNumber;
                    await _context.SaveChangesAsync().ConfigureAwait(false);
                    transaction.Commit();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public async Task<User> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            try
            {
                var record = await _context.Users.FirstOrDefaultAsync(u => u.Id == id).ConfigureAwait(false);
                if (record == null)
                {
                    return null;
                }

                return record.ToDomain();
            }
            catch
            {
                return null;
            }
        }
    }
}
