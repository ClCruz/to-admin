import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import './registerServiceWorker';
import BootstrapVue from 'bootstrap-vue';
import VueWait from 'vue-wait';
import vueAlert from 'vue-sweetalert2';
import VueHead from 'vue-head';

Vue.config.productionTip = false;

Vue.use(VueHead);
Vue.use(VueWait);
Vue.use(vueAlert);
Vue.use(BootstrapVue);

new Vue({
  el: "#app",
  router,
  store,
  wait: VueWait,
  render: h => h(App)
}).$mount('#app')
