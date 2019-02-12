import { remote, ipcRenderer } from "electron";

function open() {
  remote.dialog.showOpenDialog({ properties: ["openFile"] }, function(files) {
    if (!files) {
      return false;
    }
    const FILE = files[0];
    localStorage.setItem("file", FILE);
    location.reload();
  });
}

ipcRenderer.on('Open', open);

module.exports = open;
