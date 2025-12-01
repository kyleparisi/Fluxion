<template>
  <div>
    <div id="app" class="h-100 bg-black-passive" :style="panning">
      <div class="absolute top-0 left-0" :style="app.style">
        <svg :style="app.svgStyle" v-on:dblclick="configuring = {}">
          <marker
                  id="circle"
                  markerWidth="4"
                  markerHeight="4"
                  refX="2"
                  refY="2"
          >
            <circle cx="2" cy="2" r="2" stroke="none" fill="#c3fdff"></circle>
          </marker>
          <AddingLink
                  :sourceX="nodes[addingLink.node_id].position.right"
                  :sourceY="nodes[addingLink.node_id].position.top"
                  :sourcePortId="Object.keys(nodes[addingLink.node_id].outputs).indexOf(addingLink.port)"
                  :app="app"
                  :adding-link="addingLink"
                  v-if="Object.keys(addingLink).length"
          ></AddingLink>
          <Link :link="link"
                :sourceX="nodes[link.source.node].position.right"
                :sourceY="nodes[link.source.node].position.top"
                :targetX="nodes[link.target.node].position.left"
                :targetY="nodes[link.target.node].position.top"
                v-for="link in links"></Link>
          <Packet :link="link" v-for="link in links" v-if="packets[link.id]"></Packet>
        </svg>

        <Node :node="node" v-for="node in nodes"></Node>

        <WebViewNode v-if="webview && webview.src"></WebViewNode>

      </div>
    </div>

    <div class="fixed-center ba br1 pa3 Code" v-show="!_.size(nodes)">
      Ctrl+N to make a new node.
    </div>

    <div>
      <Configuration v-if="configuring.module"></Configuration>

      <Editor :editorStyle="{height: _.get(editor, 'height', 300) + 'px', width: getWidth()}" v-if="configuring.module"></Editor>

      <SearchNodes></SearchNodes>

      <AINodeCreator ref="aiNodeCreator"></AINodeCreator>

      <div class="fixed left-1 bottom-1 gray z-2 flex items-center">
        <label class="mr2 f7">Throttle (s):</label>
        <input
          type="number"
          v-model.number="throttle"
          min="0"
          max="60"
          step="0.1"
          class="bg-black-80 near-white ba b--gray br2 pa1 w3 tc"
          style="font-size: 12px;"
        >
      </div>

      <div class="fixed right-1 bottom-1 gray z-2" v-if="Object.keys(selectedLinks).length">
        <div class="flex items-center">
          <div class="pointer orange" @click="addLoggingToLinks">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          </div>
          <div class="pointer" @click="addLoggingToLinks">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mic-off"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Node from "./Node";
  import AddingLink from "./AddingLink";
  import Link from "./Link";
  import Packet from "./Packet";
  import Configuration from "./Configuration";
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/pug/pug.js'
  import SearchNodes from './SearchNodes';
  import Drag from "./Drag";
  import Editor from "./Editor";
  import AINodeCreator from "./AINodeCreator";

  module.exports = {
    data() {
      return window.data[0];
    },
    computed: {
      panning() {
        return {transform: `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`}
      }
    },
    mounted() {
      const dragHandler = Drag(document.getElementById("root")).in(document.body);
      dragHandler.onDrag(state => {
        if (state.dragging[0] instanceof SVGElement || state.dragging[0].id === "root") {
          this.pan.x += state.mouse.movementX;
          this.pan.y += state.mouse.movementY;
        }
      });
    },
    methods: {
      addLoggingToLinks() {
        Object.keys(this.selectedLinks).map(key => {
          this.links[key].logging = !this.links[key].logging;
        });
        this.selectedLinks = {};
      },
      getWidth() {
        return document.body.clientWidth - 300 + "px"
      }
    },
    components: { Node, AddingLink, Link, Packet, Configuration, Editor, SearchNodes, AINodeCreator }
};
</script>