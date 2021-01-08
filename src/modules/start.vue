<template>
  <div class="tc">
    <button class="button center" v-on:click="start">Fire</button>
  </div>
</template>

<script>
export default {
  name: "start",
  data() {
    return {
      state: {},
      running: true
    }
  },
  props: {
    node: Object
  },
  methods: {
    start() {
      const outputs = engine.outputs[this.node.id];
      outputs.data.put("*");
    }
  },
  destroyed() {
    this.running = false;
  }
}
</script>
