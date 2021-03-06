import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import validatePassword, {
    lowerCasePasswordLengthMessage,
    numberPasswordLengthMessage,
    specialPasswordLengthMessage,
    upperCasePasswordLengthMessage,
} from "@insite/client-framework/Store/CommonHandlers/ValidatePassword";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import signIn from "@insite/client-framework/Store/Context/Handlers/SignIn";
import addAccount from "@insite/client-framework/Store/Data/Accounts/Handlers/AddAccount";
import { getCreateAccountReturnUrl } from "@insite/client-framework/Store/Pages/CreateAccount/CreateAccountSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CreateAccountPageContext } from "@insite/content-library/Pages/CreateAccountPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox from "@insite/mobius/Checkbox";
import CheckboxGroup from "@insite/mobius/CheckboxGroup";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { IconPresentationProps } from "@insite/mobius/Icon";
import Eye from "@insite/mobius/Icons/Eye";
import EyeOff from "@insite/mobius/Icons/EyeOff";
import { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapDispatchToProps = {
    addAccount,
    signIn,
    validatePassword,
};

const mapStateToProps = (state: ApplicationState) => ({
    accountSettings: getSettingsCollection(state).accountSettings,
    returnUrl: getCreateAccountReturnUrl(state),
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CreateAccountStyles {
    spinner?: LoadingSpinnerProps;
    centeringWrapper?: InjectableCss;
    mainGridContainer?: GridContainerProps;
    userGridItem?: GridItemProps;
    userGridContainer?: GridContainerProps;
    emailGridItem?: GridItemProps;
    emailTextField?: TextFieldPresentationProps;
    userNameGridItem?: GridItemProps;
    userNameTextField?: TextFieldPresentationProps;
    passwordGridItem?: GridItemProps;
    passwordTextField?: TextFieldPresentationProps;
    passwordIcon?: IconPresentationProps;
    confirmPasswordGridItem?: GridItemProps;
    confirmPasswordTextField?: TextFieldPresentationProps;
    confirmPasswordIcon?: IconPresentationProps;
    subscriptionGridItem?: GridItemProps;
    submitErrorGridItem?: GridItemProps;
    submitErrorTitle?: TypographyProps;
    submitGridItem?: GridItemProps;
    submitButton?: ButtonPresentationProps;
    requirementsGridItem?: GridItemProps;
    requirementsTitle?: TypographyProps;
    passwordRequirementsGridItem?: GridItemProps;
    passwordRequirementsGridContainer?: GridContainerProps;
    passwordGridContainer?: GridContainerProps;
}

export const createAccountStyles: CreateAccountStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            height: 300px;
            justify-content: center;
            align-items: center;
        `,
    },
    userGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            padding-left: 100px;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    userGridContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            max-width: 300px;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    emailGridItem: {
        width: 12,
    },
    userNameGridItem: {
        width: 12,
    },
    passwordGridItem: {
        width: 12,
    },
    confirmPasswordGridItem: {
        width: 12,
    },
    subscriptionGridItem: {
        width: 12,
    },
    submitErrorGridItem: {
        width: 12,
    },
    submitErrorTitle: {
        color: "danger",
    },
    submitGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    requirementsGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            padding-left: 50px;
                        `,
                    ],
                    "min",
                )}/* stylelint-disable-line declaration-block-single-line-max-declarations */
        `,
    },
    passwordRequirementsGridContainer: {
        gap: 5,
    },
    passwordRequirementsGridItem: {
        width: 12,
    },
    requirementsTitle: {
        variant: "h4",
        as: "h2",
    },
};

const styles = createAccountStyles;
const userNameRequiredFieldMessage = siteMessage("CreateNewAccountInfo_UserName_Required");
const emailRequiredFieldMessage = siteMessage("CreateNewAccountInfo_EmailAddress_Required");
const emailFieldMessage = siteMessage("CreateNewAccountInfo_EmailAddress_ValidEmail");
const emailRegexp = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");

const CreateAccount: FC<Props> = ({ addAccount, signIn, validatePassword, accountSettings, returnUrl }) => {
    const [email, setEmail] = React.useState("");
    const [userName, setUserName] = React.useState("");
    const [userNameError, setUserNameError] = React.useState(userNameRequiredFieldMessage);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState<React.ReactNode>("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState<React.ReactNode>("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isSubscribed, setIsSubscribed] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [emailError, setEmailError] = React.useState(emailRequiredFieldMessage);
    const toasterContext = React.useContext(ToasterContext);

    const {
        passwordMinimumLength,
        passwordRequiresUppercase,
        passwordRequiresSpecialCharacter,
        passwordRequiresLowercase,
        passwordRequiresDigit,
    } = accountSettings;

    const validateEmail = (email: string) => {
        const errorMessage = !email ? emailRequiredFieldMessage : emailRegexp.test(email) ? "" : emailFieldMessage;
        setEmailError(errorMessage);
        return !errorMessage;
    };

    const validateUserName = (name: string) => {
        const errorMessage = !name ? userNameRequiredFieldMessage : "";
        setUserNameError(errorMessage);
        return !errorMessage;
    };

    const validateConfirmPassword = (newPassword: string, newConfirmPassword: string) => {
        const errorMessage =
            newPassword !== newConfirmPassword
                ? siteMessage("CreateNewAccountInfo_PasswordCombination_DoesNotMatch")
                : "";
        setConfirmPasswordErrorMessage(errorMessage);
        return !errorMessage;
    };

    const validateSubmitEnabled = () => {
        return !(emailError || passwordErrorMessage || confirmPasswordErrorMessage || userNameError);
    };

    const emailChangeHandler = (email: string) => {
        validateEmail(email);
        setEmail(email);
    };

    const userChangeHandler = (name: string) => {
        validateUserName(name);
        setUserName(name);
    };

    const passwordChangeHandler = (newPassword: string) => {
        validateConfirmPassword(newPassword, confirmPassword);
        validatePassword({
            password: newPassword,
            onComplete: errorMessage => {
                setPasswordErrorMessage(errorMessage);
            },
        });
        setPassword(newPassword);
    };

    const confirmPasswordChangeHandler = (newConfirmPassword: string) => {
        setConfirmPassword(newConfirmPassword);
        validateConfirmPassword(password, newConfirmPassword);
    };

    const onSuccessHandler = () => {
        setErrorMessage("");
        toasterContext.addToast({ body: translate("Account created successfully!"), messageType: "success" });
        setTimeout(() => {
            signIn({
                userName,
                password,
                rememberMe: false,
                returnUrl,
            });
        }, 500);
    };

    const submitHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isSubmitted) {
            setIsSubmitted(true);
        }

        if (!validateSubmitEnabled()) {
            return;
        }

        addAccount({
            email,
            userName,
            password,
            isSubscribed,
            onSuccess: onSuccessHandler,
            onError: error => {
                setErrorMessage(error);
            },
        });
    };

    const isSubmitEnabled = validateSubmitEnabled();

    return (
        <GridContainer {...styles.mainGridContainer}>
            <GridItem {...styles.userGridItem}>
                <GridContainer {...styles.userGridContainer}>
                    <GridItem {...styles.emailGridItem}>
                        <TextField
                            {...styles.emailTextField}
                            type="email"
                            label={translate("Email Address")}
                            onChange={e => emailChangeHandler(e.currentTarget.value)}
                            value={email}
                            data-test-selector="createAccount_email"
                            required
                            error={isSubmitted && emailError}
                        />
                    </GridItem>
                    <GridItem {...styles.userNameGridItem}>
                        <TextField
                            {...styles.userNameTextField}
                            label={translate("User Name")}
                            value={userName}
                            data-test-selector="createAccount_userName"
                            onChange={e => userChangeHandler(e.currentTarget.value)}
                            error={isSubmitted && userNameError}
                            required
                        />
                    </GridItem>
                    <GridItem {...styles.passwordGridItem}>
                        <TextField
                            id="password"
                            {...styles.passwordTextField}
                            type={showPassword ? undefined : "password"}
                            label={translate("Password")}
                            value={password}
                            onChange={e => passwordChangeHandler(e.currentTarget.value)}
                            error={isSubmitted && passwordErrorMessage}
                            iconProps={{ ...styles.passwordIcon, src: showPassword ? EyeOff : Eye }}
                            iconClickableProps={{
                                onClick: () => {
                                    setShowPassword(!showPassword);
                                },
                            }}
                            data-test-selector="createAccount_password"
                            required
                        />
                    </GridItem>
                    <GridItem {...styles.confirmPasswordGridItem}>
                        <TextField
                            id="confirm-password"
                            {...styles.confirmPasswordTextField}
                            type={showConfirmPassword ? undefined : "password"}
                            label={translate("Confirm Password")}
                            value={confirmPassword}
                            onChange={e => confirmPasswordChangeHandler(e.currentTarget.value)}
                            error={isSubmitted && confirmPasswordErrorMessage}
                            iconProps={{ ...styles.confirmPasswordIcon, src: showConfirmPassword ? EyeOff : Eye }}
                            iconClickableProps={{
                                onClick: () => {
                                    setShowConfirmPassword(!showConfirmPassword);
                                },
                            }}
                            data-test-selector="createAccount_confirmPassword"
                            required
                        />
                    </GridItem>
                    <GridItem {...styles.subscriptionGridItem}>
                        <CheckboxGroup>
                            <Checkbox
                                onChange={(e, value) => setIsSubscribed(value)}
                                checked={isSubscribed}
                                data-test-selector="createAccount_Subscription"
                            >
                                {siteMessage("SignIn_Sign_Up_Newsletter")}
                            </Checkbox>
                        </CheckboxGroup>
                    </GridItem>
                    {errorMessage && (
                        <GridItem {...styles.submitErrorGridItem}>
                            <Typography {...styles.submitErrorTitle}>{errorMessage}</Typography>
                        </GridItem>
                    )}
                    <GridItem {...styles.submitGridItem}>
                        <Button
                            {...styles.submitButton}
                            onClick={submitHandler}
                            disabled={isSubmitted && !isSubmitEnabled}
                            data-test-selector="createAccount_createButton"
                        >
                            {translate("Create")}
                        </Button>
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem {...styles.requirementsGridItem}>
                <Typography {...styles.requirementsTitle}>{translate("Password Requirements")}</Typography>
                <GridContainer {...styles.passwordRequirementsGridContainer}>
                    <GridItem {...styles.passwordRequirementsGridItem}>
                        {translate("Password must be at least {0} characters long").replace(
                            "{0}",
                            passwordMinimumLength.toString(),
                        )}
                    </GridItem>
                    {passwordRequiresDigit && (
                        <GridItem {...styles.passwordRequirementsGridItem}>{numberPasswordLengthMessage}</GridItem>
                    )}
                    {passwordRequiresLowercase && (
                        <GridItem {...styles.passwordRequirementsGridItem}>{lowerCasePasswordLengthMessage}</GridItem>
                    )}
                    {passwordRequiresUppercase && (
                        <GridItem {...styles.passwordRequirementsGridItem}>{upperCasePasswordLengthMessage}</GridItem>
                    )}
                    {passwordRequiresSpecialCharacter && (
                        <GridItem {...styles.passwordRequirementsGridItem}>{specialPasswordLengthMessage}</GridItem>
                    )}
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CreateAccount),
    definition: {
        allowedContexts: [CreateAccountPageContext],
        group: "Create Account",
    },
};

export default widgetModule;
