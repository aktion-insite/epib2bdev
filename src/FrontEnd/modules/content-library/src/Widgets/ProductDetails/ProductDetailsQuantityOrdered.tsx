import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { canAddToCart } from "@insite/client-framework/Store/Pages/ProductDetails/ProductDetailsSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import { TextFieldProps } from "@insite/mobius/TextField";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState, ownProps: HasProduct) => ({
    canAddToCart: canAddToCart(state, ownProps.product, ownProps.productInfo),
});

export interface ProductDetailsQuantityOrderedStyles {
    quantityOrdered?: TextFieldProps;
}

export const quantityOrderedStyles: ProductDetailsQuantityOrderedStyles = {
    quantityOrdered: {
        cssOverrides: {
            formField: css`
                margin-top: 10px;
            `,
        },
    },
};

const styles = quantityOrderedStyles;

const ProductDetailsQuantityOrdered: React.FC<Props> = ({ canAddToCart }) => {
    if (!canAddToCart) {
        return null;
    }

    return <ProductQuantityOrdered extendedStyles={styles.quantityOrdered} />;
};

const widgetModule: WidgetModule = {
    component: withProduct(connect(mapStateToProps)(ProductDetailsQuantityOrdered)),
    definition: {
        displayName: "Quantity Ordered",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
