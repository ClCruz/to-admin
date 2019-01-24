<template>
    <div v-if="mayIsee">
      <b-modal ref="baseModal" hide-footer title="Sincronização de gênero">
        <div class="d-block text-center">
          <h4>Sincronização</h4>
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
                <b-button size="sm" @click="sync(data.item)" title="Adicionar permissão" variant="outline-danger" v-if="data.item.active != 1">
                    Sincronizar
                </b-button>
                <b-button size="sm" title="Remover permissão" variant="outline-success" v-if="data.item.active == 1">
                    Sincronizado
                </b-button>
              </template>
        </b-table>
        <b-btn class="mt-3" variant="outline-info" block @click="baseClose">Fechar</b-btn>
      </b-modal>
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
                        <span v-if="!grids.genre.processing">Consultar</span>
                      </b-button>
                      <b-button title="Bases" v-if="mayI('genre-add')" size="sm" @click.stop="base()">
                        Bases
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
                  :per-page="grids.genre.perPage"
                  v-if="grids.genre.loaded"
                  :items="grids.genre.items"
                  :fields="grids.genre.fields">

              <template slot="active" slot-scope="data">
                  <span v-if="data.item.active == 1">Ativo</span>
                  <span v-else>Inativo</span>
              </template>

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('genre-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('genre-add')">
                      <b-button title="Editar" v-if="mayI('genre-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
                  </b-button-group>
              </template>
          </b-table>
          <b-pagination @change="pagto" size="sm" v-if="grids.genre.loaded && grids.genre.total>grids.genre.perPage" :total-rows="grids.genre.total" v-model="grids.genre.currentPage" :per-page="grids.genre.perPage">
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
import { genreService } from '../../components/common/services/genre';

Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'genre-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Gênero - Lista",
      }
    },
  },
  computed: {
    mayIsee() {
      return this.mayI('genre-viewer', 'genre-add');
    }
  },
  methods: {
    sync(item) {
      if (this.processing) return;

      this.processing = true;

      this.showWaitAboveAll();
      genreService.sync(item.id_base).then(
        response => {
          this.processing = false;

          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              this.toastSuccess("Sincronizado com sucesso.");
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
    baseClose() {
      this.$refs.baseModal.hide();
    },
    refreshBase() {
      this.base({ name: this.popups.base.name, id: this.popups.base.id });
    },
    base() {
      if (this.processing) return;

      this.popups.base.grids.base.processing = true;
      this.processing = true;

      //this.$wait.start("inprocess");
      this.showWaitAboveAll();
      genreService.bases(this.getLoggedId()).then(
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
    edit(item) {
      this.$router.push(`/genre/edit/${item.id}`);
    },
    pagto(to) {
      this.grids.genre.currentPage = to;
      this.search();
    },
    search() {
      if (this.processing) return;

      this.grids.genre.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      genreService.list(this.getLoggedId(), this.form.search, this.grids.genre.currentPage, this.grids.genre.perPage).then(
        response => {
          this.processing = false;
          this.grids.genre.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.grids.genre.loaded = true;
              this.grids.genre.items = response;
              this.grids.genre.currentPage = response.length == 0 ? 1 : response[0]["currentPage"];
              this.grids.genre.total = response.length == 0 ? 0 : response[0][config.system.totalCount];
          }
        },
        error => {
          this.grids.genre.processing = false;
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
          }
        },
        grids: {
            genre: {
                processing: false,
                loaded: false,
                total: 0,
                currentPage: 1,
                perPage: 10,
                items: [],
                fields: {
                    name: { label: 'Nome', sortable: false },
                    active: { label: 'Ativo?', sortable: false },
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
