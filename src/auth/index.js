import router from '../router'

export default {
  user: {
    authenticated: !!localStorage.getItem('token'),
    user: {}
  },

  login (context, data, redirect) {
    this.reset(context)
    context.$http.post('users/sign_in', data, { headers: { Authorization: null } })
      .then((response) => {
        localStorage.setItem('token', response.headers.authorization)
        localStorage.setItem('user.id', response.data.data.id)
        this.user.authenticated = true
        if (redirect) {
          router.push(redirect)
        }
      })
      .catch((error) => {
        // console.log(error.response)
        if (error.response.status === 401) {
          context.errors.push('Invalid e-mail and/or password!')
        } else {
          context.errors.push(error.response.data.error)
        }
      })
  },

  logout (context, data) {
    context.$http.delete('users/sign_out', data)
      .then(() => {
        localStorage.removeItem('token')
        this.user.authenticated = false
        router.push({path: '/login'})
      }, error => {
        console.log('User signout error')
        console.log(error)
      })
  },

  forgotPassword (context, data) {
    this.reset(context)
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
          context.errors.push('Unknow error!')
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
