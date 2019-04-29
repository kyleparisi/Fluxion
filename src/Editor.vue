<template>
  <div :style="editorStyle" class="fixed left-0 bottom-0 fw6 w-100" v-if="configuring.module">
    <div ref="rowResize" class="absolute top-0 left-0 w-100 row-resize z-1" style="height: 4px"></div>
    <codemirror
      :style="{ height: '100%' }"
      v-model="nodes[configuring.id].run"
      v-if="nodes[configuring.id].run !== undefined"
      :options="{ theme: 'dracula', mode: 'javascript' }"
    ></codemirror>
    <codemirror
      :style="{ height: '100%' }"
      v-model="nodes[configuring.id].template"
      v-if="nodes[configuring.id].template !== undefined"
      :options="{ theme: 'dracula', mode: 'pug' }"
    ></codemirror>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/pug/pug.js";
import Drag from "./Drag";

export default {
  name: "Editor",
  data() {
    return window.data[0];
  },
  props: {
    editorStyle: Object
  },
  mounted() {
    const dragHandler = Drag(this.$refs.rowResize).in(document.body);
    dragHandler.onDrag(({mouse}) => {
      const height = window.innerHeight - mouse.pageY;
      if (height >= 50 && height <= window.innerHeight - 100) {
        this._.set(this, "editor.height", height);
      }
    });
  },
  components: { codemirror }
};
</script>
