import type PalBlueprintType1 from "~/raw_data/PalActorBP/PoseidonOrca/BP_PoseidonOrca.json";
import { getObjectByCaseInsensitiveKey } from "~/utils/getObjectByCaseInsensitiveKey";

type PalBlueprintType = typeof PalBlueprintType1;

export const palBlueprints: Record<string, PalBlueprintType> = import.meta.glob(
    ["~/raw_data/PalActorBP/*/BP_*.json", "!~/raw_data/PalActorBP/*/BP_*_BOSS*.json"],
    { eager: true, import: "default" }
);

export function getPalBlueprint(id: string): PalBlueprintType | undefined {
    const blueprint =
        getObjectByCaseInsensitiveKey(palBlueprints, `/src/raw_data/PalActorBP/${id.split("_")[0]}/BP_${id}.json`) ??
        getObjectByCaseInsensitiveKey(
            palBlueprints,
            `/src/raw_data/PalActorBP/${id.split("_")[0]}/BP_${id}_Normal.json`
        );
    return blueprint;
}
