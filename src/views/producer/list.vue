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
                                  v-model="form.search"
                                  placeholder="Digite o nome, email, cnpj, cpf">
                      </b-form-input>
                      <b-button type="button" variant="primary" size="sm" @click="search">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Consultando...
                            </template>
                        </v-wait>
                        <span v-if="!grids.producers.processing">Consultar</span>
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
                  :per-page="grids.producers.perPage"
                  v-if="grids.producers.loaded"
                  :items="grids.producers.items"
                  :fields="grids.producers.fields">

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('producer-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('producer-add')">
                      <b-button title="Editar" v-if="mayI('producer-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
                  </b-button-group>
              </template>
              <template slot="in_ativo" slot-scope="data">
                  <span v-if="data.item.in_ativo == 1">Ativo</span>
                  <span v-else>Inativo</span>
              </template>
              <template slot="ds_celular" slot-scope="data">
                 ({{data.item.ds_ddd_celular}}) {{data.item.ds_celular}}
              </template>
              <template slot="ds_telefone" slot-scope="data">
                  ({{data.item.ds_ddd_telefone}}) {{data.item.ds_telefone}}
              </template>
          </b-table>
          <b-pagination @change="pagto" size="sm" v-if="grids.producers.loaded && grids.producers.total>grids.producers.perPage" :total-rows="grids.producers.total" v-model="grids.producers.currentPage" :per-page="grids.producers.perPage">
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
import { producerService } from '../../components/common/services/producer';

Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'producer-list',
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
      return this.mayI('producer-viewer', 'producer-add');
    }
  },
  methods: {
    edit(item) {
      this.$router.push(`/producer/edit/${item.id}`);
    },
    pagto(to) {
      this.grids.producers.currentPage = to;
      this.search();
    },
    search() {
      if (this.processing) return;

      this.grids.producers.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      producerService.list(this.getLoggedId(), this.form.search, this.grids.producers.currentPage, this.grids.producers.perPage).then(
        response => {
          this.processing = false;
          this.grids.producers.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.grids.producers.loaded = true;
              this.grids.producers.items = response;
              this.grids.producers.currentPage = response.length == 0 ? 1 : response[0]["currentPage"];
              this.grids.producers.total = response.length == 0 ? 0 : response[0][config.system.totalCount];
          }
        },
        error => {
          this.grids.producers.processing = false;
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
            producers: {
                processing: false,
                loaded: false,
                total: 0,
                currentPage: 1,
                perPage: 10,
                items: [],
                fields: {
                    ds_razao_social: { label: 'Nome', sortable: false },
                    cd_cpf_cnpj: { label: "Documento", sortable: false },
                    cd_email: { label: 'E-mail', sortable: false },
                    ds_celular: { label: 'Celular', sortable: false },
                    ds_telefone: { label: 'Telefone', sortable: false },
                    in_ativo: { label: 'Ativo?', sortable: false },
                    created: { label: 'Criado em', sortable: false },
                    updated: { label: 'Atualizado em', sortable: false },
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
