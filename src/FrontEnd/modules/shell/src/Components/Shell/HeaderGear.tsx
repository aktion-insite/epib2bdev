import Clickable from "@insite/mobius/Clickable";
import Modal from "@insite/mobius/Modal";
import OverflowMenu from "@insite/mobius/OverflowMenu";
import getColor from "@insite/mobius/utilities/getColor";
import About from "@insite/shell/Components/Shell/About";
import shellTheme from "@insite/shell/ShellTheme";
import { showImportExportModal } from "@insite/shell/Store/ImportExportModal/ImportExportModalActionCreators";
import { logOut, toggleMobileCmsMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { css } from "styled-components";

const mapStateToProps = ({
    shellContext: { mobileCmsModeActive, enableMobileCms, homePageId, mobileHomePageId },
}: ShellState) => ({
    mobileCmsModeActive,
    enableMobileCms,
    homePageId,
    mobileHomePageId,
});

const mapDispatchToProps = {
    logOut,
    showImportExportModal,
    toggleMobileCmsMode,
};

/** Fixes blackout caused by `OverflowMenu` using `common.border` for the background color, which in the Shell, is the same as the text. */
const menuItemStyles = css`
    &:hover {
        color: ${getColor("common.accentContrast")};
        background: ${getColor("common.accent")};
    }
` as any; // The type on the overflow menu doesn't like this but it works.

const wrapperStyles = css`
    width: 24px;
    height: 30px;
`;

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const HeaderGear = ({
    mobileCmsModeActive,
    enableMobileCms,
    homePageId,
    mobileHomePageId,
    history,
    toggleMobileCmsMode,
    logOut,
    showImportExportModal,
}: Props) => {
    const [showAbout, setShowAbout] = React.useState(false);

    return (
        <>
            <OverflowMenu
                position="end"
                buttonProps={{
                    css: css`
                        height: 32px;
                        padding: 0 16px;
                        background-color: transparent;
                        border: 0;
                        border-radius: 0;
                        &:hover {
                            background-color: ${shellTheme.colors.custom.mainHeader};
                        }
                    `,
                }}
                iconProps={{
                    src: "Settings",
                    color: "text.accent",
                }}
                cssOverrides={{ menuItem: menuItemStyles, wrapper: wrapperStyles }}
                data-test-selector="expand_shellSettings"
            >
                {enableMobileCms && (
                    <Clickable
                        data-test-selector="shellSettings_switchCms"
                        onClick={() =>
                            toggleMobileCmsMode(mobileCmsModeActive ? homePageId : mobileHomePageId, history)
                        }
                    >
                        {mobileCmsModeActive ? "Switch to Desktop CMS" : "Switch to Mobile CMS"}
                    </Clickable>
                )}
                <Clickable data-test-selector="shellSettings_logOut" onClick={showImportExportModal}>
                    Import/Export Content
                </Clickable>
                <Clickable data-test-selector="shellSettings_logOut" onClick={logOut}>
                    Log Out
                </Clickable>
                <Clickable data-test-selector="shellSettings_showAbout" onClick={() => setShowAbout(true)}>
                    About
                </Clickable>
            </OverflowMenu>
            <Modal isOpen={showAbout} headline="About" isCloseable handleClose={() => setShowAbout(false)}>
                <About />
            </Modal>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderGear));
