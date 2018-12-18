<template>
    <div>user/list</div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import { func } from "@/functions";
Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'user-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Usuário - Lista",
      }
    },
  },
}
</script>

<style>

</style>
