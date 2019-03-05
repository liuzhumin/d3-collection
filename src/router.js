import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=>import ('./views/Home.vue')
    },
    {
      path: '/example-plot-multiple',
      name: 'example-plot-multiple',
      component: () => import('./views/example-plot-multiple.vue')
    },

  ]
})
