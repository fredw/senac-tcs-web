<template>
  <v-toolbar class="blue">
    <v-menu bottom right>
      <v-btn icon dark slot="activator">
        <v-toolbar-side-icon></v-toolbar-side-icon>
      </v-btn>
      <v-list>
        <v-list-item>
          <v-list-tile href="/">
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-if="user.authenticated" href="/reservoirs">
            <v-list-tile-title>Reservoirs</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-if="user.authenticated" href="/teste">
            <v-list-tile-title>Teste</v-list-tile-title>
          </v-list-tile>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-toolbar-title class="hidden-sm-and-down">Water Reservoir</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu bottom origin="top right" transition="v-scale-transition">
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
</template>

<script>
import auth from '../auth'

export default {
  data () {
    return {
      user: auth.user
    }
  },
  methods: {
    logout () {
      auth.logout(this)
    }
  }
}
</script>
