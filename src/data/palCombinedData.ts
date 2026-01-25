import { createSignal } from "solid-js";
import basicPalData from "~/raw_data/Pal/Content/Pal/DataTable/Character/DT_PalMonsterParameter.json";
import type { PalMonsterParameter } from "~/types/PalMonsterParameter";
import { isValidPal } from "~/utils/isValidPal";
import { buildCustomData, type DerivedPalData } from "./buildCustomData";

export type CombinedData = PalMonsterParameter & DerivedPalData;

const initialRows: CombinedData[] = [];
for (const [key, data] of Object.entries(basicPalData[0].Rows)) {
    if (isValidPal(data)) {
        const customData = buildCustomData(key, data);
        if (customData === null) {
            continue;
        }
        initialRows.push({
            ...data,
            ...customData,
        });
    }
}

export const [rows, setRows] = createSignal<CombinedData[]>(initialRows);
