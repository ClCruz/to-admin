<template>
    <div>my/info</div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import { func } from "@/functions";
Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'my-info',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Informações",
      }
    },
  },
}
</script>

<style>

</style>
