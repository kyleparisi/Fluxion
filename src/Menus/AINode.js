import { ipcRenderer } from "electron";

ipcRenderer.on("AI Node", function () {
  if (window.aiNodeCreator) {
    window.aiNodeCreator.open();
  }
});
