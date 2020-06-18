import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import * as React from "react";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import CardList from "@insite/content-library/Components/CardList";
import CardListHeading from "@insite/content-library/Components/CardListHeading";
import CardContainer from "@insite/content-library/Components/CardContainer";
import siteMessage from "@insite/client-framework/SiteMessage";
import WishListCard, { WishListCardStyles } from "@insite/content-library/Components/WishListCard";
import addWishListToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddWishListToCart";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import loadWishLists from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishLists";
import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";
import { css } from "styled-components";

const enum fields {
    numberOfRecords = "numberOfRecords",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.numberOfRecords]: number;
    };
}

const mapStateToProps = (state: ApplicationState) => ({
    recentWishListsDataView: getWishListsDataView(state, recentWishListsParameter),
    myListsPageNavLink: getPageLinkByPageType(state, "MyListsPage"),
});

let recentWishListsParameter = {
    page: 1,
    sort: "ModifiedOn DESC",
    expand: ["top3products"],
} as GetWishListsApiParameter;

const mapDispatchToProps = {
    loadWishLists,
    addWishListToCart,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RecentWishListsStyles {
    wishListCardGridItem?: GridItemProps;
    noWishListsText?: TypographyProps;
    wishListCard?: WishListCardStyles;
}

const styles: RecentWishListsStyles = {
    wishListCardGridItem: {
        width: 12,
        css: css` padding: 0; `,
    },
    wishListCard: {
        actionAddToCartButton: {
            typographyProps: {
                size: 14,
            },
        },
    },
};

export const recentWishListsStyles = styles;

class RecentWishLists extends React.Component<Props> {
    componentDidMount() {
        recentWishListsParameter.pageSize = this.props.fields.numberOfRecords;
        if (!this.props.recentWishListsDataView.value && !this.props.recentWishListsDataView.isLoading) {
            this.props.loadWishLists(recentWishListsParameter);
        }

    }

    render() {
        const { recentWishListsDataView: { value: recentWishLists }, myListsPageNavLink } = this.props;
        const myListsPageUrl = myListsPageNavLink ? myListsPageNavLink.url : undefined;

        return (
            <CardList data-test-selector="cardListRecentWishLists">
                <CardListHeading heading={translate("My Lists")} viewAllUrl={myListsPageUrl} />
                {recentWishLists && recentWishLists.length === 0
                    && <GridItem width={12}>
                        <Typography {...styles.noWishListsText}>{siteMessage("WishLists_NoWishlistsFound")}</Typography>
                    </GridItem>
                }
                {recentWishLists && recentWishLists.map(wishList => (
                    <CardContainer key={wishList.id}>
                        <GridItem {...styles.wishListCardGridItem}>
                            <WishListCard
                                wishList={wishList}
                                addWishListToCart={this.props.addWishListToCart}
                                extendedStyles={styles.wishListCard} />
                        </GridItem>
                    </CardContainer>
                ))}
            </CardList>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RecentWishLists),
    definition: {
        group: "Common",
        icon: "List",
        isSystem: true,
        fieldDefinitions: [
            {
                name: fields.numberOfRecords,
                displayName: "Number of Lists Displayed",
                editorTemplate: "IntegerField",
                min: 1,
                defaultValue: 3,
                fieldType: "General",
                sortOrder: 1,
            },
        ],
    },
};

export default widgetModule;
