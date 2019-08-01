<template>
    <div v-if="mayIsee">
      <b-container>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text>
              Base:
            </b-input-group-prepend>
            <b-form-select v-model="form.id_base" :options="selects.base" size="sm" />
          </b-input-group>
        </b-row>
        <b-row class="mb-3">
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

              <template slot="StaForPagto" slot-scope="data">
                  <span v-if="data.item.StaForPagto == 'A'">Ativo</span>
                  <span v-else>Inativo</span>
              </template>

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('paymenttype-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('paymenttype-add')">
                      <b-button title="Editar" v-if="mayI('paymenttype-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
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
import config from "@/config";
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { paymenttypeService } from '../../components/common/services/paymenttype';

Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'tickettype-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Tipo de Pagamento - Lista",
      }
    },
  },
  computed: {
    mayIsee() {
      return this.mayI('paymenttype-viewer', 'paymenttype-add');
    }
  },
  created() {
    this.populateBases();
  },
  methods: {
    populateBases() {
      if (this.getLoggedId() == null || this.getLoggedId() == "") return;
      
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
    edit(item) {
      this.$router.push(`/paymenttype/edit/${item.CodForPagto}/${item.id_base}`);
    },
    pagto(to) {
      this.grids.default.currentPage = to;
      this.search();
    },
    search() {
      if (this.form.id_base == '') {
        this.toastError("Escolha uma base.");
        return;
      }
      if (this.processing) return;

      this.grids.default.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      paymenttypeService.list(this.getLoggedId(), this.form.id_base, this.form.search, this.grids.default.currentPage, this.grids.default.perPage).then(
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
          id_base: '',
        },
        selects: {
          base: [],
        },
        popups: {
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
                    ForPagto: { label: 'Nome', sortable: false },
                    StaForPagto: { label: 'Ativo?', sortable: false },
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
