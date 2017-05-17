<template>
  <v-app id="app" top-toolbar sidebar-under-toolbar>
    <v-toolbar class="blue" fixed>
      <v-toolbar-side-icon v-if="getUser" @click.native.stop="nav = !nav" />
      <v-toolbar-title class="hidden-sm-and-down">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu v-if="getUser" bottom origin="top right" transition="v-scale-transition">
        <v-btn icon dark slot="activator">
          <v-icon>account_circle</v-icon>
        </v-btn>
        <v-list>
          <v-list-item>
            <v-list-tile to="user/edit">
              <v-list-tile-title>Change Account</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click.native="logout">
              <v-list-tile-title>Log out</v-list-tile-title>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <main>
      <v-sidebar drawer v-model="nav" height="100%" v-if="getUser">
        <v-list dense>
          <v-list-item>
            <v-list-tile to="/">
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile>
            <v-list-tile to="/reservoirs">
              <v-list-tile-title>Reservoirs</v-list-tile-title>
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
import { mapGetters } from 'vuex'
import auth from '../service/auth'

export default {
  name: 'app',
  data () {
    return {
      title: 'Water Reservoir',
      nav: null
    }
  },
  computed: mapGetters(['getUser']),
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

<style lang="scss">
body {
  background: #eee !important;
}

#app .content {
  padding: 90px 0 15px;
  background: #eee;
}

/* Overwrite default styles */

.sidebar {
  padding-top: 70px !important;
}

.breadcrumbs {
  margin-bottom: 15px !important;
  background-color: #fff;
  justify-content: flex-start !important;
}

.pagination {
  width: 100%;
  justify-content: center;
}

.card__title {
  letter-spacing: 0 !important;
}

/* Card filter */

.card.filter {
  margin-bottom: 15px;

  .card__title {
    padding: 10px;
  }

  .input-group {
    margin-bottom: 0;
  }

  .btn {
    margin-top: 0;
  }
}
</style>
