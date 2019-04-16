<template>
<div v-if="mayIsee">
  <b-container>
    <b-modal ref="gmapsModal" hide-footer title="Google Maps">
      <div class="d-block text-center">
        <h4>Maps para o endereço: {{popups.gmaps.name}}</h4>
      </div>
      <iframe v-if="this.form.ds_googlemaps.length>0" :src="googlemapsURI" height="200" width="300"></iframe>
      <b-btn class="mt-3" variant="outline-info" block @click="gmapsClose">Fechar</b-btn>
    </b-modal>
    <b-row>
      <b-col>
        <div id="my-upload" style="display: flex; justify-content: center;">
            <vue-upload-multiple-image
              :key="idupload"
              @upload-success="uploadImageSuccess"
              @before-remove="beforeRemove"
              @edit-image="editImage"
              @data-change="dataChange"
              :data-images="form.images"
              :dragText="components.picOptions.dragText"
              :browseText="components.picOptions.browseText"
              :primaryText="components.picOptions.primaryText"
              :markIsPrimaryText="components.picOptions.markIsPrimaryText"
              :popupText="components.picOptions.popupText"
              :dropText="components.picOptions.dropText"
              :showPrimary="false"
              :multiple="false"
              ></vue-upload-multiple-image>
        </div>
        <div class="directlink" v-if="form.imageURICard!=''"><a :href="form.imageURICard" title="Abrir imagem usada como card" target="_blank">Card</a>/<a title="Abrir imagem usada como banner" :href="form.imageURIBanner" target="_blank">Banner</a>/<a title="Abrir imagem original" :href="form.imageURIOriginal" target="_blank">Imagem original</a></div>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.NomPeca.$invalid) }">
                Nome:
              </b-input-group-prepend>
              <b-form-input id="name" type="text" v-bind:class="{ errorFormValidateInput: ($v.form.NomPeca.$invalid) }" name="name" maxlength="150" v-model="form.NomPeca" placeholder="Digite o nome">
              </b-form-input>
            </b-input-group>
            <div class="errorFormValidate" v-if="!$v.form.NomPeca.required">Campo é obrigatório</div>
            <div class="errorFormValidate" v-if="!$v.form.NomPeca.minLength">Deve ter pelo menos {{$v.form.NomPeca.$params.minLength.min}} caracteres.</div>
          </b-row>
          <b-row class="mb-3" v-if="!isAdd">
            <b-input-group size="sm">
              <b-input-group-prepend is-text>
                URL: 
                <span v-b-tooltip.hover title="Clique para abrir" 
                style="cursor:pointer;padding-left: 4px;" @click="gotoFarFromHome(form.urifull)"><i class="fab fa-chrome"></i></span>
              </b-input-group-prepend>
              <b-form-input :disabled="true" id="uri" type="text"  name="uri" maxlength="90" v-model="form.uri" placeholder="URL">
              </b-form-input>
            </b-input-group>
          </b-row>
          <b-row class="mb-3">
            <b-col cols="6" class="ml-0 pl-0">
              <b-row>
                <div class="col-12">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.description.$invalid) }">
                      Descrição:
                    </b-input-group-prepend>
                    <div class="col-12 m-0 p-0" style="height:200px; margin-bottom:50px;margin-left: 0px;">
                      <quill-editor v-model="form.description" ref="editor" v-bind:class="{ errorFormValidateInput: ($v.form.description.$invalid) }" :options="components.quillOptions">
                      </quill-editor>
                    </div>
                  </b-input-group>
                  <div class="errorFormValidate errorFormValidateHack" v-if="!$v.form.description.required">Campo é obrigatório</div>
                  <div class="errorFormValidate errorFormValidateHack" v-if="!$v.form.description.minLength">Deve ter pelo menos {{$v.form.description.$params.minLength.min}} caracteres.</div>
                </div>
              </b-row>
            </b-col>
            <b-col cols="6" class="ml-0 pl-0">
              <b-row>
                <div class="col-12">
                  <b-input-group size="sm">
                    <b-input-group-prepend is-text>
                      Descrição Banner:
                    </b-input-group-prepend>
                    <div class="col-12 m-0 p-0" style="height:200px; margin-bottom:50px;margin-left: 0px;">
                      <quill-editor v-model="form.bannerDescription" :disabled="this.form.showInBanner!=1 && this.form.showInBanner!='1'" ref="editor" :options="components.quillOptions">
                      </quill-editor>
                    </div>
                  </b-input-group>
                </div>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text v-b-tooltip.hover title="A data é modificada conforme é cadastrado novos datas para o evento.">
                    Data(s) do evento:
                  </b-input-group-prepend>
                  <b-input-group-prepend is-text v-if="form.hasPresentantion == 0 || isAdd">
                    Nenhuma data cadastrada
                  </b-input-group-prepend>
                  <b-input-group-prepend is-text v-if="form.hasPresentantion == 1 && !isAdd">
                    {{form.DatIniPeca}}
                  </b-input-group-prepend>
                  <b-input-group-prepend is-text v-if="form.hasPresentantion == 1 && !isAdd">
                    a
                  </b-input-group-prepend>
                  <b-input-group-prepend is-text v-if="form.hasPresentantion == 1 && !isAdd">
                    {{form.DatFinPeca}}
                  </b-input-group-prepend>
                </b-input-group>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text v-b-tooltip.hover title="O valor é modificada conforme é cadastrado novos valores.">
                    Valor do Ingresso:
                  </b-input-group-prepend>
                  <b-input-group-prepend is-text v-if="form.hasPresentantion == 0 || isAdd">
                    Nenhuma data cadastrada
                  </b-input-group-prepend>
                  <b-input-group-prepend is-text v-if="form.hasPresentantion == 1 && !isAdd">
                    {{form.amountMax | showValue(form.amountMin)}}
                  </b-input-group-prepend>
                </b-input-group>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.id_base.$invalid) }">
                Base:
              </b-input-group-prepend>
              <b-form-select v-model="form.id_base" :options="selects.base" size="sm" v-bind:class="{ errorFormValidateInput: ($v.form.id_base.$invalid) }" />
            </b-input-group>
            <div class="errorFormValidate" v-if="!$v.form.id_base.required">Campo é obrigatório</div>
          </b-row>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.id_genre.$invalid) }">
                Gênero:
              </b-input-group-prepend>
              <b-form-select v-model="form.id_genre" :options="selects.genre" size="sm" v-bind:class="{ errorFormValidateInput: ($v.form.id_genre.$invalid) }" />
            </b-input-group>
            <div class="errorFormValidate" v-if="!$v.form.id_genre.required">Campo é obrigatório</div>
          </b-row>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.id_produtor.$invalid) }">
                Produtor:
              </b-input-group-prepend>
              <b-form-select v-model="form.id_produtor" :options="selects.producer" size="sm" v-bind:class="{ errorFormValidateInput: ($v.form.id_produtor.$invalid) }" />
            </b-input-group>
            <div class="errorFormValidate" v-if="!$v.form.id_produtor.required">Campo é obrigatório</div>
          </b-row>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.id_estado.$invalid) }">
                Estado:
              </b-input-group-prepend>
              <b-form-select v-on:change="selState" v-model="form.id_estado" :options="selects.state" size="sm" v-bind:class="{ errorFormValidateInput: ($v.form.id_estado.$invalid) }" />
            </b-input-group>
            <div class="errorFormValidate" v-if="!$v.form.id_estado.required">Campo é obrigatório</div>
          </b-row>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.id_municipio.$invalid) }">
                Cidade:
              </b-input-group-prepend>
              <b-form-select v-on:change="selCity" v-model="form.id_municipio" :options="selects.city" size="sm" v-bind:class="{ errorFormValidateInput: ($v.form.id_municipio.$invalid) }" />
            </b-input-group>
            <div class="errorFormValidate" v-if="!$v.form.id_municipio.required">Campo é obrigatório</div>
          </b-row>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.id_local_evento.$invalid) }">
                Local:
              </b-input-group-prepend>
              <b-form-select v-on:change="selPlace" v-model="form.id_local_evento" :options="selects.place" size="sm" v-bind:class="{ errorFormValidateInput: ($v.form.id_local_evento.$invalid) }" />
              <b-button :disabled="form.id_local_evento=='' || form.id_local_evento == 0" type="button" variant="outline-info" size="sm" @click="openMaps">
                <span>Ver no Google Maps</span>
              </b-button>
            </b-input-group>
            <div class="errorFormValidate" v-if="!$v.form.id_local_evento.required">Campo é obrigatório</div>
          </b-row>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.ticketoffice_ticketmodel.$invalid) }">
                Modelo de Ingresso na Bilheteria:
              </b-input-group-prepend>
              <b-form-select v-model="form.ticketoffice_ticketmodel" :options="selects.ticketmodels" size="sm" v-bind:class="{ errorFormValidateInput: ($v.form.ticketoffice_ticketmodel.$invalid) }" />
            </b-input-group>
            <div class="errorFormValidate" v-if="!$v.form.ticketoffice_ticketmodel.required">Campo é obrigatório</div>
          </b-row>
          <b-row class="mb-3">
            <b-col>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.TemDurPeca.$invalid) }">
                    Duração:
                  </b-input-group-prepend>
                  <b-form-input id="TemDurPeca" type="text" name="TemDurPeca" v-mask="'###'" maxlength="3" v-model="form.TemDurPeca" v-bind:class="{ errorFormValidateInput: ($v.form.TemDurPeca.$invalid) }" placeholder="Digite a duração do evento">
                  </b-form-input>
                  <b-input-group-prepend is-text>
                    min
                  </b-input-group-prepend>
                </b-input-group>
                <div class="errorFormValidate" v-if="!$v.form.TemDurPeca.required">Campo é obrigatório</div>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-input-group size="sm" style="padding-left:10px;">
                  <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.CenPeca.$invalid) }">
                    Censura:
                  </b-input-group-prepend>
                  <b-form-input id="CenPeca" type="text" name="CenPeca" v-mask="'##'" maxlength="3" v-model="form.CenPeca" v-bind:class="{ errorFormValidateInput: ($v.form.CenPeca.$invalid) }" placeholder="Digite a censura">
                  </b-form-input>
                  <b-input-group-prepend is-text>
                    anos
                  </b-input-group-prepend>
                </b-input-group>
                <div class="errorFormValidate errorFormValidateHack2" v-if="!$v.form.CenPeca.required">Campo é obrigatório</div>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text>
                    Abertura:
                  </b-input-group-prepend>
                  <b-form-input id="opening_time" type="text" name="opening_time" maxlength="50" v-model="form.opening_time" placeholder="Digite informação de abertura do evento">
                  </b-form-input>
                </b-input-group>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-input-group size="sm" style="padding-left:10px;">
                  <b-input-group-prepend is-text>
                    Apólice de seguro:
                  </b-input-group-prepend>
                  <b-form-input id="insurance_policy" type="text" name="insurance_policy" maxlength="50" v-model="form.insurance_policy" placeholder="Digite a apólice de seguro">
                  </b-form-input>
                </b-input-group>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.QtIngrPorPedido.$invalid) }">
                    Qta. máxima de ingressos por pedido na venda:
                  </b-input-group-prepend>
                  <b-form-input id="QtIngrPorPedido" type="text" name="QtIngrPorPedido" v-mask="'###'" maxlength="3" v-model="form.QtIngrPorPedido" v-bind:class="{ errorFormValidateInput: ($v.form.QtIngrPorPedido.$invalid) }" placeholder="Digite a quantidade máxima de ingressos por pedido na venda">
                  </b-form-input>
                </b-input-group>
                <div class="errorFormValidate" v-if="!$v.form.QtIngrPorPedido.required">Campo é obrigatório</div>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-input-group size="sm" style="padding-left:10px;">
                  <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.qt_ingressos_por_cpf.$invalid) }">
                    Qta. máxima de ingressos por cpf na venda:
                  </b-input-group-prepend>
                  <b-form-input id="qt_ingressos_por_cpf" type="text" name="qt_ingressos_por_cpf" v-mask="'###'" maxlength="3" v-model="form.qt_ingressos_por_cpf" v-bind:class="{ errorFormValidateInput: ($v.form.qt_ingressos_por_cpf.$invalid) }" placeholder="Digite a quantidade máxima de ingressos por cpf na venda">
                  </b-form-input>
                </b-input-group>
                <div class="errorFormValidate errorFormValidateHack2" v-if="!$v.form.qt_ingressos_por_cpf.required">Campo é obrigatório</div>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text>
                    Qta. de parcelas:
                  </b-input-group-prepend>
                  <b-form-select v-model="form.max_installments" :options="selects.max_installments" size="sm" />
                </b-input-group>
              </b-row>
            </b-col>
            <b-col>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text>
                    Qta. de parcelas sem juros aplicado
                  </b-input-group-prepend>
                  <b-form-select v-model="form.free_installments" :options="selects.max_installments" size="sm" />
                </b-input-group>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col>
              <b-row>

                <b-input-group size="sm">
                  <b-input-group-prepend is-text>
                    Valor do Juros:
                  </b-input-group-prepend>
                  <b-form-input ref="interest_rate" id="interest_rate" type="text" name="interest_rate" maxlength="8" v-money="components.money" v-model.lazy="form.interest_rate">
                  </b-form-input>
                </b-input-group>
              </b-row>
            </b-col>

          </b-row>
      </b-col>
    </b-row>
    <div class="checkboxs">
      <div class="checkboxGroup">
        <input id="showonline" name="showonline" v-model="form.showonline" type="checkbox"/>
        <label for="showonline">Vender Web</label>
      </div>
      <div class="checkboxGroup">
        <input id="showInBanner" name="showInBanner" v-model="form.showInBanner" type="checkbox"/>
        <label for="showInBanner">Mostrar no banner</label>
      </div>
      <div class="checkboxGroup">
        <input id="in_obriga_cpf" name="in_obriga_cpf" v-model="form.in_obriga_cpf" type="checkbox"/>
        <label for="in_obriga_cpf">Obriga CPF e Nome na compra da Bilheteria</label>
      </div>
      <div class="checkboxGroup">
        <input id="ticketoffice_askemail" name="ticketoffice_askemail" v-model="form.ticketoffice_askemail" type="checkbox"/>
        <label for="ticketoffice_askemail">Perguntar para enviar o bilhete por email na compra da Bilheteria</label>
      </div>
    </div>
    <b-row class="mb-3">
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
      <b-button :disabled="id == 0 || id == null || id == undefined" v-if="mayI('presentation-add')" type="button" variant="info" size="sm" @click="addPresentation">
        <span>Ver datas</span>
      </b-button>

    </b-row>

  </b-container>
</div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import VueQuillEditor from 'vue-quill-editor';
import VueUploadMultipleImage from 'vue-upload-multiple-image';
import VueMask from 'v-mask';
import Vuelidate from 'vuelidate';
import VModal from 'vue-js-modal';


import dateadd from '../presentation/add';

import config from "@/config";
import { EventBus } from '@/event-bus';
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { genreService } from '../../components/common/services/genre';
import { cityService } from '../../components/common/services/city';
import { stateService } from '../../components/common/services/state';
import { placeService } from '../../components/common/services/place';
import { producerService } from '../../components/common/services/producer';
import { eventService } from '../../components/common/services/event';
import { VMoney } from 'v-money';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import {
  required,
  minLength
} from 'vuelidate/lib/validators';

Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
});
Vue.use(VueHead);
Vue.use(VueQuillEditor);
Vue.use(VueMask);
Vue.use(Vuelidate);

export default {
  mixins: [func],
  components: {
    VueUploadMultipleImage,
  },
  props: ['id', 'base'],
  name: 'event-add',
  head: {
    title: function () {
      return {
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Evento - ${this.typeOf}`,
      }
    },
  },
  mounted() {
    EventBus.$on('reloadinfo', p => {
      this.get(false);
    });
  },
  created() {
    this.populateState();
    this.populateGenre();
    this.populateProducer();
    this.populateBases();
    if (!this.isAdd) {
      this.get(true);
    }
  },
  directives: {
    money: VMoney
  },

  computed: {
    checkboxs: {
      get: function () {
        let ret = [];
        if (this.form.showInBanner == '1' || this.form.showInBanner == 1) {
          ret.push("showInBanner");
        }
        if (this.form.showonline == '1' || this.form.showonline == 1) {
          ret.push("showonline");
        }
        if (this.form.in_obriga_cpf == '1' || this.form.in_obriga_cpf == 1) {
          ret.push("in_obriga_cpf");
        }
        if (this.form.ticketoffice_askemail == '1' || this.form.ticketoffice_askemail == 1) {
          ret.push("ticketoffice_askemail");
        }
        return ret;
      },
      set: function (newValue) {
        let index_showInBanner = newValue.map(function (e) {
          return e;
        }).indexOf("showInBanner");
        let index_in_obriga_cpf = newValue.map(function (e) {
          return e;
        }).indexOf("in_obriga_cpf");
        let index_ticketoffice_askemail = newValue.map(function (e) {
          return e;
        }).indexOf("ticketoffice_askemail");
        this.form.showInBanner = index_showInBanner == -1 ? '' : '1';
        this.form.in_obriga_cpf = index_in_obriga_cpf == -1 ? '' : '1';
        this.form.ticketoffice_askemail = index_ticketoffice_askemail == -1 ? '' : '1';
      }
    },
    mayIsee() {
      return this.mayI('ev-add', 'ev-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    },
    googlemapsURI() {
      return `http://maps.google.com/?q=${this.form.ds_googlemaps}&output=embed`;
    }
  },
  methods: {
    uploadImageSuccess(formData, index, fileList) {
      //console.log(fileList);
      this.form.saveimage = true;
      this.form.image = fileList[index].path;
      console.log("uploadImageSuccess");
      // Upload image api
      // axios.post('http://your-url-upload', formData).then(response => {
      //   console.log(response)
      // })
    },
    beforeRemove (index, done, fileList) {
      this.form.saveimage = false;
      this.form.image = null;
      done();
      console.log("beforeRemove");
    },
    editImage (formData, index, fileList) {
      this.form.saveimage = true;
      this.form.image = fileList[index].path;
      console.log("editImage");
    },
    dataChange (data) {
      console.log("dataChange");
      console.log(data)
    },
    teste() {
      alert("oi");
    },
    reloadonly() {
      this.get(false);
    },
    addPresentation() {
      this.$modal.show(dateadd, { //dateadd, {
        id: this.id,
        id_base: this.base,
      }, {
        draggable: false,
        resizable: true,
        adaptive: true,
        height: "auto",
        width: '800px',
        // resizable: true,
        scrollable: true,
      });
    },
    formatInterestRate(str) {
      return str.split('.').join("").split(" ").join("").split("%").join("");
    },
    presentationClose() {
      this.$refs.presentationModal.hide();
    },
    checkproducer() {
      if (this.form.id_produtor == null || this.form.id_produtor == "") return;
      if (this.selects.producer.length == 0) return;
      if (this.form.produceralert) return;

      let index = this.selects.producer.map(function (e) {
        return e.id_produtor;
      }).indexOf(this.form.id_produtor);
      if (index == -1) {
        this.form.produceralert = true;
        this.$swal({
          type: 'error',
          text: "Atenção existe uma incompatibilidade de permissão entre você e o produtor, não é possível visualizar o produtor que está cadastrado para o evento.",
          showConfirmButton: true,
        }).then((result) => {});
      }
    },
    get(type) {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      eventService.get(this.getLoggedId(), this.id, this.base).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response)) {
            this.form.loaded = this.validateJSONisNotEmpty(response);
            if (this.form.loaded) {
              this.form.CodPeca = response.CodPeca;
              this.form.id_produtor = response.id_produtor;
              this.form.id_base = response.id_base;
              this.form.uri = response.uri;
              this.form.urifull = response.urifull;
              this.form.NomPeca = response.NomPeca;
              this.form.CodTipPeca = response.CodTipPeca;
              this.form.id_genre = response.id_genre;
              this.form.TemDurPeca = response.TemDurPeca;
              this.form.amountMax = response.amountMax;
              this.form.amountMin = response.amountMin;
              this.form.CenPeca = response.CenPeca;
              this.form.id_local_evento = response.id_local_evento;
              this.form.id_municipio = response.id_municipio;
              this.form.id_estado = response.id_estado;
              this.form.ValIngresso = response.ValIngresso;
              this.form.description = response.description;
              this.form.meta_description = response.meta_description;
              this.form.meta_keyword = response.meta_keyword;
              this.form.showonline = response.showonline;
              this.form.showInBanner = response.showInBanner;
              this.form.bannerDescription = response.bannerDescription;
              this.form.opening_time = response.opening_time;
              this.form.insurance_policy = response.insurance_policy;
              this.form.QtIngrPorPedido = response.QtIngrPorPedido;
              this.form.qt_ingressos_por_cpf = response.qt_ingressos_por_cpf;
              this.form.in_obriga_cpf = response.in_obriga_cpf;
              this.form.ticketoffice_askemail = response.ticketoffice_askemail;
              this.form.DatIniPeca = response.DatIniPeca;
              this.form.DatFinPeca = response.DatFinPeca;
              this.form.hasPresentantion = response.hasPresentantion;

              this.form.imageURICard = response.imageURICard;
              this.form.imageURIBanner = response.imageURIBanner;
              this.form.imageURIOriginal = response.imageURIOriginal;

              this.form.max_installments = response.max_installments;
              this.form.free_installments = response.free_installments;
              this.form.interest_rate = response.interest_rate;
              this.form.ticketoffice_ticketmodel = response.ticketoffice_ticketmodel;
              this.$refs.interest_rate.$el.value = response.interest_rate;

              this.checkproducer();
              this.populateCity();
              this.populatePlace();

              this.populateImage();
              if (type == true) {
                if (this.queryString("opendate")) {
                  this.addPresentation();
                }
              }
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
    openMaps() {
      this.popups.gmaps.name = this.form.ds_local_evento;
      this.$refs.gmapsModal.show();
    },
    gmapsClose() {
      this.$refs.gmapsModal.hide();
    },
    validate() {
      return !this.$v.form.$invalid;
    },
    save() {
      if (this.processing) return;

      if (this.validate()) {
        let id_produtor = "",
          CodPeca = "",
          NomPeca = "",
          CodTipPeca = "",
          TemDurPeca = "",
          CenPeca = "",
          id_local_evento = "",
          ValIngresso = "",
          description = "",
          meta_description = "",
          meta_keyword = "",
          opening_time = "",
          insurance_policy = "",
          showInBanner = "",
          bannerDescription = "",
          QtIngrPorPedido = "",
          in_obriga_cpf = "",
          qt_ingressos_por_cpf = "",
          ticketoffice_askemail = "",
          id_base = "",
          imagechanged = false,
          showonline = "",
          imagebase64 = "",
          free_installments = "",
          max_installments = "",
          ticketoffice_ticketmodel = "",
          interest_rate = "";

        id_base = this.form.id_base;
        showonline = this.form.showonline;
        id_produtor = this.form.id_produtor;
        CodPeca = this.form.CodPeca;
        NomPeca = this.form.NomPeca;
        CodTipPeca = this.form.id_genre;
        TemDurPeca = this.form.TemDurPeca;
        CenPeca = this.form.CenPeca;
        id_local_evento = this.form.id_local_evento;
        ValIngresso = this.form.ValIngresso;
        description = this.form.description;
        meta_description = this.form.meta_description;
        meta_keyword = this.form.meta_keyword;
        opening_time = this.form.opening_time;
        insurance_policy = this.form.insurance_policy;
        showInBanner = this.form.showInBanner;
        bannerDescription = this.form.bannerDescription;
        QtIngrPorPedido = this.form.QtIngrPorPedido;
        in_obriga_cpf = this.form.in_obriga_cpf;
        ticketoffice_askemail = this.form.ticketoffice_askemail;
        ticketoffice_ticketmodel = this.form.ticketoffice_ticketmodel;
        qt_ingressos_por_cpf = this.form.qt_ingressos_por_cpf;

        imagechanged = this.form.saveimage;
        imagebase64 = this.form.image;

        free_installments = this.form.free_installments;
        max_installments = this.form.max_installments;
        interest_rate = this.formatInterestRate(this.form.interest_rate);

        eventService.save(this.getLoggedId(), id_base, id_produtor, CodPeca, NomPeca, CodTipPeca, TemDurPeca, CenPeca, id_local_evento, ValIngresso, description, meta_description, meta_keyword, opening_time, insurance_policy, showInBanner, bannerDescription, QtIngrPorPedido, in_obriga_cpf, qt_ingressos_por_cpf, ticketoffice_askemail, imagechanged, imagebase64, free_installments, max_installments, interest_rate, ticketoffice_ticketmodel, showonline).then(

          response => {
            this.processing = false;
            this.hideWaitAboveAll();
            this.$wait.end("inprocessSave");

            if (response.success) {
              this.toastSuccess("Salvo com sucesso");
            } else {
              this.toastError(response.msg);
            }
          },
          error => {
            this.grids.event.processing = false;
            this.processing = false;
            this.hideWaitAboveAll();
            this.$wait.end("inprocessSave");
            this.toastError("Falha na execução.");
          }
        );
      } else {
        this.toastError("Preencha os campos obrigatórios.");
      }
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
      let index = this.selects.place.map(function (e) {
        return e.id_local_evento;
      }).indexOf(item);
      if (index != -1) {
        this.form.ds_googlemaps = this.selects.place[index].ds_googlemaps;
      }

    },
    populateImage() {
      Vue.nextTick().then(response => {
        this.$wait.start("inprocess");
        this.showWaitAboveAll();
        eventService.base64(this.id, "ori").then(
          response => {
            this.hideWaitAboveAll();
            this.$wait.end("inprocess");

            if (this.validateJSON(response)) {
              this.form.imgbase64 = response.code;
              this.imageobj();
            }
          },
          error => {
            this.hideWaitAboveAll();
            this.$wait.end("inprocess");
            this.toastError("Falha na execução.");
          }
        );
      });
    },
    imageobj() {
      Vue.nextTick().then(response => {
        let obj = {
          default: 1
          ,highlight: 1
          ,name: "default.jpg"
          ,path: this.form.imgbase64
        }
        this.form.images.push(obj);
        this.idupload++;
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
    populateGenre() {
      this.showWaitAboveAll();
      genreService.select().then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.genre = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );
    },
    populateBases() {
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
    populateProducer() {
      this.showWaitAboveAll();
      producerService.select(this.getLoggedId()).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            this.selects.producer = response;
            this.checkproducer();
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
  },
  validations: {
    form: {
      NomPeca: {
        required,
        minLength: minLength(5)
      },
      description: {
        required,
        minLength: minLength(15)
      },
      id_base: {
        required
      },
      id_genre: {
        required
      },
      id_produtor: {
        required
      },
      id_estado: {
        required
      },
      id_municipio: {
        required
      },
      id_local_evento: {
        required
      },
      TemDurPeca: {
        required
      },
      CenPeca: {
        required
      },
      ticketoffice_ticketmodel: {
        required
      },
      QtIngrPorPedido: {
        required
      },
      qt_ingressos_por_cpf: {
        required
      },

    }
  },
  filters: {
      showValue: function (value, value2) {
          if (value != '' && value != null) {
            let max = (parseFloat(value)/100).toFixed(2);
            let min = (parseFloat(value2)/100).toFixed(2);
            if (max!=min) {
              return "R$ " + min + " a " + max;
            }
            else {
              return "R$ " + max;
            }
          }
          return " - ";
          //return value == '' || value == null ? "Sim" : "Não";
      },
      money: function (value) {
          //let v = parseFloat(value)/100;
          return `R$ ${parseFloat(value).toFixed(2)}`;
      }
  },
  data() {
    return {
      processing: false,
      loading: false,
      idupload: 1,
      components: {
        quillOptions: {
          modules: {
            toolbar: [
              [{
                header: [1, 2, false]
              }], , ['bold', 'italic', 'underline', 'image'],
              [{
                'color': []
              }, {
                'background': []
              }],
              [{
                'align': []
              }],
              ['clean']
            ]
          },
          scrollingContainer: '#scrolling-container',
          placeholder: 'Descrição do evento',
          theme: 'snow'
        },
        picOptions: {
          dragText: "Arrastar imagem",
          browseText: "Selecione",
          primaryText: "Padrão",
          markIsPrimaryText: "Definir como padrão",
          popupText: "Esta imagem será exibida como padrão",
          dropText: "Solte aqui",
        },
        money: {
            decimal: '.',
            thousands: '',
            //prefix: 'R$ ',
            //suffix: ' #',
            precision: 2,
            masked: false /* doesn't work with directive */
        },
      },
      popups: {
        gmaps: {
          loaded: false,
          name: '',
        },
        image: {
          loaded: false,
          name: '',
          url: '',
        }
      },
      checkbox: {
        options: [
          {
            text: "Vender Web",
            value: "showonline"
          },
          {
            text: "Mostrar no banner",
            value: "showInBanner"
          },
          {
            text: "Obrigar CPF e Nome na compra da bilheteria",
            value: "in_obriga_cpf"
          },
          {
            text: "Perguntar para enviar o bilhete por email na compra da bilheteria",
            value: "ticketoffice_askemail"
          },
        ]
      },
      selects: {
        city: [],
        state: [],
        place: [],
        genre: [],
        ticketmodels: [{ value: "model001", text: "Modelo 1" }, { value: "model002", text: "Modelo 2 - Ingresso TicketOffice" }],
        producer: [],
        base: [],
        free_installments: [{
            value: null,
            text: 'Escolher número de parcelas'
          },
          {
            value: '1',
            text: '1 parcela à vista'
          },
          {
            value: '2',
            text: '2 parcelas'
          },
          {
            value: '3',
            text: '3 parcelas'
          },
          {
            value: '4',
            text: '4 parcelas'
          },
          {
            value: '5',
            text: '5 parcelas'
          },
          {
            value: '6',
            text: '6 parcelas'
          },
          {
            value: '7',
            text: '7 parcelas'
          },
          {
            value: '8',
            text: '8 parcelas'
          },
          {
            value: '9',
            text: '9 parcelas'
          },
          {
            value: '10',
            text: '10 parcelas'
          },
          {
            value: '11',
            text: '11 parcelas'
          },
          {
            value: '12',
            text: '12 parcelas'
          },
        ],
        max_installments: [{
            value: null,
            text: 'Escolher número de parcelas'
          },
          {
            value: '1',
            text: '1 parcela'
          },
          {
            value: '2',
            text: '2 parcelas'
          },
          {
            value: '3',
            text: '3 parcelas'
          },
          {
            value: '4',
            text: '4 parcelas'
          },
          {
            value: '5',
            text: '5 parcelas'
          },
          {
            value: '6',
            text: '6 parcelas'
          },
          {
            value: '7',
            text: '7 parcelas'
          },
          {
            value: '8',
            text: '8 parcelas'
          },
          {
            value: '9',
            text: '9 parcelas'
          },
          {
            value: '10',
            text: '10 parcelas'
          },
          {
            value: '11',
            text: '11 parcelas'
          },
          {
            value: '12',
            text: '12 parcelas'
          },
        ]
      },
      form: {
        workaround: 0,
        imgbase64: '',
        images: [],
        image: '',
        imageURICard: '',
        imageURIBanner: '',
        imageOriginalURI: '',
        saveimage: false,

        produceralert: false,
        loaded: false,
        id: '',
        id_estado: '',
        id_municipio: '',
        ds_googlemaps: '',
        CodPeca: '',
        id_produtor: '',
        amountMax: '',
        amountMin: '',
        id_base: '',
        NomPeca: '',
        CodTipPeca: '',
        id_genre: '',
        TemDurPeca: '',
        CenPeca: '',
        id_local_evento: '',
        ValIngresso: '',
        description: '',
        meta_description: '',
        meta_keyword: '',
        showInBanner: '',
        showonline: '',
        bannerDescription: '',
        opening_time: '',
        insurance_policy: '',
        QtIngrPorPedido: '4',
        qt_ingressos_por_cpf: '4',
        in_obriga_cpf: '',
        ticketoffice_askemail: '',
        ticketoffice_ticketmodel: '',
        DatIniPeca: '',
        DatFinPeca: '',
        hasPresentantion: '',

        free_installments: null,
        max_installments: null,
        interest_rate: 0,
      }
    }
  }
}
</script>
<style lang="scss">
.checkboxGroup {
    background-color: #fff;
    display: block;
    margin: 2px 0;
    position: relative;

    label {
      padding: 2px 5px;
      width: 100%;
      display: block;
      text-align: left;
      color: #3C454C;
      cursor: pointer;
      position: relative;
      z-index: 2;
      transition: color 200ms ease-in;
      overflow: hidden;

      &:before {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        content: '';
        background-color: #2b1dc3;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale3d(1, 1, 1);
        transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
        opacity: 0;
        z-index: -1;
      }

      &:after {
        width: 32px;
        height: 32px;
        content: '';
        border: 2px solid #D1D7DC;
        background-color: #fff;
        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.414 11L4 12.414l5.414 5.414L20.828 6.414 19.414 5l-10 10z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E ");
        background-repeat: no-repeat;
        background-position: 2px 3px;
        border-radius: 50%;
        z-index: 2;
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        transition: all 200ms ease-in;
      }
    }

    input:checked ~ label {
      color: #fff;

      &:before {
        transform: translate(-50%, -50%) scale3d(56, 56, 1);
        opacity: 1;
      }

      &:after {
        background-color: #28a745;
        border-color: #28a745;
      }
    }

    input {
      width: 32px;
      height: 32px;
      order: 1;
      z-index: 2;
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      visibility: hidden;
    }
  }


// codepen formatting
.checkboxs {
  padding: 0 16px;
  max-width: 600px;
  margin: 15px auto;
  line-height: 36px;
}

html {
  box-sizing: border-box;
}

code {
  background-color: #9AA3AC;
  padding: 0 8px;
}

</style>

<style>
.datepicker--open {
  z-index: 5000;
  position: fixed !important;
  left: 50% !important;
  margin-left: -286px !important;
  top: 200px !important;
}
</style>
<style scoped>
.imgthumb {
  margin: 0 auto;
  text-align: center;
  width: 25%;
  height: 50%;
  cursor: pointer;
}

#quill-container {
  height: auto;
  min-height: 100%;
  padding: 50px;
}

#quill-container .ql-editor {
  font-size: 18px;
  overflow-y: visible;
}

/* Specify our own scrolling container */
#scrolling-container {
  height: 100%;
  min-height: 100%;
  overflow-y: auto;
}

.errorFormValidate {
  margin-top: 5px !important;
  margin-bottom: -10px;
}

.errorFormValidateHack {
  margin-top: -100px !important;
}

.errorFormValidateHack2 {
  padding-left: 12px;
}
</style>
