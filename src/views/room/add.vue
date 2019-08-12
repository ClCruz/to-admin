<template>
    <div>
      <b-container>
        <b-row>
          <b-col>
              <b-row class="mb-3">
                <b-input-group size="sm">
                  <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.id_base.$invalid) }">
                    Base:
                  </b-input-group-prepend>
                  <b-form-select v-model="form.id_base" v-on:change="selBase" :options="selects.base" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_base.$invalid) }" />
                </b-input-group>
                <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_base.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.NomSala.$invalid) }">
                          Nome:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.NomSala.$invalid) }"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.NomSala"
                                  placeholder="Digite o nome">
                      </b-form-input>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.NomSala.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Nome para o site:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.nameonsite"
                                  placeholder="Digite o nome">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.NomRedSala.$invalid) }">
                          Sigla sala:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.NomRedSala.$invalid) }"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.NomRedSala"
                                  placeholder="Digite a sigla">
                      </b-form-input>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.NomRedSala.required">Campo é obrigatório</div>
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
                <div class="form-group">
                  <div class="form-label">Sala com cadeira númerada?</div>
                  <label class="custom-switch">
                    <input type="checkbox" v-model="form.IngressoNumerado" name="IngressoNumerado" class="custom-switch-input">
                    <span class="custom-switch-indicator"></span>
                    <span class="custom-switch-description">Sim</span>
                  </label>
                </div>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-form-checkbox id="StaSala"
                                      v-model="form.StaSala"
                                      value="1">
                      <span v-if="form.StaSala == 1">Ativo</span>
                      <span v-else>Inativo</span>
                      </b-form-checkbox>
                  </b-input-group>
              </b-row>
              <b-row>
                <b-button type="button" variant="success" size="sm" @click="save">
                  <v-wait for="inprocess">
                      <template slot="waiting">
                          Carregando...
                      </template>
                  </v-wait>
                  <v-wait for="inprocessSave">
                      <template slot="waiting">
                          Salvando...
                      </template>
                  </v-wait>
                  <span v-if="!processing">Salvar</span>
                </b-button>
              </b-row>
          </b-col>
        </b-row>
        <b-row v-if="!isAdd">
          <div class="card" style="top:10px;">
            <div class="table-responsive">
              <table class="table table-hover table-outline table-vcenter text-nowrap card-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Cor</th>
                    <th>Desconto %</th>
                    <th class="text-right">
                      <i class="fas fa-plus" style="cursor: pointer" title="Adicionar" @click="sectoradd"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="form.add.show">
                    <td>
                        <b-input-group size="sm" class="w50 l60">
                            <b-form-input id="name"
                                        type="text"
                                        name="name"
                                        maxlength="100"
                                        v-model="form.add.NomSetor"
                                        v-bind:class="{ errorFormValidateInput: (executedAtLeastOne2 && $v.form.add.NomSetor.$invalid) }"
                                        placeholder="Digite o nome">
                            </b-form-input>
                        </b-input-group>
                    </td>
                    <td>
                        <swatches colors="text-advanced" popover-to="left" v-model="form.add.CorSetor"></swatches>
                    </td>
                    <td>
                      <b-input-group size="sm" class="w50 l60">
                        <b-form-input size="sm" ref="PerDesconto" id="PerDesconto" type="text" name="PerDesconto" maxlength="8" v-money="components.money" v-model.lazy="form.add.PerDesconto"
                        v-bind:class="{ errorFormValidateInput: (executedAtLeastOne2 && $v.form.add.PerDesconto.$invalid) }">
                        </b-form-input>
                      </b-input-group>
                    </td>
                    <td>
                      <i class="fas fa-save mr5 click" title="Salvar" @click="sectorsave"></i>
                      <i class="fas fa-times mr5 click" title="Cancelar" @click="sectorcancel" ></i>
                    </td>
                  </tr>
                  <tr v-if="form.add.show == false && grids.default.items.length == 0">
                    <td colspan="4">
                      Nenhum setor cadastrado.
                    </td>
                  </tr>
                  <tr v-for="(item) in grids.default.items" v-bind:key="'all_'+item.CodSetor">
                    <td><span class="text-muted">{{item.NomSetor}}</span></td>
                    <td><div>{{item.CorSetor}} <span v-bind:style="{ 'background-color': item.CorSetor }">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div></td>
                    <td><div>{{item.PerDesconto}}%</div></td>
                    <td>
                      <div class="selectgroup selectgroup-pills">
                        <label class="selectgroup-item">
                          <input type="radio" name="icon-input" value="1" class="selectgroup-input" checked=""  @click="remove(item.CodSetor, item.NomSetor)">
                          <span class="selectgroup-button selectgroup-button-icon"><i class="fas fa-trash"></i></span>
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import Vue from "vue";
import config from "@/config";

import Swatches from 'vue-swatches';
import VueHead from 'vue-head';
import VueMask from 'v-mask';
import Vuelidate from 'vuelidate';
import { VMoney } from 'v-money';

import { func } from "@/functions";

import "vue-swatches/dist/vue-swatches.min.css";

import { userService } from '../../components/common/services/user';
import { cityService } from '../../components/common/services/city';
import { stateService } from '../../components/common/services/state';
import { placeService } from '../../components/common/services/place';
import { roomService } from '../../components/common/services/room';

Vue.use(VueHead);
Vue.use(VueMask);
Vue.use(Vuelidate);

import {
  required
  ,helpers
} from 'vuelidate/lib/validators';

export default {
  mixins: [func],
  props: ['id', 'id_base'],
  name: 'room-add',
  components: { Swatches },
  directives: {
    money: VMoney
  },
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Sala - ${this.typeOf}`,
      }
    },
  },
  created() {
    this.populateBases();
    this.populateState();

    if (this.id_base != null && this.id_base != undefined) {
      this.form.id_base = this.id_base;
    }
    if (!this.isAdd) {
      this.get();
    }
  },
  computed: {
    mayIsee() {
      return this.mayI('room-add', 'room-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    }
  },
  methods: {
    sectoradd() {
      this.form.add.show = true;
      this.executedAtLeastOne2 = false;
    },
    sectorsave() {
      if (this.$v.sector.$invalid) {
        this.toastError("Preencha os campos obrigatórios.");
        return;
      }

      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocessSave");
      this.showWaitAboveAll();
      roomService.sectoradd(this.getLoggedId(), this.id_base, this.id, this.form.add.NomSetor, this.form.add.CorSetor, this.form.add.PerDesconto).then(
        response => {
          this.processing = false;
          this.executedAtLeastOne2 = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
            if (response.success) {
              this.toastSuccess("Setor incluido com sucesso.");
              this.sectorcancel();
            }
            else {
              this.toastError(response.msg);
            }
            this.getSectors();
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");
          this.toastError("Falha na execução.");
        }
      );
    },
    sectorcancel() {
      this.form.add.NomSetor = '';
      this.form.add.PerDesconto = '';
      this.form.add.CorSetor = '';
      this.form.add.show = false;
      this.executedAtLeastOne2 = false;
    },
    remove(id, name) {
      this.$swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        title: 'Remover',
        html: `Deseja remover o setor ${name}?`,
      }).then((result) => {
        if (result.value) {
          if (this.processing) return;

          this.processing = true;

          this.$wait.start("inprocessSave");
          this.showWaitAboveAll();
          roomService.sectorremove(this.getLoggedId(), this.id_base, this.id, id).then(
            response => {
              this.processing = false;
              this.hideWaitAboveAll();
              this.$wait.end("inprocessSave");

              if (this.validateJSON(response))
              {
                if (response.success) {
                  this.toastSuccess("Setor removido com sucesso.");
                }
                else {
                  this.toastError(response.msg);
                }
                this.getSectors();
              }
            },
            error => {
              this.processing = false;
              this.hideWaitAboveAll();
              this.$wait.end("inprocessSave");
              this.toastError("Falha na execução.");
            }
          );      
        }
        else if (result.dismiss === this.$swal.DismissReason.cancel) {
        }
      });
    },
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
    selBase() {
      Vue.nextTick().then(response => {
      });
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
    validate() {
      let ret = !this.$v.room.$invalid;
      return ret;
    },
    save() {
      if (this.processing) return;
      this.executedAtLeastOne = true;

      if (!this.validate()) {
        this.toastError("Verifique os campos");
        return;
      }

      this.processing = true;

      this.$wait.start("inprocessSave");
      this.showWaitAboveAll();

      let id_base = this.form.id_base;
      let CodSala = this.id;
      let NomSala = this.form.NomSala;
      let NomRedSala = this.form.NomRedSala;
      let nameonsite = this.form.nameonsite;
      let IngressoNumerado = this.form.IngressoNumerado;
      let id_local_evento = this.form.id_local_evento;
      let StaSala = this.form.StaSala == true ? 1 : 0;

      roomService.save(this.getLoggedId(), this.isAdd ? '' : this.id
                            ,id_base
                            ,NomSala
                            ,NomRedSala
                            ,nameonsite
                            ,IngressoNumerado
                            ,id_local_evento
                            ,StaSala).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
             if (response.success) {
                this.toastSuccess("Salvo com sucesso");
                this.$router.push(`/room/edit/${response.id}/${this.form.id_base}`);
             }
             else {
               this.toastError(response.msg);
             }
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");
          this.toastError("Falha na execução.");
        }
      );      
    },
    getSectors() {
      this.grids.default.processing = true;

      roomService.sectorlist(this.getLoggedId(), this.form.id_base, this.id).then(
        response => {
          this.grids.default.processing = false;
          this.grids.default.items = response;
        }
      );
    },
    get() {
      if (this.processing) return;
      this.getSectors();

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      
      roomService.get(this.getLoggedId(), this.id, this.form.id_base).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = this.validateJSONisNotEmpty(response);
              if (this.form.loaded) {
                this.form.id_estado = response.id_estado;
                this.form.id_municipio = response.id_municipio;
                this.form.id_local_evento = response.id_local_evento;
                this.form.IngressoNumerado = response.IngressoNumerado == "1";
                this.form.nameonsite = response.nameonsite;
                this.form.NomRedSala = response.NomRedSala;
                this.form.NomSala = response.NomSala;
                this.form.StaSala = response.StaSala == 'A' ? 1 : 0;
                this.populateCity();
                this.populatePlace();
              }
          }
        },
        error => {
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
      NomRedSala: {
        required,
      },
      NomSala: {
        required,
      },
      add: {
        NomSetor: {
          required,
        },
        CorSetor: {
          required,
        },
        PerDesconto: {
          required,
        },
      }
    },
    room: [ 'form.id_base', 'form.id_estado', 'form.id_municipio', 'form.id_local_evento', 'form.NomRedSala', 'form.NomSala' ],
    sector: [ 'form.add.NomSetor', 'form.add.CorSetor', 'form.add.PerDesconto' ],
  },
  filters: {
      money: function (value) {
          //let v = parseFloat(value)/100;
          return `R$ ${parseFloat(value).toFixed(2)}`;
      }
  },
  data () {
    return {
        processing: false,
        executedAtLeastOne: false,
        executedAtLeastOne2: false,
        loading: false,
        selects: {
          base: [],
          city: [],
          state: [],
          place: [],
        },
        components: { 
          money: {
              decimal: '.',
              thousands: '',
              precision: 2,
              masked: false
          },
        },
        grids: {
            default: {
                processing: false,
                loaded: false,
                items: [],
                fields: {
                    NomSetor: { label: 'Nome', sortable: false },
                    PerDesconto: { label: 'Valor', sortable: false },
                    actions: { label: 'Ações' }
                },
            }
        },
        form: {
          add: {
            show: false,
            NomSetor: '',
            PerDesconto: '',
            CorSetor: '',
          },
          loaded: false,
          id_base: '',
          id_estado: '',
          id_municipio: '',
          id_local_evento: '',
          IngressoNumerado: true,
          nameonsite: '',
          NomRedSala: '',
          NomSala: '',
          StaSala: 1,
        }
    }
  }
}
</script>

<style>
.click {
  cursor:pointer;
}
.mr5{
  margin-right: 5px;
}
.l60 {
  left: 60px;
}
.w50 {
  width:50% !important;
}
.directlink {
  font-size: 10px;
  color: #9f9f9f;
  margin-bottom: 25px;
}
.vue-js-switch {
  margin-right: 10px;
}
.v-switch-label {
  color: #495057 !important;
}
</style>
<style scoped>

</style>