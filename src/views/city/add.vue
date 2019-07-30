<template>
<div v-if="mayIsee">
  <b-container>
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
        <!-- aqui -->

          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.ds_municipio.$invalid) }">
                Nome:
              </b-input-group-prepend>
              <b-form-input id="name" type="text" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.ds_municipio.$invalid) }" name="name" maxlength="50" v-model="form.ds_municipio" placeholder="Digite o nome">
              </b-form-input>
            </b-input-group>
            <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.ds_municipio.required">Campo é obrigatório</div>
            <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.ds_municipio.minLength">Deve ter pelo menos {{$v.form.ds_municipio.$params.minLength.min}} caracteres.</div>
          </b-row>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.id_estado.$invalid) }">
                Estado:
              </b-input-group-prepend>
              <b-form-select v-on:change="selState" v-model="form.id_estado" :options="selects.state" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_estado.$invalid) }" />
            </b-input-group>
            <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_estado.required">Campo é obrigatório</div>
          </b-row>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-button type="button" variant="outline-success" size="sm" @click="save">
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
import VueUploadMultipleImage from 'vue-upload-multiple-image';
import Vuelidate from 'vuelidate';
import VModal from 'vue-js-modal';

import config from "@/config";
import { func } from "@/functions";
import { cityService } from '../../components/common/services/city';
import { stateService } from '../../components/common/services/state';

import {
  required,
  minLength
} from 'vuelidate/lib/validators';

Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true
});
Vue.use(VueHead);
Vue.use(Vuelidate);

export default {
  mixins: [func],
  components: {
    VueUploadMultipleImage,
  },
  props: ['id'],
  name: 'city-add',
  head: {
    title: function () {
      return {
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Cidade - ${this.typeOf}`,
      }
    },
  },
  mounted() {
  },
  created() {
    this.populateState();
    if (!this.isAdd) {
      this.get(true);
    }
  },
  directives: {
  },

  computed: {
    mayIsee() {
      return this.mayI('ev-add', 'ev-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    },
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
    reloadonly() {
      this.get(false);
    },
    get(type) {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      cityService.get(this.getLoggedId(), this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response)) {
            this.form.loaded = this.validateJSONisNotEmpty(response);
            if (this.form.loaded) {
              this.form.ds_municipio = response.ds_municipio;
              this.form.id_estado = response.id_estado;
              this.form.img = response.img;
              this.form.img_extra = response.img_extra;

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
    },
    validate() {
      this.executedAtLeastOne = true;
      return !this.$v.form.$invalid;
    },
    save() {
      if (this.processing) return;

      if (this.validate()) {
        let id_municipio = "",
          ds_municipio = "",
          id_estado = "",
          imagechanged = false,
          imagebase64 = "",
          imagechanged_extra = false,
          imagebase64_extra = ""
        ;

        id_municipio = this.id;
        ds_municipio = this.form.ds_municipio;
        id_estado = this.form.id_estado;

        imagechanged = this.form.saveimage;
        imagebase64 = this.form.image;


        this.processing = true;
        this.$wait.start("inprocessSave");

        this.showWaitAboveAll();
        cityService.save(this.getLoggedId(), id_municipio, ds_municipio, id_estado, imagechanged, imagebase64, '', '').then(

          response => {
            this.processing = false;
            this.hideWaitAboveAll();
            this.$wait.end("inprocessSave");

            if (response.success) {
              this.toastSuccess("Salvo com sucesso");
              this.$router.push(`/city/list`);
              // this.$router.go();
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
    },
    selState() {
    },
    populateImage() {
      Vue.nextTick().then(response => {
        this.$wait.start("inprocess");
        this.showWaitAboveAll();
        cityService.base64(this.id, "normal").then(
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
        // cityService.base64(this.id, "extra").then(
        //   response => {
        //     this.hideWaitAboveAll();
        //     this.$wait.end("inprocess");

        //     if (this.validateJSON(response)) {
        //       this.form.imgbase64_extra = response.code;
        //       this.imageobj_extra();
        //     }
        //   },
        //   error => {
        //     this.hideWaitAboveAll();
        //     this.$wait.end("inprocess");
        //     this.toastError("Falha na execução.");
        //   }
        // );
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
    imageobj_extra() {
      Vue.nextTick().then(response => {
        let obj = {
          default: 1
          ,highlight: 1
          ,name: "extra.jpg"
          ,path: this.form.imgbase64_extra
        }
        this.form.images.push(obj);
        this.idupload++;
      });
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
  },
  validations: {
    form: {
      ds_municipio: {
        required,
        minLength: minLength(3)
      },
      id_estado: {
        required,
      },
    }
  },
  filters: {
  },
  data() {
    return {
      executedAtLeastOne: false,
      processing: false,
      loading: false,
      idupload: 1,
      components: {
        picOptions: {
          dragText: "Arrastar imagem",
          browseText: "Selecione",
          primaryText: "Padrão",
          markIsPrimaryText: "Definir como padrão",
          popupText: "Esta imagem será exibida como padrão",
          dropText: "Solte aqui",
        },
      },
      popups: {
        image: {
          loaded: false,
          name: '',
          url: '',
        }
      },
      checkbox: {
      },
      selects: {
        state: [],
      },
      form: {
        workaround: 0,
        imgbase64: '',
        imgbase64_extra: '',
        images: [],
        image: '',
        img: '',
        imgExtra: '',
        saveimage: false,

        id_municipio: '',
        ds_municipio: '',
        id_estado: '',
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
  margin-top: -80px !important;
}

.errorFormValidateHack2 {
  padding-left: 12px;
}

#my-upload {
  padding-bottom: 20px;
}
</style>
