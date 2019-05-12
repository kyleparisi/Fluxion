<template>
  <g>
    <path
      :d="d"
      :style="app.linkStyle"
      markerStart="url(#circle)"
      markerEnd="url(#circle)"
      class="stroke-blue pointer"
      id="thePath"
    ></path>
    <path
      :d="d"
      :style="app.linkOverlapStyle"
      class="pointer"
      id="overlapPath"
    ></path>
  </g>
</template>

<script>
module.exports = {
  name: "AddingLink",
  props: {
    app: Object,
    addingLink: Object,
    sourcePortId: Number,
    sourceX: Number,
    sourceY: Number
  },
  data() {
    return { mouse: window.mouse };
  },
  methods: {
    verticalPosition(index) {
      const buffer = 8;
      return 10 * index + buffer;
    }
  },
  computed: {
    d: function() {
      const n = 50;
      const start = {
        x: this.sourceX,
        y: this.sourceY + this.verticalPosition(this.sourcePortId)
      };
      const handle = {
        start: {
          x: this.sourceX + n,
          y: this.sourceY + this.verticalPosition(this.sourcePortId)
        },
        end: {
          x: this.mouse.x - n,
          y: this.mouse.y
        }
      };
      const end = {
        x: this.mouse.x,
        y: this.mouse.y
      };

      // line is too short, just do a straight line
      if (handle.start.x > handle.end.x) {
        return `M ${start.x},${start.y} L ${end.x},${end.y}`;
      }

      return `M${start.x},${start.y} C${handle.start.x},${handle.start.y} ${
        handle.end.x
      },${handle.end.y} ${end.x},${end.y}`;
    }
  }
};
</script>
