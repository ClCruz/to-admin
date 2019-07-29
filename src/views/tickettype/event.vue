<template>
    <div v-if="mayIsee" style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" unselectable="on" onselectstart="return false;">
      <b-container v-if="isAdd">
        <b-row class="mb-3">
          <b-col>
            <b-collapse v-model="form.collapseTicketType" id="collapse1" class="mt-2">
                <h3>Qual o bilhete?</h3>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text>
                      Bilhete:
                  </b-input-group-prepend>
                  <b-form-select v-model="form.CodTipBilhete" v-on:change="selTicketType" :options="selects.ticketype" size="sm" />
                </b-input-group>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <b-collapse v-model="form.collapseDays" id="collapse1" class="mt-2">
                <h3>Qual os dias?</h3>
                <HotelDatePicker :id="components.datepicker.id" ref="dtpicker" :format="components.datepicker.format" :minNights="components.datepicker.minNights"
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
          <b-collapse v-model="form.collapseButton" id="collapse1" class="mt-2 mx-auto mb-3">
              <b-row class="mx-auto mb-3">
                  <b-button title="Incluir" variant="outline-success" v-if="mayI('ev-add')" @click.stop="save">Incluir</b-button>
              </b-row>
          </b-collapse>
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

              <template slot="DatIniDesconto" slot-scope="data">
                  <span>{{data.item.DatIniDesconto}} - {{data.item.DatFinDesconto}}</span>
              </template>

              <template slot="isFixed" slot-scope="data">
                  <span v-if="data.item.isFixed == 1"><i class="fas fa-circle"></i></span>
                  <span v-else><i class="far fa-circle"></i></span>
              </template>

              <template slot="isPrincipal" slot-scope="data">
                  <span v-if="data.item.isPrincipal == 1"><i class="fas fa-circle"></i></span>
                  <span v-else><i class="far fa-circle"></i></span>
              </template>

              <template slot="isHalf" slot-scope="data">
                  <span v-if="data.item.isHalf == 1"><i class="fas fa-circle"></i></span>
                  <span v-else><i class="far fa-circle"></i></span>
              </template>

              <template slot="isDiscount" slot-scope="data">
                  <span v-if="data.item.isDiscount == 1"><i class="fas fa-circle"></i></span>
                  <span v-else><i class="far fa-circle"></i></span>
              </template>

              <template slot="isPlus" slot-scope="data">
                  <span v-if="data.item.isPlus == 1"><i class="fas fa-circle"></i></span>
                  <span v-else><i class="far fa-circle"></i></span>
              </template>

              <template slot="isAllotment" slot-scope="data">
                  <span v-if="data.item.isAllotment == 1"><i class="fas fa-circle"></i></span>
                  <span v-else><i class="far fa-circle"></i></span>
              </template>

              <template slot="allowweb" slot-scope="data">
                  <span v-if="data.item.allowweb == 1"><i class="fas fa-circle"></i></span>
                  <span v-else><i class="far fa-circle"></i></span>
              </template>

              <template slot="allowticketoffice" slot-scope="data">
                  <span v-if="data.item.allowticketoffice == 1"><i class="fas fa-circle"></i></span>
                  <span v-else><i class="far fa-circle"></i></span>
              </template>

              <template slot="allowapi" slot-scope="data">
                  <span v-if="data.item.allowapi == 1"><i class="fas fa-circle"></i></span>
                  <span v-else><i class="far fa-circle"></i></span>
              </template>

              <template slot="vl_preco_fixo" slot-scope="data">
                  <span v-if="data.item.isPrincipal == 1">-</span>
                  <span v-if="data.item.isFixed == 1">{{data.item.vl_preco_fixo | money }}</span>
                  <span v-if="data.item.isDiscount == 1">{{ data.item.PerDesconto | per }}</span>
                  <span v-if="data.item.isHalf == 1">{{ data.item.PerDesconto | per }}</span>
                  <span v-if="data.item.isPlus == 1">{{ data.item.vl_preco_fixo | money }}</span>
              </template>

              <template slot="active" slot-scope="data">
                <b-button size="sm" @click="removeAdded(data.item)" title="Remover" variant="danger">
                    Remover
                </b-button>
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
import { tickettypeService } from '../../components/common/services/tickettype';
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
  props: ['id', 'id_base'],
  components: { VueTimepicker, HotelDatePicker, Datetime },
  name: 'tickettypeevent-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Bilhete x Evento - ${this.typeOf}`,
      }
    },
  },
  created() {
    this.populateGrid();
  },
  computed: {
    mayIsee() {
      return this.mayI('presentation-add', 'presentation-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    today() {
      return new Date().toString();
    }
  },
  methods: {
    save() {
      this.showWaitAboveAll();
    },
    startchanged(date) {
      this.form.selectedDate.start = moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : '';
      this.form.collapseButton = true;
    },
    endchanged(date) {
      this.form.selectedDate.end = moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : '';
      this.form.collapseButton = true;
    },
    selTicketType() {
      this.form.collapseDays = true;
    },
    add() {
      this.isAdd = true;
      this.dummy = true;
      this.populateTicketType();
    },
    deletetickettype() {
      if (this.processing) return;

      this.processing = true;
      this.showWaitAboveAll();
      presentationService.remove(this.getLoggedId(), this.form.modify.CodApresentacao,this.id_base).then(
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
    },
    edit() {
      this.isAdd = false;
      this.dummy = true;
      this.populateTicketType();
    },
    populateTicketType() {
      this.showWaitAboveAll();
      tickettypeService.select(this.id_base).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
              this.selects.room = response;
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
      tickettypeService.eventlist(this.getLoggedId(), this.id, this.id_base).then(
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
      this.form.CodTipBilhete = "";
      this.form.collapseTicketType = true;
      this.form.collapseDays = false;
      this.form.collapseButton = false;
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
            maxNights: 80,
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
          collapseTicketType: true,
          collapseDays: false,
          collapseButton: false,
          selectedDate: {
            start: '',
            end: ''
          },
        },
        selects: {
          tickettype: [],
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
                TipBilhete: { label: 'Nome', sortable: false, tdClass: 'table_column_TipBilhete' },
                DatIniDesconto: { label: 'Início', sortable: false },
                isPrincipal: { label: 'Int.', sortable: false },
                isHalf: { label: 'Meia', sortable: false },
                isFixed: { label: 'Fixa', sortable: false },
                isDiscount: { label: 'Des.', sortable: false },
                isAllotment: { label: 'Lote', sortable: false },
                isPlus: { label: 'Outros', sortable: false },
                allowweb: { label: 'Web', sortable: false },
                allowticketoffice: { label: 'Bilh.', sortable: false },
                allowapi: { label: 'API', sortable: false },
                vl_preco_fixo: { label: 'Valor', sortable: false },
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
.table_column_TipBilhete {
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
