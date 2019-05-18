import { remote, ipcRenderer } from "electron";
const fs = require("fs");
const path = require("path");

function SaveAs() {
  remote.dialog.showSaveDialog(
    {
      defaultPath: "~/App.fluxion",
      filters: [
        {
          name: "Fluxion",
          extensions: ["fluxion"]
        }
      ]
    },
    function(file) {
      if (!file) {
        return false;
      }
      fs.copyFile("src/modules/js.js", path.dirname(file) + "/js.js", err => {
        if (err) throw err;
        fs.writeFile(file, JSON.stringify(window.data, null, 2), () => {
          console.log("Saved");
          localStorage.setItem("file", file);
          window.location.reload();
        });
      });
    }
  );
}

ipcRenderer.on("Save As", SaveAs);

module.exports = SaveAs;
