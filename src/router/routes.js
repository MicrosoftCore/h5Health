// import Home from '@/views/Home.vue'

export default [
  {
    path: '/',
    name: 'basic',
    component: () => import('@/views/basic'),
    redirect: 'home',
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '我的问卷',
          auth: true
        },
        component: () => import('@/views/home')
      },
      {
        path: '/assess',
        name: 'assess',
        meta: {
          title: '我的评估',
          auth: true
        },
        component: () => import('@/views/assess')
      },
      {
        path: '/profile',
        name: 'profile',
        meta: {
          title: '我',
          auth: true
        },
        component: () => import('@/views/profile')
      },
      {
        path: '/about',
        name: 'about',
        meta: {
          title: '关于我们',
          auth: true
        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/about')
      }
    ]
  },
  {
    path: '/record/',
    name: 'record',
    meta: {
      title: '答题记录',
      auth: true
    },
    component: () => import('@/views/record')
  },
  {
    path: '/risk/:idqtnaire',
    name: 'risk',
    meta: {
      title: '评估详情',
      auth: true
    },
    component: () => import('@/views/risk')
  },
  {
    path: '/survey/:jsonIndex/:name',
    name: 'survey',
    meta: {
      title: '填写问卷',
      auth: true
    },
    component: () => import('@/views/survey')
  }
]
