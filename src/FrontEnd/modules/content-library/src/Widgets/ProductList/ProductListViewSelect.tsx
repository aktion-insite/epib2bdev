import { getCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setView from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetView";
import { getProductListDataView } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import { ProductListViewType } from "@insite/client-framework/Store/Pages/ProductList/ProductListState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Grid from "@insite/mobius/Icons/Grid";
import List from "@insite/mobius/Icons/List";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    loaded: !!getProductListDataView(state).value,
    view: state.pages.productList.view,
});

const mapDispatchToProps = {
    setView,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListViewSelectStyles {
    wrapper?: InjectableCss;
    listViewClickable?: ClickablePresentationProps;
    listViewIcon?: IconPresentationProps;
    gridViewClickable?: ClickablePresentationProps;
    gridViewIcon?: IconPresentationProps;
}

export const viewSelectStyles: ProductListViewSelectStyles = {
    wrapper: {
        css: css`
            display: flex;
            padding-top: 5px;
            float: right;
        `,
    },
    listViewClickable: {
        css: css`
            margin-right: 20px;
        `,
    },
    listViewIcon: {
        src: List,
        size: 30,
    },
    gridViewIcon: {
        src: Grid,
        size: 30,
    },
};

const styles = viewSelectStyles;

class ProductListViewSelect extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const view = getCookie("ProductList-View");
        if (view) {
            this.props.setView({ view: view as ProductListViewType });
        }
    }

    render() {
        const { loaded, view, setView } = this.props;

        if (!loaded) {
            return null;
        }

        const clickListViewHandler = () => {
            changeView("List");
        };

        const clickGridViewHandler = () => {
            changeView("Grid");
        };

        const changeView = (view: ProductListViewType) => {
            setCookie("ProductList-View", view);
            setView({ view });
        };

        return (
            <StyledWrapper {...styles.wrapper}>
                <Clickable
                    data-test-selector="viewSelectList"
                    {...styles.listViewClickable}
                    onClick={clickListViewHandler}
                >
                    <Icon {...styles.listViewIcon} color={view === "List" ? "primary" : undefined} />
                </Clickable>
                <Clickable
                    data-test-selector="viewSelectGrid"
                    {...styles.gridViewClickable}
                    onClick={clickGridViewHandler}
                >
                    <Icon {...styles.gridViewIcon} color={view === "Grid" ? "primary" : undefined} />
                </Clickable>
            </StyledWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListViewSelect),
    definition: {
        group: "Product List",
        displayName: "View Select",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
