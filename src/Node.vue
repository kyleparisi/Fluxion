<template>
  <div>
    <div class="node absolute ba br2 color-node flex items-center"
         :class="{'bg-color-node shadow-1': configuring.id === node.id, 'bg-black-node': configuring.id !== node.id, 'b--orange': problem[node.id], 'b--color-node': !problem[node.id], 'flex-column': node.symbol }"
         :style="nodeStyle()"
         v-on:dblclick="configuring = configuring.id === node.id ? {} : node">
      <div class="tc w-100 pa1" v-if="node.symbol"><img class="w-50" :src="node.symbol"></div>
      <div class="tc w-100 pa1">{{ node.name }}</div>
    </div>
    <component v-bind:is="node.module" :node="node"></component>
    <template v-for="(_, name, index) in node.inputs">
      <div class="port pointer absolute bg-green white br-100"
           v-for="(_, name, index) in node.inputs"
           :style="{top: top(index), left: inputLeft()}"
           :id="`inputs_${node.id}_${name}`"
           @click="inputClick(name)"
           @mouseover="mouseOverPort = `${node.id}_${name}`"
           @mouseleave="mouseOverPort = ''"
      ></div>
      <div class="absolute color-node"
           :style="{top: topLabel(index), left: labelLeft()}"
           v-show="mouseOverPort === `${node.id}_${name}`">{{ name }}</div>
    </template>
    <template v-for="(_, name, index) in node.outputs">
      <div class="port pointer absolute bg-green br-100"
           :style="{top: top(index), left: outputRight()}"
           :id="`outputs_${node.id}_${name}`"
           @click="outputClick(name)"
           @mouseover="mouseOverPort = `${node.id}_${name}`"
           @mouseleave="mouseOverPort = ''"
      ></div>
      <div class="absolute color-node"
           :style="{top: topLabel(index), left: labelRight()}"
           v-show="mouseOverPort === `${node.id}_${name}`">{{ name }}</div>
    </template>
  </div>
</template>

<script>
  import Drag from "./Drag";
  import js from "./modules/js.vue";
  import pug from "./modules/pug.vue";


  export default {
    name: "Node",
    data() {
      return window.data[0];
    },
    props: {
      node: Object
    },
    methods: {
      verticalPosition(index) {
        let buffer = 5;
        if (index) {
          buffer += 5 * index;
        }
        return 10 * index + buffer;
      },
      top(index) {
        return this.node.position.top + this.verticalPosition(index) + 'px'
      },
      topLabel(index) {
        return this.node.position.top + this.verticalPosition(index) - 6 + 'px'
      },
      inputLeft() {
        return this.node.position.left + "px";
      },
      outputRight() {
        return this.node.position.left + 120 - 5 + 'px'
      },
      labelLeft() {
        return this.node.position.left + 10 + 'px'
      },
      labelRight() {
        return this.node.position.left + 120 + 5 + 'px'
      },
      nodeStyle() {
        // Node Height: calculate height based on max number of ports
        const _ = this._;
        const maxPorts = _.max([_.size(this.node.inputs), _.size(this.node.outputs)]);
        let height = maxPorts * 15;
        if (height < 95 && this.node.symbol) {
          height = 95;
        }
        if (height < 40 && !this.node.symbol) {
          height = 40;
        }
        
        return {
          top: this.node.position.top + "px",
          left: this.node.position.left + "px",
          "min-height": height + "px"
        }
      },
      outputClick(name) {
        Vue.set(this, "addingLink", {
          layer_id: 0,
          node_id: this.node.id,
          port: name
        })
      },
      inputClick(name) {
        if (!Object.keys(this.addingLink).length) {
          return false;
        }
        const id = Object.keys(this.links).length;
        Vue.set(this.links, id, {
          direction: "->",
          source: {
            node: this.addingLink.node_id,
            port: this.addingLink.port
          },
          target: {
            node: this.node.id,
            port: name
          },
          id,
          layer_id: 0
        });
        Vue.set(this, "addingLink", {});
      }
    },
    mounted() {
      const dragHandler = Drag(this.$el.firstChild).in(document.body);
      dragHandler.onDrag(({left, right, top}) => {
        this.node.position = {left, right, top};
      });
    },
    components: { js, pug }
  }
</script>
