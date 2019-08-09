import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import { func } from './functions';

Vue.use(Router);

//ticketoffice
const TicketOfficeIndex = resolve => {
  require.ensure(['./views/ticketoffice/Index.vue'], () => {
    resolve(require('./views/ticketoffice/Index.vue'));
  }, 'ticketoffice');
};
const TicketOfficeOperationCashRegister = resolve => {
  require.ensure(['./views/ticketoffice/operation/CashRegister.vue'], () => {
    resolve(require('./views/ticketoffice/operation/CashRegister.vue'));
  }, 'ticketoffice');
};
const TicketOfficePinpadConf = resolve => {
  require.ensure(['./views/ticketoffice/PinpadConf.vue'], () => {
    resolve(require('./views/ticketoffice/PinpadConf.vue'));
  }, 'ticketoffice');
};
const TicketOfficeOperation = resolve => {
  require.ensure(['./views/ticketoffice/Operation.vue'], () => {
    resolve(require('./views/ticketoffice/Operation.vue'));
  }, 'ticketoffice');
};
const TicketOfficeOperationMap = resolve => {
  require.ensure(['./views/ticketoffice/operation/Map.vue'], () => {
    resolve(require('./views/ticketoffice/operation/Map.vue'));
  }, 'ticketoffice');
};
const TicketOfficeClient = resolve => {
  require.ensure(['./views/ticketoffice/Client.vue'], () => {
      resolve(require('./views/ticketoffice/Client.vue'));
  }, 'ticketoffice');
};
const TicketOfficeSeatQuantity = resolve => {
  require.ensure(['./views/ticketoffice/SeatQuantity.vue'], () => {
      resolve(require('./views/ticketoffice/SeatQuantity.vue'));
  }, 'ticketoffice');
};
const TicketOfficePurchase = resolve => {
  require.ensure(['./views/ticketoffice/Purchase.vue'], () => {
      resolve(require('./views/ticketoffice/Purchase.vue'));
  }, 'ticketoffice');
};
const TicketOfficeReservation = resolve => {
  require.ensure(['./views/ticketoffice/Reservation.vue'], () => {
      resolve(require('./views/ticketoffice/Reservation.vue'));
  }, 'ticketoffice');
};
const TicketOfficeMoviment = resolve => {
  require.ensure(['./views/ticketoffice/Moviment.vue'], () => {
      resolve(require('./views/ticketoffice/Moviment.vue'));
  }, 'ticketoffice');
};
const TicketOfficeCloseCR = resolve => {
  require.ensure(['./views/ticketoffice/CloseCR.vue'], () => {
      resolve(require('./views/ticketoffice/CloseCR.vue'));
  }, 'ticketoffice');
};
const TicketOfficeWithdrawCR = resolve => {
  require.ensure(['./views/ticketoffice/WithdrawCR.vue'], () => {
      resolve(require('./views/ticketoffice/WithdrawCR.vue'));
  }, 'ticketoffice');
};
//---------------------------------


//admin
const adminHome = resolve => {
  require.ensure(['./views/Home.vue'], () => {
    resolve(require('./views/Home.vue'));
  }, 'admin');
};

const adminLogin = resolve => {
  require.ensure(['./views/Login.vue'], () => {
    resolve(require('./views/Login.vue'));
  }, 'admin');
};

const adminMyHome = resolve => {
  require.ensure(['./views/myhome.vue'], () => {
    resolve(require('./views/myhome.vue'));
  }, 'admin-myhome');
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

// ad
const adminAdList = resolve => {
  require.ensure(['./views/ad/list.vue'], () => {
    resolve(require('./views/ad/list.vue'));
  }, 'admin-ad');
};
const adminAdAdd = resolve => {
  require.ensure(['./views/ad/add.vue'], () => {
    resolve(require('./views/ad/add.vue'));
  }, 'admin-ad');
};

// email
const adminEmailAdd = resolve => {
  require.ensure(['./views/email/generate.vue'], () => {
    resolve(require('./views/email/generate.vue'));
  }, 'admin-ad');
};

// tickettype
const adminTicketTypeList = resolve => {
  require.ensure(['./views/tickettype/list.vue'], () => {
    resolve(require('./views/tickettype/list.vue'));
  }, 'admin-tickettype');
};
const adminTicketTypeAdd = resolve => {
  require.ensure(['./views/tickettype/add.vue'], () => {
    resolve(require('./views/tickettype/add.vue'));
  }, 'admin-tickettype');
};

// typepaymenttype
const adminTypePaymentTypeList = resolve => {
  require.ensure(['./views/typeofpaymenttype/list.vue'], () => {
    resolve(require('./views/typeofpaymenttype/list.vue'));
  }, 'admin-typeofpaymenttype');
};
const adminTypePaymentTypeAdd = resolve => {
  require.ensure(['./views/typeofpaymenttype/add.vue'], () => {
    resolve(require('./views/typeofpaymenttype/add.vue'));
  }, 'admin-typeofpaymenttype');
};

// city
const adminCityList = resolve => {
  require.ensure(['./views/city/list.vue'], () => {
    resolve(require('./views/city/list.vue'));
  }, 'admin-city');
};
const adminCityAdd = resolve => {
  require.ensure(['./views/city/add.vue'], () => {
    resolve(require('./views/city/add.vue'));
  }, 'admin-city');
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
const adminPartnerWhitelabel = resolve => {
  require.ensure(['./views/partner/whitelabel.vue'], () => {
    resolve(require('./views/partner/whitelabel.vue'));
  }, 'admin-partner');
};
const adminPartnerStaticPage = resolve => {
  require.ensure(['./views/partner/static.vue'], () => {
    resolve(require('./views/partner/static.vue'));
  }, 'admin-staticpage');
};

// report
const adminReportBinPromotion = resolve => {
  require.ensure(['./views/report/binpromotion.vue'], () => {
    resolve(require('./views/report/binpromotion.vue'));
  }, 'admin-report-binpromotion');
};
const adminReportAccounting = resolve => {
  require.ensure(['./views/report/accounting.vue'], () => {
    resolve(require('./views/report/accounting.vue'));
  }, 'admin-report-accounting');
};
const adminReportPartnerSale = resolve => {
  require.ensure(['./views/report/partnersale.vue'], () => {
    resolve(require('./views/report/partnersale.vue'));
  }, 'admin-report-partnersale');
};
const adminReportQuotaSale = resolve => {
  require.ensure(['./views/report/quotasale.vue'], () => {
    resolve(require('./views/report/quotasale.vue'));
  }, 'admin-report-quotasale');
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

// quota partner
const adminQuotaPartnerList = resolve => {
  require.ensure(['./views/quota/list.vue'], () => {
    resolve(require('./views/quota/list.vue'));
  }, 'admin-quotapartner');
};
const adminQuotaPartnerAdd = resolve => {
  require.ensure(['./views/quota/add.vue'], () => {
    resolve(require('./views/quota/add.vue'));
  }, 'admin-quotapartner');
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
// room
const adminRoomList = resolve => {
  require.ensure(['./views/room/list.vue'], () => {
    resolve(require('./views/room/list.vue'));
  }, 'admin-room');
};
const adminRoomAdd = resolve => {
  require.ensure(['./views/room/add.vue'], () => {
    resolve(require('./views/room/add.vue'));
  }, 'admin-room');
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

// mobile map
const mobileMap = resolve => {
  require.ensure(['./views/ticketoffice/operation/MobileMap.vue'], () => {
    resolve(require('./views/ticketoffice/operation/MobileMap.vue'));
  }, 'admin-my');
};

const obj = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: adminHome
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
    {
      path: '/dashboard',
      name: 'dashboard',
      component: adminMyHome
    },
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
    //ad
    {
      path: '/ad/list',
      name: 'ad-list',
      component: adminAdList
    },
    {
      path: '/ad/add',
      name: 'ad-add',
      component: adminAdAdd
    },
    {
      path: '/ad/edit/:id',
      name: 'ad-edit',
      props: true,
      component: adminAdAdd
    },
    //------
    //Email
    {
      path: '/email/generate/',
      name: 'email-generate',
      props: true,
      component: adminEmailAdd
    },
    //------
    //Type of payment type
    {
      path: '/typeofpt/list',
      name: 'typeofpt-list',
      component: adminTypePaymentTypeList
    },
    {
      path: '/typeofpt/add',
      name: 'typeofpt-add',
      component: adminTypePaymentTypeAdd
    },
    {
      path: '/typeofpt/edit/:id/:id_base',
      name: 'typeofpt-edit',
      props: true,
      component: adminTypePaymentTypeAdd
    },
    //------
    //City
    {
      path: '/city/list',
      name: 'city-list',
      component: adminCityList
    },
    {
      path: '/city/add',
      name: 'city-add',
      component: adminCityAdd
    },
    {
      path: '/city/edit/:id/',
      name: 'city-edit',
      props: true,
      component: adminCityAdd
    },
    //------
    //TicketType
    {
      path: '/tickettype/list',
      name: 'tickettype-list',
      component: adminTicketTypeList
    },
    {
      path: '/tickettype/add',
      name: 'tickettype-add',
      component: adminTicketTypeAdd
    },
    {
      path: '/tickettype/edit/:id/:id_base',
      name: 'tickettype-edit',
      props: true,
      component: adminTicketTypeAdd
    },
    //------
    //partner
    {
      path: '/partner/staticpage/add',
      name: 'staticpage-add',
      component: adminPartnerStaticPage
    },
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
    {
      path: '/partner/whitelabel/:id',
      name: 'partner-whitelabel',
      props: true,
      component: adminPartnerWhitelabel
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
    //Report
    {
      path: '/report/accounting',
      name: 'report-accounting',
      component: adminReportAccounting
    },
    {
      path: '/report/partnersale',
      name: 'report-partnersale',
      component: adminReportPartnerSale
    },
    {
      path: '/report/quotasale',
      name: 'report-quotasale',
      component: adminReportQuotaSale
    },
    {
      path: '/report/binpromotion',
      name: 'report-binpromotion',
      component: adminReportBinPromotion
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
    //quota
    {
      path: '/quota/list',
      name: 'quotapartner-list',
      component: adminQuotaPartnerList
    },
    {
      path: '/quota/add',
      name: 'quotapartner-add',
      component: adminQuotaPartnerAdd
    },
    {
      path: '/quota/edit/:id',
      name: 'quotapartner-edit',
      props: true,
      component: adminQuotaPartnerAdd
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
    //ROOM
    {
      path: '/room/add',
      name: 'room-add',
      component: adminRoomAdd
    },
    {
      path: '/room/list',
      name: 'room-list',
      component: adminRoomList
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
    //mobile pages
    {
      path: '/mobile/seat',
      name: 'mobile-seat',
      component: mobileMap
    },
    //------
    //ticketoffice
    {
      path: '/ticketoffice',
      name: 'ticketoffice',
      component: () => import('./views/TicketOffice.vue'),
      children: [
        {
          path: '/ticketoffice/pinpadconf',
          components: {
            routerView_ticketoffice: TicketOfficePinpadConf
          }
        },
        {
          path: '/ticketoffice/operation/:type',
          components: {
            routerView_ticketoffice: TicketOfficeOperation
          }
        },
        {
          path: '/ticketoffice/operation/:type/seat',
          components: {
            routerView_ticketoffice: TicketOfficeOperationMap
          }
        },
        {
          path: '/ticketoffice/sell',
          components: {
            routerView_ticketoffice: TicketOfficeOperationCashRegister
          }
        },
        {
          path: '/ticketoffice/client',
          components: {
            routerView_ticketoffice: TicketOfficeClient
          }
        },
        {
          path: '/ticketoffice/operation/seatquantity',
          components: {
            routerView_ticketoffice: TicketOfficeSeatQuantity
          }
        },
        {
          path: '/ticketoffice/purchase/search',
          components: {
            routerView_ticketoffice: TicketOfficePurchase
          }
        },
        {
          path: '/ticketoffice/reservation/search',
          components: {
            routerView_ticketoffice: TicketOfficeReservation
          }
        },
        {
          path: '/ticketoffice/cashregister/moviments',
          components: {
            routerView_ticketoffice: TicketOfficeMoviment
          }
        },
        {
          path: '/ticketoffice/cashregister/close',
          components: {
            routerView_ticketoffice: TicketOfficeCloseCR
          }
        },
        {
          path: '/ticketoffice/cashregister/withdraw',
          components: {
            routerView_ticketoffice: TicketOfficeWithdrawCR
          }
        },
      ]
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