<template>
    <div v-if="mayIsee">
      <b-container>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.id_base.$invalid) }">
              Base:
            </b-input-group-prepend>
            <b-form-select v-on:change="selBase" v-model="form.id_base" :options="selects.base" size="sm" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_base.$invalid) }" />
                <template slot="first">
                    <option :value="''" disabled>-- Selecione --</option>
                </template>
            </b-form-select>
          </b-input-group>
          <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_base.required">Campo é obrigatório</div>
        </b-row>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.id_evento.$invalid) }">
                Evento:
            </b-input-group-prepend>
            <b-form-select id="event" v-on:change="selEvent" v-model="form.id_evento" :options="selects.events" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.id_evento.$invalid) }" />
                <template slot="first">
                    <option :value="null" disabled>-- Selecione --</option>
                </template>
            </b-form-select>
          </b-input-group>
          <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.id_evento.required">Campo é obrigatório</div>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <b-row>
            <b-input-group size="sm">
              <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.date.$invalid) }">
                  Dias:
              </b-input-group-prepend>
              <b-form-select id="days"
                              :options="selects.days"
                              v-on:change="selDays"
                              v-model="form.date" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.date.$invalid) }" />
                  <template slot="first">
                      <option :value="null" disabled>-- Selecione --</option>
                  </template>
              </b-form-select>
            </b-input-group>
            <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.date.required">Campo é obrigatório</div>
            </b-row>
          </b-col>
          <b-col>
            <b-row>
            <b-input-group size="sm">
              <b-input-group-prepend is-text class="firstLabel" v-bind:class="{ errorFormValidateLabel: (executedAtLeastOne && $v.form.hour.$invalid) }">
                  Horário:
              </b-input-group-prepend>
              <b-form-select id="hours"
                              :options="selects.hours"
                              v-on:change="selHours"
                              v-model="form.hour" v-bind:class="{ errorFormValidateInput: (executedAtLeastOne && $v.form.hour.$invalid) }" />
                  <template slot="first">
                      <option :value="null" disabled>-- Selecione --</option>
                  </template>
              </b-form-select>
            </b-input-group>
            <div class="errorFormValidate" v-if="executedAtLeastOne && !$v.form.hour.required">Campo é obrigatório</div>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <b-row>
              <div class="input-group">
                <div class="input-group-append">
                  <b-button type="button" class="btn btn-primary" variant="primary" size="sm" @click="search(false)">
                    <v-wait for="inprocess">
                        <template slot="waiting">
                            Aguarde...
                        </template>
                    </v-wait>
                    <span v-if="!processing">Consultar</span>
                  </b-button>
                  <button data-toggle="dropdown" type="button" class="btn btn-primary dropdown-toggle" aria-expanded="false"></button>
                  <div class="dropdown-menu dropdown-menu-right" x-placement="bottom-end" style="position: absolute; transform: translate3d(311px, 38px, 0px); top: 0px; left: 0px; will-change: transform;">
                    <a class="dropdown-item" href="javascript:void(0)" @click="search(true)">
                      Consultar e imprimir
                    </a>
                    <a class="dropdown-item" href="javascript:void(0)" @click="exportExcel" v-if="this.bordero!=''">
                      Exportar - Excel
                    </a>
                    <a class="dropdown-item" href="javascript:void(0)" @click="generatelink()">
                      Gerar link
                    </a>
                    <a class="dropdown-item" href="javascript:void(0)" @click="generatelinkandsend(true)">
                      Gerar link e enviar por e-mail
                    </a>
                  </div>
                </div>
              </div>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
      <vue-friendly-iframe id="bordero" :src="url" :width="'1000px'" :height="'2000px;'" @load="iframeloaded" @document-load="iframeloaded2" v-if="executed"></vue-friendly-iframe>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import Vuelidate from 'vuelidate';
import VueFriendlyIframe from 'vue-friendly-iframe';
import VueClipboard from 'vue-clipboard2';
import html2canvas from 'html2canvas';
import config from "@/config";
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';
import { eventService } from "../../components/common/services/event";
import jsPDF from 'jspdf';


Vue.use(VueHead);
Vue.use(Vuelidate);
Vue.use(VueClipboard);
Vue.component('vue-friendly-iframe', VueFriendlyIframe);

import {
  required
  ,helpers
} from 'vuelidate/lib/validators';

export default {
  mixins: [func],
  name: 'report-accounting',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Relatórios - Borderô",
      }
    },
  },
  computed: {
    url() {
      return this.bordero == '' ? "" : this.bordero;
    },
    mayIsee() {
      return this.mayI('report-viewer', 'report-accounting');
    }
  },
  created() {
    this.populateBases();
  },
  methods: {
    askpass(sendornot) {
      this.$swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        confirmButtonText: 'Continuar',
        currentProgressStep: 1,
        title: 'Digite a senha de acesso ao link',
        input: 'password',
        inputPlaceholder: 'Digite a senha de acesso ao bordero',
        inputAttributes: {
          maxlength: 10,
          autocapitalize: 'off',
          autocorrect: 'off'
        }
      }).then((result) => {
          this.form.password = result.value;

          if (sendornot == true) {
            this.askemail();
          }
          else {
            this.showlink();
          }
      });
    },
    askemail() {
      this.$swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        confirmButtonText: 'Continuar',
        currentProgressStep: 1,
        title: 'Digite qual o e-mail que deseja enviar',
        input: 'email',
        inputPlaceholder: 'Digite o e-mail',
        inputAttributes: {
          autocapitalize: 'off',
          autocorrect: 'off'
        }
      }).then((result) => {
          this.form.email = result.value;
          this.showlink();
      });
    },
    showlink() {
      this.executed = false;
      this.processing = true;
      this.$wait.start("inprocess");

      this.showWaitAboveAll();
      eventService.borderolinksend(this.getLoggedId(), this.form.id_evento, this.form.date, this.form.hour, this.form.email, this.form.password).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");
          this.link = response.link;
          this.form.email = "";
          this.form.password = "";

          if (this.link == '')
            return;

          this.$swal({
            title: 'Borderô',
            type: 'success',
            allowEscapeKey: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            html: "Link gerado com sucesso.<br />link: " + this.link,
          }).then((result) => {
              this.$copyText(this.link).then(function (e) { }, function (e) { });
          });
        },
        error => {
          this.form.email = "";
          this.form.password = "";
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    generatelink() {
      this.generatelinkandsend(false);
    },
    generatelinkandsend(sendornot) {
      this.askpass(sendornot);
    },
    validate() {
      let ret = !this.$v.form.$invalid;
      return ret;
    },
    exportExcel() {
      if (this.bordero == "") {
        this.toastError("Consulte antes de exportar");
        return;
      }
      if (!this.validate()) {
        this.toastError("Verifique os campos");
        return;
      }
      window.open(this.bordero+"&exportto=sheet");
    },
    iframeloaded() {
      let me = this;
      setTimeout(function() { 
        me.processing = false;
        me.hideWaitAboveAll();
        me.$wait.end("inprocess");
        me.executed = true;
      }, 4000);
    },
    iframeloaded2() {
    },
    populateBases() {
      if (this.getLoggedId() == null || this.getLoggedId() == "") return;
      
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
    populateEvents() {
      
      if (this.form.id_base == '') {
        return;
      }
      this.selects.events = [];
      this.selects.days = [];
      this.selects.hours = [];

      this.showWaitAboveAll();
      eventService.select(this.getLoggedId(),this.form.id_base).then(
        response => {
          this.selects.events = response;
          this.hideWaitAboveAll();
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");        
        }
      );
    },
    populateDays() {
      if (this.form.id_base == '' || this.form.id_evento == '') {
        return;
      }
      this.selects.days = [];
      this.selects.hours = [];

      this.showWaitAboveAll();
      eventService.selectDays(this.getLoggedId(),this.form.id_base, this.form.id_evento).then(
        response => {
          this.selects.days = response;
          this.hideWaitAboveAll();
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");        
        }
      );
    },
    populateHours() {
      if (this.form.id_base == '' || this.form.id_evento == '' || this.form.date == '') {
        return;
      }
      this.selects.hours = [];

      this.showWaitAboveAll();
      eventService.selectDayHours(this.getLoggedId(),this.form.id_base, this.form.id_evento, this.form.date).then(
        response => {
          this.selects.hours = response;
          this.hideWaitAboveAll();
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");        
        }
      );
    },
    selBase() {
      Vue.nextTick().then(response => {
        this.selects.events = [];
        this.selects.days = [];
        this.selects.hours = [];

        this.form.id_evento = "";
        this.form.date = "";
        this.form.hour = "";

        this.populateEvents();
      });
    },
    selEvent() {
      Vue.nextTick().then(response => {
        this.selects.days = [];
        this.selects.hours = [];

        this.form.date = "";
        this.form.hour = "";

        this.populateDays();
      });
    },
    selDays() {
      Vue.nextTick().then(response => {
        this.selects.hours = [];

        this.form.hour = "";

        this.populateHours();
      });
    },
    selHours() {

    },
    search(print) {
        if (print == null || print == undefined) {
          print = true;
        }
        this.executedAtLeastOne = true;
        if (!this.validate()) {
          this.toastError("Verifique os campos");
          return;
        }
        this.executed = false;
        this.processing = true;
        this.$wait.start("inprocess");

        this.showWaitAboveAll();
        eventService.borderokey(this.getLoggedId(), this.form.id_evento, this.form.date, this.form.hour, this.form.id_base).then(
          response => {
            //this.processing = false;
            //this.hideWaitAboveAll();
            this.bordero = eventService.borderourl(response.id, this.form.id_base, print);
            this.executed = true;
            //this.$wait.end("inprocess");

            //if (response.success) {
            //  this.toastSuccess("Salvo com sucesso");
            //} else {
            //  this.toastError(response.msg);
           // }
          },
          error => {
            this.processing = false;
            this.hideWaitAboveAll();
            this.$wait.end("inprocess");
            this.toastError("Falha na execução.");
          }
        );
    },
    clear() {
      this.form.id_base = "";
      this.form.id_evento = "";
      this.form.date = "";
      this.form.hour = "";
    }
  },
  validations: {
    form: {
      id_base: {
        required,
      },
      id_evento: {
        required,
      },
      date: {
        required,
      },
      hour: {
        required,
      }
    }
  },
  data () {
    return {
      processing: false,
      executedAtLeastOne: false,
      loading: false,
      bordero: '',
      link: '',
      executed: false,
      form: {
        id_base: '',
        id_evento: '',
        date: '',
        hour: '',

        password: '',
        email: '',
      },
      selects: {
        base: [],
        events: [],
        days: [],
        hours: []
      },
      popups: {
      }
    }
  }
}
</script>

<style>
.vue-friendly-iframe iframe {
  width: 740px;
  height: 1220px;
  border: 0px;
}
</style>
