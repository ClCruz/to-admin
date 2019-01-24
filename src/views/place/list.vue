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
                                  @keyup.enter.native="search"
                                  maxlength="100"
                                  v-model="form.search"
                                  placeholder="Digite o nome, cidade, estado ou sigla do estado">
                      </b-form-input>
                      <b-form-checkbox id="active"
                                      v-model="form.in_ativo"
                                      value="1">
                        <span v-if="form.in_ativo == 1">Apenas Ativos</span>
                        <span v-else>Todos</span>
                      </b-form-checkbox>
                      <b-button type="button" variant="primary" size="sm" @click="search">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Consultando...
                            </template>
                        </v-wait>
                        <span v-if="!grids.place.processing">Consultar</span>
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
                  :per-page="grids.place.perPage"
                  v-if="grids.place.loaded"
                  :items="grids.place.items"
                  :fields="grids.place.fields">

              <template slot="in_ativo" slot-scope="data">
                  <span v-if="data.item.in_ativo == 1">Ativo</span>
                  <span v-else>Inativo</span>
              </template>

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('place-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('place-add', 'place-link')">
                      <b-button title="Editar" variant="secondary" v-if="mayI('place-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
                      <b-button title="Vincular" variant="outline-warning" v-if="mayI('place-link') && data.item.linked == 0" @click.stop="link(data.item,$event.target)">
                        Vincular
                      </b-button>
                      <b-button title="Desvincular" variant="warning" v-if="mayI('place-link') && data.item.linked == 1" @click.stop="link(data.item,$event.target)">
                        Desvincular
                      </b-button>
                  </b-button-group>
              </template>
          </b-table>
          <b-pagination @change="pagto" size="sm" v-if="grids.place.loaded && grids.place.total>grids.place.perPage" :total-rows="grids.place.total" v-model="grids.place.currentPage" :per-page="grids.place.perPage">
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
import { cityService } from '../../components/common/services/city';
import { stateService } from '../../components/common/services/state';
import { placeService } from '../../components/common/services/place';

Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'place-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Local - Lista",
      }
    },
  },
  computed: {
    mayIsee() {
      return this.mayI('place-viewer', 'place-add');
    }
  },
  methods: {
    link(item) {
      if (this.processing) return;
      this.processing = true;

      this.showWaitAboveAll();
      placeService.link(this.getLoggedId(), item.id_local_evento).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
            if (response.success) {
                if (item.linked == 0) {
                  this.toastSuccess("Vinculado com sucesso.");
                }
                else {
                  this.toastSuccess("Desvinculado com sucesso.");
                }
                this.search();
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
    edit(item) {
      this.$router.push(`/place/edit/${item.id_local_evento}`);
    },
    pagto(to) {
      this.grids.place.currentPage = to;
      this.search();
    },
    search() {
      if (this.processing) return;

      this.grids.place.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      placeService.list(this.form.search, this.form.id_state, this.form.id_city, this.form.in_ativo, this.grids.place.currentPage, this.grids.place.perPage).then(
        response => {
          this.processing = false;
          this.grids.place.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.grids.place.loaded = true;
              this.grids.place.items = response;
              this.grids.place.currentPage = response.length == 0 ? 1 : response[0]["currentPage"];
              this.grids.place.total = response.length == 0 ? 0 : response[0][config.system.totalCount];
          }
        },
        error => {
          this.grids.place.processing = false;
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
        selects: {
          city: [],
          state: [],
        },
        form: {
          search: '',
          id_city: '',
          id_state: '',
          in_ativo: 1
        },
        grids: {
            place: {
                processing: false,
                loaded: false,
                total: 0,
                currentPage: 1,
                perPage: 10,
                items: [],
                fields: {
                    ds_local_evento: { label: 'Nome', sortable: false },
                    ds_tipo_local: { label: 'Tipo de local', sortable: false },
                    ds_municipio: { label: 'Cidade', sortable: false },
                    ds_estado: { label: 'Estado', sortable: false },
                    in_ativo: { label: 'Ativo?', sortable: false },
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
