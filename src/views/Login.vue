<template>
  <div v-if="!isAuth">
    <b-container>
      <b-row cols="2" class="mb-3">
        <b-input-group prepend="Login">
          <b-form-input v-model="login" @keyup.enter.native="doLogin" maxlength="100"></b-form-input>
        </b-input-group>
      </b-row>
      <b-row class="mb-3">
        <b-input-group prepend="Senha">
            <b-form-input @keyup.enter.native="doLogin" v-model="password" :type="passwordType"  maxlength="50"></b-form-input>
        </b-input-group>
      </b-row>
      <b-row>
        <b-btn variant="success" @click="doLogin">
            <v-wait for="inprocess">
                <template slot="waiting">
                    Entrando...
                </template>
            </v-wait>
            <span v-if="!processing">Entrar</span>
        </b-btn>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import VueResource from "vue-resource";
import config from "@/config";
import { func } from "@/functions";
import { authService } from "../components/common/services/auth";

export default {
  mixins: [func],
  data () {
    return {
      processing: false,
      login: null,
      password: null,
      showPassword: false
    };
  },
  computed: {
    passwordType: function() {
      if (this.showPassword) {
        return "text";
      } else {
        return "password";
      }
    },
  },
  created () {
    if (this.isAuth) {
      this.goHome();
    }
  },
  methods: {
    doLogin() {
      if (this.processing) return;

      if (!this.login || !this.password) {
        this.toastError("Preencha os campos corretamente.");
        return;
      }

      this.processing = true;
      this.$wait.start("inprocess");
      authService.login(this.login, this.password).then(
        response => {
          if (this.validateJSON(response)) {
            if (response.logged) {
              this.toastSuccess("Login efetuado com sucesso.");
              this.$store.dispatch("login", response);
              this.codes(this.$parent.setMenu);
              this.login = "";
              this.password = "";
              this.$router.push("/");
            } else {
              this.toastError(response.msg);
            }
          }
          //console.log(JSON.stringify(response));
          this.processing = false;
          this.$wait.end("inprocess");
        },
        error => {
          //console.log(JSON.stringify(response));
          this.processing = false;
          this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );
    }
  }
}
</script>
<style scoped>
.container {
  margin-top:30px;
}
.input-group-text {
  width: 72px;
}
</style>