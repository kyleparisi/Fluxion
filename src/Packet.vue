<template>
  <g>
    <circle r="3" fill="hsl(0, 100%, 50%)" ref="packet" :style="packetStyle"></circle>
  </g>
</template>

<script>
  export default {
    name: "Packet",
    data() {
      return window.data[0];
    },
    props: {
      link: Object
    },
    mounted() {
      const removePacket = () => {
        this.$refs.packet.removeEventListener("webkitAnimationEnd", removePacket);
        Vue.delete(this.packets, this.link.id)
      };
      this.$refs.packet.addEventListener("webkitAnimationEnd", removePacket);
    },
    computed: {
      packetStyle: function() {
        return {
          offsetPath: `path("${this.packets[this.link.id].d}")`,
          motionRotation: "reverse",
          animation: this.packets[this.link.id].direction + " 0.4s linear"
        }
      }
    }
  }
</script>
