import Vue from 'vue'
import Router from 'vue-router'
import Games from '@/components/Games'
import War from '@/components/War/War'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Games',
      component: Games
    },
    {
      path:'/war',
      name: 'War',
      component: War
    }
  ]
})
