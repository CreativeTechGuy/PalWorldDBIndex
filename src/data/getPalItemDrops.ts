import palItemDrops from "~/raw_data/DT_PalDropItem.json";
import { convertDataTableType } from "~/utils/convertDataTableType";

type ItemDrops = {
    Id: string;
    Rate: number;
    Min: number;
    Max: number;
};

const dropData = Object.values(convertDataTableType(palItemDrops));

export function getPalItemDrops(id: string): ItemDrops[] {
    const itemDrops = dropData.find((data) => data.CharacterID.toLowerCase() === id.toLowerCase());
    const items =
        itemDrops !== undefined
            ? Array.from({ length: 10 })
                  .map((_, index) => ({
                      Id: itemDrops[`ItemId${index + 1}` as keyof typeof itemDrops] as string,
                      Rate: itemDrops[`Rate${index + 1}` as keyof typeof itemDrops] as number,
                      Min: itemDrops[`min${index + 1}` as keyof typeof itemDrops] as number,
                      Max: itemDrops[`Max${index + 1}` as keyof typeof itemDrops] as number,
                  }))
                  .filter((item) => item.Id !== "None" && item.Rate > 0 && item.Max > 0)
            : [];
    return items;
}
