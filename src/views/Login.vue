<template>
<div :key="iddiv">
  <div v-if="!checkIsAuth()">
    <div class="page">
      <div class="page-single">
        <div class="container">
          <div class="row mt-6 pt-6">
            <div class="col col-login mx-auto mt-6 pt-6">
              <div class="card">
                <div class="card-body p-6">
                  <div class="card-title">Faça login na sua conta administrativa</div>
                  <div class="form-group">
                    <label class="form-label">Usuário</label>
                    <b-form-input v-model="login" @keyup.enter.native="doLogin" maxlength="100"></b-form-input>
                  </div>
                  <div class="form-group">
                    <label class="form-label">
                        Senha
                      </label>
                    <b-form-input @keyup.enter.native="doLogin" v-model="password" :type="passwordType" maxlength="50"></b-form-input>
                  </div>
                  <div class="form-footer">
                    <button type="submit" class="btn btn-primary btn-block" @click="doLogin">
                      <v-wait for="inprocess">
                        <template slot="waiting">
                          Entrando...
                        </template>
                      </v-wait>
                      <span v-if="!processing">Entrar</span>
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <dashboard :key="dashboardid" v-if="!!checkIsAuth() && mayIseedashboard"></dashboard>
</div>
</template>

<script>
import Vue from "vue";
import VueResource from "vue-resource";
import config from "@/config";
import dashboard from "@/views/dashboard/index.vue";

import {
  func
} from "@/functions";
import {
  authService
} from "../components/common/services/auth";

export default {
  mixins: [func],
  data() {
    return {
      iddiv: 1,
      dashboardid: 1,
      logged: false,
      processing: false,
      login: null,
      password: null,
      showPassword: false
    };
  },
  components: {
    dashboard,
  },
  computed: {
    passwordType: function () {
      if (this.showPassword) {
        return "text";
      } else {
        return "password";
      }
    },
    mayIseedashboard() {
      return this.mayI('dashboard-home-viewer');
    }
  },
  created() {
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
              let ctx = this;
              this.$store.dispatch("login", response).then(function () {
                ctx.ls_add("codes", JSON.stringify(response.codes));
                ctx.$parent.setMenu();
                //ctx.codes(ctx.$parent.setMenu);
                ctx.login = "";
                ctx.password = "";
                Vue.nextTick().then(response => {
                  ctx.iddiv++;
                  ctx.dashboardid++;
                });
                ctx.$router.push("/dashboard");
                //ctx.goHome();
                //this.logged = true;
              });
              //this.$router.push("/");
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
</style>
