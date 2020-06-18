import * as React from "react";
import { connect } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    createPageElement,
    registerPageUpdate,
    unregisterPageUpdate,
} from "@insite/client-framework/Components/ContentItemStore";
import Footer from "@insite/client-framework/Components/Footer";
import Header from "@insite/client-framework/Components/Header";
import { HasShellContext, ShellContext, withIsInShell } from "./IsInShell";
import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import Page from "@insite/mobius/Page";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import PageBreadcrumbs from "@insite/client-framework/Components/PageBreadcrumbs";
import ErrorModal from "@insite/client-framework/Components/ErrorModal";
import { getDisplayErrorPage, redirectTo } from "@insite/client-framework/ServerSideRendering";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";

const mapStateToProps = (state: ApplicationState) => ({
    page: getCurrentPage(state),
    errorPageLink: getPageLinkByPageType(state, "UnhandledErrorPage"),
});

type Props = ReturnType<typeof mapStateToProps> & HasShellContext;

class PublicPage extends React.Component<Props> {
    componentDidMount() {
        if (module.hot) {
            this.forceUpdate = this.forceUpdate.bind(this);
            registerPageUpdate(this.forceUpdate);
        }

        sendToShell({
            type: "LoadPageComplete",
            pageId: this.props.page.id,
        });
    }

    componentWillUnmount() {
        if (module.hot) {
            unregisterPageUpdate(this.forceUpdate);
        }
    }

    wrapContent(content: ReturnType<typeof createPageElement>) {
        const { page, shellContext } = this.props;
        switch (page.type) {
        case "Header":
        case "Footer":
            return <>{content}</>;
        }

        const { isInShell } = shellContext;

        return <>
                {!page.fields.hideHeader
                    && <ShellContext.Provider value={{ isInShell }}>
                        <Header />
                    </ShellContext.Provider>
                }
                {!page.fields.hideBreadcrumbs
                    && <Page as="div">
                        <PageBreadcrumbs />
                    </Page>
                }
                {content}
                <ErrorModal/>
                {!page.fields.hideFooter
                    && <ShellContext.Provider value={{ isInShell }}>
                        <Footer />
                    </ShellContext.Provider>
                }
        </>;
    }

    render() {
        if (getDisplayErrorPage() && this.props.errorPageLink) {
            redirectTo(this.props.errorPageLink.url);
        }

        const { page } = this.props;
        if (page.id === "") {
            return this.wrapContent(<p>Loading</p>);
        }

        return this.wrapContent(createPageElement(page.type, page));
    }
}

export default connect(mapStateToProps)(withIsInShell(PublicPage));
