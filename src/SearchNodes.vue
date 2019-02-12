<template>
  <div class="fixed w-100 z-1" style="top: 200px;" v-if="show" v-on-clickaway="() => show = false">
    <div class="bg-black-search w-25 br2 center shadow-4">
      <div class="flex flex-column">
        <input type="text" class="w-100 bn br--top br2 center pa2 bb b--configuring-section" style="border-bottom: 1px hsl(220, 2%, 30%) solid" placeholder="Search Nodes">
        <div class="pv2 ph3 near-white pointer search-item o-70" @click="addNode(name)"  v-for="(description, name) in nodes">{{ name }} <span class="o-50">- {{ description }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway';

  export default {
    name: "SearchNodes",
    mixins: [ clickaway ],
    data() {
      return window.search
    },
    methods: {
      addNode: type => window.addNode(type)
    }
  }
</script>
