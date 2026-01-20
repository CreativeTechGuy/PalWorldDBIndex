import { createEffect, createSignal, runWithOwner } from "solid-js";
import type { CombinedData } from "~/data/palCombinedData";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { restrictValueToList } from "~/utils/restrictValueToList";
import { loadOrDefault } from "./loadOrDefault";
import { userColumnSettings } from "./userColumns";

const defaultSortColumn = "Name";
const defaultSortDirectionAscending = true;

export const [lastSortedColumn, setLastSortedColumn] = createSignal<keyof CombinedData>(
    restrictValueToList(
        loadOrDefault("table-sort-column", defaultSortColumn),
        userColumnSettings().columnOrder,
        defaultSortColumn
    )
);
export const [lastSortDirectionAscending, setLastSortDirectionAscending] = createSignal(
    loadOrDefault<string>("table-sort-direction-ascending", defaultSortDirectionAscending.toString()) === "true"
);

runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        localStorage.setItem("table-sort-column", lastSortedColumn());
        localStorage.setItem("table-sort-direction-ascending", lastSortDirectionAscending().toString());
    });
});

export function resetTableSort(): void {
    setLastSortedColumn(defaultSortColumn);
    setLastSortDirectionAscending(defaultSortDirectionAscending);
}
