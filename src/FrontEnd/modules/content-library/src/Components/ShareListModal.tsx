import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import * as React from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { css } from "styled-components";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import setShareListModalIsOpen from "@insite/client-framework/Store/Components/ShareListModal/Handlers/SetShareListModalIsOpen";
import updateWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/UpdateWishList";
import sendWishListCopy from "@insite/client-framework/Store/Components/ShareListModal/Handlers/SendWishListCopy";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup";
import Radio, { RadioProps, RadioStyle } from "@insite/mobius/Radio";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import Tooltip, { TooltipPresentationProps } from "@insite/mobius/Tooltip";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import GridContainer, { GridOffset, GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { ShareOptions } from "@insite/client-framework/Services/WishListService";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";

interface OwnProps {
    extendedStyles?: ShareListModalStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
    modalIsOpen: state.components.shareListModal.isOpen,
    wishList: getWishListState(state, state.components.shareListModal.wishListId).value,
});

const mapDispatchToProps = {
    setShareListModalIsOpen,
    updateWishList: makeHandlerChainAwaitable(updateWishList),
    sendWishListCopy: makeHandlerChainAwaitable(sendWishListCopy),
};

export interface ShareListModalStyles {
    modal?: ModalPresentationProps;
    container?: GridContainerProps;
    shareListOptionGridItem?: GridItemProps;
    shareListOptionText?: TypographyPresentationProps;
    shareListOptionRadioGroup?: RadioGroupProps;
    sendCopyRadio?: RadioProps;
    shareListRadio?: RadioProps;
    shareListTooltip?: TooltipPresentationProps;
    shareByOptionGridItem?: GridItemProps;
    shareByOptionText?: TypographyPresentationProps;
    shareByOptionRadioGroup?: RadioGroupProps;
    shareByEmailRadio?: RadioProps;
    shareByEmailTooltip?: TooltipPresentationProps;
    shareByBillingRadio?: RadioProps;
    shareByBillingTooltip?: TooltipPresentationProps;
    sendEmailNotificationGridItem?: GridItemProps;
    sendEmailNotificationCheckbox?: CheckboxPresentationProps;
    yourNameGridItem?: GridItemProps;
    yourNameTextField?: TextFieldPresentationProps;
    recipientEmailAddressGridItem?: GridItemProps;
    recipientEmailAddressTextField?: TextFieldPresentationProps;
    recipientEmailTooltip?: TooltipPresentationProps;
    shareMessageGridItem?: GridItemProps;
    shareMessageTextArea?: TextAreaProps;
    inviteMessageGridItem?: GridItemProps;
    inviteMessageTextArea?: TextAreaProps;
    bottomRowGridItem?: GridItemProps;
    buttonsContainer?: GridContainerProps;
    allowEditingGridItem?: GridItemProps;
    allowEditingCheckbox?: CheckboxPresentationProps;
    cancelButtonGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    sendButtonGridItem?: GridItemProps;
    sendButton?: ButtonPresentationProps;
}

export const shareListModalStyles: ShareListModalStyles = {
    modal: {
        size: 600,
        cssOverrides: {
            modalTitle: css` padding: 10px 20px; `,
            modalContent: css` padding: 20px; `,
        },
    },
    container: { gap: 20 },
    shareListOptionGridItem: {
        width: 12,
        css: css` flex-direction: column; `,
    },
    shareListOptionRadioGroup: {
        css: css`
            flex-direction: row;
            & > ${RadioStyle} {
                margin-top: 10px;
            }
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [css` flex-direction: column; `], "max")}
        `,
    },
    sendCopyRadio: {
        css: css`
            & + & {
                margin-top: 10px;
                margin-left: 20px;
                ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [css` margin-left: 0; `], "max")}
            }
            input {
                margin-left: 0;
            }
        `,
    },
    shareListRadio: {
        css: css`
            input {
                margin-left: 0;
            }
        `,
    },
    shareListTooltip: {
        cssOverrides: {
            tooltipWrapper: css`
                margin-left: 5px;
            `,
            tooltipContainer: css`
                width: 500px;
                margin-left: -400px;
                &::after {
                    left: 400px;
                }
                ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [css`
                    width: 290px;
                    margin-left: -270px;
                    &::after {
                        left: 270px;
                    }
                `], "max")}
            `,
            tooltipBody: css`
                padding: 5px;
            `,
        },
        typographyProps: {
            lineHeight: "16px",
        },
    },
    shareByOptionGridItem: {
        width: 12,
        css: css` flex-direction: column; `,
    },
    shareByOptionRadioGroup: {
        css: css`
            flex-direction: row;
            & > ${RadioStyle} {
                margin-top: 10px;
            }
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [css` flex-direction: column; `], "max")}
        `,
    },
    shareByEmailRadio: {
        css: css`
            & + & {
                margin-top: 10px;
                margin-left: 20px;
                ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [css` margin-left: 0; `], "max")}
            }
            input {
                margin-left: 0;
            }
        `,
    },
    shareByEmailTooltip: { cssOverrides: { tooltipWrapper: css` margin-left: 5px; ` } },
    shareByBillingRadio: {
        css: css`
            input {
                margin-left: 0;
            }
        `,
    },
    shareByBillingTooltip: { cssOverrides: { tooltipWrapper: css` margin-left: 5px; ` } },
    sendEmailNotificationGridItem: {
        width: 12,
        css: css` flex-direction: column; `,
    },
    yourNameGridItem: { width: [12, 6, 6, 6, 6] },
    recipientEmailAddressGridItem: { width: [12, 6, 6, 6, 6] },
    recipientEmailTooltip: {
        cssOverrides: {
            tooltipWrapper: css`
                margin-left: 5px;
            `,
            tooltipContainer: css`
                margin-left: -150px;
                &::after {
                    left: 150px;
                }
            `,
        },
        typographyProps: {
            weight: "normal",
        },
    },
    shareMessageGridItem: { width: 12 },
    shareMessageTextArea: { cssOverrides: { inputSelect: css` resize: none; ` } },
    inviteMessageGridItem: { width: 12 },
    inviteMessageTextArea: { cssOverrides: { inputSelect: css` resize: none; ` } },
    bottomRowGridItem: {
        width: 12,
        css: css` justify-content: flex-end; `,
    },
    buttonsContainer: {
        gap: 20,
        css: css` & ${GridOffset} { justify-content: flex-end; } `,
    },
    allowEditingGridItem: { width: [12, 6, 8, 8, 8] },
    cancelButtonGridItem: {
        width: [12, 3, 2, 2, 2],
        css: css` justify-content: flex-end; `,
    },
    cancelButton: {
        variant: "secondary",
        css: css` ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [null, null, css` width: 100%; `], "max")} `,
    },
    sendButtonGridItem: {
        width: [12, 3, 2, 2, 2],
        css: css` justify-content: flex-end; `,
    },
    sendButton: {
        variant: "primary",
        css: css` ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [null, null, css` width: 100%; `], "max")} `,
    },
};

const emailRegexp = new RegExp("\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
const yourNameFieldRequiredMessage = siteMessage("Lists_Your_Name_Required") as string;
const recipientEmailFieldRequiredMessage = siteMessage("Lists_Recipient_Email_Address_Required") as string;
const recipientEmailFieldInvalidMessage = siteMessage("AddressInfo_EmailAddress_Validation") as string;
const defaultInviteMessage = translate("I'd like to invite you to my shared list of products.");
const defaultShareMessage = translate("I'd like to share my list of products with you.");

const ShareListModal: React.FC<Props> = ({
    session,
    modalIsOpen,
    wishList,
    extendedStyles,
    setShareListModalIsOpen,
    updateWishList,
    sendWishListCopy,
}) => {
    const toasterContext = React.useContext(ToasterContext);
    const [styles] = React.useState(() => mergeToNew(shareListModalStyles, extendedStyles));

    const [shareListOption, setShareListOption] = React.useState("sendCopy");
    const [shareByOption, setShareByOption] = React.useState("shareByEmail");
    const [allowEditList, setAllowEditList] = React.useState(false);
    const [sendEmailNotification, setSendEmailNotification] = React.useState(false);
    const [yourName, setYourName] = React.useState(`${session.firstName} ${session.lastName}`);
    const [yourNameError, setYourNameError] = React.useState("");
    const [recipientEmailAddress, setRecipientEmailAddress] = React.useState("");
    const [recipientEmailAddressError, setRecipientEmailAddressError] = React.useState("");
    const [inviteMessage, setInviteMessage] = React.useState(defaultInviteMessage);
    const [shareMessage, setShareMessage] = React.useState(defaultShareMessage);
    const [inProgress, setInProgress] = React.useState(false);

    const modalCloseHandler = () => {
        setShareListModalIsOpen({ modalIsOpen: false });
    };

    const shareListOptionChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShareListOption(event.currentTarget.value);
    };

    const shareByOptionChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShareByOption(event.currentTarget.value);
    };

    const yourNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setYourName(event.target.value);
        setYourNameError(event.target.value ? "" : yourNameFieldRequiredMessage);
    };

    const recipientEmailAddressChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipientEmailAddress(event.target.value);
        if (!event.target.value) {
            setRecipientEmailAddressError(recipientEmailFieldRequiredMessage);
        } else {
            const emails = event.target.value.split(",");
            if (emails.some(email => !emailRegexp.test(email.trim()))) {
                setRecipientEmailAddressError(recipientEmailFieldInvalidMessage);
            } else {
                setRecipientEmailAddressError("");
            }
        }
    };

    const inviteMessageChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInviteMessage(event.target.value.length > 300 ? event.target.value.slice(0, 300) : event.target.value);
    };

    const shareMessageChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setShareMessage(event.target.value.length > 300 ? event.target.value.slice(0, 300) : event.target.value);
    };

    const allowEditListChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setAllowEditList(value);
    };

    const sendEmailNotificationChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setSendEmailNotification(value);
    };

    const sendClickHandler = async () => {
        if (!wishList) {
            return;
        }

        if (shareListOption === "sendCopy" || shareByOption === "shareByEmail") {
            if (yourNameError || recipientEmailAddressError) {
                return;
            }
            if (!yourName || !recipientEmailAddress) {
                setYourNameError(yourName ? "" : yourNameFieldRequiredMessage);
                setRecipientEmailAddressError(recipientEmailAddress ? "" : recipientEmailFieldRequiredMessage);
                return;
            }
        }

        setInProgress(true);

        if (shareListOption === "sendCopy") {
            await sendWishListCopy({
                wishList: {
                    ...wishList,
                    senderName: yourName,
                    recipientEmailAddress,
                    message: shareMessage,
                },
            });
        } else {
            await updateWishList({
                apiParameter: {
                    wishList: {
                        ...wishList,
                        allowEdit: allowEditList,
                        sendEmail: shareByOption === "shareByEmail" || sendEmailNotification,
                        shareOption: shareByOption === "shareByEmail" ? ShareOptions.IndividualUsers : ShareOptions.AllCustomerUsers,
                        message: shareByOption === "shareByEmail" || sendEmailNotification ? inviteMessage : "",
                        senderName: shareByOption === "shareByEmail" ? yourName : "",
                        recipientEmailAddress: shareByOption === "shareByEmail" ? recipientEmailAddress : "",
                    },
                },
            });
        }

        setShareListModalIsOpen({ modalIsOpen: false });

        const message = shareListOption === "sendCopy"
            ? "A copy of your list has been sent."
            : shareByOption === "shareByEmail"
                ? "Your invite to the shared list has been sent."
                : sendEmailNotification
                    ? "A notification email has been sent."
                    : "Your list has been shared with all users on the billing account.";
        toasterContext.addToast({ body: translate(message), messageType: "success" });
    };

    const resetFields = () => {
        setShareListOption("sendCopy");
        setShareByOption("shareByEmail");
        setAllowEditList(false);
        setSendEmailNotification(false);
        setYourName(`${session.firstName} ${session.lastName}`);
        setYourNameError("");
        setRecipientEmailAddress("");
        setRecipientEmailAddressError("");
        setInviteMessage(defaultInviteMessage);
        setShareMessage(defaultShareMessage);
        setInProgress(false);
    };

    const afterCloseHandler = () => {
        resetFields();
    };

    React.useEffect(() => {
        resetFields();
    }, [wishList]);

    if (!wishList) {
        return null;
    }

    return <Modal
        {...styles.modal}
        headline={translate("Share List")}
        isOpen={modalIsOpen}
        handleClose={modalCloseHandler}
        onAfterClose={afterCloseHandler}
    >
        <GridContainer {...styles.container} data-test-selector="shareListForm">
            <GridItem {...styles.shareListOptionGridItem}>
                <Typography {...styles.shareListOptionText}>{siteMessage("Lists_Send_Copy_Or_Allow_Others_Access_List")}</Typography>
                <RadioGroup {...styles.shareListOptionRadioGroup} value={shareListOption} onChangeHandler={shareListOptionChangeHandler} data-test-selector="shareListOption">
                    <Radio {...styles.sendCopyRadio} value="sendCopy" data-test-selector="sendCopy">{translate("Send a copy")}</Radio>
                    <Radio {...styles.shareListRadio} value="shareList" data-test-selector="shareList">
                        {translate("Allow others to view or edit this list")}
                        <Tooltip {...styles.shareListTooltip} text={siteMessage("Lists_Invite_Individuals_Or_Make_Available_To_All_Customer_Users_Tooltip") as string} />
                    </Radio>
                </RadioGroup>
            </GridItem>
            {shareListOption === "shareList"
                && <>
                    <GridItem {...styles.shareByOptionGridItem}>
                        <Typography {...styles.shareByOptionText}>{translate("Assign users")}</Typography>
                        <RadioGroup {...styles.shareByOptionRadioGroup} value={shareByOption} onChangeHandler={shareByOptionChangeHandler} data-test-selector="shareByOption">
                            <Radio {...styles.shareByEmailRadio} value="shareByEmail" data-test-selector="shareByEmail">
                                {translate("By email address")}
                                <Tooltip {...styles.shareByEmailTooltip} text={siteMessage("Lists_Share_List_With_Anyone_Via_Email") as string} />
                            </Radio>
                            <Radio {...styles.shareByBillingRadio} value="shareByBilling" data-test-selector="shareByBilling">
                                {translate("By current billing address")}
                                <Tooltip {...styles.shareByBillingTooltip} text={siteMessage("Lists_Your_List_Will_Be_Available_To_All_Customer_Users") as string} />
                            </Radio>
                        </RadioGroup>
                    </GridItem>
                    {shareByOption === "shareByBilling"
                        && <GridItem {...styles.sendEmailNotificationGridItem}>
                            <Checkbox {...styles.sendEmailNotificationCheckbox} checked={sendEmailNotification} onChange={sendEmailNotificationChangeHandler} data-test-selector="sendEmailNotification">
                                {translate("Send an email notification to users")}
                            </Checkbox>
                        </GridItem>
                    }
                </>
            }
            {(shareListOption === "sendCopy" || (shareListOption === "shareList" && shareByOption === "shareByEmail"))
                && <>
                    <GridItem {...styles.yourNameGridItem}>
                        <TextField
                            {...styles.yourNameTextField}
                            label={translate("Your Name")}
                            value={yourName}
                            error={yourNameError}
                            onChange={yourNameChangeHandler}
                            required
                            data-test-selector="yourName"
                        />
                    </GridItem>
                    <GridItem {...styles.recipientEmailAddressGridItem}>
                        <TextField
                            {...styles.recipientEmailAddressTextField}
                            label={<>
                                {translate("Recipient Email Address")}
                                <Tooltip {...styles.recipientEmailTooltip} text={siteMessage("Lists_Use_Comma_As_Delimiter") as string} />
                            </>}
                            value={recipientEmailAddress}
                            error={recipientEmailAddressError}
                            onChange={recipientEmailAddressChangeHandler}
                            required
                            data-test-selector="recipientEmailAddress"
                        />
                    </GridItem>
                </>
            }
            {shareListOption === "sendCopy"
                && <GridItem {...styles.shareMessageGridItem}>
                    <TextArea
                        {...styles.shareMessageTextArea}
                        label={translate("Message")}
                        value={shareMessage}
                        onChange={shareMessageChangeHandler}
                        hint={`${300 - shareMessage.length} ${translate("characters left")}`}
                        data-test-selector="shareMessage"
                    />
                </GridItem>
            }
            {(shareListOption === "shareList" && (shareByOption === "shareByEmail" || sendEmailNotification))
                && <GridItem {...styles.inviteMessageGridItem}>
                    <TextArea
                        {...styles.inviteMessageTextArea}
                        label={translate("Message")}
                        value={inviteMessage}
                        onChange={inviteMessageChangeHandler}
                        hint={`${300 - inviteMessage.length} ${translate("characters left")}`}
                        data-test-selector="inviteMessage"
                    />
                </GridItem>
            }
            <GridItem {...styles.bottomRowGridItem}>
                <GridContainer {...styles.buttonsContainer}>
                    {shareListOption === "shareList"
                        && <GridItem {...styles.allowEditingGridItem}>
                            <Checkbox {...styles.allowEditingCheckbox} checked={allowEditList} onChange={allowEditListChangeHandler} data-test-selector="allowEditList">
                                {translate("Allow editing")}
                            </Checkbox>
                        </GridItem>
                    }
                    <GridItem {...styles.cancelButtonGridItem}>
                        <Button {...styles.cancelButton} onClick={modalCloseHandler}>{translate("Cancel")}</Button>
                    </GridItem>
                    <GridItem {...styles.sendButtonGridItem}>
                        <Button {...styles.sendButton} onClick={sendClickHandler} disabled={inProgress} data-test-selector="sendButton">{translate("Send")}</Button>
                    </GridItem>
                </GridContainer>
            </GridItem>
        </GridContainer>
    </Modal>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareListModal);
