<template>
    <div v-if="mayIsee">
      <b-container>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text>
              Base:
            </b-input-group-prepend>
            <b-form-select v-on:change="selBase" v-model="form.id_base" :options="selects.base" size="sm">
                <template slot="first">
                    <option :value="''" disabled>-- Selecione --</option>
                </template>
            </b-form-select>
          </b-input-group>
        </b-row>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text class="firstLabel">
                Evento:
            </b-input-group-prepend>
            <b-form-select id="event" v-on:change="selEvent" v-model="form.id_evento" :options="selects.events">
                <template slot="first">
                    <option :value="null" disabled>-- Selecione --</option>
                </template>
            </b-form-select>
          </b-input-group>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <b-row>
            <b-input-group size="sm">
              <b-input-group-prepend is-text class="firstLabel">
                  Dias:
              </b-input-group-prepend>
              <b-form-select id="days"
                              :options="selects.days"
                              v-on:change="selDays"
                              v-model="form.date">
                  <template slot="first">
                      <option :value="null" disabled>-- Selecione --</option>
                  </template>
              </b-form-select>
            </b-input-group>
            </b-row>
          </b-col>
          <b-col>
            <b-row>
            <b-input-group size="sm">
              <b-input-group-prepend is-text class="firstLabel">
                  Horário:
              </b-input-group-prepend>
              <b-form-select id="hours"
                              :options="selects.hours"
                              v-on:change="selHours"
                              v-model="form.hour">
                  <template slot="first">
                      <option :value="null" disabled>-- Selecione --</option>
                  </template>
              </b-form-select>
            </b-input-group>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <b-row>
              <b-button type="button" variant="primary" size="sm" @click="search">
                <v-wait for="inprocess">
                    <template slot="waiting">
                        Aguarde...
                    </template>
                </v-wait>
                <span v-if="!processing">Consultar</span>
              </b-button>
            </b-row>
          </b-col>
          <b-col>
            <b-row>
              <b-button type="button" variant="primary" size="sm" @click="exportExcel" v-if="this.bordero!=''">
                <v-wait for="inprocess">
                    <template slot="waiting">
                        Aguarde...
                    </template>
                </v-wait>
                <span v-if="!processing">Excel</span>
              </b-button>
            </b-row>
          </b-col>
        </b-row>
      </b-container>

      <vue-friendly-iframe id="bordero" :src="url" :width="'1000px'" :height="'2000px;'" @load="iframeloaded" @document-load="iframeloaded2" v-if="executed"></vue-friendly-iframe>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import VueFriendlyIframe from 'vue-friendly-iframe';
import html2canvas from 'html2canvas';
import config from "@/config";
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { eventService } from "../../components/common/services/event";
import jsPDF from 'jspdf';


Vue.use(VueHead);
Vue.component('vue-friendly-iframe', VueFriendlyIframe);

export default {
  mixins: [func],
  name: 'report-accounting',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Relatórios - Borderô",
      }
    },
  },
  computed: {
    url() {
      return this.bordero == '' ? "" : this.bordero;
    },
    mayIsee() {
      return this.mayI('report-viewer', 'report-accounting');
    }
  },
  created() {
    this.populateBases();
  },
  methods: {
    exportExcel() {
      if (this.bordero == "") {
        this.toastError("Consulte antes de exportar");
        return;
      }
      window.open(this.bordero+"&exportto=sheet");
    },
    iframeloaded() {
      let me = this;
      setTimeout(function() { 
        me.processing = false;
        me.hideWaitAboveAll();
        me.$wait.end("inprocess");
        me.executed = true;
      }, 4000);
    },
    iframeloaded2() {
    },
    populateBases() {
      this.showWaitAboveAll();
      userService.baseSelect(this.getLoggedId()).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.base = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );
    },
    populateEvents() {
      
      if (this.form.id_base == '') {
        return;
      }
      this.selects.events = [];
      this.selects.days = [];
      this.selects.hours = [];

      this.showWaitAboveAll();
      eventService.select(this.getLoggedId(),this.form.id_base).then(
        response => {
          this.selects.events = response;
          this.hideWaitAboveAll();
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");        
        }
      );
    },
    populateDays() {
      if (this.form.id_base == '' || this.form.id_evento == '') {
        return;
      }
      this.selects.days = [];
      this.selects.hours = [];

      this.showWaitAboveAll();
      eventService.selectDays(this.getLoggedId(),this.form.id_base, this.form.id_evento).then(
        response => {
          this.selects.days = response;
          this.hideWaitAboveAll();
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");        
        }
      );
    },
    populateHours() {
      if (this.form.id_base == '' || this.form.id_evento == '' || this.form.date == '') {
        return;
      }
      this.selects.hours = [];

      this.showWaitAboveAll();
      eventService.selectDayHours(this.getLoggedId(),this.form.id_base, this.form.id_evento, this.form.date).then(
        response => {
          this.selects.hours = response;
          this.hideWaitAboveAll();
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");        
        }
      );
    },
    selBase() {
      Vue.nextTick().then(response => {
        this.selects.events = [];
        this.selects.days = [];
        this.selects.hours = [];

        this.form.id_evento = "";
        this.form.date = "";
        this.form.hour = "";

        this.populateEvents();
      });
    },
    selEvent() {
      Vue.nextTick().then(response => {
        this.selects.days = [];
        this.selects.hours = [];

        this.form.date = "";
        this.form.hour = "";

        this.populateDays();
      });
    },
    selDays() {
      Vue.nextTick().then(response => {
        this.selects.hours = [];

        this.form.hour = "";

        this.populateHours();
      });
    },
    selHours() {

    },
    search() {
        this.executed = false;
        this.processing = true;
        this.$wait.start("inprocess");

        this.showWaitAboveAll();
        eventService.borderokey(this.getLoggedId(), this.form.id_evento, this.form.date, this.form.hour, this.form.id_base).then(
          response => {
            //this.processing = false;
            //this.hideWaitAboveAll();
            this.bordero = eventService.borderourl(response.id, this.form.id_base);
            this.executed = true;
            //this.$wait.end("inprocess");

            //if (response.success) {
            //  this.toastSuccess("Salvo com sucesso");
            //} else {
            //  this.toastError(response.msg);
           // }
          },
          error => {
            this.processing = false;
            this.hideWaitAboveAll();
            this.$wait.end("inprocess");
            this.toastError("Falha na execução.");
          }
        );
    },
    clear() {
      this.form.id_base = "";
      this.form.id_evento = "";
      this.form.date = "";
      this.form.hour = "";
    }
  },
  data () {
    return {
      processing: false,
      loading: false,
      bordero: '',
      executed: false,
      form: {
        id_base: '',
        id_evento: '',
        date: '',
        hour: '',
      },
      selects: {
        base: [],
        events: [],
        days: [],
        hours: []
      },
      popups: {
      }
    }
  }
}
</script>

<style>
.vue-friendly-iframe iframe {
  width: 740px;
  height: 1220px;
  border: 0px;
}
</style>
