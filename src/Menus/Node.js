import { ipcRenderer } from "electron";

ipcRenderer.on("New Node", function () {
  window.search.show = !window.search.show
});
