import basicPalData from "./data/DT_PalMonsterParameter.json" with { type: "json" };
import palNameMap from "./data/DT_PalNameText_Common.json" with { type: "json" };
import type { DerivedPalData } from "./types/DerivedPalData";
import type { PalMonsterParameter } from "./types/PalMonsterParameter";
import { isValidPal } from "./utils/isValidPal";
import { mapCellValue } from "./utils/mapCellValue";
import { mapColumnHeader } from "./utils/mapColumnHeader";

type CombinedData = PalMonsterParameter & DerivedPalData;

const columnOrder: (keyof CombinedData)[] = [
    "Name",
    "ElementType1",
    "ElementType2",
    "ZukanIndex",
    "SlowWalkSpeed",
    "WalkSpeed",
    "RunSpeed",
    "RideSprintSpeed",
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
    "Rarity",
    "Hp",
    "MeleeAttack",
    "ShotAttack",
    "Defense",
    "CraftSpeed",
];

// Any columns which are the same for every pal
const redundantColumns: (keyof CombinedData)[] = [];

const defaultHiddenColumns: (keyof CombinedData)[] = [
    "OverrideNameTextID",
    "NamePrefixID",
    "OverridePartnerSkillTextID",
    "IsPal",
    "Tribe",
    "BPClass",
    "ZukanIndexSuffix",
    "Organization",
    "IsBoss",
    "IsTowerBoss",
    "IsRaidBoss",
    "UseBossHPGauge",
    "BattleBGM",
    "ViewingDistance",
    "ViewingAngle",
    "MeshCapsuleHalfHeight",
    "MeshCapsuleRadius",
    "MeshRelativeLocation",
];

const rows: CombinedData[] = [];

for (const [key, data] of Object.entries(basicPalData[0].Rows)) {
    if (isValidPal(data)) {
        const localizedKey =
            `PAL_NAME_${key}` in palNameMap[0].Rows
                ? (`PAL_NAME_${key}` as keyof (typeof palNameMap)[0]["Rows"])
                : null;
        if (localizedKey === null) {
            continue;
        }
        rows.push({
            ...data,
            Name: palNameMap[0].Rows[localizedKey].TextData.LocalizedString,
        });
    }
}

const columns: (keyof CombinedData)[] = [...columnOrder];
for (const property in rows[0]) {
    if (!columns.includes(property as keyof CombinedData)) {
        columns.push(property as keyof CombinedData);
    }
}
for (const column of columns) {
    const firstValue = rows[0][column];
    let shouldHide = true;
    for (const row of rows) {
        if (row[column] !== firstValue) {
            shouldHide = false;
            break;
        }
    }
    if (shouldHide) {
        redundantColumns.push(column);
    }
}
for (const column of [...defaultHiddenColumns, ...redundantColumns]) {
    if (columns.includes(column)) {
        columns.splice(columns.indexOf(column), 1);
    }
}

let lastSortedColumn = "none";
buildTable();

function buildTable(): void {
    const root = document.getElementById("root")!;
    root.innerHTML = "";
    const table = document.createElement("table");
    root.appendChild(table);
    const headerElement = document.createElement("thead");
    for (const headerProperty of columns) {
        const td = document.createElement("td");
        td.textContent = mapColumnHeader(headerProperty);
        td.addEventListener("click", () => {
            if (lastSortedColumn === headerProperty) {
                rows.reverse();
            } else {
                let multiplier = 1;
                if (typeof rows[0][headerProperty] === "number") {
                    multiplier = -1;
                }
                rows.sort((a, b) => {
                    const aValue = a[headerProperty];
                    const bValue = b[headerProperty];
                    return (
                        // eslint-disable-next-line @typescript-eslint/no-base-to-string
                        aValue.toString().localeCompare(bValue.toString(), undefined, {
                            numeric: true,
                        }) * multiplier
                    );
                });
            }
            lastSortedColumn = headerProperty;
            buildTable();
        });
        headerElement.appendChild(td);
    }
    table.appendChild(headerElement);
    const tableBodyElement = document.createElement("tbody");
    for (const row of rows) {
        const tr = document.createElement("tr");
        for (const key of columns) {
            const td = document.createElement("td");
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            td.textContent = mapCellValue(row[key].toString());
            tr.appendChild(td);
        }
        tableBodyElement.appendChild(tr);
    }
    table.appendChild(tableBodyElement);
}
