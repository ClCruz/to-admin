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
                <h3 class="card-title">Compra {{id}} - {{first.CodVenda}}</h3>
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
          <b-col v-if="mayIseeGateway">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Split</h4>
              </div>
              <table class="table card-table">
                <tbody>
                  <tr v-for="(item) in gatewayinfo.split_rules" v-bind:key="'all_'+item.id">
                    <td width="1"><i class="fas fa-dollar-sign"></i></td>
                    <td>{{item.recipient_name}}</td>
                    <td class="text-right"><span class="text-muted">{{item.amount | amount}}</span></td>
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
      console.log(this.first.gateway_info);
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
    gotonew(uri) {
      window.open(uri);
    },
    goto_event(uri) {
      window.open(uri);
    },
    gateway(number) {
      window.open(`https://dashboard.pagar.me/#/transactions/${number}`);
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
            }
        }
      }
    }
}
</script>

<style>

</style>
