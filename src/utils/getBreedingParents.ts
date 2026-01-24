import palCombinationData from "~/raw_data/Pal/Content/Pal/DataTable/Character/DT_PalCombiUnique.json";
import basicPalData from "~/raw_data/Pal/Content/Pal/DataTable/Character/DT_PalMonsterParameter.json";
import { convertDataTableType } from "./convertDataTableType";
import { getPalName } from "./getPalName";
import { isValidPal } from "./isValidPal";

type BreedingParents = {
    parentA: string;
    parentAName: string;
    parentB: string;
    parentBName: string;
    parentAMale?: boolean;
    parentBMale?: boolean;
};

type PalStat = {
    Id: string;
    CombiRank: number;
    CombiDuplicatePriority: number;
    IgnoreCombi: boolean;
};

const breedingCombinations: Record<string, BreedingParents[]> = {};
(() => {
    const palStats: PalStat[] = [];
    const combiRanks: (undefined | PalStat)[] = [];

    const combinations = Object.values(convertDataTableType(palCombinationData));
    const anyGender = "EPalGenderType::None";
    const male = "EPalGenderType::Male";

    for (const combi of combinations) {
        const parentA = combi.ParentTribeA.replace("EPalTribeID::", "");
        const parentB = combi.ParentTribeB.replace("EPalTribeID::", "");
        if (combi.ChildCharacterID !== parentA || combi.ChildCharacterID !== parentB) {
            breedingCombinations[combi.ChildCharacterID] ??= [];
            breedingCombinations[combi.ChildCharacterID].push({
                parentA,
                parentAName: getPalName(parentA)!,
                parentB,
                parentBName: getPalName(parentB)!,
                ...(combi.ParentGenderA !== anyGender ? { parentAMale: combi.ParentGenderA === male } : {}),
                ...(combi.ParentGenderB !== anyGender ? { parentBMale: combi.ParentGenderB === male } : {}),
            });
        }
    }

    Object.entries(convertDataTableType(basicPalData)).forEach(([id, value]) => {
        if (isValidPal(value)) {
            const obj = {
                Id: id,
                CombiRank: value.CombiRank,
                CombiDuplicatePriority: value.CombiDuplicatePriority,
                IgnoreCombi: value.IgnoreCombi,
            };
            palStats.push(obj);
            if (!value.IgnoreCombi) {
                const existingPalInSlot = combiRanks[value.CombiRank];
                if (existingPalInSlot === undefined) {
                    combiRanks[value.CombiRank] = obj;
                } else {
                    if (obj.CombiDuplicatePriority > existingPalInSlot.CombiDuplicatePriority) {
                        combiRanks[value.CombiRank] = obj;
                    }
                }
            }
        }
    }, {});

    for (let a = 0; a < palStats.length; a++) {
        for (let b = a; b < palStats.length; b++) {
            const child = getChild(palStats[a], palStats[b]);
            if (child !== null) {
                breedingCombinations[child.Id] ??= [];
                if (
                    breedingCombinations[child.Id].some(
                        (combo) =>
                            (combo.parentA === palStats[a].Id && combo.parentB === palStats[b].Id) ||
                            (combo.parentB === palStats[a].Id && combo.parentA === palStats[b].Id)
                    )
                ) {
                    continue;
                }
                breedingCombinations[child.Id].push({
                    parentA: palStats[a].Id,
                    parentAName: getPalName(palStats[a].Id)!,
                    parentB: palStats[b].Id,
                    parentBName: getPalName(palStats[b].Id)!,
                });
            }
        }
    }

    for (const combos of Object.values(breedingCombinations)) {
        combos.sort((a, b) => {
            return a.parentAName.localeCompare(b.parentAName);
        });
    }

    function getChild(palA: PalStat, palB: PalStat): PalStat | null {
        if (palA.Id === palB.Id) {
            return palA;
        }
        const childCombiRank = Math.ceil((palA.CombiRank + palB.CombiRank + 1) / 2);
        for (let i = 0; childCombiRank - i >= 0 && childCombiRank + i < combiRanks.length; i++) {
            const potentialChildLow = combiRanks[childCombiRank - i];
            const potentialChildHigh = combiRanks[childCombiRank + i];
            if (typeof potentialChildLow?.Id === "string" && i === 0) {
                return potentialChildLow;
            }
            if (typeof potentialChildLow?.Id === "string" && typeof potentialChildHigh?.Id !== "string") {
                return potentialChildLow;
            }
            if (typeof potentialChildLow?.Id !== "string" && typeof potentialChildHigh?.Id === "string") {
                return potentialChildHigh;
            }
            if (typeof potentialChildLow?.Id === "string" && typeof potentialChildHigh?.Id === "string") {
                if (potentialChildLow.CombiDuplicatePriority > potentialChildHigh.CombiDuplicatePriority) {
                    return potentialChildLow;
                }
                return potentialChildHigh;
            }
        }
        return null;
    }
})();

export function getBreedingParents(palId: string): BreedingParents[] {
    return breedingCombinations[palId] ?? [];
}
