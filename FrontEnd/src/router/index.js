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
    }
  ],
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/forget']; // Paths that don't require authentication
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('userToken'); // Check if user token exists

  if (authRequired && !loggedIn) {
    alert('You must be logged in to access this page. Redirecting to login.');
    return next('/login');
  }

  next(); // Proceed to the route
});

export default router
