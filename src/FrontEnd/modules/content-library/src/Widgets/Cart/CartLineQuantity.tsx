import useAccessibleSubmit from "@insite/client-framework/Common/Hooks/useAccessibleSubmit";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";
import { isOutOfStock } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import translate from "@insite/client-framework/Translate";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import React, { FC } from "react";

interface OwnProps {
    cart: Cart;
    /**
     * If true, the qtyOrdered will display in a text field for editing.
     * If false, the qtyOrdered will display as read-only text.
     * Default value: false
     */
    editable?: boolean;
    onQtyOrderedChange?: (qtyOrdered: number) => void;
    extendedStyles?: CartLineQuantityStyles;
    label?: string;
}

type Props = OwnProps & HasCartLineContext;

export interface CartLineQuantityStyles {
    editableQuantityTextField?: TextFieldPresentationProps;
    readOnlyQuantityText?: SmallHeadingAndTextStyles;
}

export const cartLineQuantityStyles: CartLineQuantityStyles = {
    editableQuantityTextField: {
        labelProps: {
            variant: "legend",
        },
    },
};

const CartLineQuantity: FC<Props> = ({
    cart,
    cartLine,
    editable = false,
    label,
    onQtyOrderedChange = () => {},
    extendedStyles,
}) => {
    const localOnQtyOrderedChange = (value: string) => {
        const inputQty = Number.parseInt(value, 10);
        if (Number.isNaN(inputQty)) {
            return;
        }

        onQtyOrderedChange(inputQty);
    };

    const { value, changeHandler, keyDownHandler, blurHandler } = useAccessibleSubmit(
        cartLine.qtyOrdered!.toString(),
        localOnQtyOrderedChange,
    );

    const [styles] = React.useState(() => mergeToNew(cartLineQuantityStyles, extendedStyles));

    if (editable && !isOutOfStock(cartLine)) {
        return (
            <TextField
                {...styles.editableQuantityTextField}
                type="number"
                min={0}
                label={label || translate("QTY_quantity")}
                value={value}
                disabled={!cart.canModifyOrder || cartLine.isPromotionItem || cart.type === "Job"}
                onChange={changeHandler}
                onKeyDown={keyDownHandler}
                onBlur={blurHandler}
                data-test-selector="cartline_qty"
            />
        );
    }

    return (
        <SmallHeadingAndText
            {...styles.readOnlyQuantityText}
            heading={label || translate("QTY_quantity")}
            text={cartLine.qtyOrdered!}
        />
    );
};

export default withCartLine(CartLineQuantity);
