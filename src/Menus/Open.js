import { remote, ipcRenderer } from "electron";

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
