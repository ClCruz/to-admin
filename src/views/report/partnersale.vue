<template>
    <div v-if="mayIsee">
      <b-modal ref="detailModal" hide-footer title="Detalhe" size="sm">
        <div class="d-block text-center">
          <h4>Pedido {{popups.detail.id_pedido_venda}} - {{popups.detail.CodVenda}}</h4>
        </div>

        <div class="card" style="width: 270px;font-size: 13px;">
          <img class="card-img-top" :src="popups.detail.img" alt="">
          <h5 class="card-title" style="font-size: 13px;">
            <div style="padding-top:10px;">Nome: {{popups.detail.client_name}} </div>
            <div>CPF: {{popups.detail.cd_cpf}} </div>
            <div>Comissão: R$ {{popups.detail.comission_amount_formatted}}</div>
            <div class="small text-muted">E-mail: {{popups.detail.cd_email_login}}</div>
          </h5>
          <ul class="list-group list-group-flush" v-for="(item) in popups.detail.result.items" v-bind:key="'detail_'+item.Indice">
            <li class="list-group-item text-left" style="background-color:#7B7C7E">Localização: {{item.ds_localizacao}} ({{item.Indice}})</li>
            <li class="list-group-item text-left">Bilhete: {{item.ds_tipo_bilhete}}</li>
            <li class="list-group-item text-left">Valor: R$ {{item.vl_unitario}} <span v-if="item.vl_taxa_conveniencia != 0 && item.vl_taxa_conveniencia != ''">/ R$ {{item.vl_taxa_conveniencia}}</span></li>
          </ul>
        </div>
                
        <b-btn class="mt-3" variant="outline-info" block @click="detailClose">Fechar</b-btn>
      </b-modal>
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
          <b-input-group size="sm" prepend="%">
            <b-form-input ref="amount" prepend="%" type="text" v-model.lazy="form.amount" v-money="components.money">
            </b-form-input>
          </b-input-group>
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
        <b-row v-if="grids.default.loaded">

          
            
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title"></h3>
<table style="width:100%">
    <tr>
        <td style="text-align:left">
            <span class="status-icon bg-warning"></span><span class="text-muted" style="text-align:" v-if="grids.default.items.length>0">Total de venda :: {{total}}</span>


        </td>
        <td style="text-align:right">
            <span class="status-icon bg-success"></span> <span class="text-muted" v-if="grids.default.items.length>0">Total da comissão :: {{total_comission}}</span>
        </td>
    </tr>
  </table>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover table-outline table-vcenter text-nowrap card-table">
                    <thead>
                      <tr>
                        <th class="w-1">Data da venda</th>
                        <th class="w-3">Evento</th>
                        <th>Data/Hora</th>
                        <th>Pagamento</th>
                        <th class="text-center">Valor venda</th>
                        <th class="text-center">%</th>
                        <th class="text-center">Comissão</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item) in grids.default.items" v-bind:key="'all_'+item.id_pedido_venda" style="cursor:pointer" @click="detail(item.id_pedido_venda)">
                        <td><span class="text-muted">{{item.dt_pedido_venda}}</span></td>
                        <td><div>{{item.ds_evento}}</div></td>
                        <td>
                          <div class="clearfix">
                            {{item.dt_apresentacao}}
                            <div class="small text-muted">
                              {{item.hr_apresentacao}}
                            </div>
                          </div>
                        </td>
                        <td><div>{{item.ds_meio_pagamento}}</div>
                                                    <div class="small text-muted">
                              <img v-if="item.ds_meio_pagamento == 'Boleto'" src="/assets/images/boleto.png" style="width:30px" />
                              <i v-else class="fa fa-credit-card" style="font-size:20px"></i>
                            </div>
                        </td>
                        <td><div>R$ {{item.vl_total_pedido_venda}}</div></td>
                        <td><div>{{item.comission}}</div></td>
                        <td><div>R$ {{item.comission_amount_formatted}}</div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            
          
        </b-row>
      </b-container>
      
      <!-- <vue-friendly-iframe ref="reportiframe" id="partnersale" :src="url" :width="'1200px'" :height="'2000px;'" @load="iframeloaded" @document-load="iframeloaded2" v-if="form.show"></vue-friendly-iframe> -->
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import HotelDatePicker from 'vue-hotel-datepicker';
import VueFriendlyIframe from 'vue-friendly-iframe';
import html2canvas from 'html2canvas';
import config from "@/config";
import { partnersaleService } from "../../components/common/services/report/partnersale";

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
  name: 'report-partnersale',
  directives: {money: VMoney},
  components: { HotelDatePicker, Datetime },
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
    total() {
      if (this.grids.default.items.length == 0)
        return "";
      return `R$ `+this.grids.default.items[0].total_formatted;
    },
    total_comission() {
      if (this.grids.default.items.length == 0)
        return "";
      return `R$ `+this.grids.default.items[0].total_comission_formatted;
    },
    url() {
      return this.report == '' ? "" : this.report;
    },
    mayIsee() {
      return this.mayI('report-viewer', 'report-accounting');
    }
  },
  created() {
  },
  methods: {
    detail(id_pedido_venda) {
        if (this.processing) return;
        this.processing = true;

        this.showWaitAboveAll();
        partnersaleService.detail(this.getLoggedId(), id_pedido_venda, this.form.amount).then(
          response => {
            this.processing = false;
            this.hideWaitAboveAll();

            if (this.validateJSON(response))
            {
                this.popups.detail.result.loaded = true;
                this.popups.detail.result.items = response;
                
                this.popups.detail.id_pedido_venda = response[0].id_pedido_venda;
                this.popups.detail.CodVenda = response[0].CodVenda;
                this.popups.detail.dt_pedido_venda = response[0].dt_pedido_venda;
                this.popups.detail.ds_evento = response[0].ds_evento;
                this.popups.detail.uri = response[0].uri;
                this.popups.detail.dt_apresentacao = response[0].dt_apresentacao;
                this.popups.detail.hr_apresentacao = response[0].hr_apresentacao;
                this.popups.detail.vl_total_pedido_venda = response[0].vl_total_pedido_venda;
                this.popups.detail.ds_meio_pagamento = response[0].ds_meio_pagamento;
                this.popups.detail.img = response[0].img;
                this.popups.detail.client_name = response[0].client_name;
                this.popups.detail.cd_cpf = response[0].cd_cpf;
                this.popups.detail.cd_email_login = response[0].cd_email_login;
                this.popups.detail.comission_amount_formatted = response[0].comission_amount_formatted;
                // this.popups.detail.comission = response.comission;
                // this.popups.detail.comission_amount = response.comission_amount;
                // this.popups.detail.client_name = response.client_name;
                // this.popups.detail.cd_cpf = response.cd_cpf;
                // this.popups.detail.cd_email_login = response.cd_email_login;
                // this.popups.detail.dt_nascimento = response.dt_nascimento;
                // this.popups.detail.ds_tipo_bilhete = response.ds_tipo_bilhete;
                // this.popups.detail.nr_parcelas_pgto = response.nr_parcelas_pgto;
                // this.popups.detail.isInstallment = response.isInstallment;
                // this.popups.detail.host = response.host;
                // this.popups.detail.Indice = response.Indice;
                // this.popups.detail.ds_localizacao = response.ds_localizacao;
                // this.popups.detail.vl_unitario = response.vl_unitario;
                // this.popups.detail.vl_taxa_conveniencia = response.vl_taxa_conveniencia;
                // console.log(this.popups.detail);
                this.$refs.detailModal.show();
            }
          },
          error => {
            this.processing = false;
            this.hideWaitAboveAll();
            this.toastError("Falha na execução.");
          }
      );            
    },
    detailClose() {
      this.$refs.detailModal.hide();
    },
    search() {
      if (this.processing) return;
      this.processing = true;

      this.showWaitAboveAll();
      partnersaleService.list(this.getLoggedId(), this.form.selectedDate.start, this.form.selectedDate.end, this.form.amount).then(
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
    search2() {
      this.form.show = true;
      Vue.nextTick().then(response => {
        this.executed = false;
        this.report = eventService.partnersales(this.form.selectedDate.start, this.form.selectedDate.end, this.form.amount);
        this.$refs.reportiframe.reinitIframe();  
        this.executed = true;
        this.processing = true;
        this.$wait.start("inprocess");
        this.showWaitAboveAll();
      });
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
        amount: 0,
        selectedDate: {
          start: '',
          end: ''
        },
      },
      selects: {
        base: [],
        events: [],
        days: [],
        hours: []
      },
      grids: { 
          default: {
              loaded: false,
              items: [],
          },
      },
      popups: {  
        detail: {
          result: {
              loaded: false,
              items: [],
          },
          id_pedido_venda: 0,
          dt_pedido_venda: '',
          ds_evento: '',
          uri: '',
          dt_apresentacao: '',
          hr_apresentacao: '',
          vl_total_pedido_venda: '',
          ds_meio_pagamento: '',
          CodVenda: '',
          img: '',
          client_name: '',
          cd_cpf: '',
          cd_email_login: '',
          comission_amount_formatted: '',
          // comission: '',
          // comission_amount: '',
          // client_name: '',
          // cd_cpf: '',
          // cd_email_login: '',
          // dt_nascimento: '',
          // ds_tipo_bilhete: '',
          // nr_parcelas_pgto: '',
          // isInstallment: '',
          // host: '',
          // Indice: '',
          // ds_localizacao: '',
          // vl_unitario: '',
          // vl_taxa_conveniencia: '',
        }
      }
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
