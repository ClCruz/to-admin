<template>
    <div v-if="mayIsee">
      <b-container>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.id_base.$invalid) }">
              Base:
            </b-input-group-prepend>
            <b-form-select v-on:change="selBase" v-model="form.id_base" :options="selects.base" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_base.$invalid) }" />
                <template slot="first">
                    <option :value="''" disabled>-- Selecione --</option>
                </template>
            </b-form-select>
          </b-input-group>
          <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_base.required">Campo é obrigatório</div>
        </b-row>
          <hr class="hr-text" data-content="E/OU">      
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.id_evento.$invalid) }">
                Evento:
            </b-input-group-prepend>
            <b-form-select id="event" v-on:change="selEvent" v-model="form.id_evento" :options="selects.events" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_evento.$invalid) }" />
                <template slot="first">
                    <option :value="null" disabled>-- Selecione --</option>
                </template>
            </b-form-select>
          </b-input-group>
          <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_evento.required">Campo é obrigatório</div>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <b-row>
            <b-input-group size="sm">
              <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.date.$invalid) }">
                  Dias:
              </b-input-group-prepend>
              <b-form-select id="days"
                              :options="selects.days"
                              v-on:change="selDays"
                              v-model="form.date" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.date.$invalid) }" />
                  <template slot="first">
                      <option :value="null" disabled>-- Selecione --</option>
                  </template>
              </b-form-select>
            </b-input-group>
            <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.date.required">Campo é obrigatório</div>
            </b-row>
          </b-col>
          <b-col>
            <b-row>
            <b-input-group size="sm">
              <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.hour.$invalid) }">
                  Horário:
              </b-input-group-prepend>
              <b-form-select id="hours"
                              :options="selects.hours"
                              v-on:change="selHours"
                              v-model="form.hour" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.hour.$invalid) }" />
                  <template slot="first">
                      <option :value="null" disabled>-- Selecione --</option>
                  </template>
              </b-form-select>
            </b-input-group>
            <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.hour.required">Campo é obrigatório</div>
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
              <b-button type="button" variant="primary" size="sm" @click="startprint" v-if="grids.default.loaded && grids.default.items.length > 0">
                <v-wait for="inprocess">
                    <template slot="waiting">
                        Aguarde...
                    </template>
                </v-wait>
                <span v-if="!processing">Imprimir</span>
              </b-button>              
            </b-row>
          </b-col>
        </b-row>
        <b-row v-if="grids.default.loaded && grids.default.type == 'all'">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title text-center">Total de clientes do parceiro</h3>
                </div>
                <div class="card-header">
                  <table style="width:100%">
                    <tr>
                        <td style="text-align:left">
                            <span class="status-icon bg-warning"></span><span class="text-muted" style="text-align:" v-if="grids.default.items.length>0">Total de registros :: {{grids.default.items.length}}</span>
                        </td>
                    </tr>
                  </table>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover table-outline table-vcenter text-nowrap card-table">
                    <thead>
                      <tr>
                        <th class="text-center">CPF</th>
                        <th class="w-1">Cliente</th>
                        <th class="text-center">E-mail</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item) in grids.default.items" v-bind:key="'all_'+item.id" style="cursor:pointer">
                        <td><div>{{item.document}}</div></td>
                        <td>
                          <div class="clearfix">
                            {{item.name}}
                          </div>
                        </td>
                        <td><div>{{item.email}}</div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>  
        </b-row>
        <b-row v-if="grids.default.loaded && grids.default.type == 'byevent'">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title text-center">Total de clientes do evento</h3>
                </div>
                <div class="card-header">
                  <table style="width:100%">
                    <tr>
                        <td style="text-align:left">
                            <span class="status-icon bg-warning"></span><span class="text-muted" style="text-align:" v-if="grids.default.items.length>0">Total de registros :: {{grids.default.items.length}}</span>
                        </td>
                    </tr>
                  </table>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover table-outline table-vcenter text-nowrap card-table">
                    <thead>
                      <tr>
                        <th class="text-center">CPF</th>
                        <th class="w-1">Cliente</th>
                        <th class="text-center">E-mail</th>
                        <th class="text-center">Assento</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item) in grids.default.items" v-bind:key="'all_'+item.id" style="cursor:pointer">
                        <td><div>{{item.document}}</div></td>
                        <td>
                          <div class="clearfix">
                            {{item.name}}
                          </div>
                        </td>
                        <td><div>{{item.email}}</div></td>
                        <td>
                          <div>
                            {{item.seat}}
                          </div>
                          <span class="text-muted">{{item.room}}</span>
                          </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
        </b-row>
      </b-container>
      
      <!-- <vue-friendly-iframe ref="reportiframe" id="partnersale" :src="url" :width="'1200px'" :height="'2000px;'" @load="iframeloaded" @document-load="iframeloaded2" style="display:inline"></vue-friendly-iframe> -->
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import Vuelidate from 'vuelidate';
import VueFriendlyIframe from 'vue-friendly-iframe';
import config from "@/config";
import { clientService } from "../../components/common/services/report/client";
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { eventService } from "../../components/common/services/event";

Vue.use(Vuelidate);
Vue.use(VueHead);
Vue.component('vue-friendly-iframe', VueFriendlyIframe);

import {
  required
  ,helpers
} from 'vuelidate/lib/validators';

export default {
  mixins: [func],
  name: 'report-clients',
  directives: { },
  components: { },
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Relatórios - Venda por parceiro",
      }
    },
  },
  computed: {
    url() {
      return this.report == '' ? "" : this.report;
    },
    mayIsee() {
      return this.mayI('report-client');
    }
  },
  created() {
    this.populateBases();
  },
  methods: {
    searchall() {
      if (this.processing) return;
      this.processing = true;

      this.showWaitAboveAll();
      clientService.list(this.getLoggedId(), this.form.id_base).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
              this.grids.default.loaded = true;
              this.grids.default.type = 'all';
              this.grids.default.items = response;
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );      
    },
    searchbyevent() {
      if (this.processing) return;
      this.processing = true;

      this.showWaitAboveAll();
      clientService.byevent(this.getLoggedId(), this.form.id_base, this.form.id_evento, this.form.date, this.form.hour).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
              this.grids.default.loaded = true;
              this.grids.default.type = 'byevent';
              this.grids.default.items = response;
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );      
    },
    search() {
      if (this.form.id_evento == '') {
        this.searchall();
      }
      else {
        this.searchbyevent();
      }
    },
    startprint() {
      if (this.form.id_evento == '') {
        let url = clientService.list_printurl(this.getLoggedId(), this.form.id_base);
        window.open(url); 
      }
      else {
        let url = clientService.byevent_printurl(this.getLoggedId(), this.form.id_base, this.form.id_evento, this.form.date, this.form.hour);
        window.open(url); 
      }
    },
    iframeloaded() {
      let me = this;
      this.processing = false;
      setTimeout(function() { 
        me.hideWaitAboveAll();
        me.$wait.end("inprocess");
        me.executed = true;
      }, 1000);
    },
    iframeloaded2() {
      
    },
    populateBases() {
      if (this.getLoggedId() == null || this.getLoggedId() == "") return;
      
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
    clear() {
      this.form.id_base = "";
      this.form.id_evento = "";
      this.form.date = "";
      this.form.hour = "";
    }
  },
  validations: {
    form: {
      id_base: {
        required,
      },
      id_evento: {
        
      },
      date: {
        
      },
      hour: {
        
      }
    }
  },
  data () {
    return {
      processing: false,
      loading: false,
      executedAtLeastOne: false,
      report: '',
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
      grids: { 
          default: {
              type: '',
              loaded: false,
              items: [],
          },
      },
    }
  }
}
</script>
<style lang="scss">
.hr-text {
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: black;
  text-align: center;
  height: 1.5em;
  opacity: .5;
  &:before {
    content: '';
    // use the linear-gradient for the fading effect
    // use a solid background color for a solid bar
    background: linear-gradient(to right, transparent, #818078, transparent);
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
  }
  &:after {
    content: attr(data-content);
    position: relative;
    display: inline-block;
    color: black;

    padding: 0 .5em;
    line-height: 1.5em;
    // this is really the only tricky part, you need to specify the background color of the container element...
    color: #818078;
    background-color: #fcfcfa;
  }
}
</style>
<style>
.vue-friendly-iframe iframe {
  width: 880px;
  height: 1220px;
  border: 0px;
}
hr {
    margin-top: 0px;
    margin-bottom: 5px;
}
</style>
