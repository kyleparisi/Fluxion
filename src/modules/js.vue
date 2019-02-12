<template>
  <div></div>
</template>

<script>
  const path = require("path");

  export default {
    name: "js",
    data() {
      return {
        state: {},
        running: true
      }
    },
    props: {
      node: Object
    },
    mounted() {
      const file = localStorage.getItem("file");
      const main = require(path.join(path.dirname(file), "js.js"));
      main.apply(this)
    },
    destroyed() {
      this.running = false;
    }
  }
</script>
