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

namespace Cook4Me.Api.Host
{
    internal static class ErrorDescriptions
    {
        public const string TheSubjectCannotBeRetrieved = "subject cannot be retrieved";
        public const string TheShopCannotBeAdded = "an error occured while trying to add the shop";
        public const string TheUserCannotBeAdded = "an error occured while trying to add the user";
        public const string TheUserCannotBeUpdated = "an error occured while trying to update the user";
        public const string ThePlaceDoesntExist = "the place doesn't exist";
        public const string TheCategoryDoesntExist = "the category doesn't exist";
        public const string TheMapDoesntExist = "the map doesn't exist";
        public const string TheMapFileDoesntExist = "the map file doesn't exist";
        public const string ThePaymentMethodDoesntExist = "the payment method doesn't exist";
        public const string TheShopCannotBeAddedBecauseThereIsAlreadyOneInTheCategory = "you already have a shop on this category";
        public const string TheParameterIsMandatory = "the parameter {0} is mandatory";
        public const string TheParameterIsMandatoryAndShouldContainsBetween = "the parameter {0} is mandatory and should contains between {1} characters and {2}";
    }
}
