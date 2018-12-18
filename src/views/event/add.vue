<template>
    <div>event/add</div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import { func } from "@/functions";
Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'event-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Evento - Adicionar",
      }
    },
  },
}
</script>

<style>

</style>
