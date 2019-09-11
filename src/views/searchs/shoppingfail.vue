<template>
    <div v-if="mayIsee">
      <b-container>
        <b-row>
          <b-col>
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
            <b-row class="mb-3" title="Atenção: Os erros de compras que aparecem aqui são apenas referente ao dominio que você está do admin, e não a outros dominios.">
              <b-input-group size="sm">
                <b-input-group-prepend is-text>
                  Base:
                </b-input-group-prepend>
                <b-form-select v-on:change="selBase" v-model="form.id_base" :options="selects.bases" size="sm" />
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
                <b-form-select id="event" v-on:change="selEvent" v-model="form.id_evento" :options="selects.events" />
                  <template v-slot="first">
                    <option :value="''">-- Selecione --</option>
                  </template>
                </b-form-select>
              </b-input-group>
            </b-row>
            <b-row class="mb-3">
              <b-input-group size="sm">
                <b-input-group-prepend is-text class="firstLabel">
                    Apresentação:
                </b-input-group-prepend>
                <b-form-select id="presentation" v-on:change="selPresentantion" v-model="form.id_apresentacao" :options="selects.presentations" />
                    <template slot="first">
                        <option :value="null">-- Selecione --</option>
                    </template>
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
                        <th class="text-center">Data</th>
                        <th class="w-1">Cliente</th>
                        <th class="text-center">Evento</th>
                        <th class="text-center">Cartão</th>
                        <th class="text-center">Valor total</th>
                        <th class="text-center">Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item) in grids.default.items" v-bind:key="'all_'+item.id">
                        <td><div style="font-size:12px">{{item.created_at}}</div></td>
                        <td>
                          <div class="clearfix" style="font-size:12px">
                            {{item.client_name}}
                          </div>
                            <span class="text-muted" style="font-size:12px">{{item.client_document}}</span>
                        </td>
                        <td>
                          <div style="font-size:12px">{{item.ds_evento || capme}}
                          </div>
                            <span class="text-muted" style="font-size:12px">{{item.dt_apresentacao}}</span>
                            <span class="text-muted" style="font-size:12px"> - </span>
                            <span class="text-muted" style="font-size:12px">{{item.hr_apresentacao}}</span>
                        </td>
                        <td>
                          <span class="text-muted" style="font-size:12px">
                            {{getJson(item.json_gateway_response).card_first_digits}}******{{getJson(item.json_gateway_response).card_last_digits}} <br />
                            {{getJson(item.json_gateway_response).card_brand}}
                          </span>
                        </td>
                        <td>
                          <div>
                            {{getJson(item.json_values)[0].totalwithservice | money}}
                          </div>
                        </td>
                        <td style="font-size:12px">
                          <div v-if="item.refuse_reason == 'acquirer'">Recusado</div>
                          <div v-if="item.refuse_reason == 'antifraud'">Anti-fraude</div>
                          <span class="text-muted" style="font-size:12px">{{getJson(item.json_gateway_response).authorization_desc}}</span>
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
  name: 'shoppingfail-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Compras com falha",
      }
    },
  },
  filters: {
      capme: function (value) {
        if (value == null) return "";
        if (value.length > 16)  {
          return value.substring(0,15)+"...";
        }
        else {
          return value;
        }
      },
      money: function (value) {
          let v = parseFloat(value)/100;
          return `R$ ${parseFloat(v).toFixed(2)}`;
      }
  },
  computed: {
    mayIsee() {
      return this.mayI('shoppingfail-viewer');
    }
  },
  methods: {
    getJson(text) {
      return JSON.parse(text);
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

      searchService.shoppingfail(this.getLoggedId(), this.form.client_name, this.form.client_document, this.form.id_evento, this.form.id_apresentacao).then(
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
