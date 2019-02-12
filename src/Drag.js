try {
  if (document) {
  }
} catch (e) {
  throw new Error("Drag module only works in browsers");
}

const Drag = function(view) {
  let documentation = `
# Usage

\`Drag([HTMLElement] view).in([HTMLElement] document.body)\` -> draghandler

For side affect changes:

draghandler
    .onDrag([Function] fn)

`;
  if (!view) {
    console.warn("No view defined for drag handler");
    return;
  }

  let handler = {
    get: (state, key) => {
      if (key === "endDrag") {
        delete state.drag;
        if (state.dragging) {
          delete state.dragging;
        }
        return state;
      }

      if (key === "state") {
        return state;
      }

      return state[key];
    },
    set: function(state, property, value) {
      if (property === "mouse") state.mouse = value;

      let valid = [true];
      if (property === "dragging") {
        state.dragging = value;

        // if dragging is not an array, make it an array
        if (!(state.dragging instanceof Array))
          state.dragging = new Array(state.dragging);

        // validate all the entries
        valid = state.dragging.map(currentValue => {
          if (
            !(currentValue instanceof HTMLElement) &&
            !(currentValue instanceof SVGElement)
          ) {
            console.error(
              "Dragging property is not an HTMLElement",
              currentValue
            );
            return false;
          }
        });

        // establish all the initial positions for the drag
        state.drag = state.dragging.map(currentValue => {
          return {
            startX: view.offsetLeft,
            startY: view.offsetTop,
            startMouseX: state.mouse.clientX,
            startMouseY: state.mouse.clientY
          };
        });
      }

      // conduct modifications of elements
      if (property === "mouse" && state.dragging && valid[0]) {
        state.dragging.map((currentValue, index) => {
          // amount traveled
          state.drag[index].dx = value.clientX - state.drag[index].startMouseX;
          state.drag[index].dy = value.clientY - state.drag[index].startMouseY;

          state.left = state.drag[index].startX + state.drag[index].dx;
          state.styleLeft = state.left + "px";
          state.right =
            state.left + Math.round(currentValue.getBoundingClientRect().width);
          state.styleRight = state.right + "px";
          state.top = state.drag[index].startY + state.drag[index].dy;
          state.styleTop = state.top + "px";
        });

        state.onDrag();
      }

      return state;
    }
  };

  let cbs = [];
  let state = {
    documentation: documentation,
    in: function(boundry) {
      boundry.addEventListener("mousemove", e => (proxy.mouse = e));
      return this;
    },
    onDrag: function(cb) {
      if (cb) {
        cbs.push(cb);
        return false;
      }
      cbs.map(callback => {
        callback(state);
      });
    }
  };
  let proxy = new Proxy(state, handler);

  view.onmousedown = e => {
    proxy.dragging = e.target;
  };
  view.onmouseup = () => proxy.endDrag;
  return proxy;
};

// allow to be used as common js module for browserify, etc.
try {
  module.exports = Drag;
} catch (e) {}
