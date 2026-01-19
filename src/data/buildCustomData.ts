// cspell:words PARTNERSKILL
import itemNames from "~/raw_data/DT_ItemNameText_Common.json";
import palDescriptions from "~/raw_data/DT_PalFirstActivatedInfoText.json";
import palNames from "~/raw_data/DT_PalNameText_Common.json";
import skillNames from "~/raw_data/DT_SkillNameText_Common.json";
import techUnlocks from "~/raw_data/DT_TechnologyRecipeUnlock.json";
import type SwimmingPalBlueprintType from "~/raw_data/PalActorBP/Serpent/BP_Serpent.json";
import type { PalMonsterParameter } from "~/types/PalMonsterParameter";
import { convertDataTableType } from "~/utils/convertDataTableType";
import { getObjectByCaseInsensitiveKey } from "~/utils/getObjectByCaseInsensitiveKey";
import { getPalItemDrops } from "./getPalItemDrops";
import { getPalBlueprint } from "./palBlueprints";

export const customColumns = [
    "Id",
    "Name",
    "MinimumSphere",
    "PalDescription",
    "PartnerSkillUnlockLevel",
    "PartnerSkill",
    "ItemDrops",
    "SpawnLocations",
    "IsRidable",
    "IsFlying",
    "IsSwimming",
    "StatTotal",
] as const;

export type DerivedPalData = Record<(typeof customColumns)[number], string>;

const palNamesMap = convertDataTableType(palNames);
const descriptionsMap = convertDataTableType(palDescriptions);
const techUnlockMap = convertDataTableType(techUnlocks);
const skillNameMap = convertDataTableType(skillNames, { partialData: true });
const itemNameMap = convertDataTableType(itemNames);

export function buildCustomData(key: string, palData: PalMonsterParameter): DerivedPalData | null {
    const palName = getObjectByCaseInsensitiveKey(palNamesMap, `PAL_NAME_${key}`)?.TextData.LocalizedString;
    if (palName === undefined) {
        return null;
    }
    let partnerSkillUnlockLevel = "";
    let isFlying = false;
    let isRidable = false;
    let isSwimming = false;
    const blueprint = getPalBlueprint(key);
    if (blueprint !== undefined) {
        const partnerSkillComponent = blueprint.find((item) => item.Type === "PalPartnerSkillParameterComponent");
        if (partnerSkillComponent !== undefined) {
            const skillUnlockItem = partnerSkillComponent.Properties?.RestrictionItems?.[0].Key;
            if (skillUnlockItem !== undefined && skillUnlockItem in techUnlockMap) {
                partnerSkillUnlockLevel = techUnlockMap[skillUnlockItem].LevelCap.toString();
            }
        }
        const staticCharacterComponent = blueprint.find((item) => item.Type === "PalStaticCharacterParameterComponent");
        if (staticCharacterComponent !== undefined) {
            if (
                staticCharacterComponent.Properties?.GeneralBlendSpaceMap?.some((item) =>
                    item.Key.endsWith("RidingMove")
                ) === true
            ) {
                isRidable = true;
            }
            if (
                staticCharacterComponent.Properties?.GeneralBlendSpaceMap?.some((item) =>
                    item.Key.endsWith("FlyingRidingMove")
                ) === true
            ) {
                isFlying = true;
            }
            if (
                (
                    staticCharacterComponent as (typeof SwimmingPalBlueprintType)[number]
                ).Properties?.MovementType?.endsWith("::Swim") === true
            ) {
                isSwimming = true;
            }
        }
    }

    return {
        Id: key,
        Name: palName,
        MinimumSphere: "Spheres",
        ItemDrops: getPalItemDrops(key)
            .map((item) => itemNameMap[`ITEM_NAME_${item.Id}`].TextData.LocalizedString)
            .join(", "),
        IsFlying: isFlying.toString(),
        IsRidable: isRidable.toString(),
        IsSwimming: isSwimming.toString(),
        StatTotal: (palData.ShotAttack + palData.Defense + palData.Hp).toString(),
        PartnerSkill: skillNameMap[`PARTNERSKILL_${key}`]?.TextData.LocalizedString ?? "",
        PartnerSkillUnlockLevel: partnerSkillUnlockLevel,
        SpawnLocations: "Map",
        PalDescription: getObjectByCaseInsensitiveKey(descriptionsMap, `PAL_FIRST_SPAWN_DESC_${key}`)!.TextData
            .LocalizedString,
    };
}
