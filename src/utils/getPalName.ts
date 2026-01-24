import palNames from "~/raw_data/Pal/Content/L10N/en/Pal/DataTable/Text/DT_PalNameText_Common.json";
import { convertDataTableType } from "./convertDataTableType";
import { getObjectByCaseInsensitiveKey } from "./getObjectByCaseInsensitiveKey";

const palNamesMap = convertDataTableType(palNames);
const nameCache = new Map<string, string | undefined>();

export function getPalName(id: string): string | undefined {
    if (nameCache.has(id)) {
        return nameCache.get(id);
    }
    const palName = getObjectByCaseInsensitiveKey(palNamesMap, `PAL_NAME_${id}`)?.TextData.LocalizedString.trim();
    nameCache.set(id, palName);
    return palName;
}
