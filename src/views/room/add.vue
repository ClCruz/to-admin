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
                      <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.ForPagto.$invalid) }">
                          Nome:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.ForPagto.$invalid) }"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.ForPagto"
                                  placeholder="Digite o nome">
                      </b-form-input>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.ForPagto.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                <b-input-group size="sm">
                  <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.CodTipForPagto.$invalid) }">
                    Tipo:
                  </b-input-group-prepend>
                  <b-form-select v-model="form.CodTipForPagto" :options="selects.types" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.CodTipForPagto.$invalid) }" />
                </b-input-group>
                <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.CodTipForPagto.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Taxa de administração:
                      </b-input-group-prepend>
                  <b-form-input ref="PcTxAdm" id="PcTxAdm" type="text" name="PcTxAdm" maxlength="8" v-money="components.money" v-model.lazy="form.PcTxAdm">
                  </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                <div class="form-group">
                  <div class="row align-items-center">
                    <div class="col">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Prazo de repassse em dias:
                      </b-input-group-prepend>

                      <input type="range" class="form-control custom-range" step="1" min="0" max="90" v-model="form.PrzRepasseDias">
                      </b-input-group>
                    </div>
                    <div class="col-auto">
                      <input type="number" class="form-control w-8" v-model="form.PrzRepasseDias">
                    </div>
                  </div>
                </div>
              </b-row>
              <b-row class="mb-3">
                <div class="form-group">
                  <div class="row align-items-center">
                    <div class="col">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Ordem seleção:
                      </b-input-group-prepend>
                      <input type="range" class="form-control custom-range" step="1" min="0" max="10" v-model="form.showorder">
                      </b-input-group>
                    </div>
                    <div class="col-auto">
                      <input type="number" class="form-control w-8" v-model="form.showorder">
                    </div>
                  </div>
                </div>
              </b-row>
              <b-row class="mb-3">
                <div class="form-group">
                  <div class="form-label">Processar no gateway?</div>
                  <label class="custom-switch">
                    <input type="checkbox" v-model="form.StaPagarMe" name="StaPagarMe" class="custom-switch-input">
                    <span class="custom-switch-indicator"></span>
                    <span class="custom-switch-description">Sim</span>
                  </label>
                </div>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-form-checkbox id="StaForPagto"
                                      v-model="form.StaForPagto"
                                      value="1">
                      <span v-if="form.StaForPagto == 1">Ativo</span>
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
import { paymenttypeService } from '../../components/common/services/paymenttype';

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
  name: 'tickettype-add',
  directives: {
    money: VMoney
  },
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

    if (this.id_base != null && this.id_base != undefined) {
      this.form.id_base = this.id_base;
    }
    if (!this.isAdd) {
      this.populateTypes();
      this.get();
    }
  },
  computed: {
    mayIsee() {
      return this.mayI('paymenttype-add', 'paymenttype-viewer');
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
      Vue.nextTick().then(response => {
        this.populateTypes();
      });
    },
    populateTypes() {
      if ((this.getLoggedId() == null || this.getLoggedId() == "") && (this.form.id_base == null || this.form.id_base == '')) return;
      
      this.showWaitAboveAll();
      paymenttypeService.typeselect(this.getLoggedId(), this.form.id_base).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.types = response;
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

      let id_base = this.form.id_base;
      let CodTipForPagto = this.form.CodTipForPagto;
      let CodBanco = this.form.CodBanco;
      let ForPagto = this.form.ForPagto;
      let PcTxAdm = this.form.PcTxAdm;
      let PrzRepasseDias = this.form.PrzRepasseDias;
      let showorder = this.form.showorder;
      let StaDebBordLiq = this.form.StaDebBordLiq == true ? 1 : 0;
      let StaForPagto = this.form.StaForPagto == true ? 1 : 0;
      let StaPagarMe = this.form.StaPagarMe == true ? 1 : 0;
      let StaTaxaCartoes = this.form.StaTaxaCartoes == true ? 1 : 0;
      let TipCaixa = this.form.TipCaixa;


      paymenttypeService.save(this.getLoggedId(), this.isAdd ? '' : this.id
                            ,id_base
                            ,CodBanco
                            ,CodTipForPagto
                            ,ForPagto
                            ,PcTxAdm
                            ,PrzRepasseDias
                            ,showorder
                            ,StaDebBordLiq
                            ,StaForPagto
                            ,StaPagarMe
                            ,StaTaxaCartoes
                            ,TipCaixa).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
             if (response.success) {
               this.toastSuccess("Salvo com sucesso");
               this.$router.push(`/paymenttype/list`);
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
      paymenttypeService.get(this.getLoggedId(), this.id, this.form.id_base).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = this.validateJSONisNotEmpty(response);
              if (this.form.loaded) {
                
                this.form.CodTipForPagto = response.CodTipForPagto;
                this.form.CodBanco = response.CodBanco;
                this.form.ForPagto = response.ForPagto;
                let PcTxAdm = (response.PcTxAdm*100)/100;
                this.form.PcTxAdm = PcTxAdm;
                this.form.PrzRepasseDias = response.PrzRepasseDias;
                this.form.showorder = response.showorder;
                this.form.StaDebBordLiq = response.StaDebBordLiq == 'S' ? 1 : 0;
                this.form.StaForPagto = response.StaForPagto == 'A' ? 1 : 0;
                this.form.StaPagarMe = response.StaPagarMe == 'S' ? 1 : 0;
                this.form.StaTaxaCartoes = response.StaTaxaCartoes == 'S' ? 1 : 0;
                this.form.TipCaixa  = response.TipCaixa;
                this.$refs.PcTxAdm.$el.value = PcTxAdm;
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
      ForPagto: {
        required,
      },
      CodTipForPagto: {
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
          types: [],
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
          CodTipForPagto: '',
          CodBanco: '',
          ForPagto: '',
          PcTxAdm: '',
          PrzRepasseDias: 0,
          showorder: 0,
          StaDebBordLiq: false,
          StaForPagto: 1,
          StaPagarMe: true,
          StaTaxaCartoes: false,
          TipCaixa: 'A',
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