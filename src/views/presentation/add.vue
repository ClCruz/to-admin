<template>
    <div v-if="mayIsee" style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" unselectable="on" onselectstart="return false;">
      <b-container v-if="!isAdd && isModify">
        <b-row class="mb-3">
        </b-row>
        <b-row class="mb-3">
            <h2>Alterar dados de uma apresentação.</h2>
        </b-row>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text>
                Sala:
            </b-input-group-prepend>
            <b-input-group-prepend is-text>
                {{this.form.modify.NomSala}}
            </b-input-group-prepend>
          </b-input-group>
        </b-row>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text>
                Data:
            </b-input-group-prepend>
            <b-input-group-prepend is-text>
                {{this.form.modify.Date}}
            </b-input-group-prepend>
          </b-input-group>
        </b-row>
        <b-row class="mb-3">
          <b-input-group size="sm">
            <b-input-group-prepend is-text>
                Horário:
            </b-input-group-prepend>
            <vue-timepicker v-model="form.modify.sessionTime" format="HH:mm" :minute-interval="1" class="fontsizetimepicker"></vue-timepicker>
          </b-input-group>
        </b-row>
        <b-row class="mb-3">
          <b-input-group size="sm" prepend="R$">
            <b-form-input ref="amount" prepend="R$" type="text" v-model.lazy="form.modify.amount" v-money="components.money">
            </b-form-input>
          </b-input-group>
        </b-row>
        <b-row>
          <b-col>
            <toggle-button v-model="form.modify.allowweb" :width="110" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Vender Web', unchecked: 'Não vender Web' }"/>
          </b-col>
          <b-col>
            <toggle-button v-model="form.modify.allowticketoffice" :width="140" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Vender Bilheteria', unchecked: 'Não vender Bilheteria' }"/>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-button-group size="sm" class="mx-auto mb-3">
            <b-button variant="outline-info" @click="modifypresentation">Alterar</b-button>
            <b-button variant="outline-danger" @click="deletepresentation">Remover</b-button>
            <b-button variant="outline-dark" @click="cancelmodify">Cancelar</b-button>
          </b-button-group>
        </b-row>
      </b-container>
      <b-container v-if="isAdd && !isModify">
        <b-row class="mb-3">
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
        <b-row class="mb-3" >
          <b-col>
            <b-collapse v-model="form.collapseWeekdays" id="collapse1" class="mt-2">
                <h3>Quais os dias da semana?</h3>
                <div class="weekDays-selector mx-auto mx-0 centerforme">
                  <input type="checkbox" @click="clickedonweekday" id="weekday-sun" v-model="form.weekday.sun" :disabled="!form.weekday.sunEnabled" v-bind:class="{ disablemeinput: !form.weekday.sunEnabled }" class="weekday" />
                  <label for="weekday-sun" v-bind:class="{ disablemelabel: !form.weekday.sunEnabled }">DOM</label>
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
                </div>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col>
            <b-collapse v-model="form.collapseSession" id="collapse1" class="mt-2">
                <h3>Adicione as sessões</h3>
                <b-row class="mb-3">
                    <b-col cols="6">
                      <b-input-group size="sm">
                        <b-input-group-prepend is-text>
                            Horário:
                        </b-input-group-prepend>
                        <vue-timepicker v-model="form.sessionTime" format="HH:mm" :minute-interval="1" class="fontsizetimepicker"></vue-timepicker>
                      </b-input-group>
                    </b-col>
                    <b-col>
                      <b-input-group size="sm" prepend="R$">
                        <b-form-input ref="amount" prepend="R$" type="text" v-model.lazy="form.amount" v-money="components.money">
                        </b-form-input>
                      </b-input-group>
                    </b-col>
                </b-row>
                <b-row class="mb-3">
                  <b-col>
                    <b-col>
                      <toggle-button v-model="form.allowweb" :width="110" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Vender Web', unchecked: 'Não vender Web' }"/>
                    </b-col>
                    <b-col>
                      <toggle-button v-model="form.allowticketoffice" :width="140" :color="{checked: '#b3ffb3', unchecked: '#ffb3b3', disabled: '#a6a6a6'}" :labels="{ checked: 'Vender Bilheteria', unchecked: 'Não vender Bilheteria' }"/>
                    </b-col>
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

                          <template slot="ValPeca" slot-scope="data">
                              <span>R$ {{data.item.ValPeca}}</span>
                          </template>
                          <template slot="allowweb" slot-scope="data">
                              <span v-if="data.item.allowweb"><i class="fas fa-circle"></i></span>
                              <span v-else><i class="far fa-circle"></i></span>
                          </template>
                          <template slot="allowticketoffice" slot-scope="data">
                              <span v-if="data.item.allowticketoffice"><i class="fas fa-circle"></i></span>
                              <span v-else><i class="far fa-circle"></i></span>
                          </template>
                          
                          <template slot="actions" slot-scope="data">
                              <span v-if="!mayI('ev-add')">-</span>
                              <b-button-group size="sm" v-if="mayI('ev-add')">
                                  <b-button title="Excluir" v-if="mayI('ev-add')" @click.stop="exclude(data.item,$event.target)">Remover</b-button>
                              </b-button-group>
                          </template>
                      </b-table>

                    </b-col>
                </b-row>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row class="mx-auto mb-3">
          <b-collapse v-model="grids.added.loaded" id="collapse1" class="mt-2 mx-auto mb-3">
              <b-row class="mx-auto mb-3">
                  <b-button title="Incluir" variant="outline-success" v-if="mayI('ev-add')" @click.stop="savedays">Incluir</b-button>
              </b-row>
          </b-collapse>
        </b-row>
      </b-container>
      <b-container v-if="!isAdd && !dummy && !isModify">
        <b-row class="mb-3">
        </b-row>
        <b-row class="mx-auto mb-3">
          <b-button-group size="sm" class="mx-auto mb-3">
            <b-button variant="outline-info" @click="add">Adicionar</b-button>
            <b-button variant="outline-dark" @click="edit" :disabled="!this.form.modify.selected">Alterar</b-button>
          </b-button-group>
        </b-row>
        <b-row>
          <b-col>
            Filtrar por: <i class="fas fa-times deletedate" @click="filterdate = ''"></i><datetime v-model="filterdate" class="inline" format="dd/MM/yyyy" value-zone="America/Sao_Paulo" zone="America/Sao_Paulo"></datetime>
            <b-table striped="striped"
                  outlined="outlined"
                  class="fontSize bg-white"
                  small="small"
                  hover="hover"
                  responsive
                  show-empty
                  empty-text="Não foram encontrados registros."
                  @row-clicked="rowClick"
                  :busy="processing"
                  v-if="this.grids.result.loaded"
                  :items="gridfiltered"
                  :fields="this.grids.result.fields">

              <div slot="table-busy" class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Carregando...</strong>
              </div>
              <template slot="ValPeca" slot-scope="data">
                  <span>{{data.item.ValPeca | money}}</span>
              </template>
              <template slot="StaAtivoBilheteria" slot-scope="data">
                  <span>{{data.item.StaAtivoBilheteria | yesorno}}</span>
              </template>
              <template slot="StaAtivoWeb" slot-scope="data">
                  <span>{{data.item.StaAtivoWeb | yesorno}}</span>
              </template>
              <template slot="DatApresentacao" slot-scope="data">
                <span>
                  {{data.item.DatApresentacao}}
                </span>
                <span> - </span>
                <span> {{data.item.HorSessao }}</span>
                <span> ({{data.item.weekdayName }})</span>
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
import { VMoney } from 'v-money';
import { extendMoment } from 'moment-range';
import { func } from "@/functions";
import { EventBus } from '@/event-bus';
import { presentationService } from '../../components/common/services/presentation';
import { roomService } from '../../components/common/services/room';
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
  props: ['id', 'id_base', 'id_local_evento'],
  directives: {money: VMoney},
  components: { VueTimepicker, HotelDatePicker, Datetime },
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
    this.populateGrid();
  },
  computed: {
    gridfiltered() {
      if (this.filterdate == '') {
        return this.grids.result.items;
      }
      return this.grids.result.items.filter(x=> x.DatApresentacao == moment(this.filterdate).format("DD/MM/YYYY"));
    },
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
    savedays() {
      this.showWaitAboveAll();
      presentationService.save(this.getLoggedId(), this.grids.added.items,this.id_base).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response)) {
            if (response.success == true) {
              this.toastSuccess("Cadastrado com sucesso");
              this.populateGrid();
              //console.log(this.$parent);
              //this.$parent.$parent.teste();
              this.isAdd = false;
              this.dummy = false;
              this.clear();
              this.$refs.amount.$el.value = "";

              this.form.sessionTime = {
                HH: "00",
                mm: "00",
                ss: "00"
              };

              EventBus.$emit('reloadinfo', true);
            }
            else {
              this.toastError(response.msg);
            }
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );  
    },
    startchanged(date) {
      this.form.selectedDate.start = moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : '';
      this.form.collapseWeekdays = true;
      this.workwithweekdays();
    },
    endchanged(date) {
      this.form.selectedDate.end = moment(date).isValid() ? moment(date).format("YYYY-MM-DD") : '';
      this.form.collapseWeekdays = true;
      this.workwithweekdays();
    },
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
            weekday = 1;
            weekdayName = "Segunda";
            do_mon = false;
          }
          if (do_tue && weekday == 0) {
            weekday = 2;
            weekdayName = "Terça";
            do_tue = false;
          }
          if (do_wed && weekday == 0) {
            weekday = 3;
            weekdayName = "Quarta";
            do_wed = false;
          }
          if (do_thu && weekday == 0) {
            weekday = 4;
            weekdayName = "Quinta";
            do_thu = false;
          }
          if (do_fri && weekday == 0) {
            weekday = 5;
            weekdayName = "Sexta";
            do_fri = false;
          }
          if (do_sat && weekday == 0) {
            weekday = 6;
            weekdayName = "Sabado";
            do_sat = false;
          }
          if (do_sun && weekday == 0) {
            weekday = 7;
            weekdayName = "Domingo";
            do_sun = false;
          }

          let obj = {
            codSala: this.form.codSala,
            codApresentacao: this.form.codApresentacao,
            id_evento: this.id,
            id_base: this.id_base,
            weekdayName,
            weekday,
            ValPeca: this.form.amount,
            amount: this.form.amount*100,
            HorSessao: `${this.form.sessionTime.HH}:${this.form.sessionTime.mm}`,
            dateStart: this.form.selectedDate.start,
            dateEnd: this.form.selectedDate.end,
            allowweb: this.form.allowweb,
            allowwebBIT: this.form.allowweb ? 1 : 0,
            allowticketoffice: this.form.allowticketoffice,
            allowticketofficeBIT: this.form.allowticketoffice ? 1 : 0,
          };
          if (this.grids.added.items.filter(function (data) {
            return data.codSala == obj.codSala && data.HorSessao == obj.HorSessao && data.weekday == obj.weekday;
          }).length == 0) {
            this.grids.added.items.push(obj);
          }
        }
        this.grids.added.loaded = true;
        this.grids.added.items = this.grids.added.items.sort((a, b) => {
          return a.weekday - b.weekday;
        });
      });
    },
    exclude(item) {
      this.grids.added.items = this.grids.added.items.filter(data=> {
        return (data.weekday.toString()+"|"+data.HorSessao) != (item.weekday.toString()+"|"+item.HorSessao);
      });
    },
    add() {
      this.isAdd = true;
      this.dummy = true;
      this.populateRoom();
    },
    deletepresentation() {
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
              this.isModify = false;
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
    modifypresentation() {
      if (this.processing) return;

      let amount = parseInt(parseFloat(this.form.modify.amount)*100);

      if (amount < 0) {
        this.toastError("Valor não pode ser negativo.");
        return;
      }

      this.processing = true;
      this.showWaitAboveAll();
      presentationService.modify(this.getLoggedId(), this.form.modify.CodApresentacao, this.form.modify.sessionTime.HH+":"+this.form.modify.sessionTime.mm, amount, this.form.modify.allowweb, this.form.modify.allowticketoffice, this.id_base).then(
        response => {
          this.hideWaitAboveAll();
          this.processing = false;

          if (this.validateJSON(response)) {
            if (response.success == true) {
              this.toastSuccess(response.msg);
              this.populateGrid();
              this.isAdd = false;
              this.isModify = false;
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
    cancelmodify() {
      this.isAdd = false;
      this.isModify = false;
      this.dummy = false;
      this.form.row = null;
      this.form.modify.selected = false;
      this.form.modify.CodSala = '';
      this.form.modify.Date = '';
      this.form.modify.CodApresentacao = '';
      this.form.modify.NomSala = '';
      this.form.modify.StaAtivoBilheteria = '';
      this.form.modify.StaAtivoWeb = '';
      this.form.modify.ValPeca = '';
      this.form.modify.amount = '';
      this.form.modify.HorSessao = '';
      this.form.modify.allowweb = false;
      this.form.modify.allowticketoffice = false;
      this.form.modify.sessionTime = { HH: "00", mm: "00", ss: "00" };
      this.populateGrid();
    },
    edit() {
      this.isAdd = false;
      this.isModify = true;
      this.dummy = true;
      this.populateRoom();
    },
    rowClick(record, index) {
      // 'record' will be the row data from items
      // `index` will be the visible row number (available in the v-model 'shownItems')
      //console.log(record); // This will be the item data for the row
      //console.log(record._rowVariant)

      if (this.form.row != null) this.form.row._rowVariant = null;

      if (record.CodApresentacao == this.form.modify.CodApresentacao) {
        this.form.modify.selected = false;
        this.form.modify.CodSala = '';
        this.form.modify.Date = '';
        this.form.modify.CodApresentacao = '';
        this.form.modify.NomSala = '';
        this.form.modify.StaAtivoBilheteria = '';
        this.form.modify.StaAtivoWeb = '';
        this.form.modify.ValPeca = '';
        this.form.modify.amount = '';
        this.form.modify.HorSessao = '';
        this.form.modify.allowweb = false;
        this.form.modify.allowticketoffice = false;
        this.form.modify.sessionTime = { HH: "00", mm: "00", ss: "00" };
        return;
      }      

      this.form.row = record;

      record._rowVariant = record._rowVariant == 'info' ? '' : 'info';
      this.form.modify.selected = true;
      this.form.modify.CodSala = record.CodSala;
      this.form.modify.Date = record.DatApresentacao;
      this.form.modify.CodApresentacao = record.CodApresentacao;
      this.form.modify.NomSala = record.NomSala;
      this.form.modify.StaAtivoBilheteria = record.StaAtivoBilheteria;
      this.form.modify.StaAtivoWeb = record.StaAtivoWeb;
      this.form.modify.allowweb = record.StaAtivoWeb == 'S';
      this.form.modify.allowticketoffice = record.StaAtivoBilheteria == 'S';
      this.form.modify.amount = record.amount;
      this.form.modify.ValPeca = record.ValPeca;
      this.form.modify.HorSessao = record.HorSessao;
      this.form.modify.sessionTime = { HH: record.HorSessao.split(':')[0], mm: record.HorSessao.split(":")[1], ss: "00" };
    },
    save() {
    },
    workwithweekdays() {
      let weeks = new Array();
      if (moment(this.form.selectedDate.start).isValid()) {
        if (this.form.selectedDate.end == null || this.form.selectedDate.end == "") {
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
      this.form.weekday.sunEnabled = weeks.includes(7) || weeks.includes(0);
      this.form.weekday.monEnabled = weeks.includes(1);
      this.form.weekday.tueEnabled = weeks.includes(2);
      this.form.weekday.wedEnabled = weeks.includes(3);
      this.form.weekday.thuEnabled = weeks.includes(4);
      this.form.weekday.friEnabled = weeks.includes(5);
      this.form.weekday.satEnabled = weeks.includes(6);

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
    populateRoom() {
      this.showWaitAboveAll();
      roomService.select(this.getLoggedId(), this.id_base, this.id_local_evento).then(
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
      this.form.amount = "";
      this.form.codSala = '';
      this.grids.added.items = [];
      this.grids.added.loaded = false;

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
  filters: {
      yesorno: function (value) {
          return value == 'S' ? "Sim" : "Não";
      },
      money: function (value) {
          //let v = parseFloat(value)/100;
          return `R$ ${parseFloat(value).toFixed(2)}`;
      }
  },
  data () {
    return {
        processing: false,
        filterdate: '',
        dummy: true,
        loading: false,
        isAdd: false,
        isModify: false,
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
          modify: {
            selected: false,
            Date: '',
            CodSala: '',
            CodApresentacao: '',
            NomSala: '',
            StaAtivoBilheteria: '',
            StaAtivoWeb: '',
            ValPeca: '',
            amount: '',
            HorSessao: '',
            sessionTime: {
              HH: "00",
              mm: "00",
              ss: "00"
            },
          },
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
          allowweb: true,
          allowticketoffice: true,
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
                NomSala: { label: 'Sala', sortable: false, tdClass: 'table_column_NomSala' },
                DatApresentacao: { label: 'Data/Hora', sortable: false },
                ValPeca: { label: 'Valor', sortable: false, tdClass: 'table_column_ValPeca' },
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
                allowweb: { label: 'Web', sortable: false },
                allowticketoffice: { label: 'Bilheteria', sortable: false },
                actions: { label: 'Ações', sortable: false }
            },
          }
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
.table_column_NomSala {
  width: 215px;
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
