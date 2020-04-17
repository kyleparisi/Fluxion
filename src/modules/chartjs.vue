<template>
  <div class="overflow-auto" style="max-height: 600px;">
    <div :key="key" v-for="(item, key) in list">
      <chartjs-line :data="item"></chartjs-line>
    </div>
  </div>
</template>

<script>
  import ChartjsLine from "./chartjs-line";
  export default {
    components: { ChartjsLine },
    data() {
      return {
        list: {}
      }
    },
    props: {
      node: Object
    },
    mounted () {
      if (!engine.inputs[this.node.id]) return false;
      engine.inputs[this.node.id].data.take().then(packet => {
        if (!Array.isArray(packet)) {
          packet = [packet]
        }
        Vue.set(this, "list", packet);
      });
    }
  }
</script>
