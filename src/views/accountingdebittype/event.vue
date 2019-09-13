<template>
    <div v-if="mayIsee" style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" unselectable="on" onselectstart="return false;">
      <b-container v-if="isAdd">
        <b-row class="mb-3">
          <b-col>
            <b-collapse v-model="form.collapseAccountingDebitType" id="collapse1" class="mt-2">
                <h3>Qual o tipo de débito?</h3>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text>
                      Tipo de débito:
                  </b-input-group-prepend>
                  <b-form-select v-model="form.CodTipDebBordero" v-on:change="selaccountingdebittype" :options="selects.accountingdebittypes" size="sm" />
                </b-input-group>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <b-collapse v-model="form.collapseDays" id="collapse1" class="mt-2">
                <h3>Qual os dias?</h3>
                <HotelDatePicker :id="components.datepicker.id" ref="dtpicker" :format="components.datepicker.format" :minNights="components.datepicker.minNights"
                :startDate="startDate"
                :endDate="endDate"
                :maxNights="components.datepicker.maxNights"
                :hoveringTooltip="components.datepicker.hoveringTooltip"
                :i18n="components.datepicker.ptBr"
                :displayClearButton="components.datepicker.displayClearButton"
                v-on:check-in-changed="startchanged"
                v-on:check-out-changed="endchanged"
                ></HotelDatePicker>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row class="mx-auto mb-3">
              <b-row class="mx-auto mb-3">
                  <b-button v-if="mayI('ev-accountingdebittype-add') && form.collapseButtonSave" title="Incluir" variant="outline-success" @click.stop="save">Incluir</b-button>
                  <b-button title="Voltar" variant="outline-info" @click.stop="back">Voltar</b-button>
              </b-row>
        </b-row>
      </b-container>
      <b-container v-if="!isAdd && !dummy">
        <b-row class="mb-3">
        </b-row>
        <b-row class="mx-auto mb-3">
          <b-button-group size="sm" class="mx-auto mb-3">
            <b-button variant="outline-info" @click="add">Adicionar</b-button>
          </b-button-group>
        </b-row>
        <b-row>
          <b-col>
            <b-table striped="striped"
                  outlined="outlined"
                  class="fontSize bg-white"
                  small="small"
                  hover="hover"
                  responsive
                  show-empty
                  empty-text="Não foram encontrados registros."
                  :busy="processing"
                  v-if="this.grids.result.loaded"
                  :items="this.grids.result.items"
                  :fields="this.grids.result.fields">

              <div slot="table-busy" class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Carregando...</strong>
              </div>

              <template slot="DebBordero" slot-scope="data">
                  <span style="font-size:12px;">{{data.item.DebBordero}}</span>
              </template>

              <template slot="DatIniDebito" slot-scope="data">
                  <span style="font-size:12px;">{{data.item.DatIniDebito}} - {{data.item.DatFinDebito}}</span>
              </template>

              <template slot="PerDesconto_formatted" slot-scope="data">
                  <span v-if="data.item.TipValor == 'F' || data.item.TipValor == 'V'">R$ </span>
                  {{data.item.PerDesconto_formatted}}
                  <span v-if="data.item.TipValor == 'P'">%</span>
              </template>

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('ev-accountingdebittype-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('ev-accountingdebittype-add')">
                      <b-button title="Excluir" v-if="mayI('ev-accountingdebittype-add')" @click.stop="remove(data.item,$event.target)">Excluir</b-button>
                  </b-button-group>
              </template>
            </b-table>

          </b-col>
        </b-row>
      </b-container>
      <div class="dummy" v-if="dummy"></div>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import Moment from 'moment';
import VueTimepicker from 'vue2-timepicker';  
import HotelDatePicker from 'vue-hotel-datepicker';
import ToggleButton from 'vue-js-toggle-button';
import { extendMoment } from 'moment-range';
import { func } from "@/functions";
import { EventBus } from '@/event-bus';
import { accountingdebittypeService } from '../../components/common/services/accountingdebittype';
import { defer } from 'q';
import { Datetime } from 'vue-datetime';
import { Settings } from 'luxon';

Settings.defaultLocale = 'pt';

const moment = extendMoment(Moment);

Vue.use(VueTimepicker);
Vue.use(ToggleButton);
Vue.use(VueHead);

import 'vue-datetime/dist/vue-datetime.css';

export default {
  mixins: [func],
  props: ['id', 'id_base', 'startDate', 'endDate'],
  components: { VueTimepicker, HotelDatePicker, Datetime },
  name: 'tickettypeevent-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Tipo de Débito de Bordero x Evento - ${this.typeOf}`,
      }
    },
  },
  created() {
    this.populateGrid();
  },
  computed: {
    mayIsee() {
      return this.mayI('ev-accountingdebittype-add');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    today() {
      return new Date().toString();
    }
  },
  methods: {
    back() {
      this.isAdd = false;
      this.dummy = false;
      this.form.CodTipDebBordero = '';
      this.form.selectedDate.start = '';
      this.form.selectedDate.end = '';
    },
    save() {
      if (this.processing) return;
      if (this.form.CodTipDebBordero != '' && this.form.selectedDate.start != '' && this.form.selectedDate.end != '') {
        this.showWaitAboveAll();
        accountingdebittypeService.eventsave(this.getLoggedId(), this.id_base, this.id, this.form.CodTipDebBordero, this.form.selectedDate.start, this.form.selectedDate.end).then(
          response => {
            this.hideWaitAboveAll();
            this.processing = false;

            if (this.validateJSON(response)) {
              if (response.success == true) {
                this.toastSuccess(response.msg);
                this.populateGrid();
                this.isAdd = false;
                this.dummy = false;
                this.clear();

                EventBus.$emit('reloadinfo', true);
              }
              else {
                this.toastError(response.msg);
              }
            }
          },
          error => {
            this.hideWaitAboveAll();
            this.processing = false;
            this.toastError("Falha na execução.");
          }
        );        

      }
    },
    remove(data) {
      if (this.processing) return;
      this.$swal({
          type: 'question',
          text: `Deseja excluir o tipo de débito de bordero ${data.DebBordero}?`,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          preConfirm: () => {
            this.removeinternal(data.CodTipDebBordero);  
          },
      });
    },
    removeinternal(code) {
      if (this.processing) return;

      this.showWaitAboveAll();

      if (code != '') {
        accountingdebittypeService.eventremove(this.getLoggedId(), this.id_base, this.id, code).then(
          response => {
            this.hideWaitAboveAll();
            this.processing = false;

            if (this.validateJSON(response)) {
              if (response.success == true) {
                this.toastSuccess(response.msg);
                this.populateGrid();
                this.isAdd = false;
                this.dummy = false;
                this.clear();

                EventBus.$emit('reloadinfo', true);
              }
              else {
                this.toastError(response.msg);
              }
            }
          },
          error => {
            this.hideWaitAboveAll();
            this.processing = false;
            this.toastError("Falha na execução.");
          }
        );        
      }
    },
    startchanged(date) {
      this.form.selectedDate.start = moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : '';
      this.form.collapseButtonSave = true;
    },
    endchanged(date) {
      this.form.selectedDate.end = moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : '';
      this.form.collapseButtonSave = true;
    },
    selaccountingdebittype() {
      this.form.collapseDays = true;
    },
    add() {
      this.isAdd = true;
      this.dummy = true;
      this.populateAccountingDebitType();
    },
    edit() {
      this.isAdd = false;
      this.dummy = true;
      this.populateAccountingDebitType();
    },
    populateAccountingDebitType() {
      this.showWaitAboveAll();
      accountingdebittypeService.select(this.getLoggedId(),this.id_base).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
              this.selects.accountingdebittypes = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );      
    },
    populateGrid() {
      if (this.processing) return;
      this.clear();
      this.processing = true;

      this.showWaitAboveAll();
      accountingdebittypeService.eventlist(this.getLoggedId(), this.id, this.id_base).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
              this.dummy = false;
              this.grids.result.loaded = true;
              this.grids.result.items = response;
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );      
    },
    clear() {
      this.form.CodTipDebBordero = "";
      this.form.collapseAccountingDebitType = true;
      this.form.collapseDays = false;
      this.form.collapseButtonSave = false;
      this.form.selectedDate.end = '';
      this.form.selectedDate.start = '';
    },
  },
  filters: {
      money: function (value) {
          //let v = parseFloat(value)/100;
          return `R$ ${parseFloat(value).toFixed(2)}`;
      },
      per: function (value) {
          //let v = parseFloat(value)/100;
          let help = parseFloat(value).toFixed(2);
          if (help.endsWith('.00')) {
            let helpSplit = help.split('.');
            help = helpSplit[0];
          }
          return `${help}%`;
      },
      yesorno: function (value) {
          return value == 'S' ? "Sim" : "Não";
      },
  },
  data () {
    return {
        processing: false,
        dummy: true,
        loading: false,
        isAdd: false,
        components: { 
          datepicker: {
            id: 1,
            format: 'DD/MM/YYYY',
            minNights: 0,
            maxNights: 0,
            hoveringTooltip: true,
            displayClearButton: true,
            ptBr: {
              night: 'Dia',
              nights: 'Dias',
              'day-names': ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
              'check-in': 'Início',
              'check-out': 'Fim',
              'month-names': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            }
          }
        },
        form: {
          loaded: false,
          CodTipBilhete: '',
          row: null,
          collapseAccountingDebitType: true,
          collapseDays: false,
          collapseButtonSave: false,
          selectedDate: {
            start: '',
            end: ''
          },
        },
        selects: {
          accountingdebittypes: [],
        },
        grids: {
          result: {
            processing: false,
            loaded: false,
            total: 0,
            currentPage: 1,
            perPage: 1000,
            items: [],
            fields: {
                DebBordero: { label: 'Nome', sortable: false, tdClass: 'table_column_DebBordero' },
                DatIniDebito: { label: 'Início', sortable: false },
                PerDesconto_formatted: { label: 'Valor', sortable: false },
                actions: { label: 'Ações' }
            },
          },
        }
    }
  }
}
</script>
<style>
.fontsizetimepicker {
  font-size:.875rem !important;
}
.v-switch-label {
  color: #4d4d4d !important;
}
.table_column_DebBordero {
  width: 150px;
}
.table_column_ValPeca {
  width: 115px;
}
.deletedate {
  cursor: pointer;
}
</style>

<style scoped>
.weekDays-selector input {
  display: none!important;
}

.weekDays-selector input[type=checkbox] + label {
  display: inline-block;
  border-radius: 50%;
  background: #dddddd;
  height: 40px;
  width: 40px;
  margin-right: 3px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  transition: 0.4s; 
}

.weekDays-selector input[type=checkbox]:checked + label {
  background: #2c3e50;
  color: #ffffff;
}

.modal-dialog {
  width: fit-content;
  max-width: 760px !important;
  width: 760px !important
}
.centerforme {
  justify-content: center;
  display: flex;
}
.disablemeinput {
  background: #404040;
}
.disablemelabel {
  color: #b3b3b3;
}
.dummy {
  height: 200px;
}
.input.display-time {
  font-size:.875rem;
}

</style>
