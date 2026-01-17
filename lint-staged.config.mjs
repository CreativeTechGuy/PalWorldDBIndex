export default {
    "*.{js,ts,jsx,tsx,cjs,mjs,json,html,xml,svg,css,md}": "cspell --no-progress --no-must-find-files",
    "*.{js,ts,jsx,tsx,cjs,mjs}": "eslint --no-warn-ignored --max-warnings 0 --fix",
    "*": "prettier --write --ignore-unknown --log-level warn",
};
