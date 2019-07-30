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
                                  placeholder="Digite o nome da cidade ou do estado">
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

              <template slot="img" slot-scope="data">
                <img :src="data.item.img" style="width:80px; max-width:80%" />
              </template>
              <template slot="img_extra" slot-scope="data">
                <img :src="data.item.img_extra" style="width:80px; max-width:80%" />
              </template>
              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('city-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('city-add')">
                      <b-button title="Editar" v-if="mayI('city-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
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
import { cityService } from '../../components/common/services/city';

Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'city-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Cidade - Lista",
      }
    },
  },
  computed: {
    mayIsee() {
      return this.mayI('city-viewer', 'city-add');
    }
  },
  methods: {
    edit(item) {
      this.$router.push(`/city/edit/${item.id_municipio}`);
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
      cityService.list(this.getLoggedId(), this.form.search, this.grids.default.currentPage, this.grids.default.perPage).then(
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
                perPage: 500,
                items: [],
                fields: {
                    ds_municipio: { label: 'Cidade', sortable: false },
                    ds_estado: { label: 'Estado', sortable: false },
                    img: { label: '', sortable: false },
                    img_extra: { label: '', sortable: false },
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
