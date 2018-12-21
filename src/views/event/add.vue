<template>
    <div>
      <b-container>
        <b-modal ref="gmapsModal" hide-footer title="Google Maps">
          <div class="d-block text-center">
            <h4>Maps para o endereço: {{popups.gmaps.name}}</h4>
          </div>
          <iframe v-if="this.form.ds_googlemaps.length>0" :src="googlemapsURI" height="200" width="300"></iframe>
          <b-btn class="mt-3" variant="outline-info" block @click="gmapsClose">Fechar</b-btn>
        </b-modal>
        <b-modal ref="imageModal" hide-footer title="Image">
          <div class="d-block text-center">
            <h4>Imagem {{popups.image.name}}</h4>
          </div>
          <img v-if="popups.image.url!=''" :src="popups.image.url" />
          <b-btn class="mt-3" variant="outline-info" block @click="imageClose">Fechar</b-btn>
        </b-modal>
        <b-row>
          <b-col>
              <b-row v-if="form.imageURI!='' || !form.changedImage">
                <img v-on:click="imageClick" :src="form.imageURI" alt="" title="Clique em cima para trocar a imagem." class="imgthumb" />
              </b-row>
              <b-row v-if="form.imageURI=='' || form.changedImage">
                <picture-input
                  ref="pictureInput" 
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
              <b-row class="mx-auto" style="width: 295px;">
                <b-button-group class="mb-3">
                  <b-button size="sm" @click="showImage('original', form.imageOriginalURI)" v-if="form.imageOriginalURI != ''" variant="outline-info" v-b-tooltip.hover title="Clique para ver a imagem original.">Original</b-button>
                  <b-button size="sm" @click="showImage('card', form.imageURI)" v-if="form.imageURI != ''" variant="outline-success" v-b-tooltip.hover title="Clique para ver a imagem do tipo card.">Card</b-button>
                  <b-button size="sm" @click="showImage('big', form.imageBigURI)" v-if="form.imageBigURI != ''" variant="outline-warning" v-b-tooltip.hover title="Clique para ver a imagem do tipo banner.">Banner</b-button>
                </b-button-group>
              </b-row>
              <b-row>
                <b-input-group size="sm">
                    <b-input-group-prepend is-text class="firstLabel">
                        Nome:
                    </b-input-group-prepend>
                    <b-form-input id="name"
                                type="text" 
                                class="mb-3"
                                name="name"
                                maxlength="90"
                                v-model="form.NomPeca"
                                placeholder="Digite o nome">
                    </b-form-input>
                </b-input-group>
              </b-row>
              <b-row>
               <b-col cols="6" class="ml-0 pl-0">
                <b-row>
                  <div class="col-12">
                    <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Descrição:
                      </b-input-group-prepend>
                      <div class="col-12 m-0 p-0" style="height:200px; margin-bottom:50px;margin-left: 0px;">
                        <quill-editor v-model="form.description"
                            
                            ref="editor"
                            :options="components.quillOptions">
                        </quill-editor>
                      </div>
                    </b-input-group>
                  </div>
                </b-row>
               </b-col>
               <b-col cols="6" class="ml-0 pl-0">
                <b-row>
                  <div class="col-12">
                    <b-input-group size="sm">
                        <b-input-group-prepend is-text class="firstLabel">
                            Descrição Banner:
                        </b-input-group-prepend>
                        <div class="col-12 m-0 p-0" style="height:200px; margin-bottom:50px;margin-left: 0px;">
                          <quill-editor v-model="form.bannerDescription"
                              :disabled="this.form.showInBanner!=1 && this.form.showInBanner!='1'"
                              ref="editor"
                              :options="components.quillOptions">
                          </quill-editor>
                        </div>
                    </b-input-group>
                  </div>
                </b-row>
               </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-row>
                    <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel" v-b-tooltip.hover title="A data é modificada conforme é cadastrado novos datas para o evento.">
                          Data do evento:
                      </b-input-group-prepend>
                      <b-input-group-prepend  class="mb-3" is-text v-if="form.hasPresentantion == 0 || isAdd">
                          Nenhuma data cadastrada
                      </b-input-group-prepend>
                      <b-input-group-prepend class="mb-3" is-text v-if="form.hasPresentantion == 1 && !isAdd">
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
                      <b-input-group-prepend is-text class="firstLabel" v-b-tooltip.hover title="O valor é modificada conforme é cadastrado novos valores.">
                          Valor do Ingresso:
                      </b-input-group-prepend>
                      <b-input-group-prepend  class="mb-3" is-text v-if="form.hasPresentantion == 0 || isAdd">
                          Nenhuma data cadastrada
                      </b-input-group-prepend>
                      <b-input-group-prepend class="mb-3" is-text v-if="form.hasPresentantion == 1 && !isAdd">
                          {{form.ValIngresso}}
                      </b-input-group-prepend>
                    </b-input-group>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text class="firstLabel">
                      Base:
                  </b-input-group-prepend>
                  <b-form-select v-model="form.id_base" :options="selects.base" class="mb-3" size="sm" />
                </b-input-group>
              </b-row>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text class="firstLabel">
                      Gênero:
                  </b-input-group-prepend>
                  <b-form-select v-model="form.id_genre" :options="selects.genre" class="mb-3" size="sm" />
                </b-input-group>
              </b-row>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text class="firstLabel">
                      Produtor:
                  </b-input-group-prepend>
                  <b-form-select v-model="form.id_produtor" :options="selects.producer" class="mb-3" size="sm" />
                </b-input-group>
              </b-row>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text class="firstLabel">
                      Estado:
                  </b-input-group-prepend>
                  <b-form-select v-on:change="selState" v-model="form.id_estado" :options="selects.state" class="mb-3" size="sm" />
                </b-input-group>
              </b-row>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text class="firstLabel">
                      Cidade:
                  </b-input-group-prepend>
                  <b-form-select v-on:change="selCity" v-model="form.id_municipio" :options="selects.city" class="mb-3" size="sm" />
                </b-input-group>
              </b-row>
              <b-row>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text class="firstLabel">
                      Local:
                  </b-input-group-prepend>
                  <b-form-select v-on:change="selPlace" v-model="form.id_local_evento" :options="selects.place" class="mb-3" size="sm" />
                  <b-button :disabled="form.id_local_evento=='' || form.id_local_evento == 0" type="button" variant="outline-info" size="sm"  class="mb-3" @click="openMaps">
                    <span>Ver no Google Maps</span>
                  </b-button>
                </b-input-group>
              </b-row>
              <b-row>
                <b-col>
                  <b-row>
                    <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Duração:
                      </b-input-group-prepend>
                      <b-form-input id="TemDurPeca"
                                  type="text"
                                  class="mb-3"
                                  name="TemDurPeca"
                                  v-mask="'###'"
                                  maxlength="3"
                                  v-model="form.TemDurPeca"
                                  placeholder="Digite a duração do evento">
                      </b-form-input>
                      <b-input-group-prepend is-text>
                          min
                      </b-input-group-prepend>
                    </b-input-group>
                  </b-row>
                </b-col>
                <b-col>
                  <b-row>
                    <b-input-group size="sm" style="padding-left:10px;">
                      <b-input-group-prepend is-text class="firstLabel">
                          Censura:
                      </b-input-group-prepend>
                      <b-form-input id="CenPeca"
                                  type="text"
                                  class="mb-3"
                                  name="CenPeca"
                                  v-mask="'##'"
                                  maxlength="3"
                                  v-model="form.CenPeca"
                                  placeholder="Digite a censura">
                      </b-form-input>
                      <b-input-group-prepend is-text>
                          anos
                      </b-input-group-prepend>
                    </b-input-group>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-row>
                    <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Abertura:
                      </b-input-group-prepend>
                      <b-form-input id="opening_time"
                                  type="text"
                                  class="mb-3"
                                  name="opening_time"
                                  maxlength="50"
                                  v-model="form.opening_time"
                                  placeholder="Digite informação de abertura do evento">
                      </b-form-input>
                    </b-input-group>
                  </b-row>
                </b-col>
                <b-col>
                  <b-row>
                    <b-input-group size="sm" style="padding-left:10px;">
                      <b-input-group-prepend is-text class="firstLabel">
                          Apólice de seguro:
                      </b-input-group-prepend>
                      <b-form-input id="insurance_policy"
                                  type="text"
                                  class="mb-3"
                                  name="insurance_policy"
                                  maxlength="50"
                                  v-model="form.insurance_policy"
                                  placeholder="Digite a apólice de seguro">
                      </b-form-input>
                    </b-input-group>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-row>
                    <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Qta. máxima de ingressos por pedido na venda:
                      </b-input-group-prepend>
                      <b-form-input id="QtIngrPorPedido"
                                  type="text"
                                  class="mb-3"
                                  name="QtIngrPorPedido"
                                  v-mask="'###'"
                                  maxlength="3"
                                  v-model="form.QtIngrPorPedido"
                                  placeholder="Digite a quantidade máxima de ingressos por pedido na venda">
                      </b-form-input>
                    </b-input-group>
                  </b-row>
                </b-col>
                <b-col>
                  <b-row>
                    <b-input-group size="sm" style="padding-left:10px;">
                      <b-input-group-prepend is-text class="firstLabel">
                          Qta. máxima de ingressos por cpf na venda:
                      </b-input-group-prepend>
                      <b-form-input id="qt_ingressos_por_cpf"
                                  type="text"
                                  class="mb-3"
                                  name="qt_ingressos_por_cpf"
                                  v-mask="'###'"
                                  maxlength="3"
                                  v-model="form.qt_ingressos_por_cpf"
                                  placeholder="Digite a quantidade máxima de ingressos por cpf na venda">
                      </b-form-input>
                    </b-input-group>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-row>
                    <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Meta - Descrição:
                      </b-input-group-prepend>
                      <b-form-input id="meta_description"
                                  type="text"
                                  class="mb-3"
                                  name="meta_description"
                                  maxlength="300"
                                  v-model="form.meta_description"
                                  placeholder="Digite descrição para o meta da página">
                      </b-form-input>
                    </b-input-group>
                  </b-row>
                </b-col>
                <b-col>
                  <b-row>
                    <b-input-group size="sm" style="padding-left:10px;">
                      <b-input-group-prepend is-text class="firstLabel">
                          Meta - Keywords:
                      </b-input-group-prepend>
                      <b-form-input id="meta_keyword"
                                  type="text"
                                  class="mb-3"
                                  name="meta_keyword"
                                  maxlength="300"
                                  v-model="form.meta_keyword"
                                  placeholder="Digite o keyword para o meta da página">
                      </b-form-input>
                    </b-input-group>
                  </b-row>
                </b-col>
              </b-row>
              <b-row class="mx-auto" style="width: 556px;">
                <b-form-group label="">
                  <b-form-checkbox-group v-model="checkboxs"
                                        buttons
                                        button-variant="outline-primary"
                                        size="sm"
                                        name="checkboxs"
                                        :options="checkbox.options">
                  </b-form-checkbox-group>
                </b-form-group>
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
import VueQuillEditor from 'vue-quill-editor';
import PictureInput from 'vue-picture-input';
import VueMask from 'v-mask';
import config from "@/config";
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { genreService } from '../../components/common/services/genre';
import { cityService } from '../../components/common/services/city';
import { stateService } from '../../components/common/services/state';
import { placeService } from '../../components/common/services/place';
import { producerService } from '../../components/common/services/producer';
import { eventService } from '../../components/common/services/event';

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueHead);
Vue.use(VueQuillEditor);
Vue.use(VueMask);

export default {
  mixins: [func],
  components: {
    PictureInput
  },
  props: ['id','base'],
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
  created() {
    this.populateState();
    this.populateGenre();
    this.populateProducer();
    this.populateBases();
    if (!this.isAdd) {
      this.get();
    }
  },
  computed: {
    checkboxs: {
      get: function () {
        let ret = [];
        if (this.form.showInBanner == '1' || this.form.showInBanner == 1) {
          ret.push("showInBanner");
        } 
        if (this.form.in_obriga_cpf == '1' || this.form.in_obriga_cpf == 1) {
          ret.push("in_obriga_cpf");
        } 
        return ret;
      },
      set: function (newValue) {
        let index_showInBanner = newValue.map(function(e) { return e; }).indexOf("showInBanner");
        let index_in_obriga_cpf = newValue.map(function(e) { return e; }).indexOf("in_obriga_cpf");
        this.form.showInBanner = index_showInBanner == -1 ? '' : '1';
        this.form.in_obriga_cpf = index_in_obriga_cpf == -1 ? '' : '1';
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
    checkproducer() {
        let index = this.selects.producer.map(function(e) { return e.id_produtor; }).indexOf(this.form.id_produtor);
        if (index == -1) {
          this.$swal({
              type: 'error',
              text: "Atenção existe uma incompatibilidade de permissão entre você e o produtor, não é possível visualizar o produtor que está cadastrado para o evento.",
              showConfirmButton: true,
          }).then((result) => {
          });
        }
    },
    showImage(type, url) {
      switch (type) {
        case "big":
          this.popups.image.name = "Banner";
        break;
        case "original":
          this.popups.image.name = "Original";
        break;
        case "card":
          this.popups.image.name = "Card";
        break;
      }
      this.popups.image.url = url;
      this.$refs.imageModal.show();
    },
    imageClick() {
      this.form.hasImage = false;
    },
    get() {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      eventService.get(this.getLoggedId(), this.id, this.base).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = this.validateJSONisNotEmpty(response);
              if (this.form.loaded) {
                this.form.CodPeca = response.CodPeca;
                this.form.id_produtor = response.id_produtor;
                this.form.id_base = response.id_base;
                this.form.NomPeca = response.NomPeca;
                this.form.CodTipPeca = response.CodTipPeca;
                this.form.id_genre = response.id_genre;
                this.form.TemDurPeca = response.TemDurPeca;
                this.form.CenPeca = response.CenPeca;
                this.form.id_local_evento = response.id_local_evento;
                this.form.id_municipio = response.id_municipio;
                this.form.id_estado = response.id_estado;
                this.form.ValIngresso = response.ValIngresso;
                this.form.description = response.description;
                this.form.meta_description = response.meta_description;
                this.form.meta_keyword = response.meta_keyword;
                this.form.showInBanner = response.showInBanner;
                this.form.bannerDescription = response.bannerDescription;
                this.form.opening_time = response.opening_time;
                this.form.insurance_policy = response.insurance_policy;
                this.form.QtIngrPorPedido = response.QtIngrPorPedido;
                this.form.qt_ingressos_por_cpf = response.qt_ingressos_por_cpf;
                this.form.in_obriga_cpf = response.in_obriga_cpf;
                this.form.DatIniPeca = response.DatIniPeca;
                this.form.DatFinPeca = response.DatFinPeca;
                this.form.hasPresentantion = response.hasPresentantion;
                this.form.imageOriginalURI = response.imageOriginalURI;
                this.form.imageBigURI = response.imageBigURI;
                this.form.imageURI = response.imageURI;
                this.checkproducer();
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
    },
    onChange (image) {
        if (image) {
            this.form.image = image;
            this.form.changedImage = true;
        }
    },
    openMaps() {
      this.popups.gmaps.name = this.form.ds_local_evento;
      this.$refs.gmapsModal.show();
    },
    gmapsClose() {
      this.$refs.gmapsModal.hide();
    },
    imageClose() {
      this.popups.url = '';
      this.$refs.imageModal.hide();
    },
    validate() {

    },
    save() {

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
      let index = this.selects.place.map(function(e) { return e.id_local_evento; }).indexOf(item);
      if (index!=-1) {
        this.form.ds_googlemaps = this.selects.place[index].ds_googlemaps;
      }
      
    },
    populatePlace() {
      this.showWaitAboveAll();
      placeService.select(this.form.id_municipio).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
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

          if (this.validateJSON(response))
          {
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

          if (this.validateJSON(response))
          {
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

          if (this.validateJSON(response))
          {
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

          if (this.validateJSON(response))
          {
            this.selects.producer = response;
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

          if (this.validateJSON(response))
          {
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
  data () {
    return {
        processing: false,
        loading: false,
        components: {
          quillOptions: {
              modules: {
              toolbar: [ [{ header: [1, 2, false] }],
                          ,['bold', 'italic', 'underline']
                          ,[{ 'color': [] }, { 'background': [] }]
                          ,[{ 'align': [] }]
                          ,['clean']
                        ]
              },
              scrollingContainer: '#scrolling-container', 
              placeholder: 'Descrição do evento',
              theme: 'snow'
          },
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
            { text: "Mostrar no banner", value:"showInBanner" },
            { text: "Obrigar CPF e Nome na compra da bilheteria", value:"in_obriga_cpf" },
          ]
        },
        selects: {
          city: [],
          state: [],
          place: [],
          genre: [],
          producer: [],
          base: [],
        },
        form: {
          loaded: false,
          id: '',
          id_estado: '',
          id_municipio: '',
          ds_googlemaps: '',
          hasImage: true,
          changedImage: false,
          imageBase64: "",

          CodPeca: '',
          id_produtor: '',
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
          bannerDescription: '',
          opening_time: '',
          insurance_policy: '',
          QtIngrPorPedido: '4',
          qt_ingressos_por_cpf: '4',
          in_obriga_cpf: '',
          DatIniPeca: '',
          DatFinPeca: '',
          hasPresentantion: '',
          imageOriginalURI: '',
          imageBigURI: '',
          imageURI: '',
        }
    }
  }
}
</script>

<style>
.imgthumb {
  margin: 0 auto;
  text-align: center;
  width: 15%;
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

.modal-dialog {
  width: fit-content;
  max-width: 90vw;
}
</style>
