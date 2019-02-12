<template>
  <div></div>
</template>

<script>
  export default {
    name: "pug",
    data() {
      return {}
    },
    props: {
      node: Object
    },
    mounted() {
      const outputs = engine.outputs[this.node.id];
      outputs.data.put(this.node.template);
    }
  }
</script>
