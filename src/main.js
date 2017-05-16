import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import VueAxios from 'vue-axios'
import App from './components/App.vue'
import axios from 'axios'
import router from './router'
import store from './store/index'
import 'chart.js'
import 'hchs-vue-charts'
import 'vuetify/dist/vuetify.min.css'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueAxios, axios)
Vue.use(window.VueCharts)

// Set default authorization header for all requests
Vue.axios.interceptors.request.use(request => {
  let token = localStorage.getItem('token')
  request.headers['Authorization'] = `${token}`
  return request
})
// Set default base url for all requests
Vue.axios.defaults.baseURL = process.env.API_URL

// Set token on vuex stage with the token on local storage
store.dispatch('setToken', localStorage.getItem('token'))

router.beforeEach(function (to, from, next) {
  let id = localStorage.getItem('user.id')
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Validates the user token
    Vue.axios.get(`users/${id}`)
      .then((response) => {
        // When success, store user on vuex stage
        router.app.$store.dispatch('setUser', response.data.data)
        next()
      })
      .catch((error) => {
        console.log('Redirected to login')
        console.log(error)
        // Unset token and user id on local storage and store
        localStorage.removeItem('token')
        localStorage.removeItem('user.id')
        router.app.$store.dispatch('clearUser')
        router.app.$store.dispatch('clearToken')
        // Get back to login
        next({path: '/login', query: {redirect: to.fullPath}})
      })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
