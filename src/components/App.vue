<template>
  <v-app id="app" top-toolbar sidebar-under-toolbar>
    <v-toolbar class="blue" fixed>
      <v-toolbar-side-icon v-if="user.authenticated" @click.native.stop="nav = !nav" />
      <v-toolbar-title class="hidden-sm-and-down">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu v-if="user.authenticated" bottom origin="top right" transition="v-scale-transition">
        <v-btn icon dark slot="activator">
          <v-icon>account_circle</v-icon>
        </v-btn>
        <v-list>
          <v-list-item>
            <v-list-tile>
              <v-list-tile-title>Change Account</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="user.authenticated" @click.native="logout">
              <v-list-tile-title>Log Out</v-list-tile-title>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <main>
      <v-sidebar drawer v-model="nav" height="100%" v-if="user.authenticated">
        <v-list dense>
          <v-list-item>
            <v-list-tile to="/">
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile>
            <v-list-tile to="/reservoirs">
              <v-list-tile-title>Reservoirs</v-list-tile-title>
            </v-list-tile>
            <v-list-tile to="/teste">
              <v-list-tile-title>Teste</v-list-tile-title>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-sidebar>
      <v-content>
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
import auth from '../auth'

export default {
  name: 'app',
  data () {
    return {
      title: 'Water Reservoir',
      nav: null,
      user: auth.user
    }
  },
  created () {
    if (this.$route.meta.title) {
      this.title = this.$route.meta.title
    }
  },
  methods: {
    logout () {
      auth.logout(this)
    }
  }
}
</script>

<style>
#app .content {
  padding: 90px 0 15px;
  background: #eee;
}

.sidebar {
  padding-top: 70px !important;
}
</style>
