import router from '../router'

export default {
  user: {
    authenticated: !!localStorage.getItem('token')
  },

  login (context, data, redirect) {
    this.reset(context)
    context.$http.post('users/sign_in', data, { headers: { Authorization: null } })
      .then((response) => {
        localStorage.setItem('token', response.headers.authorization)
        this.user.authenticated = true
        // context.user = response.body.data
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

  logout (context, options) {
    context.$http.delete('users/sign_out', options)
      .then(() => {
        localStorage.removeItem('token')
        this.user.authenticated = false
        router.push({path: '/login'})
      }, error => {
        console.log(error.message)
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
        // console.log(error.response)
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
        context.success = {
          show: true,
          message: 'Your password was changed! Go back to login.'
        }
      })
      .catch((error) => {
        if (error.response.data.reset_password_token) {
          context.errors.push('Invalid token!')
        } else if (error.response.data.password) {
          context.errors.push(error.response.data.password[0])
        } else if (error.response.data.password_confirmation) {
          context.errors.push(error.response.data.password_confirmation[0])
        } else {
          context.errors.push(error.response.data)
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
      context.success = {
        show: false,
        message: ''
      }
    }
  }
}
