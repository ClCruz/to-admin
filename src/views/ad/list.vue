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
                                  name="name"
                                  maxlength="100"
                                  @keyup.enter.native="search"
                                  v-model="form.search"
                                  placeholder="Digite o texto que deseja procurar">
                      </b-form-input>
                      <b-button type="button" variant="primary" size="sm" @click="search">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Consultando...
                            </template>
                        </v-wait>
                        <span v-if="!grids.defaults.processing">Consultar</span>
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
                  :per-page="grids.defaults.perPage"
                  v-if="grids.defaults.loaded"
                  :items="grids.defaults.items"
                  :fields="grids.defaults.fields">

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('ad-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('ad-add')">
                      <b-button title="Editar" v-if="mayI('ad-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
                  </b-button-group>
              </template>
              <template slot="priority" slot-scope="data">
                  <span v-if="data.item.priority == 0">Sem Prioridade</span>
                  <span v-else>{{data.item.priority}}</span>
              </template>
          </b-table>
          <b-pagination @change="pagto" size="sm" v-if="grids.defaults.loaded && grids.defaults.total>grids.defaults.perPage" :total-rows="grids.defaults.total" v-model="grids.defaults.currentPage" :per-page="grids.defaults.perPage">
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
import { adService } from '../../components/common/services/ad';

Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'ad-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Produtor - Lista",
      }
    },
  },
  computed: {
    mayIsee() {
      return this.mayI('ad-viewer', 'ad-add');
    }
  },
  methods: {
    edit(item) {
      this.$router.push(`/ad/edit/${item.id}`);
    },
    pagto(to) {
      this.grids.defaults.currentPage = to;
      this.search();
    },
    search() {
      if (this.processing) return;

      this.grids.defaults.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      adService.list(this.form.search, this.grids.defaults.currentPage, this.grids.defaults.perPage).then(
        response => {
          this.processing = false;
          this.grids.defaults.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.grids.defaults.loaded = true;
              this.grids.defaults.items = response;
              this.grids.defaults.currentPage = response.length == 0 ? 1 : response[0]["currentPage"];
              this.grids.defaults.total = response.length == 0 ? 0 : response[0][config.system.totalCount];
          }
        },
        error => {
          this.grids.defaults.processing = false;
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
            defaults: {
                processing: false,
                loaded: false,
                total: 0,
                currentPage: 1,
                perPage: 10,
                items: [],
                fields: {
                    name: { label: 'Nome', sortable: false },
                    campaign: { label: "Campanha", sortable: false },
                    priority: { label: 'Prioridade', sortable: false },
                    startdate: { label: 'Início', sortable: false },
                    enddate: { label: 'Fim', sortable: false },
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
