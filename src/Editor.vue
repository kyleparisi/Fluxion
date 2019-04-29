<template>
  <div class="fixed left-0 bottom-0 fw6 w-100" v-if="configuring.module">
    <codemirror
      :style="{ height: '400px' }"
      v-model="nodes[configuring.id].run"
      v-if="nodes[configuring.id].run !== undefined"
      :options="{ theme: 'dracula', mode: 'javascript' }"
    ></codemirror>
    <codemirror
      :style="{ height: '400px' }"
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

export default {
  name: "Editor",
  data() {
    return window.data[0];
  },
  components: { codemirror }
};
</script>
