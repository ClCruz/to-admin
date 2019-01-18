<template>
    <div v-if="mayIsee">
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
                      <b-button title="Editar" v-if="mayI('partner-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
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
        },
        grids: {
            partners: {
                processing: false,
                loaded: false,
                total: 0,
                currentPage: 1,
                perPage: 10,
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
