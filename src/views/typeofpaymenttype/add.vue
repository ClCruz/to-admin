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
                  <b-form-select v-model="form.id_base" :options="selects.base" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_base.$invalid) }" />
                </b-input-group>
                <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_base.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.TipForPagto.$invalid) }">
                          Nome:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.TipForPagto.$invalid) }"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.TipForPagto"
                                  placeholder="Digite o nome">
                      </b-form-input>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.TipForPagto.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.ClassifPagtoSAP.$invalid) }">
                          Classificação:
                      </b-input-group-prepend>
                      <div class="selectgroup selectgroup-vertical w-100">
                        <label class="selectgroup-item">
                          <input type="radio" v-model="form.ClassifPagtoSAP" name="ClassifPagtoSAP" value="DI" class="selectgroup-input">
                          <span class="selectgroup-button">DI - DINHEIRO</span>
                        </label>
                        <label class="selectgroup-item">
                          <input type="radio" v-model="form.ClassifPagtoSAP" name="ClassifPagtoSAP" value="CV" class="selectgroup-input">
                          <span class="selectgroup-button">CV - Convite/Voucher/Cortesia</span>
                        </label>
                        <label class="selectgroup-item">
                          <input type="radio" v-model="form.ClassifPagtoSAP" name="ClassifPagtoSAP" value="CC" class="selectgroup-input">
                          <span class="selectgroup-button">CC - Cartão de Crédito</span>
                        </label>
                        <label class="selectgroup-item">
                          <input type="radio" v-model="form.ClassifPagtoSAP" name="ClassifPagtoSAP" value="CD" class="selectgroup-input">
                          <span class="selectgroup-button">CD - Cartão de débito</span>
                        </label>
                      </div>
                      <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.ClassifPagtoSAP.required">Campo é obrigatório</div>
                </b-input-group>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-form-checkbox id="StaTipForPagto"
                                      v-model="form.StaTipForPagto"
                                      value="1">
                      <span v-if="form.StaTipForPagto == 1">Ativo</span>
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
import config from "@/config";

import VueHead from 'vue-head';
import Vuelidate from 'vuelidate';

import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { paymenttypeService } from '../../components/common/services/paymenttype';

Vue.use(VueHead);
Vue.use(Vuelidate);

import {
  required
  ,helpers
} from 'vuelidate/lib/validators';

export default {
  mixins: [func],
  props: ['id', 'id_base'],
  name: 'tickettype-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Tipo de Bilhete - ${this.typeOf}`,
      }
    },
  },
  created() {
    this.populateBases();
    if (this.id_base != null) {
      this.form.id_base = this.id_base;
    }
    if (!this.isAdd) {
      this.get();
    }
  },
  computed: {
    mayIsee() {
      return this.mayI('typeofpt-add', 'typeofpt-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    }
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
    validate() {
      let ret = !this.$v.form.$invalid;
      // if (this.form.isAllotment == false && this.form.isFixed == false && this.form.isHalf == false && this.form.isDiscount == false && this.form.isPlus == false && this.form.isPrincipal == false) {
      //   this.toastError("Escolha o tipo do bilhete");
      //   return false;
      // }
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
      let CodTipForPagto = this.id;
      let id_base = this.form.id_base;
      let ClassifPagtoSAP = this.form.ClassifPagtoSAP;
      let TipForPagto = this.form.TipForPagto;
      let StaTipForPagto = this.form.StaTipForPagto == true ? 1 : 0;

      paymenttypeService.typesave(this.getLoggedId(), this.isAdd ? '' : this.id
                            ,id_base
                            ,ClassifPagtoSAP
                            ,StaTipForPagto
                            ,TipForPagto).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
             if (response.success) {
               this.toastSuccess("Salvo com sucesso");
               this.$router.push(`/typeofpt/list`);
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
      paymenttypeService.typeget(this.getLoggedId(), this.id, this.form.id_base).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = this.validateJSONisNotEmpty(response);
              if (this.form.loaded) {

                this.form.CodTipForPagto = response.CodTipForPagto;
                this.form.StaTipForPagto = response.StaTipForPagto == 'A' ? 1 : 0;
                this.form.TipForPagto = response.TipForPagto;
                this.form.ClassifPagtoSAP = response.ClassifPagtoSAP;
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
      ClassifPagtoSAP: {
        required,
      },
      TipForPagto: {
        required,
      },
    }
  },
  data () {
    return {
        processing: false,
        executedAtLeastOne: false,
        loading: false,
        selects: {
          base: [],
        },
        components: { 
        },
        form: {
          loaded: false,
          id_base: '',
          TipForPagto: '',
          StaTipForPagto: 1,
          ClassifPagtoSAP: '',
        }
    }
  }
}
</script>

<style>
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