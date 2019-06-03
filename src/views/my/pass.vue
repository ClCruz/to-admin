<template>
  <div>
    <b-container>
      <b-row style="width: 400px;">
        <b-col>
          <h2>Alterar Senha</h2>
          <b-row class="mb-3">
            <password labelHide="Esconder senha" labelShow="Mostrar senha" v-model="form.oldpass" placeholder="Digite sua senha antiga" :badge="false" :showStrengthMeter="false" :secureLength="7" :toggle="false" />
          </b-row>
          <b-row class="mb-3">
            <password labelHide="Esconder senha" labelShow="Mostrar senha" v-model="form.newpass" placeholder="Digite sua nova senha" :secureLength="7" :toggle="true" />
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
                  Alterando...
                </template>
              </v-wait>
              <span v-if="!processing">Alterar</span>
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
import Password from 'vue-password-strength-meter';
import config from "@/config";
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';

Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'my-pass',
  components: { Password },
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Mudar senha",
      }
    },
  },
  created() { },
  mounted() { },
  computed: { },
  methods: { 
    validate() {
      if (this.form.oldpass == "") {
        return false;
      }
      if (this.form.newpass == "") {
        return false;
      }
      if (this.form.newpass.length < 6) {
        return false;
      }
      return true;
    },
    save() {
      if (this.processing) return;

      if (this.validate()) {
        userService.changepass(this.getLoggedId(), this.form.oldpass, this.form.newpass).then(
          response => {
            this.processing = false;
            this.hideWaitAboveAll();

            if (response.success) {
              this.toastSuccess(response.msg);
              this.form.oldpass = "";
              this.form.newpass = "";
              this.$router.push("/");
            } else {
              this.toastError(response.msg);
            }
          },
          error => {
            this.processing = false;
            this.hideWaitAboveAll();
            this.toastError("Falha na execução.");
          }
        );
      } else {
        this.toastError("Preencha os campos obrigatórios.");
      }
    }
  },
  data() {
    return {
      processing: false,
      loading: false,
      components: {
      },
      popups: {
        xx: {
          loaded: false,
          name: '',
        },
      },
      checkbox: {
        options: [{
            text: "xxx",
            value: "xxx"
          }
        ]
      },
      selects: {
      },
      form: {
        loaded: false,
        oldpass: '',
        newpass: '',
        newpasscheck: '',
      }
    }
  }
}
</script>

<style scoped>
.input-group-text {
  width: 100px !important;
}
.errorFormValidate {
  margin-top: 5px !important;
  margin-bottom: -10px;
}
</style>
<style>
.Password__field {
  width: 280px !important;
}

</style>