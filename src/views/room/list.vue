<template>
    <div v-if="mayIsee">
      <b-container>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.id_base.$invalid) }">
              Base:
            </b-input-group-prepend>
            <b-form-select v-model="form.id_base" :options="selects.base" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_base.$invalid) }" />
          </b-input-group>
          <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_base.required">Campo é obrigatório</div>
        </b-row>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.id_estado.$invalid) }">
              Estado:
            </b-input-group-prepend>
            <b-form-select v-on:change="selState" v-model="form.id_estado" :options="selects.state" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_estado.$invalid) }" />
          </b-input-group>
          <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_estado.required">Campo é obrigatório</div>
        </b-row>
        <b-row class="mb-3">
          <b-input-group size="sm"> 
            <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.id_municipio.$invalid) }">
              Cidade:
            </b-input-group-prepend>
            <b-form-select v-on:change="selCity" v-model="form.id_municipio" :options="selects.city" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_municipio.$invalid) }" />
          </b-input-group>
          <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_municipio.required">Campo é obrigatório</div>
        </b-row>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.id_local_evento.$invalid) }">
              Local:
            </b-input-group-prepend>
            <b-form-select v-on:change="selPlace" v-model="form.id_local_evento" :options="selects.place" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_local_evento.$invalid) }" />
          </b-input-group>
          <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_local_evento.required">Campo é obrigatório</div>
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

              <template slot="StaSala" slot-scope="data">
                  <span v-if="data.item.StaSala == 'A'">Ativo</span>
                  <span v-else>Inativo</span>
              </template>

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('room-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('room-add')">
                      <b-button title="Editar" v-if="mayI('room-add')" @click.stop="edit(data.item,$event.target)">Editar</b-button>
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
import Vuelidate from 'vuelidate';

import config from "@/config";
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { roomService } from '../../components/common/services/room';
import { cityService } from '../../components/common/services/city';
import { stateService } from '../../components/common/services/state';
import { placeService } from '../../components/common/services/place';

import {
  required,
  minLength
} from 'vuelidate/lib/validators';

Vue.use(VueHead);
Vue.use(Vuelidate);

export default {
  mixins: [func],
  name: 'room-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Sala - Lista",
      }
    },
  },
  computed: {
    mayIsee() {
      return this.mayI('room-viewer', 'room-add');
    }
  },
  created() {
    this.populateBases();
  },
  methods: {
    selState() {
      Vue.nextTick().then(response => {
        this.populateCity();
      });
    },
    selCity() {
      Vue.nextTick().then(response => {
        this.populatePlace();
      });
    },
    selPlace(item) {

    },
    populatePlace() {
      this.showWaitAboveAll();
      placeService.select(this.form.id_municipio).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.place = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );
    },
    populateState() {
      this.showWaitAboveAll();
      stateService.select().then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.state = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );
    },
    populateCity() {
      this.showWaitAboveAll();
      cityService.select(this.form.id_estado).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.city = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );
    },
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
  validations: {
    form: {
      id_base: {
        required,
      },
      id_estado: {
        required,
      },
      id_municipio: {
        required,
      },
      id_local_evento: {
        required,
      },
    }
  },
  data () {
    return {
        processing: false,
        loading: false,
        form: {
          search: '',
          id_base: '',
          id_estado: '',
          id_municipio: '',
          id_local_evento: '',
        },
        selects: {
          base: [],
          city: [],
          state: [],
          place: [],
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
                    NomSala: { label: 'Nome', sortable: false },
                    StaSala: { label: 'Ativo?', sortable: false },
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
