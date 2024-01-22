import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import {usePermissStore} from '../store/permiss';
import Home from '../views/home.vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '首页',
          permiss: '1',
        },
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/index.vue'),
      },
      {
        path: '/user',
        name: 'basetable',
        meta: {
          title: '用户管理',
          permiss: '2',
        },
        component: () => import(/* webpackChunkName: "table" */ '../views/user/index.vue'),
      },
      {
        path: '/permission',
        name: 'permission',
        meta: {
          title: '权限管理',
          permiss: '13',
        },
        component: () => import(/* webpackChunkName: "permission" */ '../views/system/permission.vue'),
      },
      {
        path: '/user/center',
        name: 'user',
        meta: {
          title: '个人中心',
        },
        component: () => import(/* webpackChunkName: "user" */ '../views/system/user.vue'),
      },
      {
        path: '/editor',
        name: 'editor',
        meta: {
          title: '富文本编辑器',
          permiss: '8',
        },
        component: () => import(/* webpackChunkName: "editor" */ '../views/system/editor.vue'),
      },
      {
        path: '/markdown',
        name: 'markdown',
        meta: {
          title: 'markdown编辑器',
          permiss: '9',
        },
        component: () => import(/* webpackChunkName: "markdown" */ '../views/system/markdown.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/login/index.vue'),
  },
  {
    path: '/403',
    name: '403',
    meta: {
      title: '没有权限',
    },
    component: () => import(/* webpackChunkName: "403" */ '../views/error/403.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  const user_info = localStorage.getItem('user_info');
  const permiss = usePermissStore();
  if (!user_info && to.path !== '/login') {
    next('/login');
  } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
    // 如果没有权限，则进入403
    next('/403');
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done()
})

export default router;
