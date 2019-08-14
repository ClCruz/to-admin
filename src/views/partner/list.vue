<template>
    <div v-if="mayIsee">
      <b-modal ref="baseModal" hide-footer title="Parceiro x Base">
        <div class="d-block text-center">
          <h4>Permissão nas bases para {{popups.base.name}}</h4>
        </div>
        <b-table striped="striped"
                  outlined="outlined"
                  class="fontSize tableClicked bg-white"
                  small="small"
                  hover="hover"
                  responsive
                  show-empty
                  empty-text="Não foram encontrados registros."
                  v-if="this.popups.base.grids.base.loaded"
                  :items="this.popups.base.grids.base.items"
                  :fields="this.popups.base.grids.base.fields">

              <template slot="active" slot-scope="data">
                <b-button size="sm" @click="changeBase('add', data.item)" title="Adicionar base" variant="outline-success" v-if="data.item.active != 1">
                    Adicionar
                </b-button>
                <b-button size="sm" @click="changeBase('del', data.item)" title="Remover base" variant="danger" v-if="data.item.active == 1">
                    Remover
                </b-button>
              </template>
        </b-table>
        <b-btn class="mt-3" variant="outline-info" block @click="baseClose">Fechar</b-btn>
      </b-modal>
      <b-modal ref="paymenttypeModal" hide-footer title="Parceiro x Forma de Pagamento">
        <div class="d-block text-center">
          <h4>Formas de pagamento para {{popups.base.name}}</h4>
        </div>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text>
              Base:
            </b-input-group-prepend>
            <b-form-select v-on:change="selBase" v-model="form.id_base" :options="selects.base" size="sm" />
          </b-input-group>
        </b-row>
        <b-table striped="striped"
                  outlined="outlined"
                  class="fontSize tableClicked bg-white"
                  small="small"
                  hover="hover"
                  responsive
                  show-empty
                  empty-text="Não foram encontrados registros."
                  v-if="this.popups.paymenttype.grids.paymenttype.loaded"
                  :items="this.popups.paymenttype.grids.paymenttype.items"
                  :fields="this.popups.paymenttype.grids.paymenttype.fields">

              <template slot="ForPagto" slot-scope="data">
                  <span v-if="data.item.edit == 0">{{data.item.ForPagto}}</span>
                  <span v-if="data.item.edit == 1">
                    <b-input-group size="sm">
                      <b-form-select v-model="data.item.CodForPagto" :options="selects.forpagto" size="sm" />
                    </b-input-group>
                  </span>
              </template>
              <template slot="active" slot-scope="data">
                <b-button size="sm" @click="changePaymenttype('del', data.item)" title="Remover forma de pagamento" variant="danger" v-if="data.item.active == 1">
                    Remover
                </b-button>

                <b-button size="sm" @click="changePaymenttype_f1(data.item)" title="Adicionar forma de pagamento" variant="outline-info" v-if="data.item.active != 1 && data.item.edit == 0">
                    Adicionar
                </b-button>

                <b-button size="sm" @click="changePaymenttype('add', data.item)" title="Adicionar forma de pagamento" variant="outline-success" v-if="data.item.active != 1 && data.item.edit == 1">
                    Salvar
                </b-button>
                <b-button size="sm" @click="cancelPaymenttype(data.item)" title="Cancelar" variant="outline-warning" v-if="data.item.active != 1 && data.item.edit == 1">
                    Cancelar
                </b-button>
                
              </template>
        </b-table>
        <b-btn class="mt-3" variant="outline-info" block @click="paymenttypeClose">Fechar</b-btn>
      </b-modal>
      <b-container>
        <b-row class="mb-3">
          <b-col>
              <b-row>
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Buscar:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  @keyup.enter.native="search"
                                  v-model="form.search"
                                  placeholder="Digite o nome, dominio, apikey">
                      </b-form-input>
                      <b-button type="button" variant="primary" size="sm" @click="search">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Consultando...
                            </template>
                        </v-wait>
                        <span v-if="!grids.partners.processing">Consultar</span>
                      </b-button>

                  </b-input-group>
              </b-row>
          </b-col>

        </b-row>
        <b-row>
          <b-table striped="striped"
                  outlined="outlined"
                  class="fontSize tableClicked bg-white"
                  small="small"
                  hover="hover"
                  responsive
                  show-empty
                  empty-text="Não foram encontrados registros."
                  :per-page="grids.partners.perPage"
                  v-if="grids.partners.loaded"
                  :items="grids.partners.items"
                  :fields="grids.partners.fields">

              <template slot="isDemo" slot-scope="data">
                  <span v-b-tooltip.hover title="Cliente Ativo e produtivo" v-if="data.item.isDemo == 0 && data.item.isTrial == 0 && data.item.isDev == 0"><i class="fas fa-user-tie"></i></span>
                  <span v-b-tooltip.hover title="Cliente de trial" v-if="data.item.isDemo == 0 && data.item.isTrial == 1 && data.item.isDev == 0"><i class="fas fa-user-ninja"></i></span>
                  <span v-b-tooltip.hover title="Cliente de demonstração" v-if="data.item.isDemo == 1 && data.item.isTrial == 0 && data.item.isDev == 0"><i class="fas fa-user-astronaut"></i></span>
                  <span v-b-tooltip.hover title="Ambiente de desenvolvimento" v-if="data.item.isDev == 1"><i class="fas fa-skiing"></i></span>
              </template>

              <template slot="dateStart" slot-scope="data">
                  <span v-if="data.item.dateEnd != ''"> {{data.item.dateStart}} Até {{data.item.dateEnd}}</span>
                  <span v-b-tooltip.hover title="Sem previsão de termino." v-else>Iniciado em {{data.item.dateStart}}</span>
              </template>

              <template slot="domain" slot-scope="data">
                  <span v-b-tooltip.hover title="Clique para abrir" 
                        style="cursor:pointer;" @click="gotoFarFromHome(data.item.domain)"><i class="fab fa-chrome"></i></span>
              </template>

              <template slot="key" slot-scope="data">
                  <span v-b-tooltip.hover :title="'Chave de produção -'+data.item.key+' (Clique para copiar)'" 
                        style="padding-right:10px;cursor:pointer;"
                        v-clipboard:copy="data.item.key"
                        v-clipboard:success="clipboardSuccess"
                        v-clipboard:error="clipboardError"><i class="fas fa-key"></i></span>
                  <span v-b-tooltip.hover :title="'Chave de teste -'+data.item.key_test+' (Clique para copiar)'" 
                        style="cursor:pointer;"
                        v-clipboard:copy="data.item.key_test"
                        v-clipboard:success="clipboardSuccess"
                        v-clipboard:error="clipboardError"><i class="fas fa-asterisk"></i></span>
              </template>

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('partner-add', 'partner-wl')">-</span>
                  <b-button-group size="sm" v-if="mayI('partner-add', 'partner-wl')">
                      <b-button title="Bases" v-if="mayI('partner-add')" @click.stop="base(data.item,$event.target)">Bases</b-button>
                      <b-button title="Editar" v-if="mayI('partner-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
                      <b-button title="Forma de pagamento" v-if="mayI('partner-paymenttype')" @click.stop="paymenttype(data.item,$event.target)">Forma de Pgto</b-button>
                      <b-button title="Criação whitelabel" variant="danger" v-if="mayI('partner-wl')" @click.stop="whitelabel(data.item,$event.target)">Whitelabel</b-button>
                  </b-button-group>
              </template>
          </b-table>
          <b-pagination @change="pagto" size="sm" v-if="grids.partners.loaded && grids.partners.total>grids.partners.perPage" :total-rows="grids.partners.total" v-model="grids.partners.currentPage" :per-page="grids.partners.perPage">
          </b-pagination>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import VueClipboard from 'vue-clipboard2';
import config from "@/config";
import { func } from "@/functions";
import { partnerService } from '../../components/common/services/partner';


Vue.use(VueClipboard);
Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'partner-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Parceiros - Lista",
      }
    },
  },
  computed: {
    mayIsee() {
      return this.mayI('partner-viewer', 'partner-add');
    }
  },
  methods: {
    cancelPaymenttype(item) {
      item.edit = 0;
      item.CodForPagto = '';
    },
    paymenttypeClose() {
      this.$refs.paymenttypeModal.hide();
    },
    baseClose() {
      this.$refs.baseModal.hide();
    },
    selBase() {
      Vue.nextTick().then(response => {
        this.paymenttype_intern();
        this.populatePaymenttypeOnBase();
      });
    },   
    paymenttype(item) {
      this.popups.paymenttype.grids.paymenttype.loaded = false;
      this.popups.paymenttype.grids.paymenttype.items = [];
      this.form.id_base = 0;

      this.popups.paymenttype.name = item.name;
      this.popups.paymenttype.id = item.id;
      this.$refs.paymenttypeModal.show();
      this.populateBases(item);
    },
    paymenttype_intern() {
      if (this.processing) return;

      this.popups.paymenttype.grids.paymenttype.processing = true;
      this.processing = true;

      //this.$wait.start("inprocess");
      this.showWaitAboveAll();
      partnerService.listpaymenttype(this.popups.paymenttype.id, this.form.id_base).then(
        response => {
          this.processing = false;
          this.popups.paymenttype.grids.paymenttype.processing = false;
          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.popups.paymenttype.grids.paymenttype.loaded = true;
              this.popups.paymenttype.grids.paymenttype.items = response;
          }
        },
        error => {
          this.popups.paymenttype.grids.paymenttype.processing = false;
          this.processing = false;
          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    base(item) {
      if (this.processing) return;

      this.popups.base.name = item.name;
      this.popups.base.id = item.id;

      this.popups.base.grids.base.processing = true;
      this.processing = true;

      //this.$wait.start("inprocess");
      this.showWaitAboveAll();
      partnerService.listbase(item.id).then(
        response => {
          this.processing = false;
          this.popups.base.grids.base.processing = false;
          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.popups.base.grids.base.loaded = true;
              this.popups.base.grids.base.items = response;
              this.$refs.baseModal.show();
          }
        },
        error => {
          this.popups.base.grids.base.processing = false;
          this.processing = false;
          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    refreshBase() {
      this.base({ name: this.popups.base.name, id: this.popups.base.id });
    },
    changePaymenttype(type, item) {
      if (this.processing) return;

      this.processing = true;

      this.showWaitAboveAll();
      partnerService.savepaymenttype(item.id, this.getLoggedId(), this.form.id_base, item.id_meio_pagamento, item.CodForPagto).then(
        response => {
          this.processing = false;

          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              if (type == "add")
                this.toastSuccess("Salvo com sucesso.");
              else 
                this.toastSuccess("Removido com sucesso.");
                
              this.paymenttype_intern();
            }
            else {
              this.toastError(response.msg);
            }
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    changePaymenttype_f1(item) {
      item.edit = item.edit == 0 ? 1 : 0;
    },
    changeBase(type, item) {
      if (this.processing) return;

      this.processing = true;

      this.showWaitAboveAll();
      partnerService.savebase(this.getLoggedId(), this.popups.base.id, item.id_base).then(
        response => {
          this.processing = false;

          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              this.toastSuccess("Salvo com sucesso.");
              this.refreshBase();
            }
            else {
              this.toastError(response.msg);
            }
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    clipboardSuccess() {
      this.toastSuccess("Copiado com sucesso.");
    },
    clipboardError() {
      this.toastError("Erro ao tentar copiar.");
    },
    whitelabel(item) {
      this.$router.push(`/partner/whitelabel/${item.id}`);
    },
    edit(item) {
      this.$router.push(`/partner/edit/${item.id}`);
    },
    pagto(to) {
      this.grids.partners.currentPage = to;
      this.search();
    },
    populateBases() {      
      this.showWaitAboveAll();
      partnerService.listbaseselect(this.popups.paymenttype.id).then(
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
    populatePaymenttypeOnBase() {      
      this.showWaitAboveAll();
      partnerService.listpaymenttypeonbase(this.form.id_base).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.forpagto = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );
    },
    search() {
      if (this.processing) return;

      this.grids.partners.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      partnerService.list(this.getLoggedId(), this.form.search, this.grids.partners.currentPage, this.grids.partners.perPage).then(
        response => {
          this.processing = false;
          this.grids.partners.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.grids.partners.loaded = true;
              this.grids.partners.items = response;
              this.grids.partners.currentPage = response.length == 0 ? 1 : response[0]["currentPage"];
              this.grids.partners.total = response.length == 0 ? 0 : response[0][config.system.totalCount];
          }
        },
        error => {
          this.grids.partners.processing = false;
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    }
  },
  data () {
    return {
        processing: false,
        loading: false,
        form: {
          search: '',
          id_base: '',
          CodForPagto: '',
        },
        selects: {
          base: [],
          forpagto: [],
        },
        popups: {
          base: {
            loaded: false,
            name: '',
            id: '',
            grids: {
              base: {
                processing: false,
                loaded: false,
                items: [],
                fields: {
                  ds_nome_teatro: { label: 'Nome', sortable: false },
                  active: { label: '', sortable: false },
                },
              }
            }
          },
          paymenttype: {
            loaded: false,
            name: '',
            id: '',
            grids: {
              paymenttype: {
                processing: false,
                loaded: false,
                items: [],
                fields: {
                  ds_meio_pagamento: { label: 'Nome', sortable: false },
                  ForPagto: { label: 'Vinculo na base', sortable: false },
                  active: { label: '', sortable: false },
                },
              }
            }
          }
        },
        grids: {
            partners: {
                processing: false,
                loaded: false,
                total: 0,
                currentPage: 1,
                perPage: 50,
                items: [],
                fields: {
                    isDemo: { label: 'Tipo', sortable: false },
                    name: { label: 'Nome', sortable: false },
                    domain: { label: 'Domínio', sortable: false },
                    dateStart: { label: 'Data Validade', sortable: false },
                    key: { label: 'Chaves API', sortable: false },
                    created: { label: 'Criado em', sortable: false },
                    actions: { label: 'Ações' }
                },
            }
        }
    }
  }
}
</script>

<style>

</style>
