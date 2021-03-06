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
                                  maxlength="100"
                                  v-model="form.name"
                                  placeholder="Digite o nome">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Login:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="name"
                                  v-mask="'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'"
                                  maxlength="50"
                                  v-model="form.login"
                                  placeholder="Digite o login">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Email:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="email"
                                  maxlength="100"
                                  v-model="form.email"
                                  placeholder="Digite o e-mail">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-form-select v-model="form.documentType" size="sm">
                        <option value="###.###.###-##">CPF</option>
                        <option value="##.###.###/####-##">CNPJ</option>
                        <option value="">Outros</option>
                      </b-form-select>
                      <b-form-input id="name"
                                  type="text"
                                  name="document"
                                  maxlength="25"
                                  v-mask="form.documentType"
                                  v-model="form.document"
                                  placeholder="Digite o documento">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                <div v-if="!isAdd" style="margin-right: 15px;" class="alert alert-primary">Deseja alterar a senha desse usuário? Digite a senha nova no campo e salve.</div>
                <password labelHide="Esconder senha" labelShow="Mostrar senha" v-model="form.pass" placeholder="Digite a senha" :secureLength="7" :toggle="true" />
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-form-checkbox id="active"
                                      v-model="form.active"
                                      value="1"
                                      unchecked-value="not_accepted">
                      <span v-if="form.active == 1">Ativo</span>
                      <span v-else>Inativo</span>
                      </b-form-checkbox>
                  </b-input-group>
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
import Password from 'vue-password-strength-meter';
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';

Vue.use(VueHead);
Vue.use(VueMask);

export default {
  mixins: [func],
  props: ['id'],
  components: { Password },
  name: 'user-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Usuário - ${this.typeOf}`,
      }
    },
  },
  created() {
    if (!this.isAdd) {
      this.get();
    }
  },
  computed: {
    mayIsee() {
      return this.mayI('user-add', 'user-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    }
  },
  methods: {
    validate() {
      if (this.form.pass != '' && this.form.pass.length<7) {
        this.toastError("Preencha a senha corretamente.");
        return false;
      }
      return true;
    },
    save() {
      if (this.processing) return;

      if (!this.validate()) return;

      this.form.changedpass = this.form.pass != '' && this.form.pass >= 7;

      this.processing = true;

      this.$wait.start("inprocessSave");
      this.showWaitAboveAll();
      userService.save(this.getLoggedId(), this.isAdd ? '' : this.id, this.form.name, this.form.login, this.form.email, this.form.document, this.form.active, this.form.pass, this.form.changedpass).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
             if (response.success) {
               this.toastSuccess("Salvo com sucesso");
               this.$router.push(`/user/list`);
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
      userService.get(this.id).then(
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
        form: {
          documentType:"###.###.###-##",
          loaded: false,
          pass: '',
          changedpass: false,
          id: '',
          name: '',
          document: '',
          login: '',
          email: '',
          active: 1,
        }
    }
  }
}
</script>

<style>
.Password {
    max-width: 400px;
    margin: 0 0 !important;
}
</style>
