module.exports = function() {
  return new Proxy(
    {
      takes: [],
      puts: []
    },
    {
      get: function(obj, prop) {
        if (prop === "take") {
          // if puts ready (upstream)
          if (obj.puts.length) {
            return () => obj.puts.shift();
          }
          // no puts ready (might happen downstream)
          let ref;
          const prom = new Promise(resolve => (ref = resolve));
          obj.takes.push(ref);
          return () => prom;
        }
        if (prop === "put") {
          // if takes ready (upstream)
          if (obj.takes.length) {
            return obj.takes.shift();
          }
          // no takes ready (might happen downstream);
          const fn = data => {
            obj.puts.push(new Promise(resolve => resolve(data)));
          };
          return fn;
        }
      }
    }
  );
};
