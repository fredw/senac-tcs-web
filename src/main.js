import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import VueAxios from 'vue-axios'
import App from './components/App.vue'
import axios from 'axios'
import router from './router'
import auth from './auth'
import 'chart.js'
import 'hchs-vue-charts'
import 'vuetify/dist/vuetify.min.css'

Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.use(VueAxios, axios)
Vue.use(window.VueCharts)

Vue.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
Vue.axios.defaults.baseURL = process.env.API_URL

router.beforeEach(function (to, from, next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let id = localStorage.getItem('user.id')
    Vue.prototype.$http.get(`users/${id}`, null, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {
        auth.user = response.data.data
        next()
      })
      .catch(() => {
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
  template: '<App/>',
  components: { App }
})
