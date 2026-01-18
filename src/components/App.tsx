import type { JSXElement } from "solid-js";
import { PalTable } from "./PalTable";
import { Settings } from "./Settings";

export function App(): JSXElement {
    return (
        <>
            <PalTable />
            <Settings />
        </>
    );
}
