<template>
    <b-container>
      <b-col>
          <b-row class="mb-3">
            <b-input-group size="sm">
              <b-input-group-prepend is-text>
                Parceiro:
              </b-input-group-prepend>
              <b-form-select v-on:change="partnerchange" v-model="form.api" :options="selects.bases" size="sm" />
            </b-input-group>
          </b-row>
          <b-row class="mb-3" v-if="form.api!=''">
            <b-input-group size="sm">
              <b-input-group-prepend is-text>
                Página:
              </b-input-group-prepend>
              <b-form-select v-on:change="staticpagechange" v-model="form.id_static_page" :options="selects.staticpages" size="sm" />
            </b-input-group>
          </b-row>
          <b-row class="mb-3" v-if="loaded">
            <b-input-group size="sm">
              <b-input-group-prepend is-text>
                Título:
              </b-input-group-prepend>
              <b-form-input id="quantity"
                          type="text"
                          v-model="form.title"
                          >
              </b-form-input>
            </b-input-group>
          </b-row>
          <b-row class="mb-3" v-if="loaded">
            <b-input-group size="sm">
                <b-form-checkbox id="active"
                                v-model="form.isvisible"
                                value="1"
                                unchecked-value="0">
                <span v-if="form.isvisible == 1">Ativo</span>
                <span v-else>Inativo</span>
                </b-form-checkbox>
            </b-input-group>
          </b-row>
          <b-row v-if="loaded">
            <b-button type="button" variant="success" size="sm" @click="save">
              <v-wait for="inprocess">
                <template slot="waiting">
                    Salvando...
                </template>
              </v-wait>
              <span v-if="!processing">Salvar</span>
            </b-button>
          </b-row>
      </b-col>      

      <quill-editor v-if="loaded" v-model="form.content" ref="editor" :options="components.quillOptions">
      </quill-editor>

    </b-container>
</template>

<script>
import Vue from 'vue';
import VueResource from "vue-resource";
import VueQuillEditor from 'vue-quill-editor';

import config from '@/config';
import { func } from '@/functions';

import { staticpageService } from '@/components/common/services/static_page';
import { partnerService } from '@/components/common/services/partner';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

Vue.use(VueQuillEditor);

export default {
    name: 'staticpage',
    mixins: [func],
    data () {
        return {
            processing: false,
            loading: false,
            loaded: false,
            selects: {
                staticpages: [],
                bases: [],
            },
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
                placeholder: 'Conteudo da pagina',
                theme: 'snow'
              },
            },
            form: {
                id_static_page: 0,
                isvisible: 1,
                title: '',
                content: '',
                api: '',
            }
        }
    },
    computed: {
    },
    created() {
        this.load();
    },
    methods: {
        partnerchange() {
          Vue.nextTick().then(response => {
            this.populateStaticPages();
          });
        },
        staticpagechange() {
          Vue.nextTick().then(response => {
            this.get();
          });
        },
        load() {
          this.populateBases();
        },
        save() {
          this.processing = true;
          this.showWaitAboveAll();

          staticpageService.save(this.form.api, this.form.id_static_page, this.getLoggedId(), this.form.isvisible, this.form.title, this.form.content).then(
                  response => {
                      this.hideWaitAboveAll();
                      this.processing = false;
                       if (this.validateJSON(response)) {
                        if (response.success) {
                          this.toastSuccess(response.msg);
                          this.loaded = false;
                          this.form.id_static_page = 0;
                        }
                        else {
                          this.toastError(response.msg);
                        }
                      }
              },
              error => {
                  this.processing = false;
                  this.hideWaitAboveAll();
                  this.toastError("Falha na execução.");        
              }
          );
        },
        populateBases() {
          this.processing = true;
          this.showWaitAboveAll();

          partnerService.withpermissionbases(this.getLoggedId()).then(
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
        populateStaticPages() {
          this.processing = true;
          this.showWaitAboveAll();

          staticpageService.select(this.getLoggedId(), this.form.api).then(
                  response => {
                      this.hideWaitAboveAll();
                      this.processing = false;
                      this.selects.staticpages = response;
              },
              error => {
                  this.processing = false;
                  this.hideWaitAboveAll();
                  this.toastError("Falha na execução.");        
              }
          );
        },
        get() {
          this.processing = true;
          this.loaded = false;
          this.showWaitAboveAll();

          staticpageService.get(this.getLoggedId(), this.form.api, this.form.id_static_page).then(
                  response => {
                      this.hideWaitAboveAll();
                      this.processing = false;
                      this.loaded = true;

                      if (this.validateJSON(response)) {
                        this.form.isvisible = response.isvisible;
                        this.form.title = response.title;
                        this.form.content = response.content;
                      }
              },
              error => {
                  this.processing = false;
                  this.hideWaitAboveAll();
                  this.toastError("Falha na execução.");        
              }
          );
        },
    }
}
</script>

<style>

</style>
