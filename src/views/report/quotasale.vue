<template>
    <div v-if="mayIsee">
      <b-modal ref="detailModal" hide-footer title="Detalhe" size="sm">
        <div class="d-block text-center">
          <h4>Pedido {{popups.detail.CodVenda}}</h4>
        </div>
        <div class="card" style="width: 270px;font-size: 13px;">
          <img class="card-img-top" :src="popups.detail.img" alt="">
          <h5 class="card-title" style="font-size: 13px;">
            <div style="padding-top:10px;">Nome: {{popups.detail.Nome}} </div>
            <div>CPF: {{popups.detail.CPF}} </div>
          </h5>
          <ul class="list-group list-group-flush" v-for="(item) in popups.detail.result.items" v-bind:key="'detail_'+item.indice">
            <li class="list-group-item text-left" style="background-color:#7B7C7E">Localização: {{item.NomObjeto}} ({{item.indice}})</li>
            <li class="list-group-item text-left">Bilhete: {{item.TipBilhete}}</li>
            <li class="list-group-item text-left">Valor: R$ {{item.vl_total_pedido_venda}}</span></li>
          </ul>
        </div>
                
        <b-btn class="mt-3" variant="outline-info" block @click="detailClose">Fechar</b-btn>
      </b-modal>
      <b-container>
        <b-row class="mb-3">
              <b-input-group size="sm">
              <b-input-group-prepend is-text>
                  Parceiro:
              </b-input-group-prepend>
              <b-form-select v-model="form.id_quotapartner" :options="selects.partners" size="sm" />
              </b-input-group>
        </b-row>
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
                      <tr v-for="(item) in grids.default.items" v-bind:key="'all_'+item.CodVenda" style="cursor:pointer" @click="detail(item.CodVenda, item.id_base)">
                        <td><span class="text-muted">{{item.DatVenda}}</span></td>
                        <td><div>{{item.NomPeca}}</div></td>
                        <td>
                          <div class="clearfix">
                            {{item.DatApresentacao}}
                            <div class="small text-muted">
                              {{item.HorSessao}}
                            </div>
                          </div>
                        </td>
                        <td><div>{{item.TipForPagto}}</div>
                                                    <div class="small text-muted">
                              <img v-if="item.TipForPagto == 'Boleto'" src="/assets/images/boleto.png" style="width:30px" />
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
      
      <!-- <vue-friendly-iframe ref="reportiframe" id="partnersale" :src="url" :width="'1200px'" :height="'2000px;'" @load="iframeloaded" @document-load="iframeloaded2" style="display:inline"></vue-friendly-iframe> -->
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import HotelDatePicker from 'vue-hotel-datepicker';
import VueFriendlyIframe from 'vue-friendly-iframe';
import config from "@/config";
import { quotapartnerService } from "../../components/common/services/report/quotapartner";

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
    this.populateQuotapartners();
  },
  methods: {
    populateQuotapartners() {
        this.processing = true;
        this.showWaitAboveAll();

        quotapartnerService.select().then(
                response => {
                    this.hideWaitAboveAll();
                    this.processing = false;
                    this.selects.partners = response;
            },
            error => {
                this.processing = false;
                this.hideWaitAboveAll();
                this.toastError("Falha na execução.");        
            }
        );
    },        
    detail(codVenda, id_base) {
        if (this.processing) return;
        this.processing = true;

        this.showWaitAboveAll();
        quotapartnerService.detail(this.getLoggedId(), codVenda, this.form.amount, id_base, this.form.id_quotapartner).then(
          response => {
            this.processing = false;
            this.hideWaitAboveAll();

            if (this.validateJSON(response))
            {
                this.popups.detail.result.loaded = true;
                this.popups.detail.result.items = response;
                
                this.popups.detail.CodVenda = response[0].CodVenda;
                this.popups.detail.Nome = response[0].Nome;
                this.popups.detail.CPF = response[0].CPF;
                this.popups.detail.comission_amount_formatted = response[0].comission_amount_formatted;
                this.popups.detail.NomObjeto = response[0].NomObjeto;
                this.popups.detail.indice = response[0].indice;
                this.popups.detail.TipBilhete = response[0].TipBilhete;
                this.popups.detail.vl_total_pedido_venda = response[0].vl_total_pedido_venda;
                this.popups.detail.img = response[0].img;

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
      quotapartnerService.list(this.getLoggedId(), this.form.selectedDate.start, this.form.selectedDate.end, this.form.amount, this.form.id_quotapartner).then(
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
      let url = partnersaleService.printurl(this.form.selectedDate.start, this.form.selectedDate.end, this.form.amount);
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
        amount: 0,
        id_quotapartner: null,
        selectedDate: {
          start: '',
          end: ''
        },
      },
      selects: {
        base: [],
        events: [],
        days: [],
        hours: [],
        partners: [],
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
          CodVenda: '',
          Nome: '',
          CPF: '',
          comission_amount_formatted: '',
          NomObjeto: '',
          indice: '',
          TipBilhete: '',
          vl_total_pedido_venda: '',
          img: '',
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
