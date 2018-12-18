<template>
    <div>my/pass</div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import { func } from "@/functions";
Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'my-pass',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Mudar senha",
      }
    },
  },
}
</script>

<style>

</style>
