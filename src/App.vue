<template>
<div id="app" class="">

  <div class="header py-4" v-if="isAuth">
    <div class="container">
      <div class="d-flex">
        <a class="header-brand" href="./index.html">
                <!-- <img src="./demo/brand/tabler.svg" class="header-brand-img" alt="tabler logo"> -->
              </a>
        <div class="d-flex order-lg-2 ml-auto">
          <!-- <div class="nav-item d-none d-md-flex">
            <a href="https://github.com/tabler/tabler" class="btn btn-sm btn-outline-primary" target="_blank">Source code</a>
          </div> -->
          <!-- <div class="dropdown d-none d-md-flex">
            <a class="nav-link icon" data-toggle="dropdown">
                    <i class="fe fe-bell"></i>
                    <span class="nav-unread"></span>
                  </a>
            <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
              <a href="#" class="dropdown-item d-flex">
                      <span class="avatar mr-3 align-self-center" style="background-image: url(demo/faces/male/41.jpg)"></span>
                      <div>
                        <strong>Nathan</strong> pushed new commit: Fix page load performance issue.
                        <div class="small text-muted">10 minutes ago</div>
                      </div>
                    </a>
              <a href="#" class="dropdown-item d-flex">
                      <span class="avatar mr-3 align-self-center" style="background-image: url(demo/faces/female/1.jpg)"></span>
                      <div>
                        <strong>Alice</strong> started new task: Tabler UI design.
                        <div class="small text-muted">1 hour ago</div>
                      </div>
                    </a>
              <a href="#" class="dropdown-item d-flex">
                      <span class="avatar mr-3 align-self-center" style="background-image: url(demo/faces/female/18.jpg)"></span>
                      <div>
                        <strong>Rose</strong> deployed new version of NodeJS REST Api V3
                        <div class="small text-muted">2 hours ago</div>
                      </div>
                    </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item text-center">Mark all as read</a>
            </div>
          </div> -->
          <div class="dropdown">
            <a href="#" class="nav-link pr-0 leading-none" data-toggle="dropdown">
                    <span class="avatar" :style="{ backgroundImage: 'url(\'https://avatar.tobi.sh/tobiaslins.svg?text=' + getLoggedEmail().substring(0,2) + '\')' }" style="background-size: cover"></span>
                    <span class="ml-3 d-none d-lg-block  text-left">
                      <span class="text-default">{{this.getLoggedEmail() == null ? "Carregando..." : this.getLoggedEmail()}}</span>
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

  <v-wait for="loadingAboveAll">
    <template slot="waiting">
      <div id="aboveAll">
        <div class="sk-cube-grid">
          <div class="sk-cube sk-cube1"></div>
          <div class="sk-cube sk-cube2"></div>
          <div class="sk-cube sk-cube3"></div>
          <div class="sk-cube sk-cube4"></div>
          <div class="sk-cube sk-cube5"></div>
          <div class="sk-cube sk-cube6"></div>
          <div class="sk-cube sk-cube7"></div>
          <div class="sk-cube sk-cube8"></div>
          <div class="sk-cube sk-cube9"></div>
        </div>
      </div>
    </template>
  </v-wait>

  <sidebar-menu :menu="menu" v-if="isAuth" :collapsed="true" :widthCollapsed="'48px'" :width="'240px'" />
  <div class="p-5">
    <router-view />
  </div>
</div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import VueSidebarMenu from 'vue-sidebar-menu'
import config from "@/config";
import {
  func
} from "@/functions";

Vue.use(VueSidebarMenu);
Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'home',
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
      let menuHelper = [{
          header: true,
          title: 'TicketOffice - Administrador',
          code: 'all',
          theme: {
            type: String,
          }
        },
        {
          title: 'Bilheteria',
          icon: 'fas fa-ticket-alt',
          code: 'ticketoffice-login',
          href: '/ticketoffice',
        },        
        // {
        //   title: 'Dashboard',
        //   icon: 'fas fa-chart-bar',
        //   code: 'all',
        //   href: '/',
        // },
        {
          title: 'Eventos',
          icon: 'fas fa-puzzle-piece',
          code: 'ev-viewer',
          child: [{
              href: '/event/add',
              title: 'Adicionar',
              icon: 'fas fa-plus',
              code: 'ev-viewer'
            },
            {
              href: '/event/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'ev-viewer'
            },
            {
              href: '/room/add',
              title: 'Adicionar sala',
              icon: 'fas fa-person-booth',
              code: 'room-viewer'
            },
            {
              href: '/room/list',
              title: 'Listar sala',
              icon: 'fas fa-th-list',
              code: 'room-viewer'
            },
          ]
        },
        {
          title: 'Usuários',
          icon: 'fas fa-users',
          code: 'all',
          code: 'user-viewer',
          child: [{
              href: '/user/add',
              title: 'Adicionar',
              icon: 'fas fa-plus',
              code: 'user-add'
            },
            {
              href: '/user/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
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
              icon: 'fas fa-plus',
              code: 'ad-add'
            },
            {
              href: '/ad/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'ad-viewer' //'all',//'user-viewer'
            },
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
              icon: 'fas fa-plus',
              code: 'genre-add'
            },
            {
              href: '/genre/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'genre-viewer', //'user-viewer'
            },
          ]
        },
        {
          title: 'Cota',
          icon: 'fas fa-star-half-alt',
          code: 'quotapartner-viewer',
          //code: 'user-viewer',
          child: [
            {
              href: '/quota/add',
              title: 'Adicionar',
              icon: 'fas fa-plus',
              code: 'quotapartner-add'
            },
            {
              href: '/quota/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'quotapartner-viewer',//'user-viewer'
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
              icon: 'fas fa-plus',
              code: 'place-add'
            },
            {
              href: '/place/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'place-viewer', //'user-viewer'
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
              icon: 'fas fa-plus',
              code: 'producer-add'
            },
            {
              href: '/producer/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
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
              icon: 'fas fa-plus',
              code: 'partner-add'
            },
            {
              href: '/partner/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
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
          title: 'Bilhete',
          icon: 'fas fa-clipboard-list',
          code: 'tickettype-viewer',
          child: [{
              href: '/tickettype/add',
              title: 'Adicionar',
              icon: 'fas fa-plus',
              code: 'tickettype-add'
            },
            {
              href: '/tickettype/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'tickettype-viewer',
            },
          ]
        }
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
    },
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
  height: 100%;
  z-index: 60000;
  background-color: rgb(137, 137, 137, 0.9);
  transition: 0.2;
}
</style>
<style lang="scss">
.sk-cube-grid {
  width: 60px;
  height: 60px;
  margin: 340px auto;
}

.sk-cube-grid .sk-cube {
  width: 33%;
  height: 33%;
  background-color: rgb(75, 114, 224);
  float: left;
  -webkit-animation: sk-cubeGridScaleDelay 3s infinite ease-in-out;
  animation: sk-cubeGridScaleDelay 3s infinite ease-in-out;
}

.sk-cube-grid .sk-cube1 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.sk-cube-grid .sk-cube2 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.sk-cube-grid .sk-cube3 {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.sk-cube-grid .sk-cube4 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.sk-cube-grid .sk-cube5 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.sk-cube-grid .sk-cube6 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.sk-cube-grid .sk-cube7 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

.sk-cube-grid .sk-cube8 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.sk-cube-grid .sk-cube9 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes sk-cubeGridScaleDelay {

  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }

  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}

@keyframes sk-cubeGridScaleDelay {

  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }

  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}

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

.vsm-link {
  font-size: 14px !important;
  padding: 8px !important;
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

        margin-top: 65px;
  & .vsm-list {
  }

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
</style>
