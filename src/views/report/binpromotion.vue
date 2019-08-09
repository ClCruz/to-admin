<template>
    <div v-if="mayIsee">
      <b-container>
        <b-row class="mb-3">
          <HotelDatePicker :id="components.datepicker.id" ref="dtpicker" :format="components.datepicker.format" :minNights="components.datepicker.minNights"
          :maxNights="components.datepicker.maxNights"
          :hoveringTooltip="components.datepicker.hoveringTooltip"
          :i18n="components.datepicker.ptBr"
          :displayClearButton="components.datepicker.displayClearButton"
          :startDate="components.datepicker.startDate"
          :endDate="components.datepicker.endDate"
          :startingDateValue="components.datepicker.startingDateValue"
          :endingDateValue="components.datepicker.startingDateValue"
          v-on:check-in-changed="startchanged"
          v-on:check-out-changed="endchanged"
          ></HotelDatePicker>
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
        <b-row v-if="grids.default.loaded">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title"></h3>
<table style="width:100%">
    <tr>
        <td style="text-align:left">
            <span class="status-icon bg-warning"></span><span class="text-muted" style="text-align:" v-if="grids.default.items.length>0">Total de venda :: {{total}}</span>
        </td>
    </tr>
  </table>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover table-outline table-vcenter text-nowrap card-table">
                    <thead>
                      <tr>
                        <th class="w-1">Data da venda</th>
                        <th class="w-3">Comprador</th>
                        <th>BIN do Cartão</th>
                        <th>Local da venda</th>
                        <th class="text-center">Valor venda</th>
                        <th>Patrocinador</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item) in grids.default.items" v-bind:key="'all_'+item.sellid">
                        <td><span class="text-muted">{{item.created_at}}</span></td>
                        <td>
                          <div class="clearfix">
                            {{item.buyer}}
                            <div class="small text-muted">
                              {{item.buyer_document}}
                            </div>
                          </div>
                        </td>
                        <td><span>{{item.bin}}</span></td>
                        <td><span>{{item.sellfrom}}</span></td>
                        <td><span>{{item.sellamount}}</span></td>
                        <td><span>{{item.sponsor}}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import HotelDatePicker from 'vue-hotel-datepicker';
import VueFriendlyIframe from 'vue-friendly-iframe';
import config from "@/config";
import { binpromotionService } from "../../components/common/services/report/binpromotion";

import Moment from 'moment';
import VueTimepicker from 'vue2-timepicker';  
import { VMoney } from 'v-money';
import { extendMoment } from 'moment-range';
import { func } from "@/functions";
import { defer } from 'q';
import { Datetime } from 'vue-datetime';
import { Settings } from 'luxon';

Settings.defaultLocale = 'pt';

const moment = extendMoment(Moment);

Vue.use(VueHead);
Vue.component('vue-friendly-iframe', VueFriendlyIframe);

export default {
  mixins: [func],
  name: 'report-binpromotion',
  directives: {money: VMoney},
  components: { HotelDatePicker, Datetime },
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Relatórios - Venda promoção BIN",
      }
    },
  },
  computed: {
    total() {
      if (this.grids.default.items.length == 0)
        return "";
      return `R$ `+this.grids.default.items[0].selltotal;
    },
    url() {
      return this.report == '' ? "" : this.report;
    },
    mayIsee() {
      return this.mayI('report-binpromotion');
    }
  },
  created() {
  },
  methods: {
    search() {
      if (this.processing) return;
      this.processing = true;

      this.showWaitAboveAll();
      binpromotionService.list(this.getLoggedId(), this.form.selectedDate.start, this.form.selectedDate.end).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
              this.grids.default.loaded = true;
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
    startprint() {
      let url = binpromotionService.printurl(this.getLoggedId(), this.form.selectedDate.start, this.form.selectedDate.end);
      window.open(url);
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
    startchanged(date) {
      this.form.selectedDate.start = moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : '';
    },
    endchanged(date) {
      this.form.selectedDate.end = moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : '';
    },
  },
  data () {
    return {
      processing: false,
      loading: false,
      report: '',
      executed: false,
      components: { 
        money: {
            decimal: '.',
            thousands: '',
            //prefix: 'R$ ',
            //suffix: ' #',
            precision: 2,
            masked: false /* doesn't work with directive */
        },
        datepicker: {
          id: 1,
          format: 'DD/MM/YYYY',
          minNights: 0,
          maxNights: 300,
          hoveringTooltip: true,
          displayClearButton: true,
          startDate: new Date('2018-01-01'),
          endDate: new Date('2055-01-01'),
          startingDateValue: new Date(),
          ptBr: {
            night: 'Dia',
            nights: 'Dias',
            'day-names': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            'check-in': 'Início',
            'check-out': 'Fim',
            'month-names': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
          }
        },
      },
      form: {
        show: false,
        selectedDate: {
          start: '',
          end: ''
        },
      },
      selects: {
      },
      grids: { 
          default: {
              loaded: false,
              items: [],
          },
      },
    }
  }
}
</script>

<style>
.vue-friendly-iframe iframe {
  width: 880px;
  height: 1220px;
  border: 0px;
}
</style>
