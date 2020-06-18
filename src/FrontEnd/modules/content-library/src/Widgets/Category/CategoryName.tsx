import * as React from "react";
import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography from "@insite/mobius/Typography";

interface Props extends WidgetProps, HasCategoryContext {
}

const CategoryImage: React.FunctionComponent<Props> = ({
    category,
}: Props) => {
    if (!category) {
        return null;
    }

    return (
        <Typography variant="h2">
            {category.name}
        </Typography>
    );
};

const widgetModule: WidgetModule = {
    component: withCategory(CategoryImage),
    definition: {
        group: "Categories",
        icon: "PageTitle",
        isSystem: true,
    },
};

export default widgetModule;
