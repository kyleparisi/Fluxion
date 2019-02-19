<template>
  <g>
    <path
            :d="d"
            :style="app.linkStyle"
            :class="{'stroke-red': selectedLinks[link.id],
              'stroke-blue': !selectedLinks[link.id] && !link.logging,
              'stroke-orange': !selectedLinks[link.id] && link.logging}"
            markerStart="url(#circle)"
            markerEnd="url(#circle)"
            class="pointer"
            id="thePath"
    ></path>
    <path
            :d="d"
            :style="app.linkOverlapStyle"
            class="pointer"
            id="overlapPath"
            @click="selectLink"
    ></path>
  </g>
</template>

<script>

  import Sleep from "./Sleep";
  const Channel = require("./Channel");

  // const link = {
  //   "direction": "->",
  //   "source": {
  //     "node": "7a5d6030-09f8-11e9-a652-69f737f545b0",
  //     "port": "request"
  //   },
  //   "target": {
  //     "node": "fdff09c0-09f8-11e9-96c1-0118b407cc1e",
  //     "port": "request"
  //   },
  //   "id": "8446b3c0-09fe-11e9-a9c0-c3d13ea80578",
  //   "layer_id": 0
  // }
  export default {
    name: "Link",
    data() {
      return window.data[0];
    },
    props: {
      link: Object,
      sourceX: Number,
      sourceY: Number,
      targetX: Number,
      targetY: Number
    },
    methods: {
      verticalPosition(index) {
        let buffer = 2.5;
        if (index) {
          buffer += 5 * index;
        }
        return 10 * index + buffer + 5;
      },
      selectLink() {
        if (this.selectedLinks[this.link.id]) {
          Vue.delete(this.selectedLinks, this.link.id);
          return false;
        }
        Vue.set(this.selectedLinks, this.link.id, this.link)
      }
    },
    computed: {
      d: function () {
        // get port index
        const { source, target } = this.link;
        let source_port_id = Object.keys(this.nodes[source.node].outputs).indexOf(
          source.port
        );
        let target_port_id = Object.keys(this.nodes[target.node].inputs).indexOf(
          target.port
        );

        const n = 50;
        const start = {
          x: this.sourceX,
          y: this.sourceY + this.verticalPosition(source_port_id)
        };
        const handle = {
          start: {
            x: this.sourceX + n,
            y: this.sourceY + this.verticalPosition(source_port_id)
          },
          end: {
            x: this.targetX - n,
            y: this.targetY + this.verticalPosition(target_port_id)
          }
        };
        const end = {
          x: this.targetX,
          y: this.targetY + this.verticalPosition(target_port_id)
        };

        // line is too short, just do a straight line
        if (handle.start.x > handle.end.x) {
          return `M ${start.x},${start.y} L ${end.x},${end.y}`
        }

        return `M${start.x},${start.y} C${handle.start.x},${handle.start.y} ${handle
          .end.x},${handle.end.y} ${end.x},${end.y}`;
      }
    },
    mounted() {
      const input = new Channel();
      const output = new Channel();
      const { source, target, direction = "->" } = this.link;

      // animation of packet, one direction
      if (direction === "->") {
        async function leftToRightmiddleware() {
          let outputData = await output.take();

          Vue.set(this.packets, this.link.id, {
            direction: "right",
            link_id: this.link.id,
            d: this.d
          });
          // await Sleep(1000);

          if (this.link.logging) {
            console.log(outputData);
          }
          input.put(outputData);

          leftToRightmiddleware.call(this).catch(() => {});
        }

        leftToRightmiddleware.call(this).catch(console.log);
      }

      // output side of link
      if (typeof engine.outputs[source.node] !== "undefined" &&
          typeof engine.outputs[source.port] !== "undefined"
      ) {
        // fork channel
        const pipe = new Channel();
        const originalChan = engine.outputs[source.node][source.port];
        (async () => {
          while (pipe) {
            const data = await pipe.take();
            originalChan.put(data);
            output.put(data);
          }
        })();
        engine.outputs[source.node][source.port] = pipe;
      } else {
        // new channel
        engine.outputs[source.node] = engine.outputs[source.node] || {};
        engine.outputs[source.node][source.port] = output;
      }

      // input side of link
      if (typeof engine.inputs[target.node] !== "undefined" &&
          typeof engine.inputs[target.port] !== "undefined"
      ) {
        const newChannel = new Channel();
        const originalChannel = engine.inputs[target.node][target.port];
        engine.inputs[target.node][target.port] = newChannel;

        (async () => {
          const data = await originalChannel.take();
          engine.inputs[target.node][target.port].put(data);
        })();
        (async () => {
          const data = await input.take();
          engine.inputs[target.node][target.port].put(data);
        })();
      } else {
        // new channel
        engine.inputs[target.node] = engine.inputs[target.node] || {};
        engine.inputs[target.node][target.port] = input;
      }
    },
    destroyed() {
      const { source, target } = this.link;
      delete engine.inputs[target.node];
      delete engine.outputs[source.node];
    }
  }
</script>

<style scoped>

</style>