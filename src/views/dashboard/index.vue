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
          <b-form-select class="mr-2 col-12 col-md-2" v-on:change="selBase" v-model="form.id_base" :options="selects.base" size="sm">
            <template slot="first">
              <option :value="''" disabled>-- Selecione --</option>
            </template>
          </b-form-select>
          <b-input-group-prepend is-text class="firstLabel">
            Evento:
          </b-input-group-prepend>
          <b-form-select class="mr-2 col-6 col-md-6" id="event" v-on:change="selEvent" v-model="form.id_evento" :options="selects.events">
            <template slot="first">
              <option :value="null" disabled>-- Selecione --</option>
            </template>
          </b-form-select>
          <b-input-group-prepend is-text class="firstLabel">
            Dia:
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
                <input type="radio" name="icon-input" class="selectgroup-input" value="all" v-model="form.searchtype">
                <span class="selectgroup-button selectgroup-button-icon" @click="search('all');">Todos os Dias</span>
              </label>
                <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input" value="thirty" v-model="form.searchtype">
                <span class="selectgroup-button selectgroup-button-icon" @click="search('thirty');">30 Dias</span>
              </label>
                <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input" value="fifteen" v-model="form.searchtype">
                <span class="selectgroup-button selectgroup-button-icon" @click="search('fifteen');">15 Dias</span>
              </label>
                <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input" value="seven" v-model="form.searchtype">
                <span class="selectgroup-button selectgroup-button-icon" @click="search('seven');">7 Dias</span>
              </label>
                <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input" value="yesterday" v-model="form.searchtype">
                <span class="selectgroup-button selectgroup-button-icon" @click="search('yesterday');">Ontem</span>
              </label>
                <label class="selectgroup-item">
                <input type="radio" name="icon-input" class="selectgroup-input" value="today" v-model="form.searchtype">
                <span class="selectgroup-button selectgroup-button-icon" @click="search('today');">Hoje</span>
              </label>

                <label class="selectgroup-itx'em">
          <HotelDatePicker :id="datepicker.id" ref="dtpicker" :format="datepicker.format" :minNights="datepicker.minNights"
          :maxNights="datepicker.maxNights"
          :hoveringTooltip="datepicker.hoveringTooltip"
          :i18n="datepicker.ptBr"
          :displayClearButton="datepicker.displayClearButton"
          :startDate="datepicker.startDate"
          :endDate="datepicker.endDate"
          :startingDateValue="datepicker.startingDateValue"
          v-on:check-in-changed="startchanged"
          v-on:check-out-changed="endchanged"
          ></HotelDatePicker>
              </label>
              </div>

            </div>
          </form>
        </div>
        <hr class="mt-0 pt-0">

        <half-circle-spinner v-if="!isLoaded" :size="60" color="#ddd"></half-circle-spinner>
        <template v-else>

          <div class="row row-cards">
            <card-info v-if="dashboard.values.loaded" :key="'total_sold_'+dashboard.values.key.total_sold" :title="'Vendas Brutas'" :value='dashboard.values.total_sold' :percentage="dashboard.values.per_total_diff_formatted" :status="dashboard.values.typeofdiff"></card-info>
            <card-info v-if="dashboard.values.loaded" :key="'total_soldamountformatted_'+dashboard.values.key.total_soldamountformatted" :title="'Vendas Brutas'" :value="dashboard.values.total_soldamountformatted" :size="'large'" :percentage="dashboard.values.perAmount_total_formatted" :status="dashboard.values.typeofdiffAmount"></card-info>
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
        </template>
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
import HotelDatePicker from 'vue-hotel-datepicker';
import {
  HollowDotsSpinner
} from 'epic-spinners'
import {
  SemipolarSpinner
} from 'epic-spinners'
import {
  HalfCircleSpinner
} from 'epic-spinners'

import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

import {
  func
} from "@/functions";

import {
  userService
} from '../../components/common/services/user';
import {
  eventService
} from "../../components/common/services/event";

import {
  dashboardService
} from "../../components/common/services/dashboard";

export default {
  mixins: [func],
  data() {
    return {
      isLoaded: false,
      datepickerHidden: true,
      datepicker: {
        id: 1,
        format: 'DD/MM/YYYY',
        minNights: 0,
        maxNights: 50,
        hoveringTooltip: true,
        displayClearButton: true,
        startDate: new Date(),
        endDate: new Date('2055-01-01'),
        startingDateValue: new Date(),
        ptBr: {
          night: 'Dia',
          nights: 'Dias',
          'day-names': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
          'check-in': 'Início',
          'check-out': 'Fim',
          'month-names': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        },
      },
      iddiv: 1,
      processing: false,
      form: {
        searchtype: 'today',
        id_base: '',
        id_evento: '',
        date: '',
        hour: '',
        selectedDate: {
          start: moment(new Date()).format("DD/MM/YYYY"),
          end: '',
        }
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
          typeofdiff: '',
          typeofdiffAmount: '',
          per_total_diff_formatted: '',
          perAmount_total_formatted: '',
          key: {
            total_sold: 1,
            total_soldamountformatted: 1,
            averageticket_formatted: 1,
          },
        },
      }
    }
  },
  components: {
    cardInfo,
    pieChart,
    chartBarStacked,
    pieChartWithFilter,
    HotelDatePicker,
    HollowDotsSpinner,
    HalfCircleSpinner
  },
  computed: {},
  created() {
    this.hideWaitAboveAll();
    this.closer();
    //  this.$refs.dtpicker.hideDatepicker();
  },
  methods: {
    startchanged(date) {
      this.form.selectedDate.start = moment(date).isValid() ? moment(date).format("DD/MM/YYYY") : '';
      this.checkifpersonalized();
    },
    endchanged(date) {
      this.form.selectedDate.end = moment(date).isValid() ? moment(date).add(1,'days').format("DD/MM/YYYY") : '';
      this.checkifpersonalized();
    },
    checkifpersonalized() {
      // debugger;
      Vue.nextTick().then(response => {
        if (this.form.selectedDate.start != '' && this.form.selectedDate.end != '') {
          // this.form.searchtype = '';
          this.search('');
        }
        else {
          if (this.form.selectedDate.start == '' && this.form.selectedDate.end == '' && this.form.searchtype == '') {
            this.search('today');
          }
        }
      });
    },
    toggleDate() {
      this.$refs.dtpicker.hideDatepicker();
      this.$refs.dtpicker.toggleDatepicker();
    },
    closer() {
      dashboardService.closer(this.getLoggedId()).then(
        response => {
          // this.hideWaitAboveAll();
          if (this.validateJSON(response)) {
            if (response != null) {
              this.form.id_base = response.id_base;
              this.form.id_evento = response.id_evento;
              this.form.date = response.date;
              this.form.hour = response.hour;
            }
          }
          Vue.nextTick().then(response => {
            this.populateBases();
          });
        },
        error => {
          // this.hideWaitAboveAll();
          this.populateBases();
        }
      );
    },
    populateBases() {
      if (this.getLoggedId() == null || this.getLoggedId() == "") return;

      userService.baseSelect(this.getLoggedId()).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.base = response;
            if (response.length == 1) {
              this.form.id_base = response[0].value;
              this.populateEvents();
            } else {
              if (this.form.id_base != '') {
                Vue.nextTick().then(response => {
                  this.populateEvents();
                });
              }
            }
          }
        },
        error => {
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

      eventService.select(this.getLoggedId(), this.form.id_base).then(
        response => {
          this.selects.events = response;
          if (response.length == 1) {
            this.form.id_evento = response[0].value;
            this.populateDays();
          } else {
            if (this.form.date != '') {
              Vue.nextTick().then(response => {
                this.populateDays();
              });
            }
          }
        },
        error => {
          // this.hideWaitAboveAll();
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

      eventService.selectDays(this.getLoggedId(), this.form.id_base, this.form.id_evento).then(
        response => {
          this.selects.days = response;
          if (response.length == 1) {
            this.form.date = response[0].value;
            this.populateHours();
          } else {
            if (this.form.hour != '') {
              Vue.nextTick().then(response => {
                this.populateHours();
              });
            }
          }
        },
        error => {
          this.toastError("Falha na execução.");
        }
      );
    },
    populateHours() {
      if (this.form.id_base == '' || this.form.id_evento == '' || this.form.date == '') {
        return;
      }
      this.selects.hours = [];

      eventService.selectDayHours(this.getLoggedId(), this.form.id_base, this.form.id_evento, this.form.date).then(
        response => {
          this.selects.hours = response;
          if (response.length == 1) {
            this.form.hour = response[0].value;
            this.search('today');
          } else {
            if (this.form.hour != '') {
              Vue.nextTick().then(response => {
                this.search('today');
              });
            }
          }
          // this.hideWaitAboveAll();
        },
        error => {
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
      this.isLoaded = false;
      if (this.form.id_evento == "" || this.form.date == "" || this.form.hour == "")
        return;

      this.form.searchtype = type;

      let init = '';
      let end = '';

      if (this.form.searchtype == '') {
        init = this.form.selectedDate.start;
        end = this.form.selectedDate.end;
      }

      dashboardService.purchasebyboleto(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, init, end).then(
        response => {
          if (this.validateJSON(response)) {
            this.dashboard.boletos.loaded = true;
            this.dashboard.boletos.awaiting_payment = response.awaiting_payment;
            this.dashboard.boletos.ok_conversionformatted = response.ok_conversionformatted == null ? 'N/A' : (response.ok_conversionformatted + ' %');
            this.dashboard.boletos.key.awaiting_payment++;
            this.dashboard.boletos.key.ok_conversionformatted++;
          }
        },
        error => {
          this.toastError("Falha na execução.");
        }
      );
      dashboardService.purchasebychannel(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, init, end).then(
        response => {
          if (this.validateJSON(response)) {
            this.dashboard.bychannel.loaded = true;
            this.dashboard.bychannel.result = response;
            this.dashboard.bychannel.key.id++;
          }
        },
        error => {
          this.toastError("Falha na execução.");
        }
      );
      dashboardService.purchasebypaymenttype(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, init, end).then(
        response => {
          if (this.validateJSON(response)) {
            this.dashboard.bypaymenttype.loaded = true;
            this.dashboard.bypaymenttype.result = response;
            this.dashboard.bypaymenttype.key.id++;
          }
        },
        error => {
          this.toastError("Falha na execução.");
        }
      );
      dashboardService.purchasebytimetable(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, init, end).then(
        response => {
          if (this.validateJSON(response)) {
            this.dashboard.timetable.loaded = true;
            this.dashboard.timetable.result = response;
            this.dashboard.timetable.key.id++;
          }
        },
        error => {
          this.toastError("Falha na execução.");
        }
      );
      dashboardService.purchaseoccupation(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, init, end).then(
        response => {
          if (this.validateJSON(response)) {
            this.dashboard.occupation.loaded = true;
            this.dashboard.occupation.result = response;
            this.dashboard.occupation.key.id++;
          }
        },
        error => {
          this.toastError("Falha na execução.");
        }
      );
      dashboardService.purchasevalues(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, init, end).then(
        response => {
          if (this.validateJSON(response)) {
            this.dashboard.values.loaded = true;
            this.dashboard.values.total_sold = response.total_sold;
            this.dashboard.values.total_soldamountformatted = 'R$ ' + (response.total_soldamountformatted == "" ? "-" : response.total_soldamountformatted);
            this.dashboard.values.averageticket_formatted = 'R$ ' + (response.averageticket_formatted == "" ? "-" : response.averageticket_formatted);
            this.dashboard.values.typeofdiff = response.typeofdiff;
            this.dashboard.values.typeofdiffAmount = response.typeofdiffAmount;
            this.dashboard.values.per_total_diff_formatted = response.per_total_diff_formatted == '' ? "" : response.per_total_diff_formatted + '%';
            this.dashboard.values.perAmount_total_formatted = response.perAmount_total_formatted == '' ? "" : response.per_total_diff_formatted + '%';

            this.dashboard.values.key.total_sold++;
            this.dashboard.values.key.total_soldamountformatted++;
            this.dashboard.values.key.averageticket_formatted++;

            this.isLoaded = true;

          }
        },
        error => {
          this.toastError("Falha na execução.");
        }
      );

    },
  }
}
</script>

<style lang="scss">
#dashboard {

  .datepicker__dummy-wrapper {
    border-radius: 12px;
    height: 26px !important;

    .datepicker__input {
      font-size: 14px;
      color: rgb(154, 160, 172);
      /* padding-right: 0; */
      /* padding-left: 10px; */
      font-size: 11px;
      color: #9aa0ac;
      line-height: 2.2;
      height: 26px;
    }

    .datepicker__clear-button {
      margin: 8px -2px 0 0;
      font-size: 14px;
      height: 22px !important;
    }

    .datepicker__input:first-child {
      /* text-indent: 22px; */
      /* padding-left: 20px; */
      /* padding-right: 80px; */
      background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgOCAxOCI+CiAgICA8cGF0aCBmaWxsPSIjOTU5OUFBIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0uMTE5LjcxOGw3LjE1OCA3LjQwNy0uMDMzLS41NTEtNi43MzcgOC44ODlhLjQyNS40MjUgMCAwIDAgLjA4LjU5My40Mi40MiAwIDAgMCAuNTktLjA4bDYuNzM3LTguODg5YS40MjUuNDI1IDAgMCAwLS4wMzMtLjU1MUwuNzIzLjEyOEEuNDIuNDIgMCAwIDAgLjEyOC4xMmEuNDI1LjQyNSAwIDAgMC0uMDA5LjU5OHoiLz4KPC9zdmc+Cg==) no-repeat 100%/5px !important;
    }
  }

  .datepicker__wrapper {
    background: transparent url('/assets/icons/edit.svg') no-repeat 14px/13px !important;
    height: 22px !important;
  }

  .datepicker__clear-button svg {
    width: 10px !important;
    top: -10px !important;
  }

  @media (max-width: 800px) {

  .input-group-prepend, .input-group-append, .input-group-btn, .input-group-text {
    margin-bottom: 2px;
    margin-top: 2px;
    font-weight: bold;
    padding-left: 0;
    background: transparent;
    border: none;
  }

  .input-group {
    display: block;
  }

  select {
    border-radius: 4px;
    width: 50%;
    display: flex;
  }
  }

    .input-group-prepend, .input-group-append, .input-group-btn, .input-group-text { 
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    font-weight: bold;
    color: hsl(0, 0%, 13%);

    }
  select {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    color: hsl(0,0%,29%);
  }


}
</style>
