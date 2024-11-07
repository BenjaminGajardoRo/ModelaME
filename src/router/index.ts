import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/TabsPage.vue'; 
import RegisterView from '../views/RegisterView.vue'; 
import LoginView from '../views/LoginView.vue'; 
import CastingView from '@/views/CastingsView.vue'; 
import UserProfileView from '@/views/UserProfile.vue';
import ModelsView from '../views/ModelsView.vue'; 
import PublishCas from '@/views/PublishCas.vue'; 

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login' 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView 
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView 
  },
  {
    path: '/tabs',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/castings' 
      },
      {
        path: 'Castings',
        name: 'Castings',
        component: CastingView, 
        meta: { requiredAuth: true } 
      },
      {
        path: 'Profile',
        name: 'UserProfile',
        component: UserProfileView,
        meta: { requiredAuth: true } 
      },
      {
        path: 'Models',
        name: 'Models',
        component: ModelsView,
        meta: { requiredAuth: true } 
      }
    ],
    meta: { requiredAuth: true } 
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiredAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next({ name: 'Login' });
    }
  } else next();
});

export default router;
