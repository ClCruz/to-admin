<template>
<div>
    <dashboard :key="dashboard_id" v-if="!!checkIsAuth() && mayIseedashboard"></dashboard>
</div>
</template>

<script>
import dashboard from "@/views/dashboard/index.vue";

import {
  func
} from "@/functions";


export default {
  mixins: [func],
  name: 'home',
  data() {
    return {
      dashboard_id: 1,
    };
  },
  components: {
    dashboard,
  },
  computed: {
    mayIseedashboard() {
      return this.mayI('dashboard-home-viewer');
    }
  }
}
</script>
