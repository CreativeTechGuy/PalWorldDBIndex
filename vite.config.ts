import type { UserConfig } from "vite";

export default {
    resolve: {
        alias: {
            "~/": "src/",
        },
    },
    clearScreen: false,
    server: {
        port: 4143,
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
} satisfies UserConfig;
