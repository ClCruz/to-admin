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
                    <b-tab title="Scaffolder">
                      <h4>Configuração dos JSON</h4>
                      <b-jumbotron header="" lead="Configuração referente ao site." >
                        <b-row class="mb-3">
                          <img v-if="!form.changedImage" v-on:click="imageClick" :src="form.imageURI" alt="" title="Clique em cima para trocar a imagem." class="imgthumb" />
                          <picture-input
                            ref="pictureInput" 
                            v-if="form.changedImage"
                            @change="onChange" 
                            width="160" 
                            height="180" 
                            margin="0"
                            accept="image/jpeg,image/png" 
                            :crop="false"
                            :hide-change-button="true"
                            size="1" 
                            button-class="btn"
                            :custom-strings="components.picOptions"
                            ></picture-input>
                        </b-row>
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
                                    Endereço da empresa:
                                </b-input-group-prepend>
                                <b-form-input id="json_info_companyaddress"
                                            type="text"
                                            name="json_info_companyaddress"
                                            maxlength="200"
                                            v-model="form.json_info_companyaddress"
                                            placeholder="Digite o endereço da empresa">
                                </b-form-input>
                            </b-input-group>
                        </b-row>
                        <b-row class="mb-3">
                            <b-input-group size="sm">
                                <b-input-group-prepend is-text>
                                    Google Analytics TAG:
                                </b-input-group-prepend>
                                <b-form-input id="json_ga"
                                            type="text"
                                            name="json_ga"
                                            maxlength="50"
                                            v-model="form.json_ga"
                                            placeholder="Digite o código do Google Analytics">
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

                        <v-wait for="inprocess">
                            <template slot="waiting">
                                <b-dropdown id="ddown-split" variant="success" size="sm" split text="Aguarde..." class="m-2">
                                </b-dropdown>
                            </template>
                        </v-wait>

                        <b-dropdown v-if="!processing" id="ddown-split" variant="success" size="sm" split text="Salvar" @click="saveme(0);" class="m-2">
                          <b-dropdown-item href="#" @click="saveme(1)">Salvar e Criar</b-dropdown-item>
                          <b-dropdown-item href="#" @click="saveme(2)">Salvar e Criar (apenas site)</b-dropdown-item>
                          <b-dropdown-item href="#" @click="saveme(4)">Salvar e Criar (apenas legacy)</b-dropdown-item>
                          <b-dropdown-item href="#" @click="saveme(3)">Salvar e Criar (apenas api)</b-dropdown-item>
                          <b-dropdown-item href="#" @click="scaffolder_test">Preencher</b-dropdown-item>
                        </b-dropdown>
                      </b-jumbotron>
                    </b-tab>
                    <b-tab title="Deploy" active>
                      <h4>Deploy automático</h4>
                      <b-jumbotron header="" lead="Após o primeiro deploy, utilize essa tela para refazer o deploy para cada sistema." >
                        <b-button-group v-if="!processing">
                          <b-button variant="outline-dark" v-b-tooltip.hover title="Clique aqui para fazer o deploy dos scripts da base de dados." @click="deployAsk(1)">Base de dados</b-button>
                          <b-button variant="outline-dark" v-b-tooltip.hover title="Clique aqui para fazer o deploy do Site" @click="deployAsk(2)">Site</b-button>
                          <b-button variant="outline-dark" v-b-tooltip.hover title="Clique aqui para fazer o deploy da API" @click="deployAsk(3)">API</b-button>
                          <b-button variant="outline-dark" v-b-tooltip.hover title="Clique aqui para fazer o deploy do Legado" @click="deployAsk(4)">Legado</b-button>
                          <b-button variant="outline-dark" v-b-tooltip.hover title="Clique aqui para fazer o deploy do Admin" @click="deployAsk(5)">Admin</b-button>
                        </b-button-group>
                        <b-button-group v-if="processing">
                          <b-button variant="outline-dark" v-b-tooltip.hover title="Aguarde...">Aguarde...</b-button>
                          <b-button variant="outline-dark" v-b-tooltip.hover title="Aguarde...">Aguarde...</b-button>
                          <b-button variant="outline-dark" v-b-tooltip.hover title="Aguarde...">Aguarde...</b-button>
                          <b-button variant="outline-dark" v-b-tooltip.hover title="Aguarde...">Aguarde...</b-button>
                          <b-button variant="outline-dark" v-b-tooltip.hover title="Aguarde...">Aguarde...</b-button>
                        </b-button-group>
                      </b-jumbotron>
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
import PictureInput from 'vue-picture-input';
import Swatches from 'vue-swatches';
import config from "@/config";
import { func } from "@/functions";
import { partnerService } from '../../components/common/services/partner';
import { deployService } from '../../components/common/services/deploy';

import "vue-swatches/dist/vue-swatches.min.css";

Vue.use(VueMask);
Vue.use(VueHead);

export default {
  mixins: [func],
  props: ['id'],
  name: 'partner-wl',
  components: { Swatches, PictureInput },
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
    deployAsk(who) {
      this.$swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        title: 'Deploy',
        html: "Deseja realmente realizar o deploy? <p><small>(Atenção não fechar o navegador enquanto não houver o retorno de OK, essa ação leva um tempo extra.)</small></p>",
      }).then((result) => {
        if (result.value) {
          this.deploy(who);
        }
        else if (result.dismiss === this.$swal.DismissReason.cancel) {
        }
      });
    },
    deploy(who) {
      if (!this.form.candoanything) {
        this.toastError("Aguarde a execução do job para executar outro.");
        return;
      }
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();

      deployService.exec(this.getLoggedId(), who).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              this.toastSuccess("Processo de deploy iniciado, em breve estará finalizado.");
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
    saveme(type) {
      if (type>0) {
        this.scaffolderAsk(type);
      }
      else {
        this.scaffolder(0);
      }
    },
    imageClick() {
      this.form.imageURI = '';
      this.form.changedImage = true;
    },
    onChange (image) {
        if (image) {
            this.form.imagebase64 = image;
            this.form.changedImage = true;
        }
    },
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
        this.form.json_ga = "";
        this.form.json_info_companyaddress = "Rua das flores";
        this.form.scss_colors_primary = "#980000";
        this.form.scss_colors_secondary = "#4c1130";
    },
    scaffolderAsk(type) {
      this.$swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        title: 'Geração do site',
        html: "Deseja realmente gerar o site? <p><small>(Atenção não fechar o navegador enquanto não houver o retorno de OK, essa ação leva um tempo extra.)</small></p>",
      }).then((result) => {
        if (result.value) {
          this.scaffolder(type);
        }
        else if (result.dismiss === this.$swal.DismissReason.cancel) {
        }
      });
    },
    scaffolder(generate) {
      if (!this.form.candoanything) {
        this.toastError("Aguarde a execução do job para executar outro.");
        return;
      }
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();

      partnerService.scaffolder(this.getLoggedId(), this.id, this.form.json_meta_description, this.form.json_meta_keywords, this.form.json_template, this.form.json_info_title, this.form.json_info_cnpj, this.form.json_info_companyname, this.form.json_info_companyaddress, this.form.json_ga, this.form.scss_colors_primary, this.form.scss_colors_secondary, this.form.changedImage, this.form.imagebase64, generate).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              switch (generate) {
                case 0:
                  this.toastSuccess("Dados salvos com sucesso.");
                break;
                case 1:
                  this.toastSuccess("Dados salvos com sucesso, processo de deploy irá acontecer em breve.");
                break;
                case 2:
                  this.toastSuccess("Dados salvos com sucesso, processo de deploy do SITE irá acontecer em breve.");
                break;
                case 3:
                  this.toastSuccess("Dados salvos com sucesso, processo de deploy do LEGADO irá acontecer em breve.");
                break;
                case 3:
                  this.toastSuccess("Dados salvos com sucesso, processo de deploy da API irá acontecer em breve.");
                break;
              }

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

              this.form.json_info_companyaddress = response.json_info_companyaddress;
              this.form.json_ga = response.json_ga;
              this.form.json_meta_description = response.json_meta_description;
              this.form.json_meta_keywords = response.json_meta_keywords;
              this.form.json_template = response.json_template;
              this.form.json_info_title = response.json_info_title;
              this.form.json_info_description = response.json_info_description;
              this.form.json_info_cnpj = response.json_info_cnpj;
              this.form.json_info_companyname = response.json_info_companyname;
              this.form.scss_colors_primary = response.scss_colors_primary;
              this.form.scss_colors_secondary = response.scss_colors_secondary;
              this.form.imageURI = "https://media.tixs.me/logos/logo-"+response.uniquename+".png?"+this.randomString();

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
        components: {
          picOptions: {
              upload: '<p>Não foi possível realizar o upload.</p>', // HTML allowed
              drag: 'Arraste a imagem ou clique para selecionar', // HTML allowed
              tap: 'Toque aqui para selecionar uma imagem', // HTML allowed
              change: 'Mudar', // Text only
              remove: 'Remover', // Text only
              select: 'Selecione uma imagem', // Text only
              selected: '<p>Imagem selecionada com sucesso.</p>', // HTML allowed
              fileSize: 'O tamanho da imagem ultrapassou o limite.', // Text only
              fileType: 'Esse tipo de arquivo não é suportado.', // Text only
              aspect: 'Landscape/Portrait' // Text only
          },
        },
        form: {
          candoanything: false,
          loaded: false,
          id: '',
          changedImage: false,
          imageURI: '',
          imagebase64: "",

          json_ga: '',
          json_info_companyaddress: '',
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
.imgthumb {
  margin: 0 auto;
  text-align: center;
  width: 20%;
  height: 50%;
  cursor: pointer;
}
</style>
