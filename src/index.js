import Vue from "vue/dist/vue.js";
window.Vue = Vue;
import "./Menus/index";
import Message from "./Message";
const fs = require("fs");
const _ = require("lodash");
const App = require("./App.vue");
const jsConf = require("./modules/js.conf.json");
const pugConf = require("./modules/pug.conf.json");
const chartjsConf = require("./modules/chartjs.conf.json");
const fileInputConf = require("./modules/file-input.conf.json");
const webviewnodeConf = require("./modules/webviewnode.conf.json");
const startConf = require("./modules/start.conf.json");
const nodeTypes = {
  js: jsConf,
  pug: pugConf,
  fileInput: fileInputConf,
  chartjs: chartjsConf,
  webviewnode: webviewnodeConf,
  start: startConf,
};

window.current = {
  layer: 0
};
window.search = {
  show: false,
  nodes: {
    chartjs: "Draw charts",
    js: "A generic node that you can program",
    pug: "Render a pug template",
    fileInput: "File upload button, outputs data from the input.",
    webviewnode: "Webview for scrapping",
    start: "Send a * packet to start network"
  }
};
window.engine = {
  inputs: {},
  outputs: {}
};
window.data = [];
window.mouse = {
  x: 0,
  y: 0
};

const systemErrorComponent = new Vue({
  el: "#systemError",
  data: {
    message: ""
  },
  components: { Message }
});

const file = localStorage.getItem("file");
document.title = file || "Welcome to Fluxion";
if (file) {
  delete require.cache[file];
  try {
    const contents = fs.readFileSync(file, 'utf8');
    window.data = JSON.parse(contents);
  } catch (e) {
    systemErrorComponent.message = "File not found";
    throw new Error("File not found");
  }
} else {
  systemErrorComponent.message = "Start here:";
}
function addNode(type = "js") {
  const nodeType = _.get(nodeTypes, type, {
    module: type,
    name: type,
    inputs: {},
    outputs: {}
  });
  const conf = JSON.parse(JSON.stringify(nodeType));
  const nodes = Object.keys(data[current.layer].nodes);
  const id = (Number(nodes[nodes.length - 1]) || 0) + 1;
  const newNode = {
    ...conf,
    id,
    layer_id: current.layer,
    position: {
      top: -window.data[0].pan.y + 10,
      left: -window.data[0].pan.x + 10,
      right: _.get(conf, "position.right", false) || 130
    }
  };
  Vue.set(window.data[current.layer].nodes, id, newNode);
  window.search.show = !window.search.show;
}
window.addNode = addNode;
function removeLink() {
  _.each(data[current.layer].selectedLinks, link => {
    Vue.delete(data[current.layer].links, link.id);
    Vue.delete(data[current.layer].selectedLinks, link.id);
  });
}
window.removeLink = removeLink;

function handleScale(event) {
  const { deltaY, ctrlKey, clientX, clientY } = event;
  if (!ctrlKey) {
    return false;
  }
  event.preventDefault();

  const oldScale = window.data[current.layer].scale;
  const pan = window.data[current.layer].pan;

  // Calculate scale change (negative deltaY = zoom in, positive = zoom out)
  const dScale = -deltaY / 500;
  const newScale = Math.min(2, Math.max(0.1, oldScale + dScale));

  if (newScale === oldScale) {
    return false;
  }

  const scaleAsFloat = parseFloat(newScale.toFixed(2));

  // Zoom relative to cursor position
  const worldX = (clientX - pan.x) / oldScale;
  const worldY = (clientY - pan.y) / oldScale;
  const newPanX = clientX - worldX * scaleAsFloat;
  const newPanY = clientY - worldY * scaleAsFloat;

  Vue.set(data[current.layer], "scale", scaleAsFloat);
  Vue.set(data[current.layer].pan, "x", newPanX);
  Vue.set(data[current.layer].pan, "y", newPanY);
  return false;
}
function resetScale() {
  Vue.set(data[current.layer], "scale", 1);
}
function handleEsc() {
  Vue.set(data[current.layer], "selectedLinks", {});
  Vue.set(data[current.layer], "addingLink", {});
  Vue.set(data[current.layer], "configuring", {});
  window.search.show = false;
}
Mousetrap.bind(["backspace"], removeLink);
window.addEventListener("wheel", handleScale, { passive: false });
Mousetrap.bind(["command+0"], resetScale);
Mousetrap.bind(["esc"], handleEsc);

document.addEventListener("mousemove", function(event) {
  const pan = _.get(data, [current.layer, "pan"], { x: 0, y: 0 });
  mouse.x = event.clientX - pan.x;
  mouse.y = event.clientY - pan.y;
});

Object.defineProperty(Vue.prototype, "_", { value: _ });

if (file) {
  new Vue({
    el: "#root",
    components: { App }
  });
}
