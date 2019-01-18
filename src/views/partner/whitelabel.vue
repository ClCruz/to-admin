<template>
    <div>
      <b-container v-if="form.loaded">
        <b-row class="mb-3">
            <b-col>
              <b-row class="mb-3">
                <b-card no-body>
                  <b-alert variant="success" show><h3>Parceiro: {{form.name}} - {{form.uniquename}}</h3></b-alert>
                  <b-tabs pills card vertical>
                    <b-tab title="Base de dados" >
                      <h4>Configuração da base de dados</h4>
                      <b-jumbotron header="" lead="Configuração referente a base de dados única do parceiro e as conexões." >
                        <b-button-group>
                          <b-button :variant="tab1_database_variant" v-b-tooltip.hover :title="tab1_database_tooltip" @click="confdb">Base de dados - {{tab1_database_status}}</b-button>
                          <b-button :variant="tab1_user_variant" v-b-tooltip.hover :title="tab1_user_tooltip" @click="confdbuser">Conexão - {{tab1_user_status}}</b-button>
                        </b-button-group>
                      </b-jumbotron>
                    </b-tab>
                    <b-tab title="Scaffolder" active>
                      <h4>Configuração dos JSON</h4>
                      <b-jumbotron header="" lead="Configuração referente ao site." >
                        <b-row class="mb-3">
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    Meta Descrição:
                                </b-input-group-prepend>
                                <b-form-input id="json_meta_description"
                                            type="text"
                                            name="json_meta_description"
                                            maxlength="500"
                                            v-model="form.json_meta_description"
                                            placeholder="Digite a descrição para o meta dados">
                                </b-form-input>
                            </b-input-group>
                        </b-row>
                        <b-row class="mb-3">
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    Meta Keywords:
                                </b-input-group-prepend>
                                <b-form-input id="json_meta_keywords"
                                            type="text"
                                            name="json_meta_keywords"
                                            maxlength="500"
                                            v-model="form.json_meta_keywords"
                                            placeholder="Digite as keywords (palavras chaves) para o meta dados">
                                </b-form-input>
                            </b-input-group>
                        </b-row>
                        <b-row class="mb-3">
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    Modelo do site:
                                </b-input-group-prepend>
                                <b-form-select v-model="form.json_template">
                                  <option value="tixs">Modelo tixs.me</option>
                                  <option value="ticketHub">Modelo padrão </option>
                                  <option value="ticketHubVideo">Modelo com vídeo</option>
                                  <option value="ticketHubSearchHeader">Modelo com busca no cabeçalho</option>
                                </b-form-select>
                            </b-input-group>
                        </b-row>
                        <b-row class="mb-3">
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    Titulo do site:
                                </b-input-group-prepend>
                                <b-form-input id="json_info_title"
                                            type="text"
                                            name="json_info_title"
                                            maxlength="500"
                                            v-model="form.json_info_title"
                                            placeholder="Digite o título da pagina">
                                </b-form-input>
                            </b-input-group>
                        </b-row>
                        <b-row class="mb-3">
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    CNPJ do site:
                                </b-input-group-prepend>
                                <b-form-input id="json_info_cnpj"
                                            type="text"
                                            name="json_info_cnpj"
                                            v-mask="'##.###.###/####-##'"
                                            maxlength="500"
                                            v-model="form.json_info_cnpj"
                                            placeholder="Digite o título da pagina">
                                </b-form-input>
                            </b-input-group>
                        </b-row>
                        <b-row class="mb-3">
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    Nome da empresa:
                                </b-input-group-prepend>
                                <b-form-input id="json_info_companyname"
                                            type="text"
                                            name="json_info_companyname"
                                            maxlength="500"
                                            v-model="form.json_info_companyname"
                                            placeholder="Digite o nome da empresa">
                                </b-form-input>
                            </b-input-group>
                        </b-row>
                        <b-row class="mb-3">
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    Cor primária:
                                </b-input-group-prepend>
                            <swatches v-model="form.scss_colors_primary" colors="text-advanced">
                              <input slot="trigger" :value="form.scss_colors_primary" class="form__input__element" readonly>
                            </swatches>
                            </b-input-group>
                        </b-row>
                        <b-row class="mb-3">
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    Cor secundaria:
                                </b-input-group-prepend>
                            <swatches v-model="form.scss_colors_secondary" colors="text-advanced">
                              <input slot="trigger" :value="form.scss_colors_secondary" class="form__input__element" readonly>
                            </swatches>
                            </b-input-group>
                        </b-row>

<b-button v-if="false" variant="outline-success" v-b-tooltip.hover title="Clique para gerar o site" @click="scaffolder_test">aaaah</b-button>
                        <b-button variant="outline-success" v-b-tooltip.hover title="Clique para gerar o site" @click="scaffolder">Gerar o site</b-button>
                      </b-jumbotron>
                    </b-tab>
                    <b-tab title="Home (whitelabel)">
                      Configuração da home
                    </b-tab>
                  </b-tabs>
                </b-card>
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
import Swatches from 'vue-swatches';
import config from "@/config";
import { func } from "@/functions";
import { partnerService } from '../../components/common/services/partner';

import "vue-swatches/dist/vue-swatches.min.css";

Vue.use(VueMask);
Vue.use(VueHead);

export default {
  mixins: [func],
  props: ['id'],
  name: 'partner-wl',
  components: { Swatches },
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Parceiros - whitelabel`,
      }
    },
  },
  created() {
    Vue.nextTick().then(response => {
      if (!this.isAdd) {
        this.get();
      }
    });
  },
  computed: {
    tab1_database_variant() {
      return this.form.tab1.databaseOK ? "success": "outline-danger";
    },
    tab1_database_status() {
      let ret = '';
      switch (this.form.tab1.databaseStatus) {
        case "not_init":
          ret = "Não iniciado.";
        break;
        case "init":
          ret = "Iniciado.";
        break;
        case "ended":
          ret = "Finalizado.";
        break;
      }
      return ret;
    },
    tab1_database_tooltip() {
      return this.form.tab1.databaseOK ? "Conectado" : this.tab1_database_status;
    },
    tab1_user_variant() {
      return this.form.tab1.userOK ? "success": "outline-danger";
    },
    tab1_user_tooltip() {
      return this.form.tab1.userOK ? "Conectado" : "Não conectado";
    },
    tab1_user_status() {
      let ret = '';
      switch (this.form.tab1.userStatus) {
        case "not_init":
          ret = "Não iniciado.";
        break;
        case "init":
          ret = "Iniciado.";
        break;
        case "ended":
          ret = "Finalizado.";
        break;
      }
      return ret;
    },
    mayIsee() {
      return this.mayI('partner-wl', 'partner-wl');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    },
  },
  methods: {
    setdatabasetimer() {
        this.timers.database = setInterval(this.get, 10000);
    },
    cleardatabasetimer() {
      clearInterval(this.timers.database);
    },
    confdb() {
      if (!this.form.candoanything) {
        this.toastError("Aguarde a execução do job para executar outro.");
        return;
      }
      if (this.form.tab1.databaseOK) return;
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      partnerService.confdb(this.getLoggedId(), this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              this.toastSuccess("Iniciando configuração da database");
              this.setdatabasetimer();
              this.get();
            }
            else {
              this.toastError(response.msg);
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
    },
    scaffolder_test() {
        this.form.json_meta_description = "meta desc";
        this.form.json_meta_keywords = "meta keywords";
        this.form.json_template = "ticketHub";
        this.form.json_info_title = "titulo";
        this.form.json_info_description = "desc";
        this.form.json_info_cnpj = "45.464.654/6546-54";
        this.form.json_info_companyname = "nome empresa";
        this.form.scss_colors_primary = "#980000";
        this.form.scss_colors_secondary = "#4c1130";
    },
    scaffolder() {
      if (!this.form.candoanything) {
        this.toastError("Aguarde a execução do job para executar outro.");
        return;
      }
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();

      partnerService.scaffolder(this.getLoggedId(), this.id, this.form.json_meta_description, this.form.json_meta_keywords, this.form.json_template, this.form.json_info_title, this.form.json_info_cnpj, this.form.json_info_companyname, this.form.scss_colors_primary, this.form.scss_colors_secondary).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              this.toastSuccess("Site gerado por favor aguarde até 24hrs para o mesmo estar disponível.");
              this.get();
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
    },
    confdbuser() {
      if (!this.form.candoanything) {
        this.toastError("Aguarde a execução do job para executar outro.");
        return;
      }
      if (this.form.tab1.userOK) return;
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      partnerService.confdbuser(this.getLoggedId(), this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              this.toastSuccess("Conexão com a base criada com sucesso.");
              this.get();
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
    },
    get() {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      partnerService.getwl(this.getLoggedId(), this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = true;
              this.form.name = response.name;
              this.form.domain = response.domain;
              this.form.uniquename = response.uniquename;
              this.form.tab1.databaseOK = response.databaseOK;
              this.form.tab1.databaseStatus = response.databaseStatus;
              this.form.tab1.userOK = response.userOK;
              this.form.tab1.userStatus = response.userStatus;

              this.form.json_meta_description = response.json_meta_description
              this.form.json_meta_keywords = response.json_meta_keywords
              this.form.json_template = response.json_template
              this.form.json_info_title = response.json_info_title
              this.form.json_info_description = response.json_info_description
              this.form.json_info_cnpj = response.json_info_cnpj
              this.form.json_info_companyname = response.json_info_companyname
              this.form.scss_colors_primary = response.scss_colors_primary
              this.form.scss_colors_secondary = response.scss_colors_secondary

              switch (response.databaseStatus) {
                case "not_init":
                  this.form.candoanything = true;
                break;
                case "init":
                  this.form.candoanything = false;
                break;
                case "ended":
                  this.form.candoanything = true;
                break;
              }
              if (this.form.candoanything == true) {
                switch (response.userStatus) {
                  case "not_init":
                    this.form.candoanything = true;
                  break;
                  case "init":
                    this.form.candoanything = false;
                  break;
                  case "ended":
                    this.form.candoanything = true;
                  break;
                }
              }

              if (this.form.candoanything) {
                this.cleardatabasetimer();
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
  
  data () {
    return {
        processing: false,
        loading: false,
        timers: {
          database: null,
        },
        form: {
          candoanything: false,
          loaded: false,
          id: '',

          json_meta_description: '',
          json_meta_keywords: '',
          json_template: '',
          json_info_title: '',
          json_info_cnpj: '',
          json_info_companyname: '',
          scss_colors_primary: '',
          scss_colors_secondary: '',

          name: '',
          domain: '',
          type: '',
          uniquename: '',
          tab1: {
            databaseOK: false,
            userOK: false,
            databaseStatus: '',
            userStatus: '',
          },
          tab2: {
            databaseOK: false,
            userOK: false,
          },
          tab3: {
            databaseOK: false,
            userOK: false,
          },
          
        }
    }
  }
}
</script>

<style scoped>
</style>
