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
using Cook4Me.Api.Core.Repositories;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Commands.Notifications;

namespace Cook4Me.Api.Host.Validators
{
    public interface IUpdateNotificationValidator
    {
        Task<UpdateNotificationValidationResult> Validate(UpdateNotificationCommand command, string subject);
    }

    public class UpdateNotificationValidationResult
    {
        public UpdateNotificationValidationResult(NotificationAggregate notification)
        {
            Notification = notification;
            IsValid = true;
        }

        public UpdateNotificationValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
        public NotificationAggregate Notification { get; set; }
    }

    internal class UpdateNotificationValidator : IUpdateNotificationValidator
    {
        private readonly INotificationRepository _notificationRepository;

        public UpdateNotificationValidator(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<UpdateNotificationValidationResult> Validate(UpdateNotificationCommand command, string subject)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var record = await _notificationRepository.Get(command.Id);
            if (record == null)
            {
                return new UpdateNotificationValidationResult(ErrorDescriptions.TheNotificationDoesntExist);
            }

            if (record.To != subject)
            {
                return new UpdateNotificationValidationResult(ErrorDescriptions.TheNotificationCannotBeUpdated);
            }
            
            return new UpdateNotificationValidationResult(record);
        }
    }
}
