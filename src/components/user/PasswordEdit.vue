<template>
  <v-card class="password-edit">
    <v-card-text>
      <v-row row>
        <v-col xs12>
          <v-text-field
            type="password"
            name="password"
            label="Password "
            :rules="errors"
            v-model="user.password"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row row>
        <v-col xs12>
          <v-text-field
            type="password"
            name="password_confirmation"
            label="Password confirmation "
            v-model="user.password_confirmation"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn success block dark large @click.native="save">Change</v-btn>
      <v-alert info v-show="success">{{ success }}</v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import auth from '../../service/auth'

export default {
  name: 'password-edit',
  data () {
    return {
      errors: [],
      success: '',
      user: {
        password: '',
        password_confirmation: '',
        reset_password_token: ''
      }
    }
  },
  created () {
    this.user.reset_password_token = this.$route.query.reset_password_token
  },
  methods: {
    save () {
      auth.changePassword(this, { user: this.user })
    }
  }
}
</script>

<style scoped lang="scss">
.password-edit {
  width: 450px;
  margin: 50px auto 0;
}

.input-group {
  margin: 12px 0;
}
</style>
