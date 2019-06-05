<template>
  <div class="pa2">
    <div class="pa2">
      <label for="client_id">Client Id</label>
      <input class="input" v-model="client_id" id="client_id" placeholder="client_id">
    </div>

    <div class="pa2">
      <label for="client_secret">Client Secret</label>
      <input type="password" v-model="client_secret" class="input" id="client_secret" placeholder="client_secret">
    </div>

    <div class="pa2">
      <label for="callback_url">Callback URL</label>
      <input class="input" v-model="callback_url" id="callback_url" placeholder="http://localhost:3000/callback">
    </div>
  </div>
</template>

<script>
  export default {
    name: "google",
    data() {
      return {
        client_id: "",
        client_secret: "",
        callback_url: ""
      }
    },
    props: {
      node: Object
    },
    mounted() {

    }
  }
</script>
