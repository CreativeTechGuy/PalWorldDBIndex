import "./styles/index.css";
import "./styles/classes.css";
import "./styles/table.css";
import { render } from "solid-js/web";
import faviconIcon from "~/raw_data/icons/T_Hedgehog_icon_normal.png";
import { App } from "./components/App";
import { rootElement } from "./config/rootElement";

render(() => <App />, rootElement);

const faviconElem = document.createElement("link");
faviconElem.rel = "icon";
faviconElem.type = "image/png";
faviconElem.href = faviconIcon;
document.head.appendChild(faviconElem);
