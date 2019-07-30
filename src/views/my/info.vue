<template>
  <div>
     <b-container>
        <b-row>
          <b-col>
              <b-row class="mb-3">
                 <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Nome:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="name"
                                  readonly
                                  v-mask="form.name"
                                  v-model.lazy="form.name"
                                  placeholder="">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                 <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Login:
                      </b-input-group-prepend>
                      <b-form-input id="login"
                                  type="text"
                                  readonly
                                  name="login"
                                  v-mask="form.login"
                                  v-model.lazy="form.login"
                                  placeholder="">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          E-mail:
                      </b-input-group-prepend>
                      <b-form-input id="email"
                                  type="text"
                                  name="email"
                                  maxlength="100"
                                  v-mask="form.email"
                                  v-model.lazy="form.email"
                                  placeholder="Digite o e-mail">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          CPF:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  readonly
                                  name="document"
                                  maxlength="14"
                                  v-mask="form.documentType"
                                  v-model.lazy="form.document"
                                  placeholder="">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Código de pareamento:
                      </b-input-group-prepend>
                      <b-form-input id="pair"
                                  type="text"
                                  name="pair"
                                  readonly
                                  maxlength="5"
                                  v-model.lazy="form.pair"
                                  placeholder="">
                      </b-form-input>
                      <b-btn variant="outline-info" @click="generateNew" size="sm">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Carregando...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Gerar</span>
                      </b-btn>
                  </b-input-group>
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
import config from "@/config";
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';

Vue.use(VueHead);
Vue.use(VueMask);

export default {
  mixins: [func],
  name: 'my-info',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Informações",
      }
    },
  },
  methods: {
    generateNew() {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      userService.pair(this.getLoggedId()).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) { 
              this.toastSuccess("Código gerado com sucesso: " + response.msg);
            }
            else {
              this.toastError(response.msg);
            }
            this.get();
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
      userService.get(this.getLoggedId()).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = true;
              this.form.name = response.name;
              this.form.document = response.document;
              this.form.login = response.login;
              this.form.email = response.email;
              this.form.active = response.active;
              this.form.pair = response.pair;
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
  created() {
    this.get();
    this.codes();
  },
  data () {
    return {
        processing: false,
        loading: false,
        form: {
          documentType:"###.###.###-##",
          loaded: false,
          name: '',
          document: '',
          cellphone: '',
          login: '',
          email: '',
          pair: '',
        }
    }
  }
}
</script>

<style>

</style>
