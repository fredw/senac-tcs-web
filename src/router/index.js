import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import UserEdit from '@/components/user/UserEdit'
import PasswordEdit from '@/components/user/PasswordEdit'
import Teste from '@/components/Teste'
import ReservoirList from '@/components/reservoir/ReservoirList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'index', component: Home, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: Login, meta: { title: 'Water Reservoir' } },
    { path: '/user/edit', name: 'user-edit', component: UserEdit, meta: { title: 'User info', requiresAuth: true } },
    { path: '/password/edit', name: 'password-edit', component: PasswordEdit, meta: { title: 'Change your password' } },
    { path: '/reservoirs', name: 'reservoirs', component: ReservoirList, meta: { title: 'Reservoirs', requiresAuth: true } },
    { path: '/teste', name: 'teste', component: Teste, meta: { title: 'Teste', requiresAuth: true } },
    { path: '/reservoirs/Ç', name: 'device.show', component: Teste, meta: { title: 'Device', requiresAuth: true } }
  ]
})
