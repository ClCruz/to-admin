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
          <b-button type="button" variant="primary" size="sm" @click="search">
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
                <input type="radio" name="a" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon">Todos os Dias</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="a" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon">30 Dias</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="a" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon">15 Dias</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="a" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon">7 Dias</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="a" class="selectgroup-input"  >
                <span class="selectgroup-button selectgroup-button-icon">Ontem</span>
              </label>
              <label class="selectgroup-item">
                <input type="radio" name="a" class="selectgroup-input" checked>
                <span class="selectgroup-button selectgroup-button-icon">Hoje</span>
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
          <card-info :key="'total_sold_'+dashboard.key.total_sold" :title="'Vendas Brutas Total'" :value='dashboard.values.total_sold' :percentage="''" :status="''"></card-info>
          <card-info :key="'total_soldamountformatted_'+dashboard.key.total_soldamountformatted" :title="'Vendas Brutas Total'" :value="dashboard.values.total_soldamountformatted" :size="'large'" :percentage="''" :status="''"></card-info>
          <card-info :key="'averageticket_formatted_'+dashboard.key.averageticket_formatted" :title="'Ticket Médio'" :value="dashboard.values.averageticket_formatted" :percentage="''" :status="''"></card-info>
          <card-info :title="'Conversão de Boletos'" :value="'65%'" :percentage="''" :status="''"></card-info>
          <card-info :title="'Boletos Aguardando Pagamento'" :value='35' :size="'large'" :percentage="''" :status="''"></card-info>
        </div>
        <div class="row">
          <pie-chart :title="'Ocupação'" :data="[['Disponivel',177],['Vendido',36],['Gratuito',0],['Aguardando pagamento',18],['Reservado',36]]"></pie-chart>
          <chart-bar-stacked :title="'Vendas por horário'" :data="{'web':['web',26,10,2,3,1,3,10,10,65,62,63,68,56,93,77,80,85,54,63,78,60,91,86,57],'ticketoffice':['ticketoffice',0,0,0,0,0,0,0,0,32,0,0,29,73,97,62,85,12,142,21,48,45,37,3,0]}"></chart-bar-stacked>
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Ultimas Vendas</h3>
              </div>
              <div class="table-responsive">
                <table class="table table-hover table-outline table-vcenter text-nowrap card-table">
                  <thead>
                    <tr>
                      <th class="w-1">Cod. Venda</th>
                      <th class="w-3">Evento</th>
                      <th>Cliente</th>
                      <th>Data de Compra</th>
                      <th class="text-center">Valor</th>
                      <th class="text-center">Forma de Pag.</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span class="text-muted">001401</span></td>
                      <td>
                        <div>Captain Marvel</div>
                      </td>
                      <td>
                        <div>Elizabeth Martin</div>

                      </td>
                      <td>
                        <div class="clearfix">
                          20:05
                          <div class="small text-muted">
                            Mar 7, 2019
                          </div>
                        </div>
                      </td>
                      <td>R$ 50.03</td>

                      <td class="text-center">
                        <i class="payment payment-visa"></i>
                      </td>

                      <td>
                        <span class="status-icon bg-success"></span> Finalizado
                      </td>
                    </tr>
                    <tr>
                      <td><span class="text-muted">001401</span></td>
                      <td>
                        <div>Captain Marvel</div>
                      </td>
                      <td>
                        <div>Elizabeth Martin</div>

                      </td>
                      <td>
                        <div class="clearfix">
                          20:05
                          <div class="small text-muted">
                            Mar 7, 2019
                          </div>
                        </div>
                      </td>
                      <td>R$ 50.03</td>

                      <td class="text-center">
                        <i class="payment payment-visa"></i>
                      </td>

                      <td>
                        <span class="status-icon bg-danger"></span> Cancelada
                      </td>
                    </tr>
                    <tr>
                      <td><span class="text-muted">001401</span></td>
                      <td>
                        <div>Captain Marvel</div>
                      </td>
                      <td>
                        <div>Elizabeth Martin</div>
                      </td>
                      <td>
                        <div class="clearfix">
                          20:05
                          <div class="small text-muted">
                            Mar 7, 2019
                          </div>
                        </div>
                      </td>
                      <td>R$ 70</td>

                      <td class="text-center">
                        <i class="payment payment-mastercard"></i>
                      </td>

                      <td>
                        <span class="status-icon bg-warning"></span> Aguardando Pag.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
        key: {
          total_sold: 1,
          total_soldamountformatted: 1,
          averageticket_formatted: 1,
        },
        values: {
          loaded: false,
          total_sold: 0,
          total_soldamountformatted: '',
          averageticket_formatted: '',
        },
      }
    };
  },
  components: {
    cardInfo,
    pieChart,
    chartBarStacked
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
            this.search();
          }
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
      let type = 'all';
      // dashboardService.purchasebyboleto(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
      //   response => {
      //     if (this.validateJSON(response))
      //     {
              
      //     }
      //   },
      //   error => { this.toastError("Falha na execução."); }
      // );
      // dashboardService.purchasebychannel(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
      //   response => {
      //     if (this.validateJSON(response))
      //     {
              
      //     }
      //   },
      //   error => { this.toastError("Falha na execução."); }
      // );
      // dashboardService.purchasebypaymenttype(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
      //   response => {
      //     if (this.validateJSON(response))
      //     {
              
      //     }
      //   },
      //   error => { this.toastError("Falha na execução."); }
      // );
      // dashboardService.purchasebytimetable(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
      //   response => {
      //     if (this.validateJSON(response))
      //     {
              
      //     }
      //   },
      //   error => { this.toastError("Falha na execução."); }
      // );
      // dashboardService.purchaseoccupation(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
      //   response => {
      //     if (this.validateJSON(response))
      //     {
              
      //     }
      //   },
      //   error => { this.toastError("Falha na execução."); }
      // );
      dashboardService.purchasevalues(this.getLoggedId(), this.form.id_evento, '', this.form.date, this.form.hour, type, '', '').then(
        response => {
          if (this.validateJSON(response))
          {
              this.dashboard.values.total_sold = response.total_sold;
              this.dashboard.values.total_soldamountformatted = 'R$ '+response.total_soldamountformatted;
              this.dashboard.values.averageticket_formatted = 'R$ '+response.averageticket_formatted;
              this.dashboard.key.total_sold++;
              this.dashboard.key.total_soldamountformatted++;
              this.dashboard.key.averageticket_formatted++;
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
