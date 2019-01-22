<template>
    <div v-if="mayIsee">
      <b-modal ref="presentationModal" class="mymodal" hide-footer title="Apresentação">
        <dateadd :key="id" ref="dateadd" v-bind:id="id" v-bind:id_base="base"></dateadd>
        <b-btn class="mt-3" variant="outline-info" block @click="presentationClose">Fechar</b-btn>
      </b-modal>

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
              <b-row class="mx-auto mb-3" style="width: 403px;" v-if="form.imageURI!=''">
                <b-button-group>
                  <b-button size="sm" @click="showImage('original', form.imageOriginalURI)" v-if="form.imageOriginalURI != '' && !form.changedImage" variant="outline-info" v-b-tooltip.hover title="Clique para ver a imagem original.">Original</b-button>
                  <b-button size="sm" @click="showImage('card', form.imageURI)" v-if="form.imageURI != '' && !form.changedImage" variant="outline-success" v-b-tooltip.hover title="Clique para ver a imagem do tipo card.">Card</b-button>
                  <b-button size="sm" @click="showImage('big', form.imageBigURI)" v-if="form.imageBigURI != '' && !form.changedImage" variant="outline-warning" v-b-tooltip.hover title="Clique para ver a imagem do tipo banner.">Banner</b-button>
                  <b-button size="sm" @click="imageClick" variant="outline-danger" v-b-tooltip.hover title="Clique para abrir a opção de alterar a imagem.">Alterar a imagem</b-button>
                </b-button-group>
              </b-row>
              <b-row class="mb-3">
                <b-input-group size="sm">
                    <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.NomPeca.$invalid) }">
                        Nome:
                    </b-input-group-prepend>
                    <b-form-input id="name"
                                type="text" 
                                v-bind:class="{ errorFormValidateInput: ($v.form.NomPeca.$invalid) }"
                                name="name"
                                maxlength="90"
                                v-model="form.NomPeca"
                                placeholder="Digite o nome">
                    </b-form-input>
                </b-input-group>
                <div class="errorFormValidate" v-if="!$v.form.NomPeca.required">Campo é obrigatório</div>
                <div class="errorFormValidate" v-if="!$v.form.NomPeca.minLength">Deve ter pelo menos {{$v.form.NomPeca.$params.minLength.min}} caracteres.</div>
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
                        <quill-editor v-model="form.description"
                            ref="editor"
                            v-bind:class="{ errorFormValidateInput: ($v.form.description.$invalid) }"
                            :options="components.quillOptions">
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
                          {{form.ValIngresso}}
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
                  <b-button :disabled="form.id_local_evento=='' || form.id_local_evento == 0" type="button" variant="outline-info" size="sm"  @click="openMaps">
                    <span>Ver no Google Maps</span>
                  </b-button>
                </b-input-group>
                <div class="errorFormValidate" v-if="!$v.form.id_local_evento.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                <b-col>
                  <b-row>
                    <b-input-group size="sm">
                      <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.TemDurPeca.$invalid) }">
                          Duração:
                      </b-input-group-prepend>
                      <b-form-input id="TemDurPeca"
                                  type="text"
                                  name="TemDurPeca"
                                  v-mask="'###'"
                                  maxlength="3"
                                  v-model="form.TemDurPeca"
                                  v-bind:class="{ errorFormValidateInput: ($v.form.TemDurPeca.$invalid) }"
                                  placeholder="Digite a duração do evento">
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
                      <b-form-input id="CenPeca"
                                  type="text"
                                  name="CenPeca"
                                  v-mask="'##'"
                                  maxlength="3"
                                  v-model="form.CenPeca"
                                  v-bind:class="{ errorFormValidateInput: ($v.form.CenPeca.$invalid) }"
                                  placeholder="Digite a censura">
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
                      <b-form-input id="opening_time"
                                  type="text"
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
                      <b-input-group-prepend is-text>
                          Apólice de seguro:
                      </b-input-group-prepend>
                      <b-form-input id="insurance_policy"
                                  type="text"
                                  name="insurance_policy"
                                  maxlength="50"
                                  v-model="form.insurance_policy"
                                  placeholder="Digite a apólice de seguro">
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
                      <b-form-input id="QtIngrPorPedido"
                                  type="text"
                                  name="QtIngrPorPedido"
                                  v-mask="'###'"
                                  maxlength="3"
                                  v-model="form.QtIngrPorPedido"
                                  v-bind:class="{ errorFormValidateInput: ($v.form.QtIngrPorPedido.$invalid) }"
                                  placeholder="Digite a quantidade máxima de ingressos por pedido na venda">
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
                      <b-form-input id="qt_ingressos_por_cpf"
                                  type="text"
                                  name="qt_ingressos_por_cpf"
                                  v-mask="'###'"
                                  maxlength="3"
                                  v-model="form.qt_ingressos_por_cpf"
                                  v-bind:class="{ errorFormValidateInput: ($v.form.qt_ingressos_por_cpf.$invalid) }"
                                  placeholder="Digite a quantidade máxima de ingressos por cpf na venda">
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
                          Meta - Descrição:
                      </b-input-group-prepend>
                      <b-form-input id="meta_description"
                                  type="text"
                                
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
                      <b-input-group-prepend is-text>
                          Meta - Keywords:
                      </b-input-group-prepend>
                      <b-form-input id="meta_keyword"
                                  type="text"
                                
                                  name="meta_keyword"
                                  maxlength="300"
                                  v-model="form.meta_keyword"
                                  placeholder="Digite o keyword para o meta da página">
                      </b-form-input>
                    </b-input-group>
                  </b-row>
                </b-col>
              </b-row>
              <b-row class="mx-auto mb-3" style="width: 556px;">
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
                <b-button :disabled="id == 0 || id == null || id == undefined" type="button" variant="info" size="sm"  @click="addPresentation">
                  <span>Ver datas</span>
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
import Vuelidate from 'vuelidate';

import dateadd from '../presentation/add';

import config from "@/config";
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { genreService } from '../../components/common/services/genre';
import { cityService } from '../../components/common/services/city';
import { stateService } from '../../components/common/services/state';
import { placeService } from '../../components/common/services/place';
import { producerService } from '../../components/common/services/producer';
import { eventService } from '../../components/common/services/event';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { required, minLength } from 'vuelidate/lib/validators';

Vue.use(VueHead);
Vue.use(VueQuillEditor);
Vue.use(VueMask);
Vue.use(Vuelidate);

export default {
  mixins: [func],
  components: {
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
  
  },
  computed: {
 
  },
  methods: {
    
  },
  validations: {
   
  },
  data () {
    return {
       
    }
  }
}
</script>

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
.modal-dialog {
  width: fit-content;
  max-width: 740px !important;
  width: 740px !important
}
</style>
