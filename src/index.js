import Vue from "vue/dist/vue.min.js";
window.Vue = Vue;
import "./Menus/index";
import Message from "./Message";
const _ = require("lodash");
const App = require("./App.vue");
const jsConf = require("./modules/js.conf.json");
const pugConf = require("./modules/pug.conf.json");
const nodeTypes = {
  js: jsConf,
  pug: pugConf
};

window.current = {
  layer: 0
};
window.search = {
  show: false,
  nodes: {
    js: "A generic node that you can program",
    pug: "Render a pug template"
  }
};
window.engine = {
  inputs: {},
  outputs: {}
};
window.data = [];

const systemErrorComponent = new Vue({
  el: "#systemError",
  data: {
    message: ""
  },
  components: { Message }
});

const file = localStorage.getItem("file");
document.title = file || "Welcome to Fuxion";
if (file) {
  delete require.cache[file];
  try {
    window.data = require(file);
  } catch (e) {
    systemErrorComponent.message = "File not found";
    throw new Error("File not found");
  }

  document.documentElement.scrollLeft = document.body.scrollLeft = data[current.layer].pan.x;
  document.documentElement.scrollTop = document.body.scrollTop = data[current.layer].pan.y;
} else {
  systemErrorComponent.message = "Start here:";
}
function addNode(type = "js") {
  const conf = JSON.parse(JSON.stringify(nodeTypes[type]));
  const id = Object.keys(data[current.layer].nodes).length;
  const newNode = {
    ...conf,
    id,
    layer_id: current.layer,
    position: {
      top: document.documentElement.scrollTop + 10,
      left: document.documentElement.scrollLeft + 10,
      right: 130
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
  const {deltaY, ctrlKey} = event;
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

  const dScale = (Math.floor(deltaY / 10) / 100);
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
  window.search.show = false;
}
Mousetrap.bind(["ctrl+n", "command+n"], () => window.search.show = !window.search.show);
Mousetrap.bind(["backspace"], removeLink);
window.addEventListener("wheel", handleScale, false);
Mousetrap.bind(['command+0'], resetScale);
Mousetrap.bind(["esc"], handleEsc);

Object.defineProperty(Vue.prototype, "_", { value: _ });

if (file) {
  new Vue({
    el: '#root',
    components: { App }
  });
}
