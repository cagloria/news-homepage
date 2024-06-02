import { setUpNav } from "./navigation.js";
import { loadData } from "./data.js";

window.addEventListener("load", () => {
    setUpNav();
    loadData();
});
