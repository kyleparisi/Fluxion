<template>
  <div class="absolute bg-white">
    <div>
      <input v-model="node.src" class="input w-100">
      <div class="absolute w1 dim pointer top-0 right-1" @click="$refs.webview.reload()">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-ccw"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
      </div>
      <div class="absolute w1 dim pointer top-0 right-0" @click="node.src = ''">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
      </div>
    </div>
    <div :style="{height: _.get(node, 'style.height')}">
      <webview ref="webview" class="h-100" :src="node.src" :style="{width: _.get(node, 'style.width')}"></webview>
    </div>
  </div>
</template>

<script>
  export default {
    name: "WebViewNode",
    data() {
      return {}
    },
    props: {
      node: Object
    },
    mounted() {
      this.$refs.webview.addEventListener("dom-ready", () => {
        this.$refs.webview.executeJavaScript(this.node.run).then(data => {
          const outputs = engine.outputs[this.node.id];
          if (outputs && outputs.data) {
            outputs.data.put(data);
          }
        })
      })
    }
  }
</script>
