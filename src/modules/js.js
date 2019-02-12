function main() {
  if (!this.node.run) {
    return false;
  }
  const inputs = engine.inputs[this.node.id];
  const outputs = engine.outputs[this.node.id];
  const problem = (e) => {
    Vue.set(window.data[window.current.layer].problem, this.node.id, {});
  };

  let run = "";
  if (this.node.run.indexOf('await inputs') !== -1 || this.node.run.indexOf('await outputs') !== -1) {
    run = `while(this.running) {
    ${this.node.run}
    }`;
  } else {
    run = this.node.run;
  }

  eval(`/* ${this.node.name} */
(async () => {
${this.node.require || ""}
try {
  ${run}
} catch(e) {
  console.log(e);
  problem(e);
}
})()`);
}

module.exports = main;
