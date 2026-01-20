import type { JSXElement } from "solid-js";
import type { CustomFieldProps } from "./customFields";

export function NoMapCellValue(props: CustomFieldProps<string>): JSXElement {
    return <>{props.value}</>;
}
