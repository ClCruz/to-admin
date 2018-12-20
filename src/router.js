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

// producer
const adminProducerList = resolve => {
  require.ensure(['./views/producer/list.vue'], () => {
    resolve(require('./views/producer/list.vue'));
  }, 'admin-producer');
};
const adminProducerAdd = resolve => {
  require.ensure(['./views/producer/add.vue'], () => {
    resolve(require('./views/producer/add.vue'));
  }, 'admin-producer');
};

// genre
const adminGenreList = resolve => {
  require.ensure(['./views/genre/list.vue'], () => {
    resolve(require('./views/genre/list.vue'));
  }, 'admin-genre');
};
const adminGenreAdd = resolve => {
  require.ensure(['./views/genre/add.vue'], () => {
    resolve(require('./views/genre/add.vue'));
  }, 'admin-genre');
};

// place
const adminPlaceList = resolve => {
  require.ensure(['./views/place/list.vue'], () => {
    resolve(require('./views/place/list.vue'));
  }, 'admin-place');
};
const adminPlaceAdd = resolve => {
  require.ensure(['./views/place/add.vue'], () => {
    resolve(require('./views/place/add.vue'));
  }, 'admin-place');
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
    //LOGIN
    {
      path: '/login',
      name: 'login',
      component: adminLogin //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        store.dispatch('logout');
        //this.$router.push("/");
      }
    },
    //------
    //USER
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
      path: '/user/edit/:id',
      name: 'user-edit',
      props: true,
      component: adminUserAdd //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    //------
    //EVENT
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
    //------
    //PRODUCER
    {
      path: '/producer/list',
      name: 'producer-list',
      component: adminProducerList //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/producer/add',
      name: 'producer-add',
      component: adminProducerAdd //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/producer/edit/:id',
      name: 'producer-edit',
      props: true,
      component: adminProducerAdd //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    //------
    //GENRE
    {
      path: '/place/list',
      name: 'place-list',
      component: adminPlaceList //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/place/add',
      name: 'place-add',
      component: adminPlaceAdd //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/place/edit/:id',
      name: 'place-edit',
      props: true,
      component: adminPlaceAdd //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    //------
    //PLACE
    {
      path: '/genre/list',
      name: 'genre-list',
      component: adminGenreList //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/genre/add',
      name: 'genre-add',
      component: adminGenreAdd //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/genre/edit/:id',
      name: 'genre-edit',
      props: true,
      component: adminGenreAdd //import( /* webpackChunkName: "about" */ './views/login.vue')
    },
    //------
    //MY
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
    //------
    {path: '*', redirect: '/'}
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
