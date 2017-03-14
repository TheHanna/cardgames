import Vue from 'vue'
import Router from 'vue-router'
import Games from '@/components/Games'
import War from '@/components/Games/War'
import join from '@/components/Games/join'
import connect from '@/components/connect'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Connect',
      component: connect
    },
    {
      path: '/games',
      name: 'Games',
      component: Games
    },
    {
      path: '/war',
      name: 'War',
      component: War
    },
    {
      path: '/join',
      name: 'Join',
      component: join
    }
  ]
})
