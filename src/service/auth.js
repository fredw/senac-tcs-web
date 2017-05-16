import router from '../router/index'

export default {

  login (context, data, redirect) {
    this.reset(context)
    context.loading = true
    context.$http.post('users/sign_in', data, { headers: { Authorization: '' } })
      .then((response) => {
        let authorization = response.headers.authorization
        // Set token and user id on local storage and store
        localStorage.setItem('token', authorization)
        localStorage.setItem('user.id', response.data.data.id)
        context.setUser(response.data.data)
        context.setToken(authorization)
        // Redirect
        if (redirect) {
          router.push(redirect)
        }
      })
      .catch((error) => {
        console.log('User sign in error')
        console.log(error.response)
        if (error.response.status === 401) {
          context.errors.push('Invalid e-mail and/or password!')
        } else {
          context.errors.push(error.response.data.error)
        }
      })
      .then(() => {
        context.loading = false
      })
  },

  logout (context, data) {
    context.$http.delete('users/sign_out', data)
      .then(() => {
        // Unset token and user id on local storage and store
        localStorage.removeItem('token')
        localStorage.removeItem('user.id')
        context.$store.dispatch('clearUser')
        context.$store.dispatch('clearToken')
        // Get back to login
        router.push({path: '/login', query: {redirect: context.$route.path}})
      }, error => {
        console.log('User signout error')
        console.log(error)
      })
  },

  forgotPassword (context, data) {
    this.reset(context)
    context.loadingForgotPassword = true
    context.$http.post('users/password', data, { headers: { Authorization: null } })
      .then(() => {
        context.info = {
          show: true,
          title: 'We just sent you a confirmation email!',
          message: 'Go to your email inbox, look out for the email, and click on the confirmation link.'
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          context.errors.push('Invalid e-mail!')
        } else {
          context.errors.push(error.response.data.email)
        }
      })
      .then(() => {
        context.loadingForgotPassword = false
      })
  },

  changePassword (context, data) {
    this.reset(context)
    context.$http.put('users/password', data, { headers: { Authorization: null } })
      .then(() => {
        context.success = 'Your password was changed! Go back to login.'
      })
      .catch((error) => {
        if (error.response.data.reset_password_token) {
          context.errors.push('Invalid token!')
        } else if (error.response.data.password) {
          context.errors.push(error.response.data.password[0])
        } else if (error.response.data.password_confirmation) {
          context.errors.push(error.response.data.password_confirmation[0])
        } else {
          context.errors.push('Unknow error!')
        }
      })
  },

  saveUser (context, data) {
    context.errors = {
      name: [],
      password: []
    }
    context.success = ''
    context.$http.put('users', data)
      .then(() => {
        context.success = 'Your info was changed!'
      })
      .catch((error) => {
        if (error.response.data.name) {
          context.errors.name.push(error.response.data.name[0])
        } else if (error.response.data.current_password) {
          context.errors.password.push(error.response.data.current_password[0])
        } else {
          context.errors.push('Unknown error!')
        }
      })
  },

  reset (context) {
    context.errors = []
    if (context.info) {
      context.info = {
        show: false,
        title: '',
        message: ''
      }
    }
    if (context.success) {
      context.success = ''
    }
  }
}
