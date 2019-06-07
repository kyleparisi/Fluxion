<template>
  <div class="pa2">
  </div>
</template>

<script>
  const session = require("express-session");
  const DynamoDBStore = require("connect-dynamodb")({ session: session });
  const RedisStore = require("connect-redis")(session);

  // memory
  function memory() {
    return session({
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: true
    });
  }

  function dynamodb() {
    const options = {};
    return session({
      store: new DynamoDBStore(options),
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: true
    });
  }


  // redis
  function redis() {
    return session({
      store: new RedisStore({
        host: process.env.REDIS_HOST
      }),
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: true
    });
  }

  const storage = {
    memory,
    redis,
    dynamodb
  };

  export default {
    name: "session",
    data() {
      return {}
    },
    props: {
      node: Object
    },
    mounted() {
      const outputs = engine.outputs[this.node.id];
      const driver = storage[this.node.selected]();
      const port = this._.get(outputs, this.node.selected, false);
      if (driver && port) {
        port.put(driver);
      }
    }
  }
</script>
