import React, { FC, useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import updateSearchFields from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/UpdateSearchFields";
import { InvoiceHistoryPageContext } from "@insite/content-library/Pages/InvoiceHistoryPage";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import { InvoicesDataViewContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface InvoiceHistoryPaginationStyles {
    pagination?: PaginationPresentationProps;
}

const styles: InvoiceHistoryPaginationStyles = {};

export const paginationStyles = styles;

const InvoiceHistoryPagination: FC<Props> = ({ updateSearchFields }) => {
    const invoicesDataView = useContext(InvoicesDataViewContext);
    const changePage = (newPageIndex: number) => {
        updateSearchFields({
            page: newPageIndex,
        });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };

    if (!invoicesDataView.value) {
        return null;
    }

    const { pagination } = invoicesDataView;
    if (!pagination || pagination.totalItemCount === 0) {
        return null;
    }

    return (
        <Pagination
            {...styles.pagination}
            resultsCount={pagination.totalItemCount}
            currentPage={pagination.page}
            resultsPerPage={pagination.pageSize}
            resultsPerPageOptions={pagination.pageSizeOptions}
            onChangePage={changePage}
            onChangeResultsPerPage={changeResultsPerPage}/>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(InvoiceHistoryPagination),
    definition: {
        group: "Invoice History",
        displayName: "Pagination",
        allowedContexts: [InvoiceHistoryPageContext],
        isSystem: true,
    },
};

export default widgetModule;
