import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import War from '@/components/War'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path:'/war',
      name: 'War',
      component: War
    }
  ]
})
