import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import { func } from './functions';

Vue.use(Router);

const adminLogin = resolve => {
  require.ensure(['./views/Login.vue'], () => {
    resolve(require('./views/Login.vue'));
  }, 'admin');
};

// presentation
const adminPresentationAdd = resolve => {
  require.ensure(['./views/presentation/add.vue'], () => {
    resolve(require('./views/presentation/add.vue'));
  }, 'admin-presentation');
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

// partner
const adminPartnerList = resolve => {
  require.ensure(['./views/partner/list.vue'], () => {
    resolve(require('./views/partner/list.vue'));
  }, 'admin-partner');
};
const adminPartnerAdd = resolve => {
  require.ensure(['./views/partner/add.vue'], () => {
    resolve(require('./views/partner/add.vue'));
  }, 'admin-partner');
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

const obj = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: adminLogin
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
      component: adminUserList
    },
    {
      path: '/user/add',
      name: 'user-add',
      component: adminUserAdd
    },
    {
      path: '/user/edit/:id',
      name: 'user-edit',
      props: true,
      component: adminUserAdd
    },
    //------
    //------
    //partner
    {
      path: '/partner/list',
      name: 'partner-list',
      component: adminPartnerList
    },
    {
      path: '/partner/add',
      name: 'partner-add',
      component: adminPartnerAdd
    },
    {
      path: '/partner/edit/:id',
      name: 'partner-edit',
      props: true,
      component: adminPartnerAdd
    },
    //------
    //EVENT
    {
      path: '/event/list',
      name: 'event-list',
      component: adminEventList
    },
    {
      path: '/event/add',
      name: 'event-add',
      component: adminEventAdd
    },
    {
      path: '/event/edit/:id/:base',
      name: 'event-edit',
      props: true,
      component: adminEventAdd
    },
    //------
    //PRODUCER
    {
      path: '/producer/list',
      name: 'producer-list',
      component: adminProducerList
    },
    {
      path: '/producer/add',
      name: 'producer-add',
      component: adminProducerAdd
    },
    {
      path: '/producer/edit/:id',
      name: 'producer-edit',
      props: true,
      component: adminProducerAdd
    },
    //------
    //GENRE
    {
      path: '/place/list',
      name: 'place-list',
      component: adminPlaceList
    },
    {
      path: '/place/add',
      name: 'place-add',
      component: adminPlaceAdd
    },
    {
      path: '/place/edit/:id',
      name: 'place-edit',
      props: true,
      component: adminPlaceAdd
    },
    //------
    //PLACE
    {
      path: '/genre/list',
      name: 'genre-list',
      component: adminGenreList
    },
    {
      path: '/genre/add',
      name: 'genre-add',
      component: adminGenreAdd
    },
    {
      path: '/genre/edit/:id',
      name: 'genre-edit',
      props: true,
      component: adminGenreAdd
    },
    //------
    //MY
    {
      path: '/my/info',
      name: 'my-info',
      component: adminMyInfo
    },
    {
      path: '/my/pass',
      name: 'my-pass',
      component: adminMyPass
    },
    //------
    {path: '*', redirect: '/'}
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});

obj.beforeEach((to, from, next) => {
  let doNext = false;
  switch (to) {
    case "login":
    case "home":
    case "logout":
      doNext = true;
    break;
    default:
        doNext = true;
        func.methods.validateLoginForMe();
    break;
  }
  
  if (doNext) {
    next();
  }
})

export default obj;