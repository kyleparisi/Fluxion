<template>
  <div class="shadow-3 fixed top-0 right-0 z-1 white bg-black-active system-sans-serif h-100" style="width: 300px; padding: 3px; font-size: 12px;">
    <!-- Header -->
    <div class="flex items-center pb2">
      <div class="w-third"></div>
      <div class="w-third tc">{{ nodes[configuring.id].name }}</div>
      <div class="w-third tr">
        <div class="dib pointer dim" style="width: 18px" @click="configuring = {}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 mr-4 icon-close-circle"><circle cx="12" cy="12" r="10" class="primary"></circle><path class="secondary" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"></path></svg>
        </div>
      </div>
    </div>

    <!-- Name -->
    <div class="pb2">
      <div class="pa1 mb2 b--configuring-section ba bg-black-section-title">Node</div>
      <div class="flex flex-column">
        <div class="w-100 pb2">
          <label>Name</label>
          <input @keyup.enter="updateName" v-model="configuring.name" class="input w-100">
        </div>
        <div class="w-100 pb2">
          <label>Symbol</label>
          <input @keyup.enter="updateSymbol" v-model="configuring.symbol" class="input w-100">
        </div>
        <div class="w-100 tr">
          <button class="button" @click="updateName();updateSymbol()">Update</button>
        </div>
      </div>
    </div>

    <!-- Inputs -->
    <div class="pb2">
      <div class="pa1 b--configuring-section ba bg-black-section-title">Inputs</div>
      <div class="flex items-center hover-row" v-for="(_, name) in nodes[configuring.id].inputs">
        <div class="w-50">{{ name }}</div>
        <div class="w-50 tr">
          <div class="dib pointer dim" style="width: 24px" @click="removeInput(name)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="white icon-close"><path class="secondary" fill-rule="evenodd" d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"></path></svg></div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-75">
          <input class="input" @keyup.enter="addInput" v-model="configuring.newInput" placeholder="port name">
        </div>
        <div class="w-25 tc">
          <button class="button" @click="addInput">Add</button>
        </div>
      </div>
    </div>

    <!-- Outputs -->
    <div class="pb2">
      <div class="pa1 b--configuring-section ba bg-black-section-title">Outputs</div>
      <div class="flex items-center hover-row" v-for="(_, name) in nodes[configuring.id].outputs">
        <div class="w-50">{{ name }}</div>
        <div class="w-50 tr">
          <div class="dib pointer dim" style="width: 24px" @click="removeOutput(name)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="white icon-close"><path class="secondary" fill-rule="evenodd" d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"></path></svg></div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-75">
          <input class="input" @keyup.enter="addOutput" v-model="configuring.newOutput" placeholder="port name">
        </div>
        <div class="w-25 tc">
          <button class="button" @click="addOutput">Add</button>
        </div>
      </div>
    </div>

    <div class="pb2" v-if="nodes[configuring.id].run !== undefined">
      <div class="pa1 b--configuring-section ba bg-black-section-title">Requirements</div>
      <codemirror :style="{height: '50px'}" class="fw6" v-model="nodes[configuring.id].require" :options="{theme: 'dracula', mode: 'javascript'}"></codemirror>
    </div>

    <div class="pb2" v-if="nodes[configuring.id].configuration !== undefined">
      <div class="pa1 b--configuring-section ba bg-black-section-title">Configuration</div>
      <div class="flex flex-column">
        <template v-for="(_, name) in nodes[configuring.id].configuration">
          <div class="pb2">
            <label>{{ name }}</label>
            <input :type="nodes[configuring.id].protectedConfiguration[name] ? 'password' : 'text'"
                   class="input"
                   v-model="nodes[configuring.id].configuration[name]"
                   :placeholder="name">
          </div>
        </template>
      </div>
    </div>

    <div class="pb2">
      <div class="pa1 mb2 b--configuring-section ba bg-black-section-title">Delete Node</div>
      <div class="flex flex-column">
        <div class="w-100 tr">
          <button class="button" @click="deleteNode">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { codemirror } from 'vue-codemirror';

  export default {
    name: "Configuration",
    data() {
      return window.data[0]
    },
    methods: {
      removeInput(port) {
        Vue.delete(this.nodes[this.configuring.id].inputs, port);
        // find all links with targets to the port and remove the link
        const links = this._.map(this.links, link => {
          // console.log(link.target.node === this.configuring.id, )
          if (link.target.node === this.configuring.id &&
              link.target.port === port) {
            return link.id;
          }
        });
        links.map(id => Vue.delete(this.links, id));
        Vue.delete(this.configuring.inputs, port);
      },
      removeOutput(port) {
        Vue.delete(this.nodes[this.configuring.id].outputs, port);
        // find all links with sources to the port and remove the link
        const links = this._.map(this.links, link => {
          // console.log(link.target.node === this.configuring.id, )
          if (link.source.node === this.configuring.id &&
            link.source.port === port) {
            return link.id;
          }
        });
        links.map(id => Vue.delete(this.links, id));
        Vue.delete(this.configuring.outputs, port);
      },
      addOutput() {
        let newOutput = this.configuring.newOutput;
        if (!newOutput) {
          return false;
        }
        Vue.set(this.nodes[this.configuring.id].outputs, newOutput, true);
        delete this.configuring.newOutput;
      },
      addInput() {
        let newInput = this.configuring.newInput;
        if (!newInput) {
          return false;
        }
        Vue.set(this.nodes[this.configuring.id].inputs, newInput, true);
        delete this.configuring.newInput;
      },
      updateName() {
        Vue.set(this.nodes[this.configuring.id], 'name', this.configuring.name);
      },
      updateSymbol() {
        Vue.set(this.nodes[this.configuring.id], 'symbol', this.configuring.symbol);
      },
      deleteNode() {
        // scan links for deletion
        this._.each(this.links, link => {
          if (link.target.node === this.configuring.id) {
            Vue.set(this.selectedLinks, link.id, link);
          }
          if (link.source.node === this.configuring.id) {
            Vue.set(this.selectedLinks, link.id, link);
          }
        });
        window.removeLink();
        const id = this.configuring.id;
        Vue.set(this, "configuring", {});
        Vue.delete(this.nodes, id);
      }
    },
    components: { codemirror }
  }
</script>
