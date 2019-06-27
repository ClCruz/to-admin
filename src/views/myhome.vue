<template>
<div :key="iddiv">
  <dashboard :key="dashboardid" v-if="!checkIsAuth() && mayIseedashboard"></dashboard>
</div>
</template>

<script>
import Vue from "vue";
import VueResource from "vue-resource";
import config from "@/config";
import dashboard from "@/views/dashboard/index.vue";

import {
  func
} from "@/functions";
import {
  authService
} from "../components/common/services/auth";

export default {
  mixins: [func],
  data() {
    return {
      iddiv: 1,
      dashboardid: 1,
      logged: false,
      processing: false,
      login: null,
      password: null,
      showPassword: false
    };
  },
  components: {
    dashboard,
  },
  computed: {
    mayIseedashboard() {
      return this.mayI('dashboard-home-viewer');
    }
  },
  created() {
    if (this.isAuth) {
      this.goHome();
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
