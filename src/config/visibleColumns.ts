import { createEffect, createSignal, runWithOwner } from "solid-js";
import type { CombinedData } from "~/data/palCombinedData";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { redundantColumns, userColumnSettings } from "./userColumns";

const [visibleColumns, setVisibleColumns] = createSignal(getVisibleColumns());
export { visibleColumns };

runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        setVisibleColumns(getVisibleColumns());
    });
});

function getVisibleColumns(): (keyof CombinedData)[] {
    const columns = userColumnSettings().columnOrder.filter((column) => !userColumnSettings().hidden.includes(column));
    if (userColumnSettings().autoHideRedundantColumns) {
        return columns.filter((column) => !redundantColumns.includes(column));
    }
    return columns;
}
