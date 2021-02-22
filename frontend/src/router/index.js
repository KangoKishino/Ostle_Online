import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/host/:id',
    name: 'Hostgame',
    component: () => import('../views/HostGamePage.vue'),
  },
  {
    path: '/guest/:id',
    name: 'Guestgame',
    component: () => import('../views/GuestGamePage.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
