import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import UserEdit from '../components/user/UserEdit.vue'
import PasswordEdit from '../components/user/PasswordEdit.vue'
import ReservoirList from '../components/reservoir/ReservoirList.vue'
import DeviceList from '../components/device/DeviceList.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: 'Water Reservoir' }
    },
    {
      path: '/user/edit',
      name: 'user.edit',
      component: UserEdit,
      meta: { title: 'User info', requiresAuth: true }
    },
    {
      path: '/password/edit',
      name: 'password.edit',
      component: PasswordEdit,
      meta: { title: 'Change your password' }
    },
    {
      path: '/reservoirs',
      name: 'reservoir.list',
      component: ReservoirList,
      meta: { title: 'Reservoirs', requiresAuth: true }
    },
    {
      path: '/reservoirs/:reservoir/devices',
      name: 'device.list',
      component: DeviceList,
      meta: { title: 'Devices', requiresAuth: true }
    }
  ]
})
