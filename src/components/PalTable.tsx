import { createSignal, For, type JSXElement } from "solid-js";
import { columnOrder } from "~/data/orderedColumns";
import { rows, setRows } from "~/data/palCombinedData";
import { mapCellValue } from "~/utils/mapCellValue";
import { mapColumnHeader } from "~/utils/mapColumnHeader";
import { CustomField } from "./CustomField";

const sorter = new Intl.Collator(undefined, {
    numeric: true,
});

const isNumericFieldCache = new Map<string, boolean>();

export function PalTable(): JSXElement {
    const [lastSortedColumn, setLastSortedColumn] = createSignal("none");
    const [lastSortDirectionDown, setLastSortDirectionDown] = createSignal(true);
    return (
        <table class="pal-table">
            <thead>
                <For each={columnOrder()}>
                    {(columnName) => (
                        <th
                            onClick={() => {
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
                                    setLastSortDirectionDown((current) => !current);
                                } else {
                                    setLastSortDirectionDown(true);
                                }
                                setLastSortedColumn(columnName);
                            }}
                        >
                            {mapColumnHeader(columnName)}
                            <br />
                            <span
                                aria-hidden={lastSortedColumn() !== columnName}
                                style={{ visibility: lastSortedColumn() !== columnName ? "hidden" : "visible" }}
                            >
                                {lastSortDirectionDown() ? "▼" : "▲"}
                            </span>
                        </th>
                    )}
                </For>
            </thead>
            <tbody>
                <For each={rows()}>
                    {(palData) => (
                        <tr>
                            <For each={columnOrder()}>
                                {(columnName) => (
                                    <td>
                                        <CustomField property={columnName} palData={palData} />
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
