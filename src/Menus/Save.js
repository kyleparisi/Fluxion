import {ipcRenderer} from 'electron';

const fs = require("fs");

function save() {
  const file = localStorage.getItem("file");
  Object.keys(data).map(layer_id => {
    data[layer_id].packets = {};
    data[layer_id].selectedLinks = {};
    data[layer_id].addingLink = {};
    data[layer_id].problem = {};
  });
  fs.writeFile(file, JSON.stringify(data, null, 2), () => {
    console.log("Saved");
    location.reload();
  });
}

ipcRenderer.on('Save', save);
