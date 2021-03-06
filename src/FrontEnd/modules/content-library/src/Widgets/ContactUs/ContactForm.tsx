import Zone from "@insite/client-framework/Components/Zone";
import clearForm from "@insite/client-framework/Store/Components/ContactUsForm/Handlers/ClearForm";
import submitContactForm from "@insite/client-framework/Store/Components/ContactUsForm/Handlers/SubmitContactForm";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    emailRecipients = "emailRecipients",
    submitButtonText = "submitButtonText",
    successMessage = "successMessage",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.emailRecipients]: string;
        [fields.submitButtonText]: string;
        [fields.successMessage]: string;
    };
}

const mapDispatchToProps = {
    submitContactForm,
    clearForm,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface ContactFormStyles {
    container?: GridContainerProps;
    formGridItem?: GridItemProps;
    submitButton?: ButtonPresentationProps;
    successModal?: ModalPresentationProps;
    modalContainer?: GridContainerProps;
    messageTextGridItem?: GridItemProps;
    messageText?: TypographyPresentationProps;
    buttonGridItem?: GridItemProps;
    continueButton?: ButtonPresentationProps;
}

export const contactFormStyles: ContactFormStyles = {
    formGridItem: { width: 12 },
    submitButton: {
        css: css`
            float: right;
            margin-top: 20px;
        `,
    },
    successModal: { sizeVariant: "small" },
    messageTextGridItem: { width: 12 },
    buttonGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
};

const styles = contactFormStyles;
const emailsRegexp = new RegExp(
    "^[\\W]*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4}[\\W]*,{1}[\\W]*)*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4})[\\W]*$",
);

type Validator = () => boolean;
type ContextType = {
    validators: {
        [key: string]: Validator | undefined;
    };
};

export const ContactFormContext = React.createContext<ContextType>({
    validators: {},
});

const ContactForm: React.FC<Props> = ({ id, fields, submitContactForm, clearForm }) => {
    const { emailRecipients, submitButtonText, successMessage } = fields;
    const [validators] = React.useState<{ [key: string]: Validator | undefined }>({});
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const widgetValidators: Validator[] = [];
        Object.keys(validators).forEach(key => {
            const validator = validators[key];
            if (validator) {
                widgetValidators.push(validator);
            }
        });
        const results = widgetValidators.map(v => v());
        if (results.every(o => o)) {
            submitContactForm({
                emailRecipients,
                onSuccess: () => setIsModalOpen(true),
            });
        }
    };

    const modalCloseHandler = () => setIsModalOpen(false);

    const continueButtonClickHandler = () => {
        setIsModalOpen(false);
        clearForm();
    };

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.formGridItem}>
                <ContactFormContext.Provider value={{ validators }}>
                    <form id="contactForm" onSubmit={handleFormSubmit} noValidate>
                        <Zone contentId={id} zoneName="Content" />
                        <Button {...styles.submitButton} type="submit">
                            {submitButtonText}
                        </Button>
                        <Modal
                            headline={translate("Message Sent")}
                            contentLabel={successMessage}
                            {...styles.successModal}
                            isOpen={isModalOpen}
                            handleClose={modalCloseHandler}
                        >
                            <GridContainer {...styles.modalContainer}>
                                <GridItem {...styles.messageTextGridItem}>
                                    <Typography {...styles.messageText}>{successMessage}</Typography>
                                </GridItem>
                                <GridItem {...styles.buttonGridItem}>
                                    <Button {...styles.continueButton} onClick={continueButtonClickHandler}>
                                        {translate("Continue")}
                                    </Button>
                                </GridItem>
                            </GridContainer>
                        </Modal>
                    </form>
                </ContactFormContext.Provider>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(ContactForm),
    definition: {
        group: "Contact Us",
        icon: "FormField",
        fieldDefinitions: [
            {
                name: fields.emailRecipients,
                displayName: "Email recipients",
                editorTemplate: "MultilineTextField",
                fieldType: "General",
                defaultValue: "testaccount@insitesoft.com",
                isRequired: true,
                regularExpression: emailsRegexp,
            },
            {
                name: fields.submitButtonText,
                displayName: "Submit Button Text",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Send",
            },
            {
                name: fields.successMessage,
                displayName: "Submit Success Message",
                editorTemplate: "RichTextField",
                fieldType: "Translatable",
                defaultValue: "Thank you for your inquiry. A customer service representative will contact you shortly.",
            },
        ],
    },
};

export default widgetModule;
