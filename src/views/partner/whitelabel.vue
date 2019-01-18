<template>
    <div>
      <b-container v-if="form.loaded">
        <b-row class="mb-3">
          <b-col>
              <b-row class="mb-3">
                <b-alert variant="success" show>Parceiro: {{form.name}} - {{form.uniquename}}</b-alert>
              </b-row>
          </b-col>
        </b-row>

        <b-row class="mb-3">
            <b-col>
              <b-row class="mb-3">
                <b-card no-body>
                  <b-tabs pills card vertical>
                    <b-tab title="Base de dados" active>
                      <h2>Configuração da base de dados</h2>
                      <b-jumbotron header="" lead="Configuração referente a base de dados única do parceiro e as conexões." >
                        <b-button-group>
                          <b-button :variant="tab1_database_variant" v-b-tooltip.hover :title="tab1_database_tooltip" @click="confdb">Base de dados - {{tab1_database_status}}</b-button>
                          <b-button :variant="tab1_user_variant" v-b-tooltip.hover :title="tab1_user_tooltip" @click="confdbuser">Conexão - {{tab1_user_status}}</b-button>
                        </b-button-group>
                      </b-jumbotron>

                    </b-tab>
                    <b-tab title="Scaffolder">
                      Configuração dos JSON
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
import config from "@/config";
import { func } from "@/functions";
import { partnerService } from '../../components/common/services/partner';

Vue.use(VueHead);

export default {
  mixins: [func],
  props: ['id'],
  name: 'partner-wl',
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
