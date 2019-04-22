<template>
    <div>
      <b-container>
        <b-row>
          <b-col>
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
                      <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: ($v.form.nameWeb.$invalid) }">
                          Nome - WEB:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  v-bind:class="{ errorFormValidateInput: ($v.form.nameWeb.$invalid) }"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.nameWeb"
                                  placeholder="Digite o nome para web">
                      </b-form-input>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="!$v.form.nameWeb.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: ($v.form.nameTicketOffice.$invalid) }">
                          Nome - Bilheteria:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  v-bind:class="{ errorFormValidateInput: ($v.form.nameTicketOffice.$invalid) }"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.nameTicketOffice"
                                  placeholder="Digite o nome para bilheteria">
                      </b-form-input>
                  </b-input-group>
                  <div class="errorFormValidate" v-if="!$v.form.nameTicketOffice.required">Campo é obrigatório</div>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Descrição:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.description"
                                  placeholder="Digite uma descrição do bilhete">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Dia da semana:
                      </b-input-group-prepend>
                  <div class="weekDays-selector mx-0 centerforme" style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;">
                    <input type="checkbox" id="weekday-sun" v-model="form.in_dom" class="weekday" />
                    <label for="weekday-sun">DOM</label>
                    <input type="checkbox" id="weekday-mon" v-model="form.in_seg" class="weekday" />
                    <label for="weekday-mon">SEG</label>
                    <input type="checkbox" id="weekday-tue" v-model="form.in_ter" class="weekday" />
                    <label for="weekday-tue">TER</label>
                    <input type="checkbox" id="weekday-wed" v-model="form.in_qua" class="weekday" />
                    <label for="weekday-wed">QUA</label>
                    <input type="checkbox" id="weekday-thu" v-model="form.in_qui" class="weekday" />
                    <label for="weekday-thu">QUI</label>
                    <input type="checkbox" id="weekday-fri" v-model="form.in_sex" class="weekday" />
                    <label for="weekday-fri">SEX</label>
                    <input type="checkbox" id="weekday-sat" v-model="form.in_sab" class="weekday" />
                    <label for="weekday-sat">SAB</label>
                  </div>
                </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <toggle-button :sync="true" v-model="form.allowweb" :width="150" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Mostrar na Web', unchecked: 'Não monstrar na Web' }"/>
                  <toggle-button :sync="true" v-model="form.allowticketoffice" :width="180" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Mostrar na Bilheteria', unchecked: 'Não monstrar na Bilheteria' }"/>
              </b-row>
              <b-row class="mb-3">
                  <toggle-button :sync="true" @change="changed" name="isPrincipal" v-model="form.isPrincipal" :width="110" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Inteira', unchecked: 'É inteira?' }"/>
                  <toggle-button :sync="true" @change="changed" name="isDiscount" v-model="form.isDiscount" :width="120" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Desconto', unchecked: 'É com desconto?' }"/>
                  <toggle-button :sync="true" @change="changed" name="isHalf" v-model="form.isHalf" :width="110" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Meia', unchecked: 'É meia entrada?' }"/>
                  <toggle-button :sync="true" @change="changed" name="isFixed" v-model="form.isFixed" :width="110" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Fixo', unchecked: 'É valor fixo?' }"/>
                  <toggle-button :sync="true" @change="changed" name="isNoValue" v-model="form.isNoValue" :width="110" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Fixo', unchecked: 'É de graça?' }"/>
                  <toggle-button :sync="true" @change="changed" name="isPOS" v-model="form.isPOS" :width="110" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Fixo', unchecked: 'É POS?' }"/>
                  <toggle-button :sync="true" @change="changed" name="isPlus" v-model="form.isPlus" :width="110" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Outros', unchecked: 'É outro tipo?' }"/>
              </b-row>
              <b-row class="mb-3" v-if="form.isFixed">
                <b-input-group size="sm" prepend="Valor fixo: ">
                  <b-input-group-prepend is-text class="firstLabel">
                          R$:
                  </b-input-group-prepend>
                  <b-form-input ref="amount" type="text" v-model.lazy="form.vl_preco_fixo" v-money="components.money">
                  </b-form-input>
                </b-input-group>
              </b-row>
              <b-row class="mb-3" v-if="form.isPlus">
                <b-input-group size="sm" prepend="Valor: ">
                  <b-input-group-prepend is-text class="firstLabel">
                          R$:
                  </b-input-group-prepend>
                  <b-form-input ref="amount" type="text" v-model.lazy="form.vl_preco_fixo" v-money="components.money">
                  </b-form-input>
                </b-input-group>
              </b-row>
              <b-row class="mb-3" v-if="form.isHalf">
                <b-input-group size="sm" prepend="Meia entrada">
                  <b-input-group-prepend is-text class="firstLabel">
                          %:
                  </b-input-group-prepend>
                  <b-form-input ref="amount" type="text" v-model.lazy="form.discountHalf" v-money="components.percentage">
                  </b-form-input>
                </b-input-group>
              </b-row>
              <b-row class="mb-3" v-if="form.isHalf">
                <toggle-button :sync="true" v-model="form.halftype" :width="210" :color="{checked: '#97c2c9', unchecked: '#9999c9', disabled: '#a6a6a6'}" :labels="{ checked: 'A base do cálculo por porcentagem', unchecked: 'A base do cálculo por quantidade' }"/>
              </b-row>
              <b-row class="mb-3" v-if="form.isHalf && form.halftype">
                <b-input-group size="sm">
                  <b-input-group-prepend is-text class="firstLabel">
                          %:
                  </b-input-group-prepend>
                  <b-form-input ref="CotaMeiaEstudante" type="text" v-model.lazy="form.CotaMeiaEstudante" v-money="components.percentageNoPrecision">
                  </b-form-input>
                </b-input-group>
              </b-row>
              <b-row class="mb-3" v-if="form.isHalf && !form.halftype">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                        Quantidade:
                      </b-input-group-prepend>
                      <b-form-input id="CotaMeiaEstudante"
                                  type="number"
                                  name="CotaMeiaEstudante"
                                  maxlength="100"
                                  v-model="form.CotaMeiaEstudante"
                                  min="1"
                                  placeholder="Digite a quantidade">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3" v-if="form.isDiscount">
                <b-input-group size="sm" prepend="Desconto em ">
                  <b-input-group-prepend is-text class="firstLabel">
                          %:
                  </b-input-group-prepend>
                  <b-form-input ref="amount" type="text" v-model.lazy="form.discount" v-money="components.percentage">
                  </b-form-input>
                </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <toggle-button :sync="true" @change="changed" name="isAllotment" v-model="form.isAllotment" :width="110" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Lote', unchecked: 'É lote?' }"/>
              </b-row>
              <b-row class="mb-3" v-if="form.isAllotment">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Quantidade do lote:
                      </b-input-group-prepend>
                      <b-form-input id="lote"
                                  type="number"
                                  name="lote"
                                  maxlength="100"
                                  v-model="form.QtdVendaPorLote"
                                  min="1"
                                  placeholder="Digite a quantidade">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row v-if="form.isPlus">
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
              </b-row>
              <b-row v-if="form.isPlus">
                <div class="directlink"><a :href="form.imageURI" target="_blank">Imagem</a>/<a :href="form.imageURIOriginal" target="_blank">Imagem original</a></div>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-form-checkbox id="StaTipBilhete"
                                      v-model="form.StaTipBilhete"
                                      value="1">
                      <span v-if="form.StaTipBilhete == 1">Ativo</span>
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
import ToggleButton from 'vue-js-toggle-button';
import VueUploadMultipleImage from 'vue-upload-multiple-image';
import { VMoney } from 'v-money';
import Vuelidate from 'vuelidate';

import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { tickettypeService } from '../../components/common/services/tickettype';

Vue.use(VueHead);
Vue.use(ToggleButton);
Vue.use(Vuelidate);

import {
  required
  ,helpers
} from 'vuelidate/lib/validators';

export default {
  mixins: [func],
  props: ['id', 'id_base'],
  directives: {money: VMoney},
  components: { VueUploadMultipleImage },
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
      return this.mayI('genre-add', 'genre-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    }
  },
  methods: {
    populateImage() {
      Vue.nextTick().then(response => {
        this.$wait.start("inprocess");
        this.showWaitAboveAll();
        tickettypeService.base64(this.form.id_base, this.id).then(
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
    changed(obj) {
      Vue.nextTick().then(response => {
        switch (obj.srcEvent.srcElement.name) {
          case "isPrincipal":
            this.form.isHalf = false;
            this.form.isFixed = false;
            this.form.isDiscount = false;
            this.form.isPlus = false;
          break;
          case "isDiscount":
            this.form.isPrincipal = false;
            this.form.isHalf = false;
            this.form.isFixed = false;
            this.form.isPlus = false;
          break;
          case "isHalf":
            this.form.isPrincipal = false;
            this.form.isFixed = false;
            this.form.isDiscount = false;
            this.form.isPlus = false;
          break;
          case "isFixed":
            this.form.isPrincipal = false;
            this.form.isHalf = false;
            this.form.isDiscount = false;
            this.form.isPlus = false;
          break;
          case "isPlus":
            this.form.isPrincipal = false;
            this.form.isHalf = false;
            this.form.isDiscount = false;
            this.form.isFixed = false;
          break;
        }
      });
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
    validate() {
      let ret = !this.$v.form.$invalid;
      if (this.form.isAllotment == false && this.form.isFixed == false && this.form.isHalf == false && this.form.isDiscount == false && this.form.isPlus == false && this.form.isPrincipal == false) {
        this.toastError("Escolha o tipo do bilhete");
        return false;
      }
      return ret;
    },
    save() {
      if (this.processing) return;

      if (!this.validate()) {
        this.toastError("Verifique os campos");
        return;
      }

      this.processing = true;

      this.$wait.start("inprocessSave");
      this.showWaitAboveAll();
      let id = this.id;
      let id_base = this.form.id_base;
      let nameWeb = this.form.nameWeb;
      let nameTicketOffice = this.form.nameTicketOffice;
      let description = this.form.description;
      let in_dom = this.form.in_dom;
      let in_seg = this.form.in_seg;
      let in_ter = this.form.in_ter;
      let in_qua = this.form.in_qua;
      let in_qui = this.form.in_qui;
      let in_sex = this.form.in_sex;
      let in_sab = this.form.in_sab;
      let allowweb = this.form.allowweb == true ? 1 : 0;
      let allowticketoffice = this.form.allowticketoffice == true ? 1 : 0;
      let isPrincipal = this.form.isPrincipal == true ? 1 : 0;
      let isDiscount = this.form.isDiscount == true ? 1 : 0;
      let isHalf = this.form.isHalf == true ? 1 : 0;
      let isFixed = this.form.isFixed == true ? 1 : 0;
      let isPlus = this.form.isPlus == true ? 1 : 0;
      let vl_preco_fixo_fixed = this.form.vl_preco_fixo;
      let vl_preco_fixo_plus = this.form.vl_preco_fixo;
      let discountHalf = this.form.discountHalf;
      let halftype = this.form.halftype == true ? 'P' : 'Q';
      let CotaMeiaEstudante_value = this.form.CotaMeiaEstudante;
      let discount = this.form.discount;
      let isAllotment = this.form.isAllotment == true ? 1 : 0;
      let QtdVendaPorLote_allotment = this.form.QtdVendaPorLote;
      let StaTipBilhete = this.form.StaTipBilhete == 1 ? 'A' : 'I';

      let vl_preco_fixo = 0;
      let PerDesconto = 0;
      let StaCalculoMeiaEstudante = '';
      let QtdVendaPorLote = '';
      let CotaMeiaEstudante = '';
      let saveimage = false;
      let imagebase64 = '';

      if (isDiscount == 1) {
        PerDesconto = discount;
      }
      if (isHalf == 1) {
        PerDesconto = discountHalf;
        CotaMeiaEstudante = CotaMeiaEstudante_value;
        StaCalculoMeiaEstudante = halftype;
      }
      if (isFixed == 1) {
        vl_preco_fixo = vl_preco_fixo_fixed;
      }
      if (isPlus == 1) {
        vl_preco_fixo = vl_preco_fixo_plus;
        saveimage = this.form.saveimage;
        imagebase64 = this.form.image;
      }
      if (isAllotment == 1) {
        QtdVendaPorLote = QtdVendaPorLote_allotment;
      }
      tickettypeService.save(this.getLoggedId(), this.isAdd ? '' : this.id
                            ,id_base
                            ,nameWeb
                            ,nameTicketOffice
                            ,description
                            ,in_dom
                            ,in_seg
                            ,in_ter
                            ,in_qua
                            ,in_qui
                            ,in_sex
                            ,in_sab
                            ,allowweb
                            ,allowticketoffice
                            ,isPrincipal
                            ,isDiscount
                            ,isHalf
                            ,isFixed
                            ,isPlus
                            ,vl_preco_fixo
                            ,PerDesconto
                            ,CotaMeiaEstudante
                            ,StaCalculoMeiaEstudante
                            ,isAllotment
                            ,QtdVendaPorLote
                            ,StaTipBilhete
                            ,saveimage
                            ,imagebase64).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
             if (response.success) {
               this.toastSuccess("Salvo com sucesso");
               this.$router.push(`/tickettype/list`);
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
      tickettypeService.get(this.getLoggedId(), this.id, this.form.id_base).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = this.validateJSONisNotEmpty(response);
              if (this.form.loaded) {

                //this.form.CodTipBilhete = response.CodTipBilhete;
                this.form.imageURI = response.imageURI;
                this.form.imageURIOriginal = response.imageURIOriginal;
                this.form.uniquename = response.uniquename;
                this.form.allowticketoffice = response.allowticketoffice == 1;
                this.form.allowweb = response.allowweb == 1;
                this.form.CobraComs = response.CobraComs;
                this.form.CotaMeiaEstudante = response.CotaMeiaEstudante;
                this.form.description = response.description;
                this.form.ds_nome_site = response.ds_nome_site;
                this.form.hasImage = response.hasImage;
                this.form.id_promocao_controle = response.id_promocao_controle;
                this.form.Img1Promocao = response.Img1Promocao;
                this.form.Img2Promocao = response.Img2Promocao;
                this.form.ImpDSBilhDest = response.ImpDSBilhDest;
                this.form.ImpVlIngresso = response.ImpVlIngresso;
                this.form.in_dom = response.in_dom;
                this.form.in_qua = response.in_qua;
                this.form.in_qui = response.in_qui;
                this.form.in_sab = response.in_sab;
                this.form.in_seg = response.in_seg;
                this.form.in_sex = response.in_sex;
                this.form.in_ter = response.in_ter;
                this.form.in_hot_site = response.in_hot_site;
                this.form.in_venda_site = response.in_venda_site;
                this.form.InPacote = response.InPacote;
                this.form.isAllotment = response.isAllotment == 1;
                this.form.isFixed = response.isFixed == 1;
                this.form.isHalf = response.isHalf == 1;
                this.form.isDiscount = response.isDiscount == 1;
                this.form.isOld = response.isOld == 1;
                this.form.isPlus = response.isPlus == 1;
                this.form.isPrincipal = response.isPrincipal == 1;
                this.form.nameTicketOffice = response.nameTicketOffice;
                this.form.nameWeb = response.nameWeb;
                this.form.PerDesconto = response.PerDesconto;
                this.form.QtdVendaPorLote = response.QtdVendaPorLote;
                this.form.StaCalculoMeiaEstudante = response.StaCalculoMeiaEstudante;
                this.form.StaCalculoPorSala = response.StaCalculoPorSala;
                this.form.StaTipBilhete = response.StaTipBilhete == 'A' ? 1 : 0;
                this.form.StaTipBilhMeia = response.StaTipBilhMeia;
                this.form.StaTipBilhMeiaEstudante = response.StaTipBilhMeiaEstudante;
                this.form.TipBilhete = response.TipBilhete;
                this.form.TipCaixa = response.TipCaixa;
                this.form.vl_preco_fixo = response.vl_preco_fixo;

                this.form.halftype = response.StaCalculoMeiaEstudante == 'P';
                this.form.discountHalf = response.PerDesconto;
                this.form.discount = response.PerDesconto;

                this.populateImage();
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
      nameWeb: {
        required,
      },
      nameTicketOffice: {
        required,
      },
    }
  },
  data () {
    return {
        processing: false,
        idupload: 1,
        loading: false,
        selects: {
          base: [],
        },
        components: { 
          picOptions: {
            dragText: "Arrastar imagem",
            browseText: "Selecione",
            primaryText: "Padrão",
            markIsPrimaryText: "Definir como padrão",
            popupText: "Esta imagem será exibida como padrão",
            dropText: "Solte aqui",
          },
          percentage: {
            decimal: '.',
            thousands: '',
            //prefix: 'R$ ',
            //suffix: ' #',
            precision: 2,
            masked: false /* doesn't work with directive */
          },
          percentageNoPrecision: {
            decimal: '.',
            thousands: '',
            //prefix: 'R$ ',
            //suffix: ' #',
            precision: 0,
            masked: false /* doesn't work with directive */
          },
          money: {
            decimal: '.',
            thousands: '',
            //prefix: 'R$ ',
            //suffix: ' #',
            precision: 2,
            masked: false /* doesn't work with directive */
          }
        },
        form: {
          loaded: false,

          imgbase64: '',
          images: [],
          image: '',
          imageURI: '',
          imageOriginalURI: '',
          saveimage: false,

          id_base: '',
          uniquename: '',
          allowticketoffice: true,
          allowweb: true,
          CobraComs: '',
          CotaMeiaEstudante: 40,
          description: '',
          ds_nome_site: '',
          hasImage: '',
          id_promocao_controle: '',
          Img1Promocao: '',
          Img2Promocao: '',
          ImpDSBilhDest: '',
          ImpVlIngresso: '',
          in_dom: true,
          in_hot_site: '',
          in_qua: true,
          in_qui: true,
          in_sab: true,
          in_seg: true,
          in_sex: true,
          in_ter: true,
          in_venda_site: '',
          InPacote: '',
          isAllotment: false,
          isFixed: false,
          isHalf: false,
          isDiscount: false,
          isOld: false,
          isPlus: false,
          isPrincipal: false,
          halftype: true,
          nameTicketOffice: '',
          nameWeb: '',
          PerDesconto: '',
          discountHalf: 5000,
          discount: 0,
          QtdVendaPorLote: '',
          StaCalculoMeiaEstudante: '',
          StaCalculoPorSala: '',
          StaTipBilhete: 1,
          StaTipBilhMeia: '',
          StaTipBilhMeiaEstudante: '',
          TipBilhete: '',
          TipCaixa: '',
          vl_preco_fixo: '',


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
.weekDays-selector {
  margin-left: 10px !important;
}
.weekDays-selector input {
  display: none!important;
}

.weekDays-selector input[type=checkbox] + label {
  display: inline-block;
  border-radius: 50%;
  background: #dddddd;
  height: 30px;
  width: 30px;
  margin-right: 3px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  transition: 0.4s; 
  font-size: 10px;
}

.weekDays-selector input[type=checkbox]:checked + label {
  background: #2c3e50;
  color: #ffffff;
}
</style>