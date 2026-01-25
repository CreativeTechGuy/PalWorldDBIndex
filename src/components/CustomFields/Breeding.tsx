import { createMemo, For, onMount, type JSXElement } from "solid-js";
import { Hover } from "~/components/Hover";
import { filterSettings } from "~/config/filter";
import { getBreedingParents } from "~/utils/getBreedingParents";
import type { CustomFieldProps } from "./customFields";
import { Name } from "./Name";

export function Breeding(props: CustomFieldProps<string>): JSXElement {
    const parentData = createMemo(() => {
        const highlightedRows = filterSettings().highlightedRowIds;
        let hasHighlightedParents = false;
        const sortedParents = [...getBreedingParents(props.palData.Id)].sort((a, b) => {
            let highlightScoreA = 0;
            if (highlightedRows.includes(a.parentA)) {
                highlightScoreA++;
            }
            if (highlightedRows.includes(a.parentB)) {
                highlightScoreA++;
            }
            let highlightScoreB = 0;
            if (highlightedRows.includes(b.parentA)) {
                highlightScoreB++;
            }
            if (highlightedRows.includes(b.parentB)) {
                highlightScoreB++;
            }
            if (highlightScoreA > 0 || highlightScoreB > 0) {
                hasHighlightedParents = true;
            }
            return highlightScoreB - highlightScoreA;
        });
        return { sortedParents, hasHighlightedParents };
    });
    onMount(() => {
        const newValue = `${parentData().sortedParents.length} combination${parentData().sortedParents.length === 1 ? "" : "s"}`;
        if (props.value !== newValue) {
            props.updateData({
                ...props.palData,
                Breeding: newValue,
            });
        }
    });
    return (
        <Hover
            label={props.value}
            title={
                parentData().hasHighlightedParents
                    ? "Highlighted Pals are shown first"
                    : "Click table rows to highlight Pals. They will be listed first"
            }
        >
            <div style={{ "max-height": "min(50vh, 20rem)", "overflow-y": "auto" }}>
                <table style={{ width: "100%" }}>
                    <tbody>
                        <For each={parentData().sortedParents}>
                            {(parents) => {
                                return (
                                    <tr>
                                        <td>
                                            <Name
                                                value={parents.parentAName}
                                                palData={{ Id: parents.parentA }}
                                                updateData={undefined}
                                            />
                                            <FormatGender male={parents.parentAMale} />
                                        </td>
                                        <td>+</td>
                                        <td>
                                            <Name
                                                value={parents.parentBName}
                                                palData={{ Id: parents.parentB }}
                                                updateData={undefined}
                                            />
                                            <FormatGender male={parents.parentBMale} />
                                        </td>
                                    </tr>
                                );
                            }}
                        </For>
                    </tbody>
                </table>
            </div>
        </Hover>
    );
}

function FormatGender(props: { male: boolean | undefined }): JSXElement {
    return <>{props.male === undefined ? "" : props.male ? " (M)" : " (F)"}</>;
}
