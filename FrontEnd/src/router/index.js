import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  {
    path: '/',
    redirect: '/home'
  },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/inspiration',
      name: 'inspiration',
      component: () => import('../views/InspirationView.vue'),
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue')
    },
    {
      path: '/reflection',
      name: 'reflection',
      component: () => import('../views/ReflectionView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue')
    },
    {
      path: '/register',
      name: 'register',
      // Use dynamic import consistent with other routes
      component: () => import('../views/RegisterView.vue')
    },

    {
      path: '/login',
      name: 'login',

      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/forget',
      name: 'forget-password',
      component: () => import('../views/ForgetPass.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/admin-login',
      name: 'admin-login',
      component: () => import('../views/AdminLogin.vue')
    },
  ],
})

// Update the public pages array in the navigation guard
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/forget', '/admin-login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('userToken');
  const role = localStorage.getItem('userRole');

  if (authRequired && !loggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } });
    return;
  }

  // Prevent regular users from accessing /admin
  if (to.path === '/admin' && role !== 'admin') {
    next('/home');
    return;
  }

  next();
});

export default router
