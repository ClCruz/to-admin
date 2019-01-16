<template>
    <div v-if="mayIsee">
      <b-container v-if="isAdd">
        <b-row>
          <b-col>
            <b-collapse v-model="form.collapseRoom" id="collapse1" class="mt-2">
                <h3>Qual a sala?</h3>
                <b-input-group size="sm">
                  <b-input-group-prepend is-text>
                      Sala:
                  </b-input-group-prepend>
                  <b-form-select v-model="form.codSala" v-on:change="selRoom" :options="selects.room" size="sm" />
                </b-input-group>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-collapse v-model="form.collapseDays" id="collapse1" class="mt-2">
                <h3>Qual os dias?</h3>
                <vue-rangedate-picker class="mx-auto mx-0 centerforme" @selected="onDateSelected" :presetRanges="components.datepicker.presetRanges" :format="components.datepicker.format" :months="components.datepicker.months" :shortDays="components.datepicker.shortDays" :captions="components.datepicker.captions" i18n="EN">
                </vue-rangedate-picker>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-collapse v-model="form.collapseWeekdays" id="collapse1" class="mt-2">
                <h3>Quais os dias da semana?</h3>
                <div class="weekDays-selector mx-auto mx-0 centerforme">
                  <input type="checkbox" @click="clickedonweekday" id="weekday-mon" v-model="form.weekday.mon" :disabled="!form.weekday.monEnabled" v-bind:class="{ disablemeinput: !form.weekday.monEnabled }" class="weekday" />
                  <label for="weekday-mon" v-bind:class="{ disablemelabel: !form.weekday.monEnabled }">SEG</label>
                  <input type="checkbox" @click="clickedonweekday" id="weekday-tue" v-model="form.weekday.tue" :disabled="!form.weekday.tueEnabled" v-bind:class="{ disablemeinput: !form.weekday.tueEnabled }" class="weekday" />
                  <label for="weekday-tue" v-bind:class="{ disablemelabel: !form.weekday.tueEnabled }">TER</label>
                  <input type="checkbox" @click="clickedonweekday" id="weekday-wed" v-model="form.weekday.wed" :disabled="!form.weekday.wedEnabled" v-bind:class="{ disablemeinput: !form.weekday.wedEnabled }" class="weekday" />
                  <label for="weekday-wed" v-bind:class="{ disablemelabel: !form.weekday.wedEnabled }">QUA</label>
                  <input type="checkbox" @click="clickedonweekday" id="weekday-thu" v-model="form.weekday.thu" :disabled="!form.weekday.thuEnabled" v-bind:class="{ disablemeinput: !form.weekday.thuEnabled }" class="weekday" />
                  <label for="weekday-thu" v-bind:class="{ disablemelabel: !form.weekday.thuEnabled }">QUI</label>
                  <input type="checkbox" @click="clickedonweekday" id="weekday-fri" v-model="form.weekday.fri" :disabled="!form.weekday.friEnabled" v-bind:class="{ disablemeinput: !form.weekday.friEnabled }" class="weekday" />
                  <label for="weekday-fri" v-bind:class="{ disablemelabel: !form.weekday.friEnabled }">SEX</label>
                  <input type="checkbox" @click="clickedonweekday" id="weekday-sat" v-model="form.weekday.sat" :disabled="!form.weekday.satEnabled" v-bind:class="{ disablemeinput: !form.weekday.satEnabled }" class="weekday" />
                  <label for="weekday-sat" v-bind:class="{ disablemelabel: !form.weekday.satEnabled }">SAB</label>
                  <input type="checkbox" @click="clickedonweekday" id="weekday-sun" v-model="form.weekday.sun" :disabled="!form.weekday.sunEnabled" v-bind:class="{ disablemeinput: !form.weekday.sunEnabled }" class="weekday" />
                  <label for="weekday-sun" v-bind:class="{ disablemelabel: !form.weekday.sunEnabled }">DOM</label>
                </div>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-collapse v-model="form.collapseSession" id="collapse1" class="mt-2">
                <h3>Adicione as sessões</h3>
                <b-row>
                    <b-col>
                      <b-input-group size="sm">
                        <b-input-group-prepend is-text>
                            Horário:
                        </b-input-group-prepend>
                        <vue-timepicker v-model="form.sessionTime" format="HH:mm" :minute-interval="1"></vue-timepicker>
                      </b-input-group>
                    </b-col>
                    <b-col>
                      <b-input-group size="sm" prepend="R$">
                        <b-form-input prepend="R$" type="text" v-model.lazy="form.amount" v-money="components.money">
                        </b-form-input>
                      </b-input-group>
                    </b-col>
                    <b-col>
                      <b-button type="button" variant="secondary" size="sm" @click="addnewsession">
                        Adicionar
                      </b-button>
                    </b-col>
                </b-row>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-collapse v-model="grids.added.loaded" id="collapse1" class="mt-2">
                <h4>Dias gerados:</h4>
                <b-row>
                    <b-col>
                      <b-table striped="striped"
                              outlined="outlined"
                              class="fontSize tableClicked bg-white"
                              small="small"
                              hover="hover"
                              responsive
                              show-empty
                              empty-text="Não foram encontrados registros."
                              v-if="grids.added.loaded"
                              :items="grids.added.items"
                              :fields="grids.added.fields">


                          <template slot="actions" slot-scope="data">
                              <span v-if="!mayI('ev-add')">-</span>
                              <b-button-group size="sm" v-if="mayI('ev-add')">
                                  <b-button title="Editar" v-if="mayI('ev-add')" @click.stop="edit(data.item,$event.target)">Remover</b-button>
                              </b-button-group>
                          </template>
                      </b-table>

                    </b-col>
                </b-row>
            </b-collapse>
          </b-col>
        </b-row>
      </b-container>
      <b-container v-if="!isAdd">
        <b-row>
          <b-col>
            <b-button-group size="sm">
              <b-button variant="info" @click="add">Adicionar</b-button>
              <b-button variant="info" @click="edit" :disabled="form.codApresentacao == ''">Alterar</b-button>
            </b-button-group>
          </b-col>
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
                  @row-clicked="rowClick"
                  v-if="this.grids.result.loaded"
                  :items="this.grids.result.items"
                  :fields="this.grids.result.fields">

              <template slot="active" slot-scope="data">
                <b-button size="sm" @click="removeAdded(data.item)" title="Remover" variant="danger">
                    Remover
                </b-button>
              </template>
            </b-table>

          </b-col>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import { func } from "@/functions";
import { presentationService } from '../../components/common/services/presentation';
import { roomService } from '../../components/common/services/room';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import VueRangedatePicker from 'vue-rangedate-picker';
import VueTimepicker from 'vue2-timepicker';
import { VMoney } from 'v-money';


const moment = extendMoment(Moment);

Vue.use(VueRangedatePicker);
Vue.use(VueTimepicker);

Vue.use(VueHead);

export default {
  mixins: [func],
  props: ['id', 'id_base'],
  directives: {money: VMoney},
  components: { VueTimepicker, VueRangedatePicker },
  name: 'pres-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Apresentação - ${this.typeOf}`,
      }
    },
  },
  created() {
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
    selRoom() {
      this.form.collapseDays = true;
    },
    addnewsession() {
      Vue.nextTick().then(response => {
        let howmanytoadd = 0;
        let do_mon = false, do_tue = false, do_wed = false, do_thu = false, do_fri = false, do_sat = false, do_sun = false;
        do_mon = this.form.weekday.mon;
        do_tue = this.form.weekday.tue;
        do_wed = this.form.weekday.wed;
        do_thu = this.form.weekday.thu;
        do_fri = this.form.weekday.fri;
        do_sat = this.form.weekday.sat;
        do_sun = this.form.weekday.sun;

        howmanytoadd = (do_mon ? 1 : 0) + 
                        (do_tue ? 1 : 0) +
                        (do_wed ? 1 : 0) +
                        (do_thu ? 1 : 0) +
                        (do_fri ? 1 : 0) +
                        (do_sat ? 1 : 0) +
                        (do_sun ? 1 : 0)

        for (let index = 1; index <= howmanytoadd; index++) {
          let weekday = 0;
          let weekdayName = "";

          if (do_mon) {
            weekday = 2;
            weekdayName = "Segunda";
            do_mon = false;
          }
          if (do_tue && weekday == 0) {
            weekday = 3;
            weekdayName = "Terça";
            do_tue = false;
          }
          if (do_wed && weekday == 0) {
            weekday = 4;
            weekdayName = "Quarta";
            do_wed = false;
          }
          if (do_thu && weekday == 0) {
            weekday = 5;
            weekdayName = "Quinta";
            do_thu = false;
          }
          if (do_fri && weekday == 0) {
            weekday = 6;
            weekdayName = "Sexta";
            do_fri = false;
          }
          if (do_sat && weekday == 0) {
            weekday = 0;
            weekdayName = "Sabado";
            do_sat = false;
          }
          if (do_sun && weekday == 0) {
            weekday = 1;
            weekdayName = "Domingo";
            do_sun = false;
          }

          let obj = {
            codSala: this.form.codSala,
            codApresentacao: this.form.codApresentacao,
            weekdayName,
            weekday,
            ValPeca: this.form.amount,
            HorSessao: `${this.form.sessionTime.HH}:${this.form.sessionTime.mm}`,
            dateStart: this.form.selectedDate.start,
            dateEnd: this.form.selectedDate.end,
          };
          this.grids.added.items.push(obj);
          
        }
        
        this.grids.added.loaded = true;
      });
    },
    removeAdded() {

    },
    add() {
      this.isAdd = true;
      this.populateRoom();
    },
    edit() {
      this.isAdd = true;
      this.populateRoom();
    },
    rowClick(record, index) {
      // 'record' will be the row data from items
      // `index` will be the visible row number (available in the v-model 'shownItems')
      //console.log(record); // This will be the item data for the row
      //console.log(record._rowVariant)
      if (this.form.row != null) this.form.row._rowVariant = null;

      if (record.CodApresentacao == this.form.codApresentacao && record.CodSala == this.form.codSala) {
        this.form.codApresentacao = '';
        this.form.codSala = '';
        return;
      }      

      this.form.row = record;

      record._rowVariant = record._rowVariant == 'info' ? '' : 'info';


      this.form.codApresentacao = record.CodApresentacao;
      this.form.codSala = record.CodSala;
    },
    save() {
    },
    workwithweekdays() {
      let weeks = new Array();
      if (moment(this.form.selectedDate.start).isValid()) {
        if (this.form.selectedDate.end == null) {
          weeks.push(moment(this.form.selectedDate.start).day());
        }
        else {
          let range = moment.range(this.form.selectedDate.start, this.form.selectedDate.end);
          let days = range.by('day', { step: 1 });
          for (let day of range.by('day', { step: 1 })) {
            weeks.push(day.day());
          }
        }
      }

      this.form.weekday.sunEnabled = weeks.includes(1);
      this.form.weekday.monEnabled = weeks.includes(2);
      this.form.weekday.tueEnabled = weeks.includes(3);
      this.form.weekday.wedEnabled = weeks.includes(4);
      this.form.weekday.thuEnabled = weeks.includes(5);
      this.form.weekday.friEnabled = weeks.includes(6);
      this.form.weekday.satEnabled = weeks.includes(0);

    },
    clickedonweekday: function() {
      Vue.nextTick().then(response => {
        if (this.form.weekday.mon
          || this.form.weekday.tue
          || this.form.weekday.wed
          || this.form.weekday.thu
          || this.form.weekday.fri
          || this.form.weekday.sat
          || this.form.weekday.sun) {
            this.form.collapseSession = true;
        }
        else if (!this.form.weekday.mon
          && !this.form.weekday.tue
          && !this.form.weekday.wed
          && !this.form.weekday.thu
          && !this.form.weekday.fri
          && !this.form.weekday.sat
          && !this.form.weekday.sun) {
          this.form.collapseSession = false;
        }
      });
    },
    onDateSelected: function (daterange) {
      this.form.selectedDate = daterange;
      this.form.collapseWeekdays = true;
      this.workwithweekdays();
    },
    populateRoom() {
      this.showWaitAboveAll();
      roomService.select(this.id_base).then(
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
      presentationService.list(this.getLoggedId(), this.id_base, this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
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
      this.form.collapseRoom = true;
      this.form.collapseDays = false;
      this.form.collapseWeekdays = false;
      this.form.collapseSession = false;
      this.form.weekday.monEnabled = false;
      this.form.weekday.mon = false;
      this.form.weekday.tueEnabled = false;
      this.form.weekday.tue = false;
      this.form.weekday.wedEnabled = true;
      this.form.weekday.wed = false;
      this.form.weekday.thuEnabled = true;
      this.form.weekday.thu = false;
      this.form.weekday.friEnabled = true;
      this.form.weekday.fri = false;
      this.form.weekday.satEnabled = true;
      this.form.weekday.sat = false;
      this.form.weekday.sunEnabled = true;
      this.form.sun = false;
      this.form.selectedDate.end = '';
      this.form.selectedDate.start = '';
    },
  },
  data () {
    return {
        processing: false,
        loading: false,
        isAdd: false,
        components: { 
          money: {
              decimal: '.',
              thousands: '',
              //prefix: 'R$ ',
              //suffix: ' #',
              precision: 2,
              masked: false /* doesn't work with directive */
          },
          datepicker: {
            months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
            captions: {
              'title': 'Escolha uma ou duas datas',
              'ok_button': 'Escolher'
            },
            format: 'DD/MM/YYYY',
            presetRanges: {
              today: function () { return { label: "Hoje", active: false, dateRange: { start: moment().startOf('day').add('days', 1).toDate(), end: moment().endOf('day').add('days', 1).toDate() } }; },
              thisMonth: function () {  return { label: "5 dias", active: false, dateRange: { start: moment().startOf('day').add('days', 1).toDate(), end: moment().endOf('day').add('days', 1).add(5, "days").toDate() } }; },
              lastMonth: function () { return {  label: '1 semana', active: false, dateRange: { start: moment().startOf('day').add('days', 1).toDate(), end: moment().endOf('day').add('days', 1).add(1, "week").toDate() } }; },
              last7days: function () { return {  label: '1 mês', active: false, dateRange: { start: moment().startOf('day').add('days', 1).toDate(), end: moment().endOf('day').add('days', 1).add(1, "month").toDate() } }; },
              //  last30days: function () { return {  label: '2 meses', active: false, dateRange: { start: moment().startOf('day').toDate(), end: moment().endOf('day').add(2, "month").toDate() } }; },
            } 
          }
        },
        form: {
          loaded: false,
          codApresentacao: '',
          codSala: '',
          row: null,
          collapseRoom: true,
          collapseDays: false,
          collapseWeekdays: false,
          collapseSession: false,
          weekday: {
            monEnabled: false,
            mon: false,
            tueEnabled: false,
            tue: false,
            wedEnabled: true,
            wed: false,
            thuEnabled: true,
            thu: false,
            friEnabled: true,
            fri: false,
            satEnabled: true,
            sat: false,
            sunEnabled: true,
            sun: false,
          },
          selectedDate: {
            start: '',
            end: ''
          },
          amount: '',
          sessionTime: {
            HH: "00",
            mm: "00",
            ss: "00"
          },
        },
        selects: {
          room: [],
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
                NomSala: { label: 'Sala', sortable: false },
                weekdayName: { label: 'Dia da Semana', sortable: false },
                DatApresentacao: { label: 'Data', sortable: false },
                HorSessao: { label: 'Hora', sortable: false },
                ValPeca: { label: 'Valor', sortable: false },
                StaAtivoWeb: { label: 'Ativo Web?', sortable: false },
                StaAtivoBilheteria: { label: 'Ativo Bilheteria?', sortable: false },
            },
          },
          added: {
            processing: false,
            loaded: false,
            total: 0,
            currentPage: 1,
            perPage: 1000,
            items: [],
            fields: {
                weekdayName: { label: 'Dia da Semana', sortable: false },
                HorSessao: { label: 'Hora', sortable: false },
                ValPeca: { label: 'Valor', sortable: false },
                actions: { label: 'Excluir', sortable: false }
            },
          }
        }
    }
  }
}
</script>

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
</style>
