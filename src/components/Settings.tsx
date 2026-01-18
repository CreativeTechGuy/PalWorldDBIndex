import { createSignal, For, type JSXElement } from "solid-js";
import { Portal } from "solid-js/web";
import { rootElement } from "~/config/rootElement";
import { setSphereSettings, sphereSettings } from "~/config/sphereSettings";
import { setUserColumnSettings, userColumnSettings } from "~/config/tableColumns";
import { configurableColumns } from "~/data/orderedColumns";
import settingsIcon from "~/icons/settings.svg";
import { mapColumnHeader } from "~/utils/mapColumnHeader";
import { Dialog } from "./Dialog";

export function Settings(): JSXElement {
    const [open, setOpen] = createSignal(false);
    return (
        <>
            <button
                class="link-button floating-button"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <img style={{ height: "100%" }} src={settingsIcon} alt="Settings icon" />
            </button>
            {open() && (
                <Portal mount={rootElement}>
                    <Dialog
                        title="Settings"
                        onClose={() => {
                            setOpen(false);
                        }}
                    >
                        <table>
                            <tbody>
                                <tr>
                                    <th colSpan={2} class="center">
                                        Pal Sphere Capture Settings
                                    </th>
                                </tr>
                                <tr>
                                    <td>Pal Health Remaining</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="10"
                                            style={{ width: "3em" }}
                                            value={Math.round(sphereSettings().healthRemaining * 100)}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    healthRemaining: parseInt(evt.target.value, 10) / 100,
                                                }));
                                            }}
                                        />
                                        %
                                    </td>
                                </tr>
                                <tr>
                                    <td>Min Capture Chance Acceptable</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="10"
                                            style={{ width: "3em" }}
                                            value={Math.round(sphereSettings().minCaptureRateAcceptable * 100)}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    minCaptureRateAcceptable: parseInt(evt.target.value, 10) / 100,
                                                }));
                                            }}
                                        />
                                        %
                                    </td>
                                </tr>
                                <tr>
                                    <td>Include Back Bonus</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={sphereSettings().isBack}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    isBack: evt.target.checked,
                                                }));
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Statue of Power Level</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            step="1"
                                            style={{ width: "3em" }}
                                            value={sphereSettings().lifmunkLevel}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    lifmunkLevel: parseInt(evt.target.value, 10),
                                                }));
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>World Setting Capture Rate</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0.5"
                                            max="2"
                                            step="0.5"
                                            style={{ width: "3em" }}
                                            value={sphereSettings().worldSettingCaptureRate}
                                            onInput={(evt) => {
                                                setSphereSettings((current) => ({
                                                    ...current,
                                                    worldSettingCaptureRate: parseFloat(evt.target.value),
                                                }));
                                            }}
                                        />
                                        x
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan={2}>Columns</th>
                                </tr>
                                <ColumnConfigurationRow type="columnsFirst" label="Move columns to front" />
                                <ColumnConfigurationRow type="columnsLast" label="Move columns to end" />
                                <ColumnConfigurationRow type="hidden" label="Hide columns" />
                                <tr>
                                    <td colSpan={2}>
                                        <button
                                            class="link-button center"
                                            onClick={() => {
                                                localStorage.clear();
                                                location.reload();
                                            }}
                                        >
                                            Reset all settings
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Dialog>
                </Portal>
            )}
        </>
    );
}

type ColumnConfigurationRowProps = {
    label: string;
    type: keyof ReturnType<typeof userColumnSettings>;
};

function ColumnConfigurationRow(props: ColumnConfigurationRowProps): JSXElement {
    return (
        <tr>
            <td>
                {props.label}
                <br />({userColumnSettings()[props.type].length} Selected)
                <br />
                <button
                    class="link-button"
                    onClick={() => {
                        // eslint-disable-next-line solid/reactivity
                        setUserColumnSettings((current) => ({
                            ...current,
                            [props.type]: [],
                        }));
                    }}
                >
                    Clear Selection
                </button>
            </td>
            <td>
                <select
                    multiple={true}
                    onChange={(evt) => {
                        // eslint-disable-next-line solid/reactivity
                        setUserColumnSettings((current) => {
                            const newColumns = [...evt.target.options]
                                .filter((option) => option.selected)
                                .map((option) => option.value);
                            return {
                                ...current,
                                columnsFirst: [...current.columnsFirst].filter(
                                    (column) => !newColumns.includes(column)
                                ),
                                columnsLast: [...current.columnsLast].filter((column) => !newColumns.includes(column)),
                                hidden: [...current.hidden].filter((column) => !newColumns.includes(column)),
                                [props.type]: newColumns,
                            };
                        });
                    }}
                >
                    <For each={configurableColumns}>
                        {(columnName) => (
                            <option value={columnName} selected={userColumnSettings()[props.type].includes(columnName)}>
                                {mapColumnHeader(columnName)}
                            </option>
                        )}
                    </For>
                </select>
            </td>
        </tr>
    );
}
