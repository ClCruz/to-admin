<template>
<div id="app" class="">
  <div class="header py-4" v-if="checkIsAuth()">
    <div class="container">
      <div class="d-flex">
        <a class="header-brand" href="./index.html" style="color: #333; font-weight: regular; font-size: 13px">
          <img src="/assets/images/logo.png" alt="Logo Ticketoffice" style="width: 40px">
          
        </a>
        <div class="d-flex order-lg-2 ml-auto">
          <div class="dropdown">
            <a href="#" class="nav-link pr-0 leading-none" data-toggle="dropdown">
              <!-- <span class="avatar" :style="{ backgroundImage: 'url(\'https://avatar.tobi.sh/tobiaslins.svg?text=' + getLoggedEmail().substring(0,2) + '\')' }" style="background-size: cover"></span> -->
              <span class="ml-3 d-none d-lg-block  text-left pt-2">
                <span class="text-default" style="font-size: 13px; font-weight:">{{this.getLoggedEmail() == null ? "Carregando..." : this.getLoggedEmail()}}</span>
                <!-- <small class="text-muted d-block mt-1">Administrador</small> -->
              </span>
            </a>
            <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
              <a class="dropdown-item" href="/my/info">
              <i class="dropdown-icon fe fe-user"></i> Informações de Perfil
              </a>
              <a class="dropdown-item" href="/my/pass">
              <i class="dropdown-icon fas fa-key"></i> Mudar Senha
              </a>
              <a class="dropdown-item" href="/logout">
              <i class="dropdown-icon fe fe-log-out"></i> Sair
              </a>
            </div>
          </div>
        </div>
        <a href="#" class="header-toggler d-lg-none ml-3 ml-lg-0" data-toggle="collapse" data-target="#headerMenuCollapse">
        <span class="header-toggler-icon"></span>
        </a>
      </div>
    </div>
  </div>
  <div class="header d-lg-flex p-0 collapse" id="headerMenuCollapse" style="">
    <div class="container">
      <div class="row align-items-center">

        <div class="col-lg order-lg-first">
          <ul class="nav nav-tabs border-0 flex-column flex-lg-row">
            <li class="nav-item">
              <a :href="'/my/info'" class="nav-link"><i class="fas fa-user"></i>  Informações de Perfil</a>
            </li>
            <li class="nav-item">
              <a :href="'/my/pass'" class="nav-link"><i class="fa fa-key"></i> Mudar Senha</a>
            </li>

            <linkMenu v-for="(item, index) in menu" :key='index' :title="item.title" :icon="item.icon" :code="item.code" :link="item.href" :child="item.child">
            </linkMenu>


            <li class="nav-item">
              <a :href="'/logout'" class="nav-link"><i class="fas fa-sign-out-alt"></i> Sair</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <v-wait for="loadingAboveAll">
    <template slot="waiting">
      <div id="aboveAll">
       <semipolar-spinner
  :size="64"
  color="rgb(73,130,204)"
/>
      </div>
    </template>
  </v-wait>
  <sidebar-menu :menu="menu" v-if="checkIsAuth()" :collapsed="true" :widthCollapsed="'48px'" :width="'280px'" />
  <div class="p-5">
    <router-view :key="$route.fullPath" />
  </div>
</div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import VueSidebarMenu from 'vue-sidebar-menu'
import config from "@/config";
import LinkMenu from "./components/ticketoffice/LinkMenu";
import {
  func
} from "@/functions";
import { SemipolarSpinner } from 'epic-spinners'

Vue.use(VueSidebarMenu);
Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'home',
  components: {
    LinkMenu,
    SemipolarSpinner
  },
  mounted() {
    if (this.getLoggedId() == null) {
      this.goLogin();
      return;
    }
    this.tryLogin(null);
    this.setMenu();
  },
  created() {
    
    // Listen for swUpdated event and display refresh snackbar as required.
    document.addEventListener('swUpdated', this.showRefreshUI, {
      once: true
    });
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });

    if (this.getLoggedId() == null) {
      this.goLogin();
      return;
    }
    this.tryLogin(null);
    this.setMenu();

    console.log(this.menu)
  },
  computed: {},
  head: {
    title: function () {
      return {
        inner: `TicketOffice`,
        separator: " | ",
        complement: "Administrativo",
      }
    },
  },
  methods: {
    showRefreshUI(e) {
      this.registration = e.detail;
      this.updateExists = true;
      this.$swal({
        title: 'Nova versão',
        text: "Realizamos atualizações no sistema, iremos atualizar agora.",
        type: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
      }).then((result) => {
        this.refreshApp();
      });
      //      this.refreshApp();
      //this.toastSuccess("Realizamos atualizações no site, iremos atualizar agora.");
    },
    refreshApp() {
      this.updateExists = false;
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage('skipWaiting');
    },
    setMenu() {
      let menuHelper = [
        {
          title: 'Bilheteria',
          icon: 'fas fa-ticket-alt',
          code: 'ticketoffice-login',
          href: '/ticketoffice',
        },
        {
          title: 'Usuários',
          icon: 'fas fa-users',
          code: 'all',
          code: 'user-viewer',
          child: [{
              href: '/user/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'user-add'
            },
            {
              href: '/user/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'user-viewer' //'all',//'user-viewer'
            },
          ]
        },
        {
          title: 'Relatórios',
          icon: 'fas fa-chart-bar',
          code: 'all',
          code: 'report-viewer',
          child: [{
              href: '/report/accounting',
              title: 'Borderô',
              icon: 'fas fa-file-invoice-dollar',
              code: 'report-accounting'
            },
            {
              href: '/report/partnersale',
              title: 'Venda para parceiros',
              icon: 'fas fa-chart-pie',
              code: 'report-partnersale'
            },
            {
              href: '/report/quotasale',
              title: 'Venda para cota',
              icon: 'fas fa-chart-pie',
              code: 'report-quotasale'
            },
            {
              href: '/report/binpromotion',
              title: 'Venda para promoção BIN',
              icon: 'fas fa-file-contract',
              code: 'report-binpromotion'
            },
            {
              href: '/report/binpromotionresume',
              title: 'Venda para promoção BIN Resumido',
              icon: 'fas fa-file-contract',
              code: 'report-binpromotion'
            },
          ]
        },
        {
          title: 'Eventos',
          icon: 'fas fa-theater-masks',
          code: 'ev-viewer',
          child: [{
              href: '/event/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'ev-viewer'
            },
            {
              href: '/event/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'ev-viewer'
            },
            {
              title: 'Sala',
              icon: 'fas fa-person-booth',
              code: 'room-viewer',
              child: [
                {
                  href: '/room/add',
                  title: 'Adicionar sala',
                  icon: 'fas fa-pen',
                  code: 'room-viewer'
                },
                {
                  href: '/room/list',
                  title: 'Listar sala',
                  icon: 'fas fa-list-ul',
                  code: 'room-viewer'
                },
              ]
            },
          ]
        },
        {
          title: 'Tipo de pagamento',
          icon: 'fas fa-money-bill-wave',
          code: 'typeofpt-viewer',
          child: [
            {
              title: 'Tipo',
              icon: 'fas fa-money-check-alt',
              code: 'typeofpt-add',
              child: [
                {
                  href: '/typeofpt/add',
                  title: 'Adicionar',
                  icon: 'fas fa-pen',
                  code: 'typeofpt-add'
                },
                {
                  href: '/typeofpt/list',
                  title: 'Listar',
                  icon: 'fas fa-list-ul',
                  code: 'typeofpt-viewer',
                },
              ]
            },
            {
              title: 'Forma',
              icon: 'fas fa-money-bill-alt',
              code: 'paymenttype-add',
              child: [
                {
                  href: '/paymenttype/add',
                  title: 'Adicionar',
                  icon: 'fas fa-pen',
                  code: 'paymenttype-add'
                },
                {
                  href: '/paymenttype/list',
                  title: 'Listar',
                  icon: 'fas fa-list-ul',
                  code: 'paymenttype-viewer',
                },
              ]
            },
          ]
        },
        {
          title: 'Bilhete',
          icon: 'fas fa-clipboard-list',
          code: 'tickettype-viewer',
          child: [{
              href: '/tickettype/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'tickettype-add'
            },
            {
              href: '/tickettype/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'tickettype-viewer',
            },
          ]
        },
        {
          title: 'Propaganda',
          icon: 'fas fa-ad',
          code: 'all',
          code: 'ad-viewer',
          child: [{
              href: '/ad/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'ad-add'
            },
            {
              href: '/ad/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'ad-viewer' //'all',//'user-viewer'
            },
            {
              href: '/email/generate',
              title: 'Gerar e-mail',
              icon: 'fas fa-envelope',
              code: 'ad-emailtemplate-add' //'all',//'user-viewer'
            }
          ]
        },
        {
          title: 'Gênero',
          icon: 'fas fa-band-aid',
          code: 'genre-viewer',
          //code: 'user-viewer',
          child: [{
              href: '/genre/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'genre-add'
            },
            {
              href: '/genre/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'genre-viewer', //'user-viewer'
            },
          ]
        },
        {
          title: 'Cota',
          icon: 'fas fa-star-half-alt',
          code: 'quotapartner-viewer',
          //code: 'user-viewer',
          child: [{
              href: '/quota/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'quotapartner-add'
            },
            {
              href: '/quota/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'quotapartner-viewer', //'user-viewer'
            },
          ]
        },
        {
          title: 'Local',
          icon: 'fas fa-map-marked-alt',
          code: 'place-viewer',
          //code: 'user-viewer',
          child: [{
              href: '/place/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'place-add'
            },
            {
              href: '/place/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'place-viewer', //'user-viewer'
            },
          ]
        },
        {
          title: 'Cidade',
          icon: 'fas fa-city',
          code: 'city-viewer',
          //code: 'user-viewer',
          child: [{
              href: '/city/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'city-add'
            },
            {
              href: '/city/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'city-viewer', //'user-viewer'
            },
          ]
        },
        {
          title: 'Produtores',
          icon: 'fas fa-people-carry',
          code: 'producer-viewer',
          //code: 'user-viewer',
          child: [{
              href: '/producer/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'producer-add'
            },
            {
              href: '/producer/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'producer-viewer', //'user-viewer'
            },
          ]
        },
        {
          title: 'Parceiros',
          icon: 'far fa-handshake',
          code: 'partner-viewer',
          child: [{
              href: '/partner/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'partner-add'
            },
            {
              href: '/partner/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'partner-viewer', //'user-viewer'
            },
            {
              href: '/partner/staticpage/add',
              title: 'Páginas Estaticas',
              icon: 'fas fa-scroll',
              code: 'partner-staticpage',
            },
          ]
        },
        {
          title: 'Tipo de debito no bordero',
          icon: 'fas fa-file-invoice-dollar',
          code: 'accountingdebittype-viewer',
          child: [{
              href: '/accountingdebittype/add',
              title: 'Adicionar',
              icon: 'fas fa-pen',
              code: 'accountingdebittype-add'
            },
            {
              href: '/accountingdebittype/list',
              title: 'Listar',
              icon: 'fas fa-list-ul',
              code: 'accountingdebittype-viewer',
            },
          ]
        },        
      ];

      for (let x = (menuHelper.length - 1); x > 0; x--) {
        const element = menuHelper[x];
        if (!this.removeOrNot(x, element, menuHelper)) {
          continue;
        }

        if (menuHelper[x].hasOwnProperty('child')) {
          for (let x2 = (menuHelper[x].child.length - 1); x2 > 0; x2--) {
            const element = menuHelper[x].child[x2];
            if (!this.removeOrNot(x2, element, menuHelper[x].child)) {
              continue;
            }

            if (menuHelper[x].child[x2].hasOwnProperty('child')) {
              for (let x3 = (menuHelper[x].child[x2].child.length - 1); x3 > 0; x3--) {
                const element = menuHelper[x].child[x2].child[x3];
                if (!this.removeOrNot(x3, element, menuHelper[x].child[x2].child)) {
                  continue;
                }
              }
            }

          }
        }
      }

      this.menu = menuHelper;
      this.menuMobile = menuHelper;
      //console.log(this.menu);
      this.setMenuMobile();
    },
    setMenuMobile() {},
    removeOrNot(y, element, who) {
      //console.log("Title: " + element.title + ' / ' + element.code + " -- " + y);
      if (element.code != 'all') {
        if (!this.menuCheck(element.code)) {
          //console.log("removed");
          who.splice(y, 1);
          //          y--;
          return false;
        } else {
          //console.log("ok");
        }
      }
      return true;
    },
    menuCheck(code) {
      if (this.ls_get("codes") == undefined || this.ls_get("codes") == "" || this.ls_get("codes") == null)
        return false;

      let obj = JSON.parse(this.ls_get("codes"));
      let index = obj.map(function (e) {
        return e.code;
      }).indexOf(code);
      return index != -1;
    }
  },
  data() {
    return {
      menu: [],
      menuMobile: [],
      refreshing: false,
      registration: null,
      updateExists: false,
    }
  }
}
</script>

<style>
#aboveAll {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 60000;
  background-color: rgb(137, 137, 137, 0.3);
  transition: 0.2;
}
.half-circle-spinner {
     position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
 
}
.semipolar-spinner {
      position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    top: 50%;

}


</style>
<style lang="scss">
.ql-editor {
  max-height: 140px !important;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.v-sidebar-menu {
  z-index: 1000;
  display: block !important;
}

@media (min-width: 900px) {
  .header-brand {
    /* display: none; */
  }
}

@media (max-width: 900px) {
  .v-sidebar-menu,
  .avatar {
    display: none !important;
  }
}

.vsm-link {
  font-size: 14px !important;
  padding: 8px !important;
}




@media (max-width: 1600px) {
.vsm-link {
  font-size: 14px !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}
}

@media (max-width: 1400px) {
.vsm-link {
  font-size: 13px !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}
}

@media (max-width: 1200px) {
.vsm-link {
  font-size: 13px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.v-sidebar-menu .vsm-item.first-item > .vsm-link > .vsm-icon {
  color: #b0b0d3 !important
}
}

.vsm-icon {
  height: 30px !important;
  width: 30px !important;
  line-height: 30px !important;
}

.collapse-btn {
  height: 35px !important;
}

// A

.v-sidebar-menu {
  background: #fff !important;
}

.v-sidebar-menu .vsm-item.first-item>.vsm-link>.vsm-icon {
  background: #fff !important;
}

.v-sidebar-menu .vsm-icon {
  color: #ccc !important;
}

$primaryColor: rgb(130, 130, 150);
$baseBg: #fff;
$darkenBg: darken($baseBg, 5%);
$lightenBg: #e0e0e0;

$itemColor: rgb(130, 130, 130);

$itemOpenColor: #fff;
$itemOpenBg: $primaryColor;

$itemHoverColor: rgb(130, 130, 130);
$itemHoverBg: $darkenBg;

$iconColor: rgb(190, 190, 210);
$iconBg: #fff;

$iconActiveColor: rgb(75, 114, 224);
$iconActiveBg: #fff;

$iconOpenColor: #fff;
$iconOpenBg: transparent;

$mobileItemColor: #fff;
$mobileItemBg: $primaryColor;
$mobileIconBg: transparent;
$mobileIconColor: #fff;

$dropDownColor: #262626;
$dropDownBg: #fff;

.v-sidebar-menu {
  background-color: $baseBg !important;

  padding-top: 65px;

  & .vsm-list {}

  & .vsm-link {
    color: $itemColor !important;
    text-align: left;
    border-left: 1px solid #eee;

  }

  & .vsm-title {
    text-align: left;
  }

  & .vsm-item.mobile-item {
    &>.vsm-link {
      color: $mobileItemColor !important;
    }

    &>.vsm-icon {
      color: $mobileIconColor !important;
      background-color: $mobileIconBg !important;
      padding-right: 0px;
      margin-right: 0px;
    }
  }

  & .vsm-item.first-item {
    &>.vsm-link {
      &>.vsm-icon {
        color: $iconColor !important;
        background-color: $iconBg !important;
      }
    }

    &.active-item>.vsm-link,
    &.parent-active-item>.vsm-link {

      // box-shadow: 3px 0px 0px 0px $primaryColor inset !important;
      &>.vsm-icon {
        color: $iconActiveColor !important;
        background-color: $iconActiveBg !important;
      }
    }
  }

  &.rtl .vsm-item.first-item {

    &.active-item>.vsm-link,
    &.parent-active-item>.vsm-link {
      // box-shadow: -3px 0px 0px 0px $primaryColor inset !important;
    }
  }

  &.vsm-default {
    & .vsm-item.first-item {
      &.open-item>.vsm-link {
        color: $itemOpenColor !important;
        background-color: $itemOpenBg !important;

        &>.vsm-icon {
          color: $iconOpenColor !important;
          background-color: $iconOpenBg !important;
        }
      }
    }

    & .vsm-link:hover {
      color: $itemHoverColor !important;
      background-color: #000 !important;
    }
  }

  & .nav-item {}

  & .vsm-dropdown {

    &>.vsm-list {
      background-color: $dropDownBg !important;

      &:hover {}

      & .vsm-link {
        color: #333 !important;
      }

      & .vsm-link:hover {
        color: $itemHoverColor !important;
        background-color: #fff !important;
      }

      & .vsm-icon {

        padding-right: 0px !important;
        margin-right: 0px !important;
      }

      & .vsm-title {
        font-size: 12px;
        padding-left: 0px !important;
        margin-left: 0px !important;
      }

      & :hover {
        // color: $itemHoverColor !important;
        // background-color: #e3e3e3 !important; 
      }
    }
  }

  & .vsm-mobile-bg {
    background-color: $mobileItemBg !important;
  }

  & .vsm-header {
    color: rgba($itemColor, 0.7) !important;
  }

  & .vsm-badge.default-badge {
    color: $itemColor !important;
    background-color: $lightenBg !important;
  }

  & .collapse-btn {
    color: $itemColor !important;
    background-color: $darkenBg !important;
  }
}

.vsm-list {
  border-right: 1px solid rgba(0, 40, 100, 0.12);
}

.py-4 {
    padding-bottom: 0.8rem !important;
}


@media (max-width: 1200px) {
.vsm-link {
  font-size: 13px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.v-sidebar-menu .vsm-item.first-item > .vsm-link > .vsm-icon {
  color: #b0b0d3 !important
}
}
</style>

