// @ts-nocheck -- Don't try to infer the type of this file since it's too large
import spawnLocations from "~/raw_data/DT_PaldexDistributionData.json";
import spawnerPlacementData from "~/raw_data/DT_PalSpawnerPlacement.json";
import { convertDataTableType } from "~/utils/convertDataTableType";

/**
 * @type {typeof import("../types/SpawnLocations.ts").SpawnData}
 */
export const spawnLocationMap = convertDataTableType(spawnLocations);
/**
 * @type {typeof import("../types/SpawnLocations.ts").SpawnerData}
 */
export const spawnerLocationMap = convertDataTableType(spawnerPlacementData);
