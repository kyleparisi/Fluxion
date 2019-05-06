<template>
  <div class="overflow-auto" style="height: 600px;">
    <div :key="key" v-for="(stocks, key) in list">
      <div v-for="(stock, symbol) in stocks">
        <chartjs :labels="_.keys(stock.live)" :datasets="datasets(stock)" :title="symbol + ':' + key"></chartjs>
      </div>
    </div>
  </div>
</template>

<script>
  import Chartjs from "./chartjs";
  export default {
    components: { Chartjs },
    data() {
      return {
        list: {}
      }
    },
    props: {
      node: Object
    },
    methods: {
      datasets: function(data) {
        const datasets = [];
        this._.forEach(data, function(value, key) {
          if (key === "diff") {
            return true;
          }
          if (key === "live") {
            datasets.push({
              label: key,
              backgroundColor: '#f89fa2',
              data: value
            });
            return true;
          }
          datasets.unshift({
            label: key,
            data: value
          })
        });
        return datasets;
      }
    },
    mounted () {
      if (!engine.inputs[this.node.id]) return false;
      engine.inputs[this.node.id].data.take().then(closings => {
        this.list = closings;
      });
    }
  }
</script>
