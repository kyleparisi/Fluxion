import { ipcRenderer } from "electron";
const remote = require("@electron/remote");

function open() {
  const files = remote.dialog.showOpenDialogSync({ properties: ["openFile"] })
  if (!files) {
    return false;
  }
  const FILE = files[0];
  localStorage.setItem("file", FILE);
  location.reload();
}

ipcRenderer.on('Open', open);

module.exports = open;
