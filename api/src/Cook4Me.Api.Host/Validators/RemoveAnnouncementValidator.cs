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

using Cook4Me.Api.Core.Commands.Announcement;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IRemoveAnnouncementValidator
    {
        Task<RemoveAnnouncementValidationResult> Validate(RemoveAnnouncementCommand command);
    }

    public class RemoveAnnouncementValidationResult
    {
        public RemoveAnnouncementValidationResult()
        {
            IsValid = true;
        }

        public RemoveAnnouncementValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class RemoveAnnouncementValidator : IRemoveAnnouncementValidator
    {
        private readonly IAnnouncementRepository _repository;

        public RemoveAnnouncementValidator(IAnnouncementRepository repository)
        {
            _repository = repository;
        }

        public async Task<RemoveAnnouncementValidationResult> Validate(RemoveAnnouncementCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            var announcement = await _repository.Get(command.AnnouncementId);
            if (announcement == null)
            {
                return new RemoveAnnouncementValidationResult(ErrorDescriptions.TheAnnouncementDoesntExist);
            }

            if (announcement.Subject != command.Subject)
            {
                return new RemoveAnnouncementValidationResult(ErrorDescriptions.TheAnnouncementCannotBeRemovedByYou);
            }

            return new RemoveAnnouncementValidationResult();
        }
    }
}
