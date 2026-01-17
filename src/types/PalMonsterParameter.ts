import type basicPalData from "../data/DT_PalMonsterParameter.json";

export type PalMonsterParameter = (typeof basicPalData)[0]["Rows"][keyof (typeof basicPalData)[0]["Rows"]];
