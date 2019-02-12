<template>
  <div class="w-100 tc">
    <div>{{ message }}</div>
    <div>
      <button class="button" @click="newProject">New Project</button>
      <button class="button" @click="openProject">Open Project</button>
    </div>
  </div>
</template>

<script>
  const NewProject = require("./Menus/New");
  const OpenProject = require("./Menus/Open");

  export default {
    name: "Message",
    props: {
      message: String
    },
    methods: {
      newProject: function() {
        NewProject();
      },
      openProject: function() {
        OpenProject();
      }
    }
  };
</script>
