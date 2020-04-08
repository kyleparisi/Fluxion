<template>
  <div>
    <input
      type="file"
      @change="filesChange($event.target.files)"
      class="file-input"
    />
  </div>
</template>

<script>
export default {
  name: "file-input",
  data() {
    return {};
  },
  props: {
    node: Object
  },
  methods: {
    filesChange(files) {
      if (!files.length) return;
      const reader = new FileReader();
      reader.addEventListener("load", e => {
        const data = e.target.result;
        const outputs = engine.outputs[this.node.id];
        outputs.data.put(data);
      });
      reader.readAsBinaryString(files[0]);
    }
  }
};
</script>
