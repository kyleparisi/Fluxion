<template>
  <div class="pa2">
    <div class="pa2">
      <label for="client_id">Client Id</label>
      <input class="input" v-model="node.clientID" id="client_id" placeholder="client_id">
    </div>

    <div class="pa2">
      <label for="client_secret">Client Secret</label>
      <input type="password" v-model="node.clientSecret" class="input" id="client_secret" placeholder="client_secret">
    </div>

    <div class="pa2">
      <label for="callback_url">Callback URL</label>
      <input class="input" v-model="node.callbackURL" id="callback_url" placeholder="/auth/google/callback">
    </div>
  </div>
</template>

<script>
  const passport = require("passport");
  const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
  const express = require("express");
  const router = express.Router();

  export default {
    name: "google",
    props: {
      node: Object
    },
    mounted() {
      const config = {
        clientID: this.node.clientID,
        clientSecret: this.node.clientSecret,
        callbackURL: this.node.callbackURL
      };
      const strategy = new GoogleStrategy(config, function(
        token,
        tokenSecret,
        profile,
        done
      ) {
        return done(null, Object.assign({}, profile));
      });

      passport.use(strategy);

      passport.serializeUser(function(user, done) {
        done(null, user);
      });

      passport.deserializeUser(function(user, done) {
        done(null, user);
      });

      const outputs = engine.outputs[this.node.id];
      const initializeStrategyPort = this._.get(outputs, "initializeStrategy", false);
      if (initializeStrategyPort) {
        initializeStrategyPort.put(passport.initialize());
      }
      const strategySessionPort = this._.get(outputs, "strategySession", false);
      if (strategySessionPort) {
        strategySessionPort.put(passport.session());
      }

      router.get(
        "/auth/google",
        passport.authenticate("google", {
          scope: ["https://www.googleapis.com/auth/plus.login", "email"]
        }, () => {})
      );

      router.get(
        "/auth/google/callback",
        passport.authenticate("google", { failureRedirect: "/login" }, () => {}),
        function(req, res) {
          res.redirect(req.session.returnTo || "/");
        }
      );
      const routesPort = this._.get(outputs, "routes", false);
      if (routesPort) {
        routesPort.put(router);
      }
    }
  }
</script>
