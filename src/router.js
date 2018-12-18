import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store';

Vue.use(Router);

const adminLogin = resolve => {
  require.ensure(['./views/Login.vue'], () => {
    resolve(require('./views/Login.vue'));
  }, 'admin');
};

// event
const adminEventList = resolve => {
  require.ensure(['./views/event/list.vue'], () => {
    resolve(require('./views/event/list.vue'));
  }, 'admin-event');
};
const adminEventAdd = resolve => {
  require.ensure(['./views/event/add.vue'], () => {
    resolve(require('./views/event/add.vue'));
  }, 'admin-event');
};

// user
const adminUserList = resolve => {
  require.ensure(['./views/user/list.vue'], () => {
    resolve(require('./views/user/list.vue'));
  }, 'admin-user');
};
const adminUserAdd = resolve => {
  require.ensure(['./views/user/add.vue'], () => {
    resolve(require('./views/user/add.vue'));
  }, 'admin-user');
};

// my
const adminMyInfo = resolve => {
  require.ensure(['./views/my/info.vue'], () => {
    resolve(require('./views/my/info.vue'));
  }, 'admin-my');
};
const adminMyPass = resolve => {
  require.ensure(['./views/my/pass.vue'], () => {
    resolve(require('./views/my/pass.vue'));
  }, 'admin-my');
};


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: adminLogin //import( /* webpackChunkName: "about" */ './views/login.vue')
    },

    {
      path: '/user/list',
      name: 'user-list',
      component: adminUserList //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/user/add',
      name: 'user-add',
      component: adminUserAdd //import( /* webpackChunkName: "about" */ './views/login.vue')
    },

    {
      path: '/event/list',
      name: 'event-list',
      component: adminEventList //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/event/add',
      name: 'event-add',
      component: adminEventAdd //import( /* webpackChunkName: "about" */ './views/login.vue')
    },

    {
      path: '/my/info',
      name: 'my-info',
      component: adminMyInfo //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/my/pass',
      name: 'my-pass',
      component: adminMyPass //import( /* webpackChunkName: "about" */ './views/login.vue')
    },

    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        store.dispatch('logout');
        //this.$router.push("/");
      }
    },
    {path: '*', redirect: '/'}
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
