<template>
  <div id="app">
    <sidebar-menu :menu="menu" v-if="isAuth" :collapsed="true" />
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

<style lang="scss">


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
</style>
