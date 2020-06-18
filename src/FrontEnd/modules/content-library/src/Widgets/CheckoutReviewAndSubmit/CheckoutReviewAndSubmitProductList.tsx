import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartLinesList, { CartLinesListStyles } from "@insite/content-library/Components/CartLinesList";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";
import { getCurrentPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getDefaultPageSize, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

const mapStateToProps = (state: ApplicationState) => ({
    cartState: getCurrentCartState(state),
    promotionsDataView: getCurrentPromotionsDataView(state),
    defaultPageSize: getDefaultPageSize(state),
    settingsCollection: getSettingsCollection(state),
});

const mapDispatchToProps = {
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutReviewAndSubmitProductListStyles {
    centeringWrapper?: InjectableCss;
    orderLinesList?: CartLinesListStyles;
}

const styles: CheckoutReviewAndSubmitProductListStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
        `,
    },
};

export const productListStyles = styles;

const CheckoutReviewAndSubmitProductList: FC<Props> = ({
                                                           cartState,
                                                           promotionsDataView,
                                                           settingsCollection,
                                                       }) => {
    const [isCondensed, setIsCondensed] = useState(false);

    if (!cartState.value || !cartState.value.cartLines || !promotionsDataView.value) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner/>
            </StyledWrapper>
        );
    }

    const { productSettings } = settingsCollection;

    return (
        <CartLinesList
            cart={cartState.value}
            promotions={promotionsDataView.value}
            isCondensed={isCondensed}
            onChangeIsCondensed={(event: React.SyntheticEvent<Element, Event>, value: boolean) => setIsCondensed(value)}
            editable={false}
            showSavingsAmount={productSettings.showSavingsAmount}
            showSavingsPercent={productSettings.showSavingsPercent}
            extendedStyles={styles.orderLinesList}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutReviewAndSubmitProductList),
    definition: {
        displayName: "Product List",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        group: "Checkout - Review & Submit",
        isSystem: true,
    },
};

export default widgetModule;
