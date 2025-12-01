<template>
  <div class="fixed w-100 h-100 z-999" style="top: 0; left: 0; background: rgba(0,0,0,0.7);" v-if="show" v-on-clickaway="close">
    <div class="bg-black-search w-50 br2 center shadow-4 mt5 pa3">
      <div class="flex flex-column">
        <div class="near-white mb2 f5">Create Node with AI</div>
        <textarea
          v-model="prompt"
          placeholder="Describe the node you want to create...&#10;&#10;Example: A node that takes two numbers as inputs (a and b) and outputs their sum"
          class="w-100 bg-black-80 near-white ba b--gray br2 pa2 mb2"
          rows="4"
          style="resize: vertical; font-size: 13px;"
          :disabled="loading"
          @keydown.meta.enter="create"
          @keydown.ctrl.enter="create"
        ></textarea>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <button
              class="button ph3 pv2 mr2"
              :disabled="loading || !prompt.trim()"
              @click="create"
            >
              {{ loading ? 'Creating...' : 'Create Node' }}
            </button>
            <button class="button ph3 pv2 bg-gray" @click="close">Cancel</button>
          </div>
          <span v-if="error" class="red f7">{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { generateText } = require("ai");
const { createAnthropic } = require("@ai-sdk/anthropic");
import { mixin as clickaway } from 'vue-clickaway';

export default {
  name: "AINodeCreator",
  mixins: [clickaway],
  data() {
    return {
      show: false,
      prompt: "",
      loading: false,
      error: ""
    };
  },
  methods: {
    open() {
      this.show = true;
      this.prompt = "";
      this.error = "";
    },
    close() {
      this.show = false;
      this.prompt = "";
      this.error = "";
    },
    async create() {
      if (!this.prompt.trim() || this.loading) return;

      this.loading = true;
      this.error = "";

      try {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
          throw new Error("ANTHROPIC_API_KEY not set in .env");
        }

        const anthropic = createAnthropic({ apiKey });

        const systemPrompt = `You are a code generator for Fluxion, a flow-based visual programming environment.
Your task is to generate a node configuration based on the user's description.

A node has:
- name: A short display name for the node
- inputs: An object where keys are input port names (use camelCase), values are always true
- outputs: An object where keys are output port names (use camelCase), values are always true
- run: JavaScript code that processes inputs and produces outputs
- require: Any require() statements needed (optional)

The code in "run" has access to:
- inputs: Object with input channels. Data is automatically awaited, so each input name becomes a const variable.
- outputs: Object with output channels. Use outputs.portName.put(value) to send data.

IMPORTANT RULES FOR THE CODE:
1. Input variables are automatically created from await inputs.portName.take(), so just use the input names directly as variables.
2. Use outputs.portName.put(value) to send results.
3. Keep code simple and focused on the task.
4. Do not use await for inputs - they are auto-awaited.

Example for "add two numbers a and b":
{
  "name": "add",
  "inputs": {"a": true, "b": true},
  "outputs": {"sum": true},
  "run": "outputs.sum.put(a + b);",
  "require": ""
}

Example for "fetch URL and output JSON":
{
  "name": "fetch",
  "inputs": {"url": true},
  "outputs": {"data": true, "error": true},
  "run": "try {\\n  const res = await fetch(url);\\n  const json = await res.json();\\n  outputs.data.put(json);\\n} catch(e) {\\n  outputs.error.put(e.message);\\n}",
  "require": ""
}

Respond with ONLY valid JSON, no explanation or markdown.`;

        const { text } = await generateText({
          model: anthropic("claude-sonnet-4-20250514"),
          system: systemPrompt,
          prompt: this.prompt
        });

        // Parse the response
        let config;
        try {
          // Try to extract JSON from the response
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            config = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("No JSON found in response");
          }
        } catch (e) {
          throw new Error("Failed to parse AI response: " + e.message);
        }

        // Validate required fields
        if (!config.name || !config.inputs || !config.outputs || !config.run) {
          throw new Error("Invalid node config: missing required fields");
        }

        // Create the node
        this.createJsNode(config);
        this.close();

      } catch (e) {
        console.error("AI Node Creator error:", e);
        this.error = e.message || "Failed to create node";
      } finally {
        this.loading = false;
      }
    },
    createJsNode(config) {
      const layer = window.current.layer;
      const nodes = window.data[layer].nodes;
      const nodeIds = Object.keys(nodes);
      const id = (Number(nodeIds[nodeIds.length - 1]) || 0) + 1;

      const newNode = {
        module: "js",
        name: config.name || "ai-node",
        inputs: config.inputs || {},
        outputs: config.outputs || {},
        run: config.run || "",
        require: config.require || "",
        id,
        layer_id: layer,
        position: {
          top: -window.data[0].pan.y + 50,
          left: -window.data[0].pan.x + 50,
          right: 130
        }
      };

      Vue.set(window.data[layer].nodes, id, newNode);
    }
  },
  mounted() {
    // Listen for the menu event
    window.aiNodeCreator = this;
  }
};
</script>
