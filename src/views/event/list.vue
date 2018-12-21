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
                                  placeholder="Digite o nome do evento">
                      </b-form-input>
                      <b-button type="button" variant="primary" size="sm" @click="search">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Consultando...
                            </template>
                        </v-wait>
                        <span v-if="!grids.event.processing">Consultar</span>
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
                  :per-page="grids.event.perPage"
                  v-if="grids.event.loaded"
                  :items="grids.event.items"
                  :fields="grids.event.fields">

              <template slot="imageURI" slot-scope="data">
                <img :src="data.item.imageURI" style="width:80px; max-width:80%" />
              </template>
              <template slot="ds_municipio" slot-scope="data">
                  {{data.item.ds_municipio}}/{{data.item.sg_estado}}
              </template>

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('ev-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('ev-add')">
                      <b-button title="Editar" v-if="mayI('ev-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
                      <b-button title="Datas" v-if="mayI('ev-add')" @click.stop="datas(data.item,$event.target)">Datas</b-button>
                  </b-button-group>
              </template>
          </b-table>
          <b-pagination @change="pagto" size="sm" v-if="grids.event.loaded && grids.event.total>grids.event.perPage" :total-rows="grids.event.total" v-model="grids.event.currentPage" :per-page="grids.event.perPage">
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
import { eventService } from '../../components/common/services/event';

Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'event-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Evento - Lista",
      }
    },
  },
  computed: {
    mayIsee() {
      return this.mayI('ev-viewer', 'ev-add', 'ev-add-date');
    }
  },
  methods: {
    edit(item) {
      this.$router.push(`/event/edit/${item.id}`);
    },
    pagto(to) {
      this.grids.event.currentPage = to;
      this.search();
    },
    search() {
      if (this.processing) return;

      this.grids.event.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      eventService.list(this.getLoggedId(), this.form.search, this.grids.event.currentPage, this.grids.event.perPage).then(
        response => {
          this.processing = false;
          this.grids.event.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.grids.event.loaded = true;
              this.grids.event.items = response;
              this.grids.event.currentPage = response.length == 0 ? 1 : response[0]["currentPage"];
              this.grids.event.total = response.length == 0 ? 0 : response[0][config.system.totalCount];
          }
        },
        error => {
          this.grids.event.processing = false;
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
            event: {
                processing: false,
                loaded: false,
                total: 0,
                currentPage: 1,
                perPage: 10,
                items: [],
                fields: {
                    imageURI: { label: '-', sortable: false },
                    ds_evento: { label: 'Evento', sortable: false },
                    ds_local_evento: { label: 'Local', sortable: false },
                    genreName: { label: 'Gênero', sortable: false },
                    ds_municipio: { label: 'Cidade', sortable: false },
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
