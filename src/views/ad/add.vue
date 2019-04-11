<template>
    <div>
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
        <div class="directlink"><a :href="form.imageURI" target="_blank">Imagem</a>/<a :href="form.imageURIOriginal" target="_blank">Imagem original</a></div>
      <b-container>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.id_partner.$invalid) }">
                Parceiro:
              </b-input-group-prepend>
              <b-form-select v-model="form.id_partner" :options="selects.bases" size="sm" v-bind:class="{ errorFormValidateInput: ($v.form.id_partner.$invalid) }" />
            </b-input-group>
            <div class="errorFormValidate" v-if="!$v.form.id_partner.required">Campo é obrigatório</div>
          </b-row>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.name.$invalid) }">
                Nome:
              </b-input-group-prepend>
              <b-form-input id="name" type="text" v-bind:class="{ errorFormValidateInput: ($v.form.name.$invalid) }" name="name" maxlength="100" v-model="form.name" placeholder="Digite o nome">
              </b-form-input>
            </b-input-group>
            <div class="errorFormValidate" v-if="!$v.form.name.required">Campo é obrigatório</div>
          </b-row>
          <b-row class="mb-3">
            <b-col class="colpadding">
              <b-input-group size="sm">
                <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.title.$invalid) }">
                  Título:
                </b-input-group-prepend>
                <b-form-input id="title" type="text" v-bind:class="{ errorFormValidateInput: ($v.form.title.$invalid) }" name="title" maxlength="200" v-model="form.title" placeholder="Digite o titulo">
                </b-form-input>
              </b-input-group>
              <div class="errorFormValidate" v-if="!$v.form.title.required">Campo é obrigatório</div>
            </b-col>
            <b-col>
              <b-input-group size="sm">
                <b-input-group-prepend is-text>
                  Texto:
                </b-input-group-prepend>
                <b-form-input id="content" type="text" name="content" maxlength="200" v-model="form.content" placeholder="Digite o text">
                </b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col class="colpadding">
              <b-input-group size="sm">
                <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.startdate.$invalid) }">
                  Data inicio:
                </b-input-group-prepend>
                <b-form-input id="startdate" v-mask="'##/##/#### ##:##'" type="text" v-bind:class="{ errorFormValidateInput: ($v.form.startdate.$invalid) }" name="startdate" maxlength="200" v-model="form.startdate" placeholder="ex.: 01/01/2019 00:00">
                </b-form-input>
              </b-input-group>
              <div class="errorFormValidate" v-if="!$v.form.startdate.required || !$v.form.startdate.dateRequiredAndValid"><span v-if="!$v.form.startdate.dateRequiredAndValid && $v.form.startdate.required">Campo é inválido</span><span v-if="!$v.form.startdate.required">Campo é obrigatório</span></div>
            </b-col>
            <b-col>
              <b-input-group size="sm">
                <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.enddate.$invalid) }">
                  Data fim:
                </b-input-group-prepend>
                <b-form-input id="enddate" v-mask="'##/##/#### ##:##'" type="text" v-bind:class="{ errorFormValidateInput: ($v.form.enddate.$invalid) }" name="enddate" maxlength="200" v-model="form.enddate" placeholder="ex.: 30/01/2019 18:00">
                </b-form-input>
              </b-input-group>
              <div class="errorFormValidate" v-if="!$v.form.enddate.dateNotRequiredAndValid">Campo é inválido</div>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col class="colpadding">
              <b-input-group size="sm">
                <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: ($v.form.type.$invalid) }">
                  Tipo:
                </b-input-group-prepend>
                <b-form-select v-model="form.type" :options="selects.types" size="sm" v-bind:class="{ errorFormValidateInput: ($v.form.type.$invalid) }" />
              </b-input-group>
              <div class="errorFormValidate" v-if="!$v.form.type.required">Campo é obrigatório</div>
            </b-col>
            <b-col>
              <b-input-group size="sm">
                <b-input-group-prepend is-text>
                  Campanha:
                </b-input-group-prepend>
                <b-form-input id="campaign" type="text" name="campaign" maxlength="200" v-model="form.campaign" placeholder="Digite a campanha">
                </b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col class="colpadding">
              <b-input-group size="sm">
                <b-input-group-prepend is-text>
                  Prioridade:
                </b-input-group-prepend>
                <b-form-input id="priority" type="number" min="1" max="5" step="1" name="priority" v-model="form.priority" placeholder="Digite a prioridade">
                </b-form-input>
              </b-input-group>
            </b-col>
            <b-col>
              <b-input-group size="sm">
                <b-input-group-prepend is-text title="Posição quando o tipo for card">
                  Index no card:
                </b-input-group-prepend>
                <b-form-input id="index" :disabled="form.type!='card'" type="number" min="1" max="100" step="1" name="index" v-model="form.index" placeholder="Digite o index">
                </b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text>
                Link:
              </b-input-group-prepend>
              <b-form-input id="link" type="text" name="link" maxlength="100" v-model="form.link" placeholder="Digite o link">
              </b-form-input>
            </b-input-group>
          </b-row>
          <b-row class="mb-3">
            <b-col>
              <b-input-group size="sm">
                  <b-form-checkbox id="isactive"
                                  v-model="form.isactive"
                                  value="1"
                                  unchecked-value="0">
                  <span v-if="form.isactive == 1">Ativo</span>
                  <span v-else>Inativo</span>
                  </b-form-checkbox>
              </b-input-group>
            </b-col>
            <b-col>
                <span class="createddate" v-if="!isAdd">
                  Criado em {{form.created}}
                </span>
            </b-col>
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
      </b-container>
      
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import { func } from "@/functions";

import moment from 'moment';
import VueMask from 'v-mask';
import VueQuillEditor from 'vue-quill-editor';
import VModal from 'vue-js-modal';
import VueUploadMultipleImage from 'vue-upload-multiple-image';
// import PictureInput from 'vue-picture-input';
import Vuelidate from 'vuelidate';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import {
  required
  ,helpers
} from 'vuelidate/lib/validators';

import { partnerService } from '@/components/common/services/partner';
import { adService } from '@/components/common/services/ad';

Vue.use(VueMask);
Vue.use(VueHead);
Vue.use(VueQuillEditor);
Vue.use(Vuelidate);
Vue.use(moment);

Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
});

const dateRequiredAndValid = (value) => moment(value, "DD/MM/YYYY HH:mm",true).isValid();
const dateNotRequiredAndValid = (value) => {
  if (value == null || value == "") {
    return true;
  }
  else {
    return moment(value, "DD/MM/YYYY HH:mm",true).isValid();
  }
};

export default {
  mixins: [func],
  props: ['id'],
  name: 'ad-add',
  components: {
    // PictureInput,
    VueUploadMultipleImage,
  },
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Propagandas - ${this.typeOf}`,
      }
    },
  },
  created() {
    this.populateBases();
    if (!this.isAdd) {
      this.get();
    }
  },
  computed: {
    mayIsee() {
      return this.mayI('add-add', 'add-viewer');
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
        adService.base64(this.id, this.form.type).then(
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
    populateBases() {
      this.processing = true;
      this.showWaitAboveAll();

      partnerService.withpermission(this.getLoggedId()).then(
              response => {
                  this.hideWaitAboveAll();
                  this.processing = false;
                  this.selects.bases = response;
          },
          error => {
              this.processing = false;
              this.hideWaitAboveAll();
              this.toastError("Falha na execução.");        
          }
      );
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
    validateDates() {
      if (this.$v.form.startdate.required && this.$v.form.startdate.dateRequiredAndValid && this.$v.form.enddate.dateNotRequiredAndValid) {
        let before = moment(this.form.startdate, "DD/MM/YYYY HH:mm",true);
        let after = moment(this.form.enddate, "DD/MM/YYYY HH:mm",true);
        if (before.toDate()>after.toDate()) {
          this.toastError("Datas inválidas.");
          return false;
        }
      }
      return true;
    },
    validate() {
      let ret = !this.$v.form.$invalid;
      if (this.isAdd) {
        ret = this.form.saveimage;
      }
      return ret;
    },
    get() {
      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      adService.get(this.id).then(
        response => {
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response)) {
            this.form.loaded = this.validateJSONisNotEmpty(response);
            if (this.form.loaded) {
              // this.form.images: [],
              this.form.id = response.id;
              this.form.created = response.created;
              this.form.id_partner = response.id_partner;
              this.form.isactive = response.isactive,
              this.form.startdate = response.startdate;
              this.form.enddate = response.enddate;
              this.form.title = response.title;
              this.form.content = response.content;
              this.form.link = response.link;
              this.form.type = response.type;
              this.form.imageURI = response.imageURI;
              this.form.imageURIOriginal = response.imageURIOriginal;
              // this.form.saveimage = response.ddd;
              this.form.campaign = response.campaign;
              this.form.name = response.name;
              this.form.priority = response.priority;
              this.form.index = response.index;
              this.populateImage();
            }
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );
    },
    save() {
      // console.log(this.form.images);
      // return;
      if (this.processing) return;

      if (!this.validateDates()) {
        return;
      }

      if (this.validate()) {
        this.processing = true;
        this.$wait.start("inprocessSave");
        this.showWaitAboveAll();
        adService.save(this.getLoggedId(),this.form.id,this.form.id_partner,this.form.isactive
        ,this.form.startdate,this.form.enddate,this.form.title
        ,this.form.content,this.form.link,this.form.type
        ,this.form.image,this.form.campaign,this.form.name
        ,this.form.priority,this.form.index,this.form.saveimage).then(

          response => {
            this.processing = false;
            this.hideWaitAboveAll();
            this.$wait.end("inprocessSave");

            if (response.success) {
              this.toastSuccess("Salvo com sucesso");
              //this.$router.push(`/ad/list`);
            } else {
              this.toastError(response.msg);
            }
          },
          error => {
            this.processing = false;
            this.hideWaitAboveAll();
            this.$wait.end("inprocessSave");
            this.toastError("Falha na execução.");
          }
        );
      } else {
        this.toastError("Preencha os campos obrigatórios.");
      }
    }
  },
  validations: {
    form: {
      id_partner: {
        required,
      },
      startdate: {
        required,
        dateRequiredAndValid,
      },
      enddate: {
        dateNotRequiredAndValid,
      },
      title: {
        required,
      },
      type: {
        required,
      },
      // image: {
      //   required,
      // },
      name: {
        required,
      },
    }
  },
  data () {
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
              }], , ['bold', 'italic', 'underline'],
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
      },
      selects: {
        bases: [],
        types: [ { text: 'Banner', value: 'banner' },  { text: 'Cartão', value: 'card' }]
      },
      form: {
        workaround: 0,
        imgbase64: '',
        loaded: false,
        images: [],
        id: '',
        created: '',
        id_partner: '',
        isactive: 1,
        startdate: '',
        enddate: '',
        title: '',
        content: '',
        link: '',
        type: '',
        image: '',
        imageURI: '',
        imageOriginalURI: '',
        saveimage: false,
        campaign: '',
        name: '',
        priority: '',
        index: '',
      }
    }
  }
}
</script>

<style>
#my-upload {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
 
h1, h2 {
  font-weight: normal;
}
 
ul {
  list-style-type: none;
  padding: 0;
}
 
li {
  display: inline-block;
  margin: 0 10px;
}
 
a {
  color: #42b983;
}
.errorFormValidate {
  margin-top: 5px !important;
  margin-bottom: -10px;
}
.col {
  padding-left: 0px;
  padding-right: 0px;
}
.colpadding {
  padding-right: 15px;
}
.createddate {
  font-size: 12px;
  float: right;
  color: #9f9f9f;
}
.directlink {
  font-size: 10px;
  color: #9f9f9f;
  margin-bottom: 25px;
}
</style> 