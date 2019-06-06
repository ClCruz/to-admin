<template>
    <div v-if="mayIsee">
      <b-container>
        <b-row>
          <b-col>
              <b-row>
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Buscar:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  @keyup.enter.native="search"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.search"
                                  placeholder="Digite o nome">
                      </b-form-input>
                      <b-button type="button" variant="primary" size="sm" @click="search">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Consultando...
                            </template>
                        </v-wait>
                        <span v-if="!grids.default.processing">Consultar</span>
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
                  :per-page="grids.default.perPage"
                  v-if="grids.default.loaded"
                  :items="grids.default.items"
                  :fields="grids.default.fields">

              <template slot="active" slot-scope="data">
                  <span v-if="data.item.active == 1">Ativo</span>
                  <span v-else>Inativo</span>
              </template>

              <template slot="key" slot-scope="data">
                <span :title="'Chave do parceiro -'+data.item.key+' (Clique para copiar)'" 
                      style="padding-right:10px;cursor:pointer;"
                      v-clipboard:copy="data.item.key"
                      v-clipboard:success="clipboardSuccess"
                      v-clipboard:error="clipboardError"><i class="fas fa-key"></i></span>
              </template>

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('quotapartner-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('quotapartner-add')">
                      <b-button title="Editar" v-if="mayI('quotapartner-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
                  </b-button-group>
              </template>
          </b-table>
          <b-pagination @change="pagto" size="sm" v-if="grids.default.loaded && grids.default.total>grids.default.perPage" :total-rows="grids.default.total" v-model="grids.default.currentPage" :per-page="grids.default.perPage">
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
import { quotapartnerService } from '../../components/common/services/quotapartner';

Vue.use(VueClipboard);
Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'quotapartner-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Parceiro para cota - Lista",
      }
    },
  },
  computed: {
    mayIsee() {
      return this.mayI('quotapartner-viewer', 'quotapartner-add');
    }
  },
  methods: {
    clipboardSuccess() {
      this.toastSuccess("Copiado com sucesso.");
    },
    edit(item) {
      this.$router.push(`/quota/edit/${item.id}`);
    },
    pagto(to) {
      this.grids.default.currentPage = to;
      this.search();
    },
    search() {
      if (this.processing) return;

      this.grids.default.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      quotapartnerService.list(this.getLoggedId(), this.form.search, this.grids.default.currentPage, this.grids.default.perPage).then(
        response => {
          this.processing = false;
          this.grids.default.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.grids.default.loaded = true;
              this.grids.default.items = response;
              this.grids.default.currentPage = response.length == 0 ? 1 : response[0]["currentPage"];
              this.grids.default.total = response.length == 0 ? 0 : response[0][config.system.totalCount];
          }
        },
        error => {
          this.grids.default.processing = false;
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
            default: {
                processing: false,
                loaded: false,
                total: 0,
                currentPage: 1,
                perPage: 10,
                items: [],
                fields: {
                    name: { label: 'Nome', sortable: false },
                    active: { label: 'Ativo?', sortable: false },
                    key: { label: 'Chave', sortable: false },
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
