import { For, type JSXElement } from "solid-js";
import type { JSX } from "solid-js/h/jsx-runtime";

type Item<ItemValue> = {
    label: JSXElement;
    value: ItemValue;
};

type DragAndDropListProps<ItemValue> = {
    style?: JSX.CSSProperties;
    items: Item<ItemValue>[];
    onChange: (items: Item<ItemValue>[]) => void;
};

export function DragAndDropList<ItemValue>(props: DragAndDropListProps<ItemValue>): JSXElement {
    return (
        <div class="drag-and-drop-list" style={props.style}>
            <For each={props.items}>
                {(item, index) => {
                    return (
                        <div
                            draggable={true}
                            onDragStart={(evt) => {
                                evt.dataTransfer!.effectAllowed = "move";
                                evt.dataTransfer?.setData("text/plain", index().toString());
                                if (evt.target instanceof HTMLElement) {
                                    evt.target.style.opacity = "0.5";
                                }
                            }}
                            onDragEnd={(evt) => {
                                if (evt.target instanceof HTMLElement) {
                                    evt.target.style.opacity = "1";
                                }
                            }}
                            onDragOver={(evt) => {
                                evt.preventDefault();
                                if (evt.target instanceof HTMLElement) {
                                    evt.target.style.borderTopColor = "black";
                                }
                            }}
                            onDragLeave={(evt) => {
                                if (evt.target instanceof HTMLElement) {
                                    evt.target.style.borderTopColor = "transparent";
                                }
                            }}
                            onDrop={(evt) => {
                                evt.preventDefault();
                                const movedIndex = parseInt(evt.dataTransfer!.getData("text/plain"), 10);
                                const newList = [...props.items.filter((_, i) => i !== movedIndex)];
                                const dropIndex = newList.findIndex((i) => i.value === item.value);
                                const movedObj = props.items[movedIndex];
                                newList.splice(dropIndex, 0, movedObj);
                                props.onChange(newList);
                            }}
                        >
                            {item.label}
                        </div>
                    );
                }}
            </For>
        </div>
    );
}
