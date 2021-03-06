import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import CheckoutReviewAndSubmitState from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitState";
import { Draft } from "immer";

const initialState: CheckoutReviewAndSubmitState = {
    isPlacingOrder: false,
    isApplyingPromotion: false,
    isCheckingOutWithPayPay: false,
};

const reducer = {
    "Pages/CheckoutReviewAndSubmit/SetCartId": (
        draft: Draft<CheckoutReviewAndSubmitState>,
        action: { cartId?: string },
    ) => {
        draft.cartId = action.cartId;
    },
    "Pages/CheckoutReviewAndSubmit/BeginApplyPromotion": (draft: Draft<CheckoutReviewAndSubmitState>) => {
        draft.isApplyingPromotion = true;
    },
    "Pages/CheckoutReviewAndSubmit/CompleteApplyPromotion": (
        draft: Draft<CheckoutReviewAndSubmitState>,
        action: { successMessage?: string; errorMessage?: string },
    ) => {
        draft.isApplyingPromotion = false;
        draft.promotionErrorMessage = action.errorMessage;
        draft.promotionSuccessMessage = action.successMessage;
    },
    "Pages/CheckoutReviewAndSubmit/BeginPlaceOrder": (draft: Draft<CheckoutReviewAndSubmitState>) => {
        draft.isPlacingOrder = true;
        draft.placeOrderErrorMessage = undefined;
    },
    "Pages/CheckoutReviewAndSubmit/SetPlaceOrderErrorMessage": (
        draft: Draft<CheckoutReviewAndSubmitState>,
        action: { errorMessage?: string },
    ) => {
        draft.placeOrderErrorMessage = action.errorMessage;
    },
    "Pages/CheckoutReviewAndSubmit/CompletePlaceOrder": (draft: Draft<CheckoutReviewAndSubmitState>) => {
        draft.isPlacingOrder = false;
    },
    "Pages/CheckoutReviewAndSubmit/BeginCheckoutWithPayPal": (draft: Draft<CheckoutReviewAndSubmitState>) => {
        draft.isCheckingOutWithPayPay = true;
    },
    "Pages/CheckoutReviewAndSubmit/CompleteCheckoutWithPayPal": (
        draft: Draft<CheckoutReviewAndSubmitState>,
        action: { redirectUri: string },
    ) => {
        draft.payPalRedirectUri = action.redirectUri;
    },
    "Pages/CheckoutReviewAndSubmit/SetRequestedDeliveryDate": (
        draft: Draft<CheckoutReviewAndSubmitState>,
        action: { requestedDeliveryDate?: Date },
    ) => {
        draft.requestedDeliveryDate = action.requestedDeliveryDate;
    },
    "Pages/CheckoutReviewAndSubmit/SetRequestedPickUpDate": (
        draft: Draft<CheckoutReviewAndSubmitState>,
        action: { requestedPickUpDate?: Date },
    ) => {
        draft.requestedPickupDate = action.requestedPickUpDate;
    },
    "Pages/CheckoutReviewAndSubmit/BeginPlaceOrderForApproval": (draft: Draft<CheckoutReviewAndSubmitState>) => {
        draft.isPlacingOrder = true;
        draft.placeOrderErrorMessage = undefined;
    },
    "Pages/CheckoutReviewAndSubmit/CompletePlaceOrderForApproval": (draft: Draft<CheckoutReviewAndSubmitState>) => {
        draft.isPlacingOrder = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
