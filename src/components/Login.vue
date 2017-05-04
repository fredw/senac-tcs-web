<template>
  <v-card class="login">
    <v-card-text>
      <v-row row>
        <v-col xs12>
          <v-text-field
            name="email"
            label="E-mail "
            v-model="user.email"
            :rules="errors"
            required
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
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn success block dark large @click.native="authenticate">Login</v-btn>
      <v-row>
        <v-col xs12>
          <v-btn flat block small class="grey--text lighten-1" @click.native="forgotPassword">Forgot your password?</v-btn>
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
import auth from '../auth'
import User from '../domain/user/User'

export default {
  name: 'login',
  data () {
    return {
      errors: [],
      info: {
        title: '',
        message: ''
      },
      user: new User()
    }
  },
  methods: {
    authenticate () {
      auth.login(this, { user: this.user }, this.$route.query.redirect ? this.$route.query.redirect : '/')
    },
    forgotPassword () {
      auth.forgotPassword(this, { user: { email: this.user.email } })
    }
  }
}
</script>

<style scoped>
.login {
  width: 450px;
  margin: 50px auto 0;
}

.card {
  padding-top: 20px;
}

.input-group {
  margin: 12px 0;
}
</style>
