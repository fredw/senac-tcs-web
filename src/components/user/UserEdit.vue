<template>
  <v-card class="user-edit">
    <v-card-text>
      <v-row row>
        <v-col xs12>
          <v-text-field
            name="name"
            label="Name "
            :rules="errors.name"
            v-model="user.name"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row row>
        <v-col xs12>
          <v-text-field
            type="password"
            name="current_password"
            label="Your password "
            :rules="errors.password"
            v-model="user.current_password"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn success block dark large @click.native="save">Save</v-btn>
      <v-alert info v-show="success">{{ success }}</v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import auth from '../../auth/index'

export default {
  name: 'user-edit',
  data () {
    return {
      errors: {
        name: [],
        password: []
      },
      success: '',
      user: {
        name: '',
        current_password: ''
      }
    }
  },
  created () {
    this.user.name = auth.user.attributes.name
  },
  methods: {
    save () {
      auth.saveUser(this, { user: this.user })
    }
  }
}
</script>

<style scoped lang="scss">
.user-edit {
  width: 450px;
  margin: 50px auto 0;
}

.input-group {
  margin: 12px 0;
}
</style>
