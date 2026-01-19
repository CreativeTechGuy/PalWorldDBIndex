import { createEffect, createSignal, For, onMount, runWithOwner, type JSXElement } from "solid-js";
import { loadOrDefault } from "~/config/loadOrDefault";
import { unsortableColumns } from "~/config/tableColumns";
import { columnOrder } from "~/data/orderedColumns";
import { rows, setRows } from "~/data/palCombinedData";
import { arrayIncludes } from "~/utils/arrayIncludes";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { mapCellValue } from "~/utils/mapCellValue";
import { mapColumnHeader } from "~/utils/mapColumnHeader";
import { CustomField } from "./CustomField";

const sorter = new Intl.Collator(undefined, {
    numeric: true,
});

const isNumericFieldCache = new Map<string, boolean>();

const [lastSortedColumn, setLastSortedColumn] = createSignal<ReturnType<typeof columnOrder>[number] | "none">(
    loadOrDefault("table-sort-column", "none")
);
const [lastSortDirectionAscending, setLastSortDirectionAscending] = createSignal(
    loadOrDefault<string>("table-sort-direction-ascending", "true") === "true"
);

runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        localStorage.setItem("table-sort-column", lastSortedColumn());
        localStorage.setItem("table-sort-direction-ascending", lastSortDirectionAscending().toString());
    });
});

export function PalTable(): JSXElement {
    const [highlightedRow, setHighlightedRow] = createSignal("");
    onMount(() => {
        // eslint-disable-next-line solid/reactivity -- Wait for any display text to get replaced by their respective components
        window.requestAnimationFrame(() => {
            const columnName = lastSortedColumn();
            const sortAscending = lastSortDirectionAscending();
            if (columnName !== "none") {
                setLastSortedColumn("none");
                if (!sortAscending) {
                    setLastSortDirectionAscending((current) => !current);
                }
                sortColumn(columnName);
                if (!sortAscending) {
                    sortColumn(columnName);
                }
            }
        });
    });
    function sortColumn(columnName: ReturnType<typeof columnOrder>[number]): void {
        if (lastSortedColumn() === columnName) {
            setRows((current) => [...current.reverse()]);
        } else {
            let multiplier = 1;
            if (!isNumericFieldCache.has(columnName)) {
                for (const row of rows()) {
                    if (mapCellValue(row[columnName].toString()) === "") {
                        continue;
                    } else if (
                        typeof row[columnName] === "number" ||
                        row[columnName].toString().match(/^[0-9]+$/) !== null
                    ) {
                        isNumericFieldCache.set(columnName, true);
                        break;
                    }
                    isNumericFieldCache.set(columnName, false);
                    break;
                }
            }
            if (isNumericFieldCache.get(columnName) === true) {
                multiplier = -1;
            } else if (arrayIncludes(["true", "false"], rows()[0][columnName])) {
                multiplier = -1;
            }

            setRows((current) =>
                current.toSorted((a, b) => {
                    const aValue = a[columnName];
                    const bValue = b[columnName];
                    const isValueAEmpty = mapCellValue(aValue.toString()) === "";
                    const isValueBEmpty = mapCellValue(bValue.toString()) === "";
                    if (isValueAEmpty && !isValueBEmpty) {
                        return 1;
                    }
                    if (isValueBEmpty && !isValueAEmpty) {
                        return -1;
                    }
                    return sorter.compare(aValue.toString(), bValue.toString()) * multiplier;
                })
            );
        }
        if (lastSortedColumn() === columnName) {
            setLastSortDirectionAscending((current) => !current);
        } else {
            setLastSortDirectionAscending(true);
        }
        setLastSortedColumn(columnName);
    }
    return (
        <table class="pal-table">
            <thead>
                <For each={columnOrder()}>
                    {(columnName) => (
                        <th
                            class={unsortableColumns.includes(columnName) ? "no-sort" : undefined}
                            onClick={() => {
                                if (unsortableColumns.includes(columnName)) {
                                    return;
                                }
                                sortColumn(columnName);
                            }}
                        >
                            {mapColumnHeader(columnName)}
                            <br />
                            <span
                                aria-hidden={lastSortedColumn() !== columnName}
                                style={{ visibility: lastSortedColumn() !== columnName ? "hidden" : "visible" }}
                            >
                                {lastSortDirectionAscending() ? "▲" : "▼"}
                            </span>
                        </th>
                    )}
                </For>
            </thead>
            <tbody>
                <For each={rows()}>
                    {(palData, index) => (
                        <tr
                            class={highlightedRow() === palData.Id ? "highlight" : undefined}
                            onClick={function (this: HTMLTableRowElement, evt) {
                                if (evt.target !== this && evt.target.parentElement !== this) {
                                    return;
                                }
                                if (highlightedRow() === palData.Id) {
                                    setHighlightedRow("");
                                } else {
                                    setHighlightedRow(palData.Id);
                                }
                            }}
                        >
                            <For each={columnOrder()}>
                                {(columnName) => (
                                    <td>
                                        <CustomField
                                            property={columnName}
                                            palData={palData}
                                            updateData={(newData: typeof palData) => {
                                                const i = index();
                                                setRows((current) => {
                                                    return [...current.slice(0, i), newData, ...current.slice(i + 1)];
                                                });
                                            }}
                                        />
                                    </td>
                                )}
                            </For>
                        </tr>
                    )}
                </For>
            </tbody>
        </table>
    );
}
