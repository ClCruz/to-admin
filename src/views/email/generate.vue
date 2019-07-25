<template>
    <div>
      
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import VueMask from 'v-mask';
import Moment from 'moment';
import HotelDatePicker from 'vue-hotel-datepicker';
import VueClipboard from 'vue-clipboard2';
import Vuelidate from 'vuelidate';
import { extendMoment } from 'moment-range';
import config from "@/config";
import { func } from "@/functions";
import { partnerService } from '../../components/common/services/partner';

import { required } from 'vuelidate/lib/validators';

const moment = extendMoment(Moment);
Vue.use(VueClipboard);
Vue.use(VueHead);
Vue.use(VueMask);
Vue.use(Vuelidate);

export default {
  mixins: [func],
  props: ['id'],
  name: 'email-generate',
  components: {  },
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Criar template email - ${this.typeOf}`,
      }
    },
  },
  created() {
    Vue.nextTick().then(response => {
    });
  },
  computed: {
   
  },
  methods: {
   
  },
  data () {
    return {
      
    }
  }
}
</script>

<style scoped>
.errorFormValidate {
  margin-top: 5px !important;
  margin-bottom: -10px;
}
</style>
