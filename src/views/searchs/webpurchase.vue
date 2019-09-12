<template>
    <div v-if="mayIsee">
      <b-container>
        <b-row>
          <b-col>
            <b-row class="mb-3">
                <b-input-group size="sm">
                    <b-input-group-prepend is-text class="firstLabel">
                        Pedido:
                    </b-input-group-prepend>
                    <b-form-input id="id_pedido_venda"
                                type="text"
                                name="id_pedido_venda"
                                v-mask="['###########']"
                                maxlength="10"
                                v-model="form.id_pedido_venda"
                                placeholder="Digite o id do pedido">
                    </b-form-input>
                </b-input-group>
            </b-row>
            <b-row class="mb-3">
                <b-input-group size="sm">
                    <b-input-group-prepend is-text class="firstLabel">
                        CPF:
                    </b-input-group-prepend>
                    <b-form-input id="client_document"
                                type="text"
                                name="client_document"
                                v-mask="['###.###.###-##']"
                                maxlength="14"
                                v-model="form.client_document"
                                placeholder="Digite o CPF">
                    </b-form-input>
                </b-input-group>
            </b-row>
            <b-row class="mb-3">
                <b-input-group size="sm">
                    <b-input-group-prepend is-text class="firstLabel">
                        Nome:
                    </b-input-group-prepend>
                    <b-form-input id="client_name"
                                type="text"
                                name="client_name"
                                maxlength="50"
                                v-model="form.client_name"
                                placeholder="Digite o nome">
                    </b-form-input>
                </b-input-group>
            </b-row>
            <b-row class="mb-3" title="Atenção: As compras que aparecem aqui são apenas referente ao dominio que você está do admin, e não a outros dominios.">
              <b-input-group size="sm">
                <b-input-group-prepend is-text>
                  Base:
                </b-input-group-prepend>
                <b-form-select v-on:change="selBase" v-model="form.id_base" :options="selects.bases" size="sm" />
                </b-form-select>
              </b-input-group>
            </b-row>
            <b-row class="mb-3">
              <b-input-group size="sm">
                <b-input-group-prepend is-text class="firstLabel">
                    Evento:
                </b-input-group-prepend>
                <b-form-select id="event" v-on:change="selEvent" v-model="form.id_evento" :options="selects.events" />
                </b-form-select>
              </b-input-group>
            </b-row>
            <b-row class="mb-3">
              <b-input-group size="sm">
                <b-input-group-prepend is-text class="firstLabel">
                    Apresentação:
                </b-input-group-prepend>
                <b-form-select id="presentation" v-on:change="selPresentantion" v-model="form.id_apresentacao" :options="selects.presentations" />
                </b-form-select>
              </b-input-group>
            </b-row>
            <b-row class="mb-3">
                <b-input-group size="sm">
                    <b-button type="button" variant="primary" size="sm" @click="search">
                      <v-wait for="inprocess">
                          <template slot="waiting">
                              Consultando...
                          </template>
                      </v-wait>
                      <span v-if="!processing">Consultar</span>
                    </b-button>
                </b-input-group>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-if="grids.default.loaded" class="mb-3">
              <div class="card">
                <div class="table-responsive">
                  <table class="table table-hover table-outline table-vcenter text-nowrap card-table">
                    <thead>
                      <tr>
                        <th class="text-center">Pedido</th>
                        <th class="text-center">Data</th>
                        <th class="w-1">Cliente</th>
                        <th class="text-center">Evento</th>
                        <th class="text-center">Situação</th>
                        <th class="text-center">Transação</th>
                        <th class="text-center">Quantidade de Tickets</th>
                        <th class="text-center">Valor total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item) in grids.default.items" v-bind:key="'all_'+item.id_pedido_venda">
                        <td>
                          <span v-if="!mayIseeDetail" style="font-size:12px">
                            {{item.id_pedido_venda}}
                          </span>
                          <span v-if="mayIseeDetail" @click="detail(item.id_pedido_venda)" style="font-size:12px;cursor:pointer;" title="Clique para abrir o detalhe">
                            {{item.id_pedido_venda}}
                          </span>
                        </td>
                        <td><div style="font-size:12px">{{item.created_at}}</div></td>
                        <td>
                          <div class="clearfix" style="font-size:12px">
                            {{item.client_name}}
                          </div>
                            <span class="text-muted" style="font-size:12px">{{item.client_document}}</span>
                        </td>
                        <td>
                          <div style="font-size:12px" :title="item.ds_evento">{{item.ds_evento | capme}}
                          </div>
                            <span class="text-muted" style="font-size:12px">{{item.dt_apresentacao}}</span>
                            <span class="text-muted" style="font-size:12px"> - </span>
                            <span class="text-muted" style="font-size:12px">{{item.hr_apresentacao}}</span>
                        </td>
                        <td>
                          <span style="font-size:12px">
                            <span class="status-icon bg-success" v-if="item.in_situacao == 'F'"></span>
                            <span class="status-icon bg-warning" v-if="item.in_situacao == 'P'"></span>
                            <span class="status-icon bg-secondary" v-if="item.in_situacao == 'E'"></span>
                            <span class="status-icon bg-dark" v-if="item.in_situacao == 'C'"></span>
                            {{item.in_situacao | situacao }}
                          </span>
                        </td>
                        <td>
                          <span v-if="!mayIseeGateway" style="font-size:12px">
                            {{item.cd_numero_transacao}}
                          </span>
                          <span v-if="mayIseeGateway" @click="gateway(item.cd_numero_transacao)" style="font-size:12px;cursor:pointer;" title="Clique para abrir a transação no gateway">
                            {{item.cd_numero_transacao}}
                          </span>
                        </td>
                        <td style="font-size:12px">
                          {{item.tickets_count}}
                        </td>
                        <td style="font-size:12px">
                          <div>
                            {{item.vl_total_pedido_venda | money}}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <b-pagination @change="pagto" size="sm" v-if="grids.default.loaded && grids.default.total>grids.default.perPage" :total-rows="grids.default.total" v-model="grids.default.currentPage" :per-page="grids.default.perPage">
                  </b-pagination>
                </div>
              </div>


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
      }
  },
  computed: {
    mayIsee() {
      return this.mayI('webpurchase-viewer');
    },
    mayIseeGateway() {
      return this.mayI('webpurchase-gateway');
    },
    mayIseeDetail() {
      return this.mayI("webpurchase-detail");
    },
  },
  methods: {
    detail(id) {
      this.$router.push(`/webpurchase/detail/${id}`);
    },
    gateway(number) {
      window.open(`https://dashboard.pagar.me/#/transactions/${number}`);
    },
    selBase() {
      Vue.nextTick().then(response => {
        this.selects.events = [];
        this.selects.presentations = [];

        this.form.id_evento = null;
        this.form.id_apresentacao = null;

        this.populateEvents();
      });
    },
    pagto(to) {
      this.grids.event.currentPage = to;
      this.search();
    },
    search() {
      if (this.processing) return;
      this.processing = true;

      this.showWaitAboveAll();

      searchService.webPurchase(this.getLoggedId(), this.form.id_pedido_venda, this.form.client_name, this.form.client_document, this.form.id_evento, this.form.id_apresentacao).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
              this.grids.default.loaded = true;
              this.grids.default.items = response;

              this.grids.default.currentPage = response.length == 0 ? 1 : response[0]["currentPage"];
              this.grids.default.total = response.length == 0 ? 0 : response[0][config.system.totalCount];
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );   
    },
    selEvent() {
      Vue.nextTick().then(response => {
        this.selects.presentations = [];

        this.form.id_apresentacao = null;

        this.populatePresentations();
      });
    },
    selPresentantion() {

    },
    populateBases() {
      if (this.getLoggedId() == null || this.getLoggedId() == "") return;
      
      this.showWaitAboveAll();
      userService.baseSelect(this.getLoggedId()).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.bases = response;
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
      this.selects.presentations = [];

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
    populatePresentations() {      
      if (this.form.id_base == '' && this.form.id_evento == '') {
        return;
      }
      this.selects.presentations = [];

      this.showWaitAboveAll();
      eventService.selectPresentation(this.getLoggedId(),this.form.id_evento).then(
        response => {
          this.selects.presentations = response;
          this.hideWaitAboveAll();
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");        
        }
      );
    },
  },
  created() {
    this.populateBases();
  },
  data () {
    return {
        processing: false,
        loading: false,
        selects: {
          bases: [],
          events: [],
          presentations: []
        },
        form: {
          id_pedido_venda: '',
          client_name: '',
          client_document: '',
          id_evento: null,
          id_apresentacao: null,
        },
        grids: {
            default: {
                processing: false,
                loaded: false,
                total: 0,
                currentPage: 1,
                perPage: 10,
                items: [],
            }
        }
    }
  }
}
</script>

<style>

</style>
