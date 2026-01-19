import { createEffect, createSignal, runWithOwner } from "solid-js";
import type { CombinedData } from "~/data/palCombinedData";
import { fakeSolidOwner } from "~/utils/fakeSolidOwner";
import { loadOrDefault } from "./loadOrDefault";

export const defaultColumnOrder: (keyof CombinedData)[] = [
    "Name",
    "ElementType1",
    "ElementType2",
    "ZukanIndex",
    "SpawnLocations",
    "MinimumSphere",
    "Rarity",
    "Hp",
    "ShotAttack",
    "Defense",
    "StatTotal",
    "SlowWalkSpeed",
    "WalkSpeed",
    "RunSpeed",
    "IsRidable",
    "IsFlying",
    "RideSprintSpeed",
    "IsSwimming",
    "SwimSpeed",
    "SwimDashSpeed",
    "Stamina",
    "WorkSuitability_EmitFlame",
    "WorkSuitability_Seeding",
    "WorkSuitability_Handcraft",
    "WorkSuitability_Deforest",
    "WorkSuitability_ProductMedicine",
    "WorkSuitability_Transport",
    "WorkSuitability_Watering",
    "WorkSuitability_GenerateElectricity",
    "WorkSuitability_Collection",
    "WorkSuitability_Mining",
    "WorkSuitability_Cool",
    "WorkSuitability_MonsterFarm",
];

export const unmovableLeftColumns: (keyof CombinedData)[] = ["Name"];

export const forceHiddenColumns: (keyof CombinedData)[] = [
    "OverrideNameTextID",
    "NamePrefixID",
    "OverridePartnerSkillTextID",
    "IsPal",
    "MeleeAttack",
    "IsBoss",
    "IsTowerBoss",
    "IsRaidBoss",
    "UseBossHPGauge",
    "ViewingDistance",
    "ViewingAngle",
    "MeshCapsuleHalfHeight",
    "MeshCapsuleRadius",
    // @ts-expect-error -- This will be removed from the object before it's used
    "MeshRelativeLocation",
];

export const defaultHiddenColumns: (keyof CombinedData)[] = [
    "Id",
    "Tribe",
    "BPClass",
    "ZukanIndexSuffix",
    "GenusCategory",
    "Organization",
    "AIResponse",
    "BiologicalGrade",
    "BattleBGM",
    "CombiDuplicatePriority",
];

export const [userColumnSettings, setUserColumnSettings] = createSignal(
    loadOrDefault("column-settings", {
        columnsFirst: [] as string[],
        columnsLast: [] as string[],
        hidden: [...defaultHiddenColumns],
    })
);

runWithOwner(fakeSolidOwner, () => {
    createEffect(() => {
        const settings = userColumnSettings();
        localStorage.setItem("column-settings", JSON.stringify(settings));
    });
});
