import { ipcRenderer } from "electron";

function exportNetwork() {
  alert("Feature not available yet.");
}

ipcRenderer.on("Export", exportNetwork);
