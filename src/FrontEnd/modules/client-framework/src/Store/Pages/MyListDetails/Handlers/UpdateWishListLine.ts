import { HandlerWithResult, createHandlerChainRunner, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { updateWishListLine as updateWishListLineApi } from "@insite/client-framework/Services/WishListService";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import { WishListLineModel } from "@insite/client-framework/Types/ApiModels";

export interface UpdateWishListLineResult {
    wishListLine?: WishListLineModel;
    errorMessage?: string;
}

type HandlerType = HandlerWithResult<
    {
        wishListId: string;
        wishListLineId: string;
        wishListLine: WishListLineModel;
        reloadWishListLines?: boolean;
    } & HasOnSuccess,
    UpdateWishListLineResult
>;

export const RequestUpdateWishListLine: HandlerType = async props => {
    const wishListLine = await updateWishListLineApi({
        wishListId: props.parameter.wishListId,
        wishListLineId: props.parameter.wishListLineId,
        wishListLine: props.parameter.wishListLine,
    });
    props.result = { wishListLine };
};

export const DispatchUpdateWishListLine: HandlerType = props => {
    if (props.result.wishListLine) {
        props.dispatch({
            type: "Data/WishListLines/UpdateWishListLine",
            model: props.result.wishListLine,
        });
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const DispatchLoadWishListLines: HandlerType = props => {
    if (props.parameter.reloadWishListLines) {
        props.dispatch(loadWishListLines());
    }
};

export const chain = [
    RequestUpdateWishListLine,
    DispatchUpdateWishListLine,
    ExecuteOnSuccessCallback,
    DispatchLoadWishListLines,
];

const updateWishListLine = createHandlerChainRunner(chain, "UpdateWishListLine");
export default updateWishListLine;