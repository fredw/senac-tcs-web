<template>
  <v-card class="login">
    <v-card-text>
      <v-avatar>
        <img src="/static/logo.png" width="150" height="150" alt="Water Reservoir">
      </v-avatar>
      <v-row row>
        <v-col xs12>
          <v-text-field
            name="email"
            label="E-mail "
            v-model="user.email"
            :rules="errors"
            @keyup.enter.prevent.native="authenticate"
            required
            :disabled="loading || loadingForgotPassword"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row row>
        <v-col xs12>
          <v-text-field
            type="password"
            name="password"
            label="Password "
            v-model="user.password"
            @keyup.enter.prevent.native="authenticate"
            required
            :disabled="loading"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn success block dark large :loading="loading" @click.native="authenticate">Login</v-btn>
      <v-row>
        <v-col xs12>
          <v-btn
            flat block small
            class="grey--text lighten-1"
            :loading="loadingForgotPassword"
            @click.native="forgotPassword"
          >Forgot your password?</v-btn>
          <v-alert info dismissible v-show="info.title">
            <div>
              <strong>{{ info.title }}</strong><br/>
              {{ info.message }}
            </div>
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import auth from '../service/auth'
import User from '../domain/user/User'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      loading: false,
      loadingForgotPassword: false,
      errors: [],
      info: {
        title: '',
        message: ''
      },
      user: new User()
    }
  },
  computed: mapGetters(['getUser']),
  methods: {
    ...mapActions(['setUser', 'setToken']),
    authenticate () {
      auth.login(this, { user: this.user }, this.$route.query.redirect ? this.$route.query.redirect : '/')
    },
    forgotPassword () {
      auth.forgotPassword(this, { user: { email: this.user.email } })
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  width: 450px;
  margin: 50px auto 0;
}

.avatar {
  margin-bottom: 10px;

  img {
    width: 150px;
    height: 150px;
    border: 10px solid #f5f5f5;
  }
}

.card {
  padding-top: 20px;
}

.input-group {
  margin: 12px 0;
}
</style>
