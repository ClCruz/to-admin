<template>
    <div>
      <b-container>
        <b-row>
          <b-col>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.name.$invalid) }">
                          Nome:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="name"
                                  v-bind:class="{ errorFormValidateInput: ($v.form.name.$invalid) }"
                                  maxlength="500"
                                  v-model="form.name"
                                  placeholder="Digite o nome">
                      </b-form-input>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="!$v.form.name.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.domain.$invalid) }">
                          Domínio:
                      </b-input-group-prepend>
                      <b-form-input id="domain"
                                  type="text"
                                  name="domain"
                                  v-bind:class="{ errorFormValidateInput: ($v.form.domain.$invalid) }"
                                  v-mask="'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'"
                                  maxlength="800"
                                  v-model="form.domain"
                                  placeholder="Digite o dominio">
                      </b-form-input>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="!$v.form.domain.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.type.$invalid) }">
                          Tipo:
                      </b-input-group-prepend>
                      <b-form-select v-model="form.type">
                        <option value="prod">Cliente produtivo</option>
                        <option value="demo">Cliente demostrativo</option>
                        <option value="trial">Cliente trial</option>
                        <option value="dev">Ambiente desenvolvimento</option>
                      </b-form-select>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="!$v.form.type.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.selectedDate.start.$invalid) }">
                          Validade:
                      </b-input-group-prepend>
                      <HotelDatePicker :id="components.datepicker.id" ref="dtpicker" :format="components.datepicker.format" :minNights="components.datepicker.minNights"
                      :maxNights="components.datepicker.maxNights"
                      :hoveringTooltip="components.datepicker.hoveringTooltip"
                      :i18n="components.datepicker.ptBr"
                      :displayClearButton="components.datepicker.displayClearButton"
                      v-on:check-in-changed="startchanged"
                      v-on:check-out-changed="endchanged"
                      ></HotelDatePicker>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="!$v.form.selectedDate.start.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3" v-if="!isAdd">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text>
                          API KEY:
                      </b-input-group-prepend>
                      <b-input-group-prepend is-text>
                        <span v-b-tooltip.hover :title="'Chave de produção -'+form.key+' (Clique para copiar)'" 
                            style="padding-right:10px;cursor:pointer;"
                            v-clipboard:copy="form.key"
                            v-clipboard:success="clipboardSuccess"
                            v-clipboard:error="clipboardError"><i class="fas fa-key"></i></span>
                      </b-input-group-prepend>
                      <b-input-group-append>
                          <b-btn variant="outline-danger" @click="regenerateNewKey">Criar nova?</b-btn>
                      </b-input-group-append>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3" v-if="!isAdd">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text>
                          API KEY TESTE:
                      </b-input-group-prepend>
                      <b-input-group-prepend is-text>
                        <span v-b-tooltip.hover :title="'Chave de Homologação -'+form.key_test+' (Clique para copiar)'" 
                            style="padding-right:10px;cursor:pointer;"
                            v-clipboard:copy="form.key_test"
                            v-clipboard:success="clipboardSuccess"
                            v-clipboard:error="clipboardError"><i class="fas fa-key"></i></span>
                      </b-input-group-prepend>
                      <b-input-group-append>
                          <b-btn variant="outline-danger" @click="regenerateNewKeyTest">Criar nova?</b-btn>
                      </b-input-group-append>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-form-checkbox id="active"
                                      v-model="form.active"
                                      value="1"
                                      unchecked-value="not_accepted">
                      <span v-if="form.active == 1">Ativo</span>
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
      </b-container>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import VueMask from 'v-mask';
import Moment from 'moment';
import HotelDatePicker from 'vue-hotel-datepicker';
import VueClipboard from 'vue-clipboard2';
import Vuelidate from 'vuelidate';
import { extendMoment } from 'moment-range';
import config from "@/config";
import { func } from "@/functions";
import { partnerService } from '../../components/common/services/partner';

import { required } from 'vuelidate/lib/validators';

const moment = extendMoment(Moment);
Vue.use(VueClipboard);
Vue.use(VueHead);
Vue.use(VueMask);
Vue.use(Vuelidate);

export default {
  mixins: [func],
  props: ['id'],
  name: 'partner-add',
  components: { HotelDatePicker },
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Parceiros - ${this.typeOf}`,
      }
    },
  },
  created() {
    if (!this.isAdd) {
      this.get();
    }
  },
  computed: {
    mayIsee() {
      return this.mayI('partner-add', 'partner-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    },
  },
  methods: {
    startchanged(date) {
      this.form.selectedDate.start = moment(date).format("YYYY-MM-DD");
    },
    endchanged(date) {
      this.form.selectedDate.end = moment(date).format("YYYY-MM-DD");
    },
    regenerateNewKey() {
      this.$swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        title: 'Geração de nova API KEY',
        html: "Deseja realmente gerar uma nova chave de API? <p><small>(A antiga irá parar de funcionar no momento.)</small></p>",
      }).then((result) => {
        if (result.value) {
        }
        else if (result.dismiss === this.$swal.DismissReason.cancel) {
        }
      });
    },
    regenerateNewKeyTest() {
      this.$swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        title: 'Geração de nova API KEY de TESTE',
        html: "Deseja realmente gerar uma nova chave de API? <p><small>(A antiga irá parar de funcionar no momento.)</small></p>",
      }).then((result) => {
        if (result.value) {
        }
        else if (result.dismiss === this.$swal.DismissReason.cancel) {
        }
      });
    },
    clipboardSuccess() {
      this.toastSuccess("Copiado com sucesso.");
    },
    clipboardError() {
      this.toastError("Erro ao tentar copiar.");
    },
    onDateSelected: function (daterange) {
      this.form.selectedDate = daterange;
      if (moment(this.form.selectedDate.start).format("DD/MM/YYYY") == moment(this.form.selectedDate.end).format("DD/MM/YYYY")) {
        this.form.selectedDate.end = null;
      }
    },
    save() {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocessSave");
      this.showWaitAboveAll();
      partnerService.save(this.isAdd ? '' : this.id, this.form.name, this.form.login, this.form.email, this.form.document, this.form.active).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
             if (response.success) {
               this.toastSuccess("Salvo com sucesso");
               this.$router.push(`/partner/list`);
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
    get() {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      partnerService.get(this.getLoggedId(), this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = true;
              this.form.selectedDate.start = response.dateStart;
              this.form.selectedDate.end = response.dateEnd;
              this.$refs.dtpicker.setCheckIn(moment(this.form.selectedDate.start).toDate());
              if (this.form.selectedDate.end != '') {
                this.$refs.dtpicker.setCheckOut(moment(this.form.selectedDate.end).toDate());
              }
              this.components.datepicker.id++;
              this.form.loaded = true;
              this.form.id = response.id;
              this.form.name = response.name;
              this.form.active = response.active,
              this.form.domain = response.domain;
              this.form.type = response.type;
              this.form.key = response.key;
              this.form.key_test = response.key;
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
      name: { required },
      domain: { required },
      type: { required },
      selectedDate: {
        start: { required }
      },
    }
  },
  data () {
    return {
        processing: false,
        loading: false,
        components: { 
          datepicker: {
            id: 1,
            format: 'DD/MM/YYYY',
            minNights: 0,
            maxNights: 80,
            hoveringTooltip: true,
            displayClearButton: true,
            ptBr: {
              night: 'Dia',
              nights: 'Dias',
              'day-names': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
              'check-in': 'Início',
              'check-out': 'Fim',
              'month-names': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            }
          }
        },
        form: {
          selectedDate: {
            start: '',
            end: ''
          },
          loaded: false,
          id: '',
          name: '',
          active: 1,
          domain: '',
          type: '',
          key: '',
          key_test: '',
        }
    }
  }
}
</script>

<style scoped>
.errorFormValidate {
  margin-top: 5px !important;
  margin-bottom: -10px;
}
</style>
