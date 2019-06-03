<template>
<div v-if="!isAuth">
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

<div v-else>
  <div class="my-3 my-md-5" v-if="1==2">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">
          Dashboard
        </h1>
      </div>
      <div class="row row-cards">
        <card-info :title="'Vendas'" :value='43' :percentage="'6'" :status="'increase'"></card-info>
        <card-info :title="'Vendas'" :value='43' :percentage="'6'" :status="'increase'"></card-info>
        <card-info :title="'Vendas'" :value='43' :percentage="'6'" :status="'decrease'"></card-info>
        <card-info :title="'Vendas'" :value='43' :percentage="'6'" :status="'decrease'"></card-info>
        <card-info :title="'Vendas'" :value='43' :percentage="'6'" :status="'decrease'"></card-info>
        <card-info :title="'Vendas'" :value='43' :percentage="'6'" :status="'decrease'"></card-info>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Ultimas Vendas</h3>
            </div>
            <div class="table-responsive">
              <table class="table table-hover table-outline table-vcenter text-nowrap card-table">
                <thead>
                  <tr>
                    <th class="w-1">Cod. Venda</th>
                    <th class="w-3">Evento</th>
                    <th>Cliente</th>
                    <th>Data de Compra</th>
                    <th class="text-center">Valor</th>
                    <th class="text-center">Forma de Pag.</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="text-muted">001401</span></td>
                     <td>
                      <div>Captain Marvel</div>
                    </td>
                    <td>
                      <div>Elizabeth Martin</div>

                    </td>
                    <td>
                      <div class="clearfix">
                        20:05
                        <div class="small text-muted">
                          Mar 7, 2019
                        </div>
                      </div>
                    </td>
                    <td>R$ 50.03</td>

                    <td class="text-center">
                      <i class="payment payment-visa"></i>
                    </td>

                    <td>
                      <span class="status-icon bg-success"></span> Finalizado
                    </td>
                  </tr>
                  <tr>
                    <td><span class="text-muted">001401</span></td>
                    <td>
                      <div>Captain Marvel</div>
                    </td>
                    <td>
                      <div>Elizabeth Martin</div>

                    </td>
                    <td>
                      <div class="clearfix">
                        20:05
                        <div class="small text-muted">
                          Mar 7, 2019
                        </div>
                      </div>
                    </td>
                    <td>R$ 50.03</td>

                    <td class="text-center">
                      <i class="payment payment-visa"></i>
                    </td>

                    <td>
                      <span class="status-icon bg-danger"></span> Cancelada
                    </td>
                  </tr>
                  <tr>
                    <td><span class="text-muted">001401</span></td>
                    <td>
                      <div>Captain Marvel</div>
                    </td>
                    <td>
                      <div>Elizabeth Martin</div>
                    </td>
                    <td>
                      <div class="clearfix">
                        20:05
                        <div class="small text-muted">
                          Mar 7, 2019
                        </div>
                      </div>
                    </td>
                    <td>R$ 70</td>

                    <td class="text-center">
                      <i class="payment payment-mastercard"></i>
                    </td>

                    <td>
                      <span class="status-icon bg-warning"></span> Aguardando Pag.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import Vue from "vue";
import VueResource from "vue-resource";
import config from "@/config";

import cardInfo from "@/views/dashboard/card-info"

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
      processing: false,
      login: null,
      password: null,
      showPassword: false
    };
  },
  components: {
    cardInfo
  },
  computed: {
    passwordType: function () {
      if (this.showPassword) {
        return "text";
      } else {
        return "password";
      }
    },
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
</style>
