<template>
<div :key="iddiv">
  <div>
    <div class="my-3 my-md-5">
      <div class="container" id="dashboard">
        <div class="page-header">
          <h1 class="page-title">
            Dashboard
          </h1>
        </div>

        <b-input-group size="sm" class="col-12 col-sm-12 p-0 pb-4">
          <b-input-group-prepend is-text class="firstLabel">
            Base:
          </b-input-group-prepend>
          <b-form-select class="mr-2 col-12 col-md-4" v-on:change="selBase" v-model="form.id_base" :options="selects.base" size="sm">
            <template slot="first">
              <option :value="''" disabled>-- Selecione --</option>
            </template>
          </b-form-select>
          <b-input-group-prepend is-text class="firstLabel">
            Evento:
          </b-input-group-prepend>
          <b-form-select class="mr-2 col-6 col-md-4" id="event" v-on:change="selEvent" v-model="form.id_evento" :options="selects.events">
            <template slot="first">
              <option :value="null" disabled>-- Selecione --</option>
            </template>
          </b-form-select>
          <b-input-group-prepend is-text class="firstLabel">
            Dias:
          </b-input-group-prepend>
          <b-form-select class="mr-2 col-6 col-md-1" id="days" :options="selects.days" v-on:change="selDays" v-model="form.date">
            <template slot="first">
              <option :value="null" disabled>-- Selecione --</option>
            </template>
          </b-form-select>
          <b-input-group-prepend is-text class="firstLabel">
            Horário:
          </b-input-group-prepend>
          <b-form-select class="mr-2 col-6 col-md-1" id="hours" :options="selects.hours" v-on:change="selHours" v-model="form.hour">
            <template slot="first">
              <option :value="null" disabled>-- Selecione --</option>
            </template>
          </b-form-select>
          <b-button type="button" variant="primary" size="sm" @click="search('today')" v-if="1==2">
            <v-wait for="inprocess">
              <template slot="waiting">
                Aguarde...
              </template>
            </v-wait>
            <span v-if="!processing">Consultar</span>
          </b-button>
        </b-input-group>


        <div class="row">
          <form name="day">
          <div class="col-12 form-group filter-day">
            <div class="selectgroup selectgroup-pills">
              <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon" @click="search('all');">Todos os Dias</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon" @click="search('thirty');">30 Dias</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon" @click="search('fifteen');">15 Dias</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon" @click="search('seven');">7 Dias</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon" @click="search('yesterday');">Ontem</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input" checked >
                <span class="selectgroup-button selectgroup-button-icon" @click="search('today');">Hoje</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="a" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon"><i class="fas fa-pencil-alt mr-2"></i>Período Personalizado</span>
              </label>
            </div>
          </div>
          </form>
        </div>
        <hr class="mt-0 pt-0">

        <div class="row row-cards">
          <card-info v-if="dashboard.values.loaded" :key="'total_sold_'+dashboard.values.key.total_sold" :title="'Vendas Brutas'" :value='dashboard.values.total_sold' :percentage="''" :status="''"></card-info>
          <card-info v-if="dashboard.values.loaded" :key="'total_soldamountformatted_'+dashboard.values.key.total_soldamountformatted" :title="'Vendas Brutas'" :value="dashboard.values.total_soldamountformatted" :size="'large'" :percentage="''" :status="''"></card-info>
          <card-info v-if="dashboard.values.loaded" :key="'averageticket_formatted_'+dashboard.values.key.averageticket_formatted" :title="'Ticket Médio'" :value="dashboard.values.averageticket_formatted" :size="'large'" :percentage="''" :status="''"></card-info>
          <card-info v-if="dashboard.boletos.loaded" :key="'ok_conversionformatted'+dashboard.boletos.key.ok_conversionformatted" :title="'Conversão de Boletos'" :value="dashboard.boletos.ok_conversionformatted" :percentage="''" :status="''"></card-info>
          <card-info v-if="dashboard.boletos.loaded" :key="'awaiting_payment'+dashboard.boletos.key.awaiting_payment" :title="'Boletos pendentes'" :value='dashboard.boletos.awaiting_payment' :percentage="''" :status="''"></card-info>
        </div>
        <div class="row">
          <pie-chart v-if="dashboard.occupation.loaded" :key="'occupation_'+dashboard.occupation.key.id" :title="'Ocupação'" :data="dashboard.occupation.result"></pie-chart>
          <chart-bar-stacked v-if="dashboard.timetable.loaded" :key="'timetable_'+dashboard.timetable.key.id" :title="'Vendas por horário'" :data="dashboard.timetable.result"></chart-bar-stacked>
        </div>
        <div class="row">
          <pie-chart-with-filter :hasFilter="true" v-if="dashboard.bychannel.loaded" :key="'bypaymenttype_'+dashboard.bypaymenttype.key.id" :title="'Vendas por forma de pagamento'" :data="dashboard.bypaymenttype.result"></pie-chart-with-filter>
          <pie-chart v-if="dashboard.bychannel.loaded" :key="'bychannel_'+dashboard.bychannel.key.id" :title="'Vendas por canal'" :data="dashboard.bychannel.result"></pie-chart>
        </div>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import Vue from "vue";
import VueResource from "vue-resource";
import config from "@/config";

import cardInfo from "@/views/dashboard/card-info";
import pieChart from "@/views/dashboard/pie-chart";
import pieChartWithFilter from "@/views/dashboard/pie-chart-with-filter";
import chartBarStacked from "@/views/dashboard/chart-bar-stacked";

import {
  func
} from "@/functions";

import { userService } from '../../components/common/services/user';
import { eventService } from "../../components/common/services/event";

import { dashboardService } from "../../components/common/services/dashboard";


export default {
  mixins: [func],
  data() {
    return {
      iddiv: 1,
      processing: false,
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
      dashboard: {
        boletos: {
          key: {
            awaiting_payment: 1,
            ok_conversionformatted: 1
          },
          awaiting_payment: '',
          ok_conversionformatted: '',
        },
        timetable: {
          loaded: false,
          result: {},
          key: {
            id: 1
          }
        },
        occupation: {
          loaded: false,
          result: [],
          key: {
            id: 1
          }
        },
        bychannel: {
          loaded: false,
          result: [],
          key: {
            id: 1
          }
        },
        bypaymenttype: {
          loaded: false,
          result: [],
          key: {
            id: 1
          }
        },
        values: {
          loaded: false,
          total_sold: '',
          total_soldamountformatted: '',
          averageticket_formatted: '',
          key: {
            total_sold: 1,
            total_soldamountformatted: 1,
            averageticket_formatted: 1,
          },
        },
      }
    };
  },
  components: {
    cardInfo,
    pieChart,
    chartBarStacked,
    pieChartWithFilter
  },
  computed: {},
  created() {
    this.populateBases();
  },
  methods: {
    populateBases() {
      this.showWaitAboveAll();
      userService.baseSelect(this.getLoggedId()).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.base = response;
            if (response.length == 1) {
              this.form.id_base = response[0].value;
              this.populateEvents();
            }
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
      eventService.select(this.getLoggedId(), this.form.id_base).then(
        response => {
          this.selects.events = response;
          if (response.length == 1) {
            this.form.id_evento = response[0].value;
            this.populateDays();
          }
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
      eventService.selectDays(this.getLoggedId(), this.form.id_base, this.form.id_evento).then(
        response => {
          this.selects.days = response;
          if (response.length == 1) {
            this.form.date = response[0].value;
            this.populateHours();
          }
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
      eventService.selectDayHours(this.getLoggedId(), this.form.id_base, this.form.id_evento, this.form.date).then(
        response => {
          this.selects.hours = response;
          if (response.length == 1) {
            this.form.hour = response[0].value;
            this.search('today');
          }
          this.hideWaitAboveAll();
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );
    },
    clear() {
      this.dashboard.values.loaded = false;
      this.dashboard.boletos.loaded = false;
      this.dashboard.occupation.loaded = false;
      this.dashboard.bychannel.loaded = false;
      this.dashboard.timetable.loaded = false;
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
        this.clear();

        this.form.date = "";
        this.form.hour = "";

        this.populateDays();
      });
    },
    selDays() {
      Vue.nextTick().then(response => {
        this.selects.hours = [];
        this.clear();

        this.form.hour = "";

        this.populateHours();
      });
    },
    selHours() {
      Vue.nextTick().then(response => {
        this.clear();
        this.search("today");
      });
    },
    search(type) {
      if (this.form.id_evento == "" || this.form.date == "" || this.form.hour == "")
        return;

      dashboardService.purchasebyboleto(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
        response => {
          if (this.validateJSON(response))
          {
              this.dashboard.boletos.loaded = true;
              this.dashboard.boletos.awaiting_payment = response.awaiting_payment;
              this.dashboard.boletos.ok_conversionformatted = response.ok_conversionformatted == null ? 'N/A' : (response.ok_conversionformatted+' %');
              this.dashboard.boletos.key.awaiting_payment++;
              this.dashboard.boletos.key.ok_conversionformatted++;
          }
        },
        error => { this.toastError("Falha na execução."); }
      );
      dashboardService.purchasebychannel(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
        response => {
          if (this.validateJSON(response))
          {
              this.dashboard.bychannel.loaded = true;
              this.dashboard.bychannel.result = response;
              this.dashboard.bychannel.key.id++;
          }
        },
        error => { this.toastError("Falha na execução."); }
      );
      dashboardService.purchasebypaymenttype(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
        response => {
          if (this.validateJSON(response))
          {
              this.dashboard.bypaymenttype.loaded = true;
              this.dashboard.bypaymenttype.result = response;
              this.dashboard.bypaymenttype.key.id++;              
          }
        },
        error => { this.toastError("Falha na execução."); }
      );
      dashboardService.purchasebytimetable(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
        response => {
          if (this.validateJSON(response))
          {
              this.dashboard.timetable.loaded = true;
              this.dashboard.timetable.result = response;
              this.dashboard.timetable.key.id++;              
          }
        },
        error => { this.toastError("Falha na execução."); }
      );
      dashboardService.purchaseoccupation(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
        response => {
          if (this.validateJSON(response))
          {
              this.dashboard.occupation.loaded = true;
              this.dashboard.occupation.result = response;
              this.dashboard.occupation.key.id++;
          }
        },
        error => { this.toastError("Falha na execução."); }
      );
      dashboardService.purchasevalues(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
        response => {
          if (this.validateJSON(response))
          {
              this.dashboard.values.loaded = true;
              this.dashboard.values.total_sold = response.total_sold;
              this.dashboard.values.total_soldamountformatted = 'R$ '+(response.total_soldamountformatted == "" ? "-" :response.total_soldamountformatted);
              this.dashboard.values.averageticket_formatted = 'R$ '+(response.averageticket_formatted == "" ? "-" : response.averageticket_formatted);
              this.dashboard.values.key.total_sold++;
              this.dashboard.values.key.total_soldamountformatted++;
              this.dashboard.values.key.averageticket_formatted++;
          }
        },
        error => { this.toastError("Falha na execução."); }
      );
    },
  }
}
</script>

<style scoped>
</style>
