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
        public const string TheShopDoesntExist = "the shop doesn't exist";
        public const string TheServiceDoesntExist = "the service doesn't exist";
        public const string TheProductDoesntExist = "the product doesn't exist";
        public const string TheAnnouncementDoesntExist = "the announcement doesn't exist";
        public const string TheCommentDoesntExist = "the comment doesn't exist";
        public const string TheClientServiceDoesntExist = "the client service doesn't exist";
        public const string TheCommentAlreadyExists = "a comment has already been written by the user";
        public const string TheCommentCannotBeInserted = "an error occured when trying to add the comment";
        public const string TheShopCannotBeUpdated = "an error occured when trying to update the shop";
        public const string ThePaymentMethodDoesntExist = "the payment method doesn't exist";
        public const string TheCommentCannotBeRemoved = "an error occured while trying to remove the comment";
        public const string TheShopCannotBeAddedBecauseThereIsAlreadyOneInTheCategory = "you already have a shop on this category";
        public const string TheParameterIsMandatory = "the parameter {0} is mandatory";
        public const string TheParametersAreMandatories = "the parameters {0} are mandatories";
        public const string TheParameterIsMandatoryAndShouldContainsBetween = "the parameter {0} is mandatory and should contains between {1} characters and {2}";
        public const string TheParameterLengthCannotExceedNbCharacters = "the parameter {0} length cannot exceed {1} characters";
        public const string TheScoreMustBeBetween = "the score must be between 1 and 5";
        public const string TheCommentCannotBeRemovedByYou = "the comment cannot be removed by you";
        public const string TheShopCannotBeRemovedByYou = "the shop cannot be removed by you";
        public const string TheAnnouncementCannotBeRemovedByYou = "the announcement cannot be removed by you";
        public const string ThePriceCannotBeLessThanZero = "the price cannot be less than 0";
        public const string TheQuantityCannotBeLessThanZero = "the quantity cannot be less than 0";
        public const string TheAvailableInStockCannotBeLessThanZero = "the available in stock number cannot be less than 0";
        public const string TheUnitOfMeasureIsNotCorrect = "only the following unit of measure are supported : {0}";
        public const string TheProductCannotBeAddedByYou = "the product cannot be added by you";
        public const string SomeFiltersAreNotValid = "some filters are not valid";
        public const string DuplicateValues = "the values must be unique in the parameter {0}";
        public const string OnlyEightCategoriesCanBeAdded = "only 6 product categories can be added";
        public const string TheServiceCannotBeAddedByYou = "the service cannot be added by you";
        public const string TheDaysAreNotValid = "either the parameter 'days' is empty or one of its value is not valid";
        public const string TheOccurrenceDatePeriodIsNotValid = "the occurence date period is not valid";
        public const string TheOccurrenceTimePeriodIsNotValid = "the occurrence time period is not valid";
        public const string TheIbanIsNotValid = "the IBAN is not valid";
        public const string ThePaypalAccountIsNotValid = "the paypal account is not a valid email";
        public const string TheNotificationDoesntExist = "the notification doesn't exist";
        public const string TheNotificationCannotBeUpdated = "you don't have the correct right to update the notification";
        public const string TheProductAndServiceCannotBeSpecifiedAtSameTime = "the product, shop service and client service parameters cannot be specified at same time";
        public const string TheParentMessageDoesntExist = "the parent message doesn't exist";
        public const string TheMessageCannotBeSentToYourself = "the message cannot be sent to yourself";
        public const string TheOrderDoesntExist = "the order doesn't exist";
        public const string TheOrderLineProductIsInvalid = "One or more products don't exist";
        public const string TheOrderLineQuantityIsInvalid = "The quantity should be > 0";
        public const string TheOrderLineQuantityIsTooMuch = "There is not enough product";
        public const string TheOrderCannotBeRemovedByYou = "The order cannot be removed by you";
        public const string TheProductCannotBeOrderedByYou = "You cannot order your own product";
        public const string TheOrderCannotBeUpdatedBecauseOfItsState = "An order with the state {0} cannot be updated";
        public const string TheOrderCannotBeAccessedByYou = "You cannot access to the order";
        public const string TheOrderReceptionCanBeConfirmedOnlyByItsCreator = "You cannot confirm the reception";
        public const string TheOrderStateCannotBeUpdated = "Not possible to pass from {0} state to {1}";
        public const string TheReceivedOrderCannotBeUpdated = "The received order cannot be updated";
        public const string TheReceivedOrderCannotBeRemoved = "The received order cannot be removed";
        public const string ThePayerPaypalAccountNotExist = "the payer doesn't have a valid Paypal account";
        public const string TheSellerPaypalAccountNotExist = "the seller doesn't have a valid Paypal account";
        public const string TheParcelDoesntExist = "the parcel doesn't exist";
        public const string ThePaypalPaymentDoesntWork = "an error occured while trying to pay with Paypal";
        public const string TheOrderDoesntHavePayment = "the order doesn't have payment";
        public const string ThePaymentMethodIsNotSupported = "the payment method is not yet supported";
        public const string TheOrderTransactionIsNotCorrect = "the order transaction is not correct";
        public const string TheOrderTransactionHasBeenApproved = "the order transaciton has already been approved";
        public const string TheOrderCanBeApprovedOnlyByItsCreator = "the order can be approved only by its creator";
        public const string TheOrderLabelCanBePurchasedOnlyBySeller = "the order label can be purchased only by its seller";
        public const string TheOrderIsNotConfirmed = "the order is not confirmed";
        public const string TheOrderPaymentHasNotBeenConfirmed = "the order payment has not been confirmed";
        public const string TheUpsIsOnlySupported = "Only the UPS transport mode is supported";
        public const string TheShipmentIdDoesntExist = "the label has not been purchased";
        public const string TheOrderLabelCanBeUploadedOnlyByTheSeller = "the order label can be uploaded only by the seller";
        public const string TheLabelCannotBeRetrieved = "the order label cannot be retrieved";
        public const string TheLabelFormatIsNotSupported = "the label format is not supported";
        public const string TheOrderCannotBeCanceledByYou = "the order cannot be canceled by you";
        public const string TheOrderCannotBeCanceledPurchased = "the order cannot be canceled because its label has been purchased";
        public const string TheParcelSizeIsInvalid = "the parcel size is invalid";
        public const string ThePurchasedRequestLabelCannotBeRemoved = "the request cannot be removed because its label has been purchased";
        public const string TheOrderPaymentDetailsCanBeUploadByTheBuyer = "the payment details can be retrieved only by the buyer";
        public const string TheOrderPaymentDoesntExist = "the order payment doesn't exist";
        public const string TheOrderCanBeTrackedBySellerOrBuyer = "the order can be tracker only by the seller or buyer";
        public const string TheOrderDoesntContainTrackingNumber = "the order doesn't have a valid tracking number";
        public const string TheOrderReceptionCanBeConfirmedOnlyByTheBuyer = "the order reception can be confirmed only by the buyer";
        public const string TheOrderLabelHasNotBeenPurchased = "the order label has not been purchased";
        public const string TheOrderParcelHasNotBeenDelivered = "the order parcel has not been delivered";
        public const string TheStartDateMustBeInferiorToEndDate = "the start date must be < end date";
        public const string SomeProductsDontExist = "some products don't exist";
        public const string TheProductsShouldBelongsToTheSameShop = "products should belong to the same shop";
        public const string TheDiscountCannotBeAddedByYou = "the discount cannot be added by you";
        public const string TheDiscountCannotBeAccessedByYou = "the discount cannot be accessed by you";
        public const string TheDiscountDoesntExist = "the discount doesn't exist";
        public const string TheProductPriceCannotBeInferiorToTheDiscount = "the product price cannot be inferior to the discount";
        public const string TheProductDiscountIsInvalid = "the product discount {0} is invalid";
        public const string TheDiscountCannotBeUsedForThisProduct = "the discount cannot be used for the product {0}";
        public const string TheDiscountCodesAreNotValid = "the discount codes are not valid";
        public const string TheProductCannotBeUpdatedByYou = "the product cannot be updated by you";
        public const string TheProductImageCanBeUrlOrBase64Encoded = "the product image must be a URL or a valid base 64 encoded image";
    }
}
