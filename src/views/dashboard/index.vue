<template>
<div :key="iddiv">
  <div>
    <div class="my-3 my-md-5">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">
            Dashboard
          </h1>
        </div>


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
        </b-row>



        <div class="row row-cards">
          <card-info :title="'Vendas Brutas Total'" :value='43' :percentage="''" :status="''"></card-info>
          <card-info :title="'Vendas Brutas Total'" :value="'R$ 120.000,00'" :size="'large'" :percentage="''" :status="''"></card-info>
          <card-info :title="'Ticket Médio'" :value="'R$ 34,29'" :percentage="''" :status="''"></card-info>
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
    };
  },
  components: {
    cardInfo,
    pieChart,
    chartBarStacked
  },
  computed: {
  },
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

    },
  }
}
</script>

<style scoped>
</style>
