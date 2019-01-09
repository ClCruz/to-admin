<template>
    <div v-if="mayIsee">
      <b-container>
        teste
      </b-container>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import { func } from "@/functions";

Vue.use(VueHead);

export default {
  mixins: [func],
  props: ['id'],
  name: 'pres-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Apresentação - ${this.typeOf}`,
      }
    },
  },
  created() {
    if (!this.isAdd) {
      this.get();
    }
  },
  computed: {
    mayIsee() {
      return this.mayI('presentation-add', 'presentation-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    }
  },
  methods: {
    save() {
    },
    get() {
    }
  },
  data () {
    return {
        processing: false,
        loading: false,
        form: {
          loaded: false,
        }
    }
  }
}
</script>

<style>

</style>
