import Vue from "vue/dist/vue.js";
window.Vue = Vue;
import "./Menus/index";
import Message from "./Message";
const fs = require("fs");
const _ = require("lodash");
const App = require("./App.vue");
const jsConf = require("./modules/js.conf.json");
const pugConf = require("./modules/pug.conf.json");
const auth0Conf = require("./modules/auth0.conf.json");
const googleConf = require("./modules/google.conf.json");
const nodeTypes = {
  js: jsConf,
  pug: pugConf,
  auth0: auth0Conf,
  google: googleConf
};

window.current = {
  layer: 0
};
window.search = {
  show: false,
  nodes: {
    js: "A generic node that you can program",
    pug: "Render a pug template",
    auth0: "Configure Auth0 OAuth",
    google: "Configure Google OAuth"
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

let scaleCache = 1;
function handleScale(event) {
  const { deltaY, ctrlKey } = event;
  if (!ctrlKey) {
    return false;
  }
  event.preventDefault();
  if (scaleCache === deltaY) {
    return false;
  }
  const scale = window.data[current.layer].scale;
  if ((scale === 0.1 && deltaY <= 0) || (scale === 2 && deltaY >= 0)) {
    return false;
  }
  scaleCache = deltaY;

  const dScale = Math.floor(deltaY / 10) / 100;
  const rangeScale = Math.min(2, Math.max(0.1, scale + dScale));
  const scaleAsFloat = parseFloat(rangeScale.toFixed(2));
  Vue.set(data[current.layer], "scale", scaleAsFloat);
  return false;
}
function resetScale() {
  Vue.set(data[current.layer], "scale", 1);
}
function handleEsc() {
  Vue.set(data[current.layer], "selectedLinks", {});
  Vue.set(data[current.layer], "addingLink", {});
  window.search.show = false;
}
Mousetrap.bind(["backspace"], removeLink);
window.addEventListener("wheel", handleScale, false);
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
