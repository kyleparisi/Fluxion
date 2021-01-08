<template>
  <div class="node absolute ba br2 color-node flex flex-column"
       :class="{'bg-color-node shadow-1': configuring.id === node.id, 'bg-black-node': configuring.id !== node.id, 'b--orange': problem[node.id], 'b--color-node': !problem[node.id], 'flex-column': node.symbol }"
       :style="nodeStyle()"
       v-on:dblclick="configuring = configuring.id === node.id ? {} : node">
    <div class="tc w-100 pv2 ph3" v-if="node.symbol"><img class="w-50" :src="node.symbol"></div>
    <div class="tc mw5 pv1 ph3 center">{{ node.name }}</div>

    <component class="w-100 pa1" v-bind:is="node.module" :node="node"></component>

    <!-- Inputs -->
    <template v-for="(_, name, index) in node.inputs">
      <div class="absolute" :style="{top: top(index), left: 0}">
        <!-- Port -->
        <div class="absolute port pointer bg-green white br-100"
             :id="`inputs_${node.id}_${name}`"
             @click="inputClick(name)"
             @mouseover="mouseOverPort = `${node.id}_${name}`"
             @mouseleave="mouseOverPort = ''"
        ></div>
        <!-- Port Label -->
        <div class="absolute color-node"
             :style="{top: '-5px', right: '4px'}"
             v-show="mouseOverPort === `${node.id}_${name}`">{{ name }}</div>
      </div>
    </template>

    <!-- Outputs -->
    <template v-for="(_, name, index) in node.outputs">
      <!-- Port -->
      <div class="absolute" :style="{top: top(index), right: 0}">
        <div class="absolute right-0 port pointer bg-green br-100"
             :id="`outputs_${node.id}_${name}`"
             @click="outputClick(name)"
             @mouseover="mouseOverPort = `${node.id}_${name}`"
             @mouseleave="mouseOverPort = ''"
        ></div>
        <!-- Port Label -->
        <div class="absolute color-node"
             :style="{top: '-5px', left: '4px'}"
             v-show="mouseOverPort === `${node.id}_${name}`">{{ name }}</div>
      </div>
    </template>
  </div>
</template>

<script>
  import Drag from "./Drag";
  import js from "./modules/js.vue";
  import pug from "./modules/pug.vue";
  import chartjs from "./modules/chartjs.vue";
  import fileInput from "./modules/file-input.vue";
  import webviewnode from "./modules/webviewnode.vue";
  import start from "./modules/start.vue";

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
          buffer += 10 * index;
        }
        return buffer;
      },
      top(index) {
        return this.verticalPosition(index) + 'px'
      },
      topLabel(index) {
        return this.verticalPosition(index) + 'px'
      },
      inputLeft() {
        return this.node.position.left + "px";
      },
      outputRight() {
        return this.node.position.left + _.get(this.node, "style.width", 120) - 5 + 'px'
      },
      labelLeft() {
        return this.node.position.left + 10 + 'px'
      },
      labelRight() {
        console.log(this.node.position.right + 10 + 'px');
        return this.node.position.right + 'px'
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
          ...this.node.style,
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
        const ids = Object.keys(this.links);
        const id = ids.length ? parseInt(ids[ids.length - 1]) + 1 : 0;
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
      const dragHandler = Drag(this.$el).in(document.body);
      dragHandler.onDrag(({left, right, top}) => {
        this.node.position = {left, right, top};
      });
    },
    components: { js, pug, chartjs, fileInput, webviewnode, start }
  }
</script>
