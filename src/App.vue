<template>
  <div id="app">
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
    <sidebar-menu :menu="menu" v-if="isAuth" :collapsed="true" :widthCollapsed="'35px'" :width="'250px'" />
    <div class="p-5">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import VueSidebarMenu from 'vue-sidebar-menu'
import config from "@/config";
import { func } from "@/functions";

Vue.use(VueSidebarMenu);
Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'home',
  created() {
    // Listen for swUpdated event and display refresh snackbar as required.
    document.addEventListener('swUpdated', this.showRefreshUI, { once: true });
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
  computed: {
  },
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
    showRefreshUI (e) {
      this.registration = e.detail;
      this.updateExists = true;
      this.$swal({
        title: 'Nova versão',
        text: "Realizamos atualizações no sistema, iremos atualizar agora.",
        type: 'success',
        toast: true,
        position: 'top-end',
        customClass: 'alert__tixsme alert__sucess',
        background: '#333',
        showConfirmButton: false,
        timer: 4000,
      }).then((result) => {
        this.refreshApp();
      });
//      this.refreshApp();
      //this.toastSuccess("Realizamos atualizações no site, iremos atualizar agora.");
    },
    refreshApp () {
      this.updateExists = false;
      if (!this.registration || !this.registration.waiting) { return; }
      this.registration.waiting.postMessage('skipWaiting');
    },
    setMenu() {
      let menuHelper = [
        {
          header: true,
          title: 'TicketOffice - Administrador',
          code: 'all'
        },
        {
          title: 'Meu cadastro - ' + this.getLoggedEmail() == null ? "Carregando..." : this.getLoggedEmail(),
          icon: 'far fa-address-card',
          code: 'all',
          child: [
            {
              href: '/my/info',
              title: 'Informações',
              icon: 'fas fa-info',
              code: 'all',
            },
            {
              href: '/my/pass',
              title: 'Mudar senha',
              icon: 'fas fa-key',
              code: 'all',
            },
            {
              href: '/logout',
              title: 'Sair',
              icon: 'fas fa-sign-out-alt',
              code: 'all',
            }
          ]
        },
        {
          title: 'Usuários',
          icon: 'fas fa-users',
          code: 'all',
          code: 'user-viewer',
          child: [
            {
              href: '/user/add',
              title: 'Adicionar',
              icon: 'fas fa-plus',
              code: 'user-add'
            },
            {
              href: '/user/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'user-viewer'//'all',//'user-viewer'
            },
          ]
        },
        {
          title: 'Relatórios',
          icon: 'fas fa-chart-bar',
          code: 'all',
          code: 'report-viewer',
          child: [
            {
              href: '/report/accounting',
              title: 'Borderô',
              icon: 'fas fa-file-invoice-dollar',
              code: 'report-accounting'
            },
          ]
        },
               {
          title: 'Propaganda',
          icon: 'fas fa-ad',
          code: 'all',
          code: 'ad-viewer',
          child: [
            {
              href: '/ad/add',
              title: 'Adicionar',
              icon: 'fas fa-plus',
              code: 'ad-add'
            },
            {
              href: '/ad/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'ad-viewer'//'all',//'user-viewer'
            },
          ]
        },
        {
          title: 'Bilheteria',
          icon: 'fas fa-ticket-alt',
          code: 'ticketoffice-login',
          href: '/ticketoffice',
        },
        {
          title: 'Gênero',
          icon: 'fas fa-band-aid',
          code: 'genre-viewer',
          //code: 'user-viewer',
          child: [
            {
              href: '/genre/add',
              title: 'Adicionar',
              icon: 'fas fa-plus',
              code: 'genre-add'
            },
            {
              href: '/genre/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'genre-viewer',//'user-viewer'
            },
          ]
        },
        {
          title: 'Local',
          icon: 'fas fa-map-marked-alt',
          code: 'place-viewer',
          //code: 'user-viewer',
          child: [
            {
              href: '/place/add',
              title: 'Adicionar',
              icon: 'fas fa-plus',
              code: 'place-add'
            },
            {
              href: '/place/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'place-viewer',//'user-viewer'
            },
          ]
        },
        {
          title: 'Produtores',
          icon: 'fas fa-people-carry',
          code: 'producer-viewer',
          //code: 'user-viewer',
          child: [
            {
              href: '/producer/add',
              title: 'Adicionar',
              icon: 'fas fa-plus',
              code: 'producer-add'
            },
            {
              href: '/producer/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'producer-viewer',//'user-viewer'
            },
          ]
        },
        {
          title: 'Parceiros',
          icon: 'far fa-handshake',
          code: 'partner-viewer',
          child: [
            {
              href: '/partner/add',
              title: 'Adicionar',
              icon: 'fas fa-plus',
              code: 'partner-add'
            },
            {
              href: '/partner/list',
              title: 'Listar',
              icon: 'fas fa-th-list',
              code: 'partner-viewer',//'user-viewer'
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
          child: [
            {
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
        },
        {
          title: 'Eventos',
          icon: 'fas fa-puzzle-piece',
          code: 'ev-viewer',
          child: [
            {
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
        }
      ];

      for (let x = (menuHelper.length-1); x > 0; x--) {
        const element = menuHelper[x];
        if (!this.removeOrNot(x, element, menuHelper)) {
          continue;
        }

        if (menuHelper[x].hasOwnProperty('child')) {
          for (let x2 = (menuHelper[x].child.length-1); x2 > 0; x2--) {
            const element = menuHelper[x].child[x2];
            if (!this.removeOrNot(x2, element, menuHelper[x].child)) {
              continue;
            }

            if (menuHelper[x].child[x2].hasOwnProperty('child')) {
              for (let x3 = (menuHelper[x].child[x2].child.length-1); x3 > 0; x3--) {
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
          }        
          else {
            //console.log("ok");
          }
        }
        return true;
    },
    menuCheck(code) {
      if (this.ls_get("codes") == undefined || this.ls_get("codes") == "" || this.ls_get("codes") == null)
        return false;

      let obj = JSON.parse(this.ls_get("codes"));
      let index = obj.map(function(e) { return e.code; }).indexOf(code);
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
      z-index:60000;
      background-color: rgb(137, 137, 137, 0.9);
      transition: 0.2;
  }
</style>
<style lang="scss">
.sk-cube-grid {
  width: 140px;
  height: 140px;
  margin: 200px auto;
}

.sk-cube-grid .sk-cube {
  width: 33%;
  height: 33%;
  background-color: #000;
  float: left;
  -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
          animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out; 
}
.sk-cube-grid .sk-cube1 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }
.sk-cube-grid .sk-cube2 {
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s; }
.sk-cube-grid .sk-cube3 {
  -webkit-animation-delay: 0.4s;
          animation-delay: 0.4s; }
.sk-cube-grid .sk-cube4 {
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s; }
.sk-cube-grid .sk-cube5 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }
.sk-cube-grid .sk-cube6 {
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s; }
.sk-cube-grid .sk-cube7 {
  -webkit-animation-delay: 0s;
          animation-delay: 0s; }
.sk-cube-grid .sk-cube8 {
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s; }
.sk-cube-grid .sk-cube9 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }

@-webkit-keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
            transform: scale3D(1, 1, 1);
  } 35% {
    -webkit-transform: scale3D(0, 0, 1);
            transform: scale3D(0, 0, 1); 
  }
}

@keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
            transform: scale3D(1, 1, 1);
  } 35% {
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
  z-index: 50000;
  display:block !important;
}
.vsm-link {
  font-size: 12px !important;
  padding: 8px !important;
}
.vsm-icon {
  height: 20px !important;
  width: 20px !important;
  line-height: 20px !important;
}
.collapse-btn {
  height: 30px !important;
}
</style>
