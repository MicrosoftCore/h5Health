// import Home from '@/views/Home.vue'

export default [
  {
    path: '/',
    name: 'fullLayout',
    component: () => import('@/views/fullLayout'),
    redirect: 'home',
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '我的问卷'
        },
        component: () => import('@/views/home')
      },
      {
        path: '/assess',
        name: 'assess',
        meta: {
          title: '我的评估'
        },
        component: () => import('@/views/assess')
      },
      {
        path: '/profile',
        name: 'profile',
        meta: {
          title: '我'
        },
        component: () => import('@/views/profile')
      },
      {
        path: '/record/',
        name: 'record',
        meta: {
          title: '答题记录'
        },
        component: () => import('@/views/record')
      },
      {
        path: '/about',
        name: 'about',
        meta: {
          title: '关于我们'
        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/about')
      }
    ]
  },
  {
    path: '/survey/:jsonIndex/:name',
    name: 'survey',
    component: () => import('@/views/survey')
  },
  {
    path: '/risk/:idqtnaire',
    name: 'risk',
    meta: {
      title: '评估详情'
    },
    component: () => import('@/views/risk')
  }
]
