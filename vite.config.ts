// cspell:ignore Loaction
import "dotenv/config";
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

const jsonFieldsToTransform: Record<string, (key: string, value: unknown) => unknown> = {
    "DT_PaldexDistributionData.json": (key, value) => {
        if (key === "Z") {
            return undefined;
        }
        if (key === "X" || key === "Y") {
            return Math.round(value as number);
        }
        return value;
    },
    "DT_PalSpawnerPlacement.json": (key, value) => {
        if (["Z", "SpawnerClass", "LayerNames", "InstanceName", "WorldName"].includes(key)) {
            return undefined;
        }
        if (key === "X" || key === "Y") {
            return Math.round(value as number);
        }
        return value;
    },
    "DT_BossSpawnerLoactionData.json": (key, value) => {
        if (key === "Z") {
            return undefined;
        }
        if (key === "X" || key === "Y") {
            return Math.round(value as number);
        }
        return value;
    },
    "DT_PalCharacterIconDataTable.json": (key, value) => {
        if (key === "SubPathString") {
            return undefined;
        }
        return value;
    },
    "DT_PassiveSkill_Main.json": (key, value) => {
        if (typeof value === "boolean") {
            return undefined;
        }
        return value;
    },
};

export default defineConfig({
    base: "./",
    plugins: [
        solidPlugin(),
        {
            name: "add-build-date",
            transformIndexHtml: {
                order: "post",
                handler: (html) => {
                    return html
                        .replace("BUILD_DATE", new Date().toLocaleDateString())
                        .replace("GAME_VERSION", process.env.GAME_VERSION ?? "unknown");
                },
            },
        },
        {
            name: "remove-json-fields",
            load: (id) => {
                const filename = basename(id);
                if (filename in jsonFieldsToTransform) {
                    const code = readFileSync(id, "utf-8");
                    const transformations = jsonFieldsToTransform[filename];
                    const jsonObj = JSON.parse(code) as unknown;
                    return JSON.stringify(jsonObj, transformations);
                }
                return null;
            },
        },
    ],
    resolve: {
        alias: {
            "~": resolve(import.meta.dirname, "src"),
        },
    },
    clearScreen: false,
    server: {
        host: "0.0.0.0",
        port: 4143,
        allowedHosts: true,
        strictPort: true,
        hmr: {
            overlay: false,
        },
    },
    build: {
        assetsInlineLimit: 0,
        license: {
            fileName: "license.txt",
        },
    },
});
