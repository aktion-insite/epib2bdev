import { addTask } from "@insite/client-framework/ServerSideRendering";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import { getShellContext, switchContentMode, getPagePublishInfo } from "@insite/shell/Services/ContentAdminService";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import ContentMode from "@insite/client-framework/Common/ContentMode";
import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import { loadTreeNodes } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import { loadPage } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { Location } from "history";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";

export const loadShellContext = (): ShellThunkAction => dispatch => {
    addTask(async function () {
        const shellContext = await getShellContext();

        dispatch({
            ...shellContext,
            type: "ShellContext/CompleteLoadShellContext",
        });

        dispatch({
            type: "Data/Pages/CompleteChangeContext",
            languageId: shellContext.currentLanguageId,
            personaId: shellContext.defaultPersonaId,
            deviceType: "Desktop",
            defaultLanguageId: shellContext.defaultLanguageId,
            permissions: shellContext.permissions,
        });
    }());
};

export const changeStageMode = (stageMode: DeviceType): AnyShellAction => ({
    type: "ShellContext/ChangeStageMode",
    stageMode,
});

export const logOut = (): ShellThunkAction => dispatch => {
    dispatch({
        type: "ShellContext/LogOut",
    });
    window.location.reload();
};

export const setContentMode = (contentMode: ContentMode): ShellThunkAction => (dispatch, getState) => {
    addTask(async function () {
        await switchContentMode(contentMode);
        (window as any).frameHoleIsReady = false; // makes sure our AUI tests won't try to access the iframe until it reestablishes the connection which indicates it is done loading.
        sendToSite({
            type: "Reload",
        });
        const pageId = getCurrentPageForShell(getState()).id;
        // we need to clear out any already loaded pages so our editor doesn't show the wrong field values
        dispatch({
            type: "Data/Pages/Reset",
        });
        dispatch(loadPage({ pathname: `/Content/Page/${pageId}`, search: "" } as Location));
        dispatch({
            type: "ShellContext/SetContentMode",
            contentMode,
        });
        dispatch(loadTreeNodes());
    }());
};

export const loadPublishInfo = (pageId: string): ShellThunkAction => (dispatch, getState) => {
    if (getState().shellContext.pagePublishInfo.isLoading) {
        return;
    }

    dispatch({
        type: "ShellContext/BeginLoadingPublishInfo",
    });

    (async () => {
        const page = await getPagePublishInfo(pageId);

        dispatch({
            type: "ShellContext/CompleteLoadingPublishInfo",
            pages: page ? [page] : [],
        });
    })();
};