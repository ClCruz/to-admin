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
                      <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.DebBordero.$invalid) }">
                          Nome:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.DebBordero.$invalid) }"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.DebBordero"
                                  placeholder="Digite o nome">
                      </b-form-input>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.DebBordero.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                <b-input-group size="sm">
                  <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.TipValor.$invalid) }">
                    Tipo:
                  </b-input-group-prepend>
                  <b-form-select v-model="form.TipValor" :options="selects.types" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.TipValor.$invalid) }" />
                </b-input-group>
                <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.TipValor.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Valor:
                      </b-input-group-prepend>
                  <b-form-input ref="PerDesconto" id="PerDesconto" type="text" name="PerDesconto" maxlength="8" v-money="components.money" v-model.lazy="form.PerDesconto">
                  </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-form-checkbox id="StaDebBordero"
                                      v-model="form.StaDebBordero"
                                      value="1">
                      <span v-if="form.StaDebBordero == 1">Ativo</span>
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
import VueMask from 'v-mask';
import Vuelidate from 'vuelidate';
import { VMoney } from 'v-money';

import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { accountingdebittypeService } from '../../components/common/services/accountingdebittype';

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
  name: 'accountingdebittype-add',
  directives: {
    money: VMoney
  },
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Debito de borderô - ${this.typeOf}`,
      }
    },
  },
  created() {
    this.populateBases();

    if (this.id_base != null && this.id_base != undefined) {
      this.form.id_base = this.id_base;
    }
    if (!this.isAdd) {
      this.get();
    }
  },
  computed: {
    mayIsee() {
      return this.mayI('accountingdebittype-add', 'accountingdebittype-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    }
  },
  methods: {
    selBase() {
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
      let ret = !this.$v.form.$invalid;
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
      let CodTipBilhete = this.form.CodTipBilhete;
      let DebBordero = this.form.DebBordero;
      let in_DescontaCartao = this.form.in_DescontaCartao == true ? 1 : 0;
      let PerDesconto = this.form.PerDesconto;
      let QtdLimiteIngrParaVenda = this.form.QtdLimiteIngrParaVenda;
      let StaDebBordero = this.form.StaDebBordero == true ? 1 : 0;
      let StaDebBorderoLiq = this.form.StaDebBorderoLiq == true ? 1 : 0;
      let TipValor = this.form.TipValor;
      let ValIngressoExcedente = this.form.ValIngressoExcedente;
      let VlMinimo = this.form.VlMinimo;

      accountingdebittypeService.save(this.getLoggedId(), this.isAdd ? '' : this.id
                            ,id_base
                            ,DebBordero
                            ,in_DescontaCartao
                            ,PerDesconto
                            ,QtdLimiteIngrParaVenda
                            ,StaDebBordero
                            ,StaDebBorderoLiq
                            ,TipValor
                            ,ValIngressoExcedente
                            ,VlMinimo).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
             if (response.success) {
               this.toastSuccess("Salvo com sucesso");
               this.$router.push(`/accountingdebittype/list`);
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
      accountingdebittypeService.get(this.getLoggedId(), this.id, this.form.id_base).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = this.validateJSONisNotEmpty(response);
              if (this.form.loaded) {
                
                let PerDesconto = (response.PerDesconto*100)/100;
                this.form.DebBordero = response.DebBordero;
                this.form.in_DescontaCartao = response.in_DescontaCartao == 'S' ? 1 : 0;
                this.form.PerDesconto = PerDesconto;
                this.form.QtdLimiteIngrParaVenda = response.QtdLimiteIngrParaVenda;
                this.form.StaDebBordero = response.StaDebBordero == 'A' ? 1 : 0;
                this.form.StaDebBorderoLiq = response.StaDebBorderoLiq == 'A' ? 1 : 0;
                this.form.TipValor = response.TipValor;
                this.form.ValIngressoExcedente = response.ValIngressoExcedente;
                this.form.VlMinimo = response.VlMinimo;

                this.$refs.PerDesconto.$el.value = PerDesconto;
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
      DebBordero: {
        required,
      },
      TipValor: {
        required,
      }
    }
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
      loading: false,
      selects: {
        base: [],
        types: [ { 'value': 'V', 'text': 'Por valor' }, { 'value': 'P', 'text': 'Por porcentagem' }, { 'value': 'F', 'text': 'Por valor fixo' }],
      },
      components: { 
        money: {
            decimal: '.',
            thousands: '',
            precision: 2,
            masked: false
        },
      },
      form: {
        loaded: false,
        id_base: '',
        CodTipBilhete: '',
        DebBordero: '',
        in_DescontaCartao: false,
        PerDesconto: 0,
        QtdLimiteIngrParaVenda: '',
        StaDebBordero: 1,
        StaDebBorderoLiq: true,
        TipValor: 'V',
        ValIngressoExcedente: '',
        VlMinimo: 0,
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