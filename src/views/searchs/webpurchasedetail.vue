<template>
    <div v-if="mayIsee">
      <b-container v-if="!grids.default.loaded" style="text-align: left;">
        Carregando...
      </b-container>
      <b-container v-if="grids.default.nothing" style="text-align: left;">
        <i class="fas fa-frown-open"></i>
      </b-container>
      <b-container v-if="grids.default.loaded && grids.default.nothing == false" style="text-align: left;">
        <b-row>
          <div class="card">
              <div class="card-status bg-success" v-if="first.in_situacao == 'F'"></div>
              <div class="card-status bg-warning" v-if="first.in_situacao == 'P'"></div>
              <div class="card-status bg-secondary" v-if="first.in_situacao == 'E'"></div>
              <div class="card-status bg-dark" v-if="first.in_situacao == 'C'"></div>
              <div class="card-header">
                <b-col>
                  <h3 class="card-title">Compra {{id}} - {{first.CodVenda}}</h3>
                </b-col>
                <b-col>
                  <div class="input-group-append" style="float:right;">
                    <button type="button" class="btn btn-primary">Ações</button>
                    <button data-toggle="dropdown" type="button" class="btn btn-primary dropdown-toggle"></button>
                    <div class="dropdown-menu dropdown-menu-right">
                      <a v-if="mayIseePrint" class="dropdown-item" @click="see()" style="cursor:pointer">
                        <i class="far fa-eye"></i> Visualizar Ingresso
                      </a>
                      <a class="dropdown-item" @click="sendemail" style="cursor:pointer">
                        <i class="fas fa-share"></i> Enviar Ingresso por e-mail
                      </a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" @click="refund" style="cursor:pointer">
                        <i class="fas fa-hand-holding-usd"></i> Reembolso
                      </a>
                    </div>
                  </div>
                </b-col>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-auto">
                    <span class="avatar avatar-xl" v-bind:style="{ 'background-image': 'url(' + image + ')' }"></span>
                  </div>
                  <div class="col">
                    <div class="form-group card-title" @click="goto_event(first.uri)" style="cursor:pointer;margin-bottom: 5px !important;" title="Ir para o evento">
                      {{first.ds_evento}}
                    </div>
                    <div>
                      Data do evento: {{first.dt_apresentacao}} - {{first.hr_apresentacao}}
                    </div>
                    <div>
                      Base: {{first.ds_nome_base_sql}}
                    </div>
                  </div>
                </div>
                <br />
                <div class="form-group">
                  <label class="form-label">Comprador</label>
                </div>
                <div class="form-group">
                  <b-row>
                      <b-col>
                        <label class="text-muted" style="padding-right:5px;">Nome:</label> {{first.client_name}}
                      </b-col>
                      <b-col>
                        <label class="text-muted" style="padding-right:5px;">CPF:</label> {{first.client_document}}
                      </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Telefone:</label> {{first.ds_ddd_celular}}{{first.ds_celular}}
                    </b-col>
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Email:</label> {{first.cd_email_login}}
                    </b-col>
                  </b-row>
                </div>
                <div class="form-group">
                  <label class="form-label">Compra</label>
                </div>
                <div class="form-group">
                  <b-row>
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">ID:</label> {{first.id_pedido_venda}}
                    </b-col>
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Código:</label> {{first.CodVenda}}
                    </b-col>
                  </b-row>
                  <b-row>
                      <b-col>
                        <label class="text-muted" style="padding-right:5px;">Situação:</label> {{first.in_situacao | situacao}}
                        <span class="status-icon bg-success" v-if="first.in_situacao == 'F'"></span>
                        <span class="status-icon bg-warning" v-if="first.in_situacao == 'P'"></span>
                        <span class="status-icon bg-secondary" v-if="first.in_situacao == 'E'"></span>
                        <span class="status-icon bg-dark" v-if="first.in_situacao == 'C'"></span>
                      </b-col>
                      <b-col>
                        <label class="text-muted" style="padding-right:5px;">Data:</label> {{first.created_at}}
                      </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Meio de pagamento:</label>
                      <label v-if="gatewayinfo.payment_method == 'boleto'">Boleto</label>
                      <label v-if="gatewayinfo.payment_method == 'credit_card'">Cartão de crédito</label>
                    </b-col>
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Código da transação:</label>
                      <span @click="gateway(gatewayinfo.tid)" title="Abrir gateway" style="cursor:pointer">{{gatewayinfo.tid}}</span>
                    </b-col>
                  </b-row>
                  <b-row v-if="gatewayinfo.payment_method == 'boleto'">
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Situação no gateway:</label>
                      <span v-if="gatewayinfo.status == 'paid'" style="padding-right: 5px">Pago</span><span class="status-icon bg-success" v-if="first.in_situacao == 'F'"></span>
                      <span v-if="gatewayinfo.status == 'waiting_payment'" style="padding-right: 5px">Esperando o pagamento</span><span class="status-icon bg-warning" v-if="first.in_situacao == 'P'"></span>
                    </b-col>
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Data de expiração:</label> {{gatewayinfo.boleto_expiration_date | boletodate}}
                    </b-col>
                  </b-row>
                  <b-row v-if="gatewayinfo.payment_method == 'boleto'">
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Link:</label>
                      <span @click="gotonew(gatewayinfo.boleto_url)" title="Abrir boleto" style="cursor:pointer">Abrir</span>
                    </b-col>
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Valor:</label> {{gatewayinfo.amount | amount}}
                    </b-col>
                  </b-row>
                  <b-row v-if="gatewayinfo.payment_method == 'credit_card'">
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Cartão:</label>
                      {{gatewayinfo.card_first_digits}} ****** {{gatewayinfo.card_last_digits}}
                      <i class="payment payment-visa" v-if="gatewayinfo.card_brand == 'visa'"></i>
                      <i class="payment payment-mastercard" v-if="gatewayinfo.card_brand == 'mastercard'"></i>
                      <span v-if="gatewayinfo.card_brand != 'visa' && gatewayinfo.card_brand != 'mastercard'">({{gatewayinfo.card_brand}})</span>
                    </b-col>
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Nome:</label> {{gatewayinfo.card_holder_name}}
                    </b-col>
                  </b-row>
                  <b-row v-if="gatewayinfo.payment_method == 'credit_card'">
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Número de parcelas:</label>
                      {{gatewayinfo.installments}}
                    </b-col>
                    <b-col>
                      <label class="text-muted" style="padding-right:5px;">Valor:</label> {{gatewayinfo.amount | amount}}
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
        </b-row>
        <b-row v-if="mayIseeGateway">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Split</h4>
              </div>
              <table class="table card-table" style="font-size: 12px !important">
                <tbody>
                  <tr v-for="(item) in gatewayinfo.split_rules" v-bind:key="'all_'+item.id">
                    <td width="1"><i class="fas fa-dollar-sign"></i></td>
                    <td>
                      <span class="status-icon bg-success" v-if="item.playable_status == 'paid'" title="Recebimento pago ou antecipado"></span>
                      <span class="status-icon bg-danger" v-if="item.playable_status == 'waiting_funds'" title="Aguardando recebimento"></span>
                      {{item.recipient_name}}
                    </td>
                    <td v-if="item.playable_status == 'paid'" class="text-right"><span class="text-muted">{{item.amount | amount}}</span></td>
                    <td v-if="item.playable_status == 'waiting_funds'" :title="'Data pagamento ' + $options.filters.gatewaydate(item.playable_payment_date)" class="text-right"><span class="text-muted">{{item.amount | amount}}</span></td>
                    <td v-if="item.playable_status == 'paid'">
                      <i class="fas fa-history" v-if="item.playable_isanticipation" :title="'Data antecipação ' + $options.filters.gatewaydate(item.playable_payment_date)"></i>
                      <i class="fas fa-long-arrow-alt-right" v-if="!item.playable_isanticipation"></i>
                    </td>
                    <td v-if="item.playable_status == 'paid' && item.playable_isanticipation" :title="'Data original ' + $options.filters.gatewaydate(item.playable_original_payment_date)">{{amount_final(item) | amount}}</td>
                    <td v-if="item.playable_status == 'paid' && !item.playable_isanticipation" :title="'Data pagamento ' + $options.filters.gatewaydate(item.playable_payment_date)">{{amount_final(item) | amount}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
        </b-row>
        <b-row>
          <b-col>
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Lugares</h4>
              </div>
              <table class="table card-table">
                <tbody>
                  <tr v-for="(item) in grids.default.items" v-bind:key="'all_'+item.Indice">
                    <td width="1"><i class="fas fa-chair"></i></td>
                    <td>{{item.ds_setor}} - {{item.ds_localizacao}}</td>
                    <td class="text-right"><span class="text-muted">{{item.tickettype}}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-col>
          <b-col>
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Log</h4>
              </div>
              <table class="table card-table" style="font-size: 12px !important">
                <tbody>
                  <tr v-if="grids.logs.items.length == 0">
                    <td>Nenhum log</td>
                  </tr>
                  <tr v-for="(item) in grids.logs.items" v-bind:key="'all_'+item.id">
                    <td width="1">
                      <i class="fas fa-eye" v-if="item.type == 'see'"></i>
                      <i class="far fa-paper-plane" v-else></i>
                    </td>
                    <td>{{item.login}}</td>
                    <td>
                      <span v-if="item.type == 'see'">Visualizou o bilhete</span>
                      <span v-else>Enviou por e-mail</span>
                    </td>
                    <td>
                      {{item.created}}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import { func } from "@/functions";
import { searchService } from '../../components/common/services/searchs';
import { userService } from '../../components/common/services/user';
import { eventService } from "../../components/common/services/event";

import { mask } from 'vue-the-mask';

Vue.use(VueHead);

export default {
  mixins: [func],
  directives: { mask },
  props: ['id'],
  name: 'webpurchase-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Compras na web",
      }
    },
  },
  filters: {
      situacao: function (value) {
        switch (value) {
          case "F":
            value = "Finalizado";
            break;
          case "P":
            value = "Processando";
            break;
          case "E":
            value = "Estornado/Expirado";
            break;
          case "C":
            value = "Cancelado";
            break;
        }
        return value;
      },
      boletodate: function (value) {
        if (value == null || value == '') return "";
        let aux = value.substring(0,10);
        let split = aux.split("-");
        return split[2]+"/"+split[1]+"/"+split[0];
      },
      gatewaydate: function (value) {
        if (value == null || value == '') return "";
        let aux = value.substring(0,10);
        let split = aux.split("-");
        let ret = split[2]+"/"+split[1]+"/"+split[0];
        // console.log(value);
        return ret;
      },
      capme: function (value) {
        if (value == null) return "";
        if (value.length > 30)  {
          return value.substring(0,15)+"...";
        }
        else {
          return value;
        }
      },
      money: function (value) {
        let v = value;
          //let v = parseFloat(value)/100;
        return `R$ ${parseFloat(v).toFixed(2)}`;
      },
      amount: function (value) {
        let v = parseFloat(value)/100;
        return `R$ ${parseFloat(v).toFixed(2)}`;
      }
  },
  computed: {
    gatewayinfo() {
      //console.log(this.first.gateway_info);
      return JSON.parse(this.first.gateway_info);
    },
    first() {
      return this.grids.default.items[0];
    },
    image() {
      if (this.grids.default.items.length == 0) return "";
      return this.grids.default.items[0].img;
    },
    mayIsee() {
      return this.mayI('webpurchase-detail');
    },
    mayIseePrint() {
      return this.mayI('webpurchase-print');
    },
    mayIseeRefund() {
      return this.mayI("webpurchase-refund");
    },
    mayIseeGateway() {
      return this.mayI('webpurchase-gateway');
    },
  },
  methods: {
    see() {
      if (this.processing) return;
      this.processing = true;

      this.showWaitAboveAll();

      searchService.ticketSee(this.getLoggedId(), this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.populateLog();
          this.gotonew(response.see);
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );
    },
    sendemailinternal() {
      if (this.processing) return;
      this.processing = true;

      this.showWaitAboveAll();

      searchService.sendEmail(this.getLoggedId(), this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.toastSuccess("E-mail enviado.");
          this.populateLog();
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );

    },
    sendemail() {
      this.$swal({
          type: 'question',
          text: `Deseja reenviar para o e-mail cadastrado do cliente?`,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          preConfirm: () => {
            this.sendemailinternal();  
          },
      });

    },
    refund() {

    },
    amount_final(item) {
      let amount = item.playable_amount-item.playable_anticipation_fee-item.playable_fee;
      return amount;
    },
    gotonew(uri) {
      window.open(uri);
    },
    goto_event(uri) {
      window.open(uri);
    },
    gateway(number) {
      window.open(`https://dashboard.pagar.me/#/transactions/${number}`);
    },
    populateLog() {
      this.showWaitAboveAll();

      searchService.loglist(this.getLoggedId(), this.id).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
              this.grids.logs.loaded = true;
              this.grids.logs.items = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );   
    },
    get() {
      if (this.processing) return;
      this.processing = true;

      this.showWaitAboveAll();

      searchService.webPurchaseDetail(this.getLoggedId(), this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
              this.grids.default.loaded = true;
              this.grids.default.items = response;
              if (response.length == 0)
              {
                this.grids.default.nothing = true;
                this.toastError("Não foi possível achar o pedido ou o dominio não é o correto.");
                
              }
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );   
    },
  },
  created() {
    this.get();
    this.populateLog();
  },
  data () {
    return {
        processing: false,
        loading: false,
        grids: {
            default: {
                processing: false,
                nothing: false,
                loaded: false,
                items: [],
            },
            logs: {
                processing: false,
                loaded: false,
                items: [],
            }
        }
      }
    }
}
</script>

<style>

</style>
