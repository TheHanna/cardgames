import Vue from 'vue'
import Router from 'vue-router'
import Games from '@/components/Games'
import War from '@/components/Games/War'
import connect from '@/components/connect'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Connect',
      component: connect,
      props: false
    },
    {
      path: '/games',
      name: 'Games',
      component: Games,
      props: true
    },
    {
      path: '/war',
      name: 'War',
      component: War,
      props: true
    }
  ]
})
