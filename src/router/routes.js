// import Home from '@/views/Home.vue'

export default [
  {
    path: '/',
    name: 'boxed',
    component: () => import('@/views/boxed'),
    redirect: 'home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home')
      }
    ]
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    component: () => import('@/views/questionnaire')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/about')
  }
]
