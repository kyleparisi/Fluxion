import { remote, ipcRenderer } from "electron";
const fs = require("fs");
const path = require("path");

const data = [
  {
    app: {
      style: {
        width: "100%",
        height: "100%",
        transition: "transform 0.2s"
      },
      svgStyle: {
        width: "100%",
        height: "100vh",
        overflow: "visible",
        transition: "transform 0.2s"
      },
      linkStyle: {
        strokeWidth: 1,
        strokeLinejoin: "round",
        strokeLinecap: "round",
        fill: "none"
      },
      linkOverlapStyle: {
        strokeWidth: 50,
        strokeLinejoin: "round",
        strokeLinecap: "round",
        fill: "none",
        stroke: "rgba(230, 230, 230, 0)"
      }
    },
    editor: {
      height: 400
    },
    pan: {
      x: 0,
      y: 0
    },
    scale: 1,
    throttle: 10,
    links: {},
    nodes: {},
    packets: {},
    configuring: {},
    addingLink: {},
    mouseOverPort: "",
    webview: {
      style: {
        width: "320px",
        height: "480px",
        left: "10px",
        top: "10px"
      },
      src: ""
    },
    problem: {},
    selectedLinks: {}
  }
];

function New() {
  const file = remote.dialog.showSaveDialogSync(
    {
      defaultPath: "~/App.fluxion",
      filters: [
        {
          name: "Fluxion",
          extensions: ["fluxion"]
        }
      ]
    }
  );
  if (!file) {
    console.log("No file to save")
    return false;
  }
  fs.copyFile(
    __dirname + "/../src/modules/js.js",
    path.dirname(file) + "/js.js",
    err => {
      if (err) throw err;
      fs.writeFile(file, JSON.stringify(data, null, 2), () => {
        console.log("Saved");
        localStorage.setItem("file", file);
        window.location.reload();
      });
    }
  );
}

Mousetrap.bind(["ctrl+shift+n", "command+shift+n"], New);
ipcRenderer.on("New", New);

module.exports = New;
