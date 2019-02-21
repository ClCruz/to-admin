<template>
        <b-container>            
            <b-modal ref="detailModal" hide-footer title="Detalhes" class="movimentmodal">
                <div class="d-block text-center">
                    <h4>{{popups.detail.name}}</h4>
                </div>
                <b-table striped="striped"
                            outlined="outlined"
                            class="fontSize tableClicked bg-white"
                            small="small"
                            hover="hover"
                            responsive
                            show-empty
                            empty-text="Não foram encontrados registros."
                            v-if="this.popups.detail.grids.detail.loaded"
                            :items="this.popups.detail.grids.detail.items"
                            :fields="this.popups.detail.grids.detail.fields">

                    <template slot="amount" slot-scope="data">
                        {{data.item.amount | money }}
                    </template>
                </b-table>
                <b-btn class="mt-3" variant="outline-info" block @click="detailClose">Fechar</b-btn>
            </b-modal>
            <b-col>
                <b-row v-if="mayI('to-cashregister-closeother')" class="my-1 mb-3">
                    <b-input-group size="sm">
                        <b-input-group-prepend is-text class="firstLabel">
                            Operadores:
                        </b-input-group-prepend>
                        <b-form-select id="operators" v-model="form.id_operator" :options="operators">
                            <template slot="first">
                                <option :value="null" disabled>-- Selecione --</option>
                            </template>
                        </b-form-select>
                    </b-input-group>
                </b-row>
                <b-row class="my-1 mb-3">
                    <b-input-group size="sm">
                        <b-input-group-prepend is-text class="firstLabel">
                            Data de fechamento:
                        </b-input-group-prepend>
                        <datetime v-model="form.date"
                            id="date"
                            value-zone="America/Sao_Paulo"
                            zone="America/Sao_Paulo"
                            format="dd/MM/yyyy"
                            input-class="form-control fakebs"
                            @close="dateChange"
                        ></datetime>
                    </b-input-group>
                </b-row>
                <b-row v-if="mayI('to-cashregister-closeother')" class="my-1 mb-3">
                    <b-input-group size="sm">
                        <b-input-group-prepend is-text class="firstLabel">
                            Fechamentos:
                        </b-input-group-prepend>
                        <b-form-select id="closeds" v-model="form.id_ticketoffice_cashregister" :options="closeds" v-on:change="selectedCR">
                            <template slot="first">
                                <option :value="null" disabled>-- Selecione --</option>
                            </template>
                        </b-form-select>
                    </b-input-group>
                </b-row>
                <b-row class="mb-3">
                    <b-button type="button" variant="success" size="sm" @click="searchOpened">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                            Carregando...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Consultar abertos</span>
                    </b-button>
                    <b-button type="button" variant="success" size="sm" @click="searchByDate">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                            Carregando...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Consultar por fechamento</span>
                    </b-button>
                </b-row>
                <b-form-row>
                    <table class="table table-sm table-bordered table-hover" style="background-color: #fff;" v-if="grids.movs.loaded">
                        <thead>
                            <tr>
                                <th scope="col">Parceiro</th>
                                <th scope="col">Evento</th>
                                <th scope="col">Tipo</th>
                                <th scope="col">Forma</th>
                                <th scope="col">Qtde.</th>
                                <th scope="col">Valor</th>
                            </tr>
                        </thead>
                        <tbody v-if="grids.movs.loaded && grids.movs.items.length == 0">
                            <tr>
                                <td colspan="6">Nenhum registro encontrado.</td>
                            </tr>

                        </tbody>
                        <tbody v-if="grids.movs.loaded && grids.movs.items.length > 0">
                            <template v-for="(itembase) in grids.movsbybase.items">
                                <tr v-bind:key="'base_'+itembase.id">
                                    <td :rowspan="(itembase.rowspan)">{{itembase.ds_nome_teatro}}</td>
                                    <td :colspan="4"></td>
                                    <td>{{itembase.amountbybase | money}}
                                    </td>
                                </tr>
                                <template v-for="(itemevent) in grids.movsbyevent.items.filter(o=>o.id_base==itembase.id_base)">
                                    <tr v-bind:key="'event_'+itemevent.id" @click="detailOpen(itemevent.id_evento, itemevent.ds_evento)" v-bind:class="{ clickable: (itemevent.id_evento<0) }" :title="(itemevent.id_evento<0 ?'Clique para ver detalhes' : '')">
                                        <td :rowspan="(itemevent.rowspan)">{{itemevent.ds_evento}}</td>
                                        <td :colspan="2"></td>
                                        <td>{{itemevent.qtdbyevent}}</td>
                                        <td>{{itemevent.amountbyevent | money}}</td>
                                    </tr>
                                    <tr v-for="(item) in grids.movs.items.filter(o=>o.id_evento==itemevent.id_evento)" v-bind:key="'all_'+item.id">
                                        <td>{{item.type | typeofpayment}}</td>
                                        <td>{{item.desc}}</td>
                                        <td>{{item.qtd}}</td>
                                        <td>{{item.amount | money}}</td>                     
                                    </tr>
                                </template>
                            </template>
                        </tbody>
                    </table>
                </b-form-row>
            </b-col>
        </b-container>
</template>

<script>
import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';
import { func } from '@/functions';
import { funcOperation } from '../../components/ticketoffice/services/functions';
import { cashregisterService } from "../../components/ticketoffice/services/cashregister";
import { printService } from '../../components/ticketoffice/services/print';
import { userService } from '../../components/common/services/user';

import {mask} from 'vue-the-mask';
import { Datetime } from 'vue-datetime';

import moment from 'moment';

Vue.use(moment);

import 'vue-datetime/dist/vue-datetime.css';

export default {
    name: 'movs',
    mixins: [func, funcOperation],
    directives: {mask},
    components: { Datetime },
    computed: {
        sells () {
            return this.grids.movs.items.filter(o => o.Operacao == 'Venda');
        },
    },
    filters: {
        typeofpayment: function (value) {
            let ret = value;
            switch (value) { 
                case "add":
                    ret = "Venda";
                break;
                case "refund":
                    ret = "Estorno";
                break;
                case "withdraw":
                    ret = "Saque";
                break;
                case "diff":
                    ret = "Diferença cadastrada";
                break;
                case "cashdepositopen":
                    ret = "-";
                break
                case "cashdeposit":
                    ret = "-";
                break
            }
            return ret;
        },
        truefalse: function (value) {
            return value == 1 || value == "1" || value == true ? "Sim" : "Não";
        },
        money: function (value) {
            let v = parseFloat(value)/100;
            return `R$ ${v.toFixed(2)}`;
        }
    },
    data () {
        return {
            processing: false,
            loading: false,
            result: null,
            movsDay: [],
            operators: [],
            closeds: [],
            closedinfo: {
                id: '',
                name: '',
                login: '',
                email: '',
                justification: '',
                created: '',
                closed: '',
            },
            form: {
                id_operator: 0,
                date: null,
                datePTBR: null,
                id_ticketoffice_cashregister: '00000000-0000-0000-0000-000000000000'
            },
            popups: {  
                detail: {
                    loaded: false,
                    name: '',
                    id: '',
                    grids: {
                        detail: {
                        processing: false,
                        loaded: false,
                        items: [],
                        fields: {
                                created: { label: 'Data', sortable: false },
                                nameMoviment: { label: 'Operador', sortable: false },
                                amount: { label: 'Valor', sortable: false },
                                justification: { label: 'Justificativa', sortable: false },
                            },
                        }
                    }
            },
            },    
            grids: { 
                movs: {
                    loaded: false,
                    items: [],
                },
                movsbyevent : {
                    loaded: false,
                    items: [],
                },
                movsbybase : {
                    loaded: false,
                    items: [],
                }
            }
        }
    },
    created() {
        if (this.mayI('to-cashregister-closeother')) {
            this.populateOperators();
        }
    },
    computed: {
      
    },
    methods: {
        selectedCR() {
            Vue.nextTick().then(response => {
                this.loadme(this.form.datePTBR);
            });

        },
        detailOpen(type, desc) {
            this.popups.detail.name = desc;
            if (type<0) {
                this.detail(type);
            }
        },
        detailClose() {
            this.$refs.detailModal.hide();
        },
        searchOpened() {
            this.loadme("");
        },
        searchByDate() {
            if (this.form.datePTBR == "" || this.form.datePTBR == null) {
                this.toastError("Preencha a data de fechamento");
                return;
            }
            this.loadme(this.form.datePTBR);
        },
        populateOperators() {
            this.showWaitAboveAll();

            Vue.nextTick().then(response => {
                userService.ticketofficeuserwithpermission(this.get_id_base()).then(
                response => {
                    this.hideWaitAboveAll();
                    if (this.validateJSON(response)) {
                        this.operators = response;

                    }
                },
                error => {
                    this.hideWaitAboveAll();
                    this.toastError("Falha na execução.");        
                }
                );
            });
        },
        dateChange() {
            Vue.nextTick().then(response => {
                let ok = moment(this.form.date).format("YYYY-MM-DD");
                if (ok != "Invalid date")
                {
                    this.form.date = ok;
                    this.form.datePTBR = moment(this.form.date).format("DD/MM/YYYY");
                    this.loadCloseds();
                }
                else {
                    this.form.datePTBR = null;
                    this.closeds = [];
                }
            });
        },
        movChange() {
            Vue.nextTick().then(response => {
                this.search();
            });
        },
        loadCloseds() {
            let id = this.getLoggedId();
            if (this.mayI('to-cashregister-closeother')) {
                if (this.form.id_operator!=null && this.form.id_operator!=0) {
                    id = this.form.id_operator;
                }
            }

            this.showWaitAboveAll();
            cashregisterService.listclosed(this.get_id_base(), id, this.form.datePTBR).then(response => { 
                    this.hideWaitAboveAll(); if (this.validateJSON(response)) { this.closeds = response; }
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução.");}
            );
        },
        loadme(date) {
            let id = this.getLoggedId();
            if (this.mayI('to-cashregister-closeother')) {
                if (this.form.id_operator!=null && this.form.id_operator!=0) {
                    id = this.form.id_operator;
                }
            }
            this.showWaitAboveAll();
            cashregisterService.movimentlist(id, date, 0, this.form.id_ticketoffice_cashregister).then(response => { 
                this.hideWaitAboveAll(); if (this.validateJSON(response)) { this.grids.movs.items = response; this.grids.movs.loaded = true; }
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução.");}
            );

            this.showWaitAboveAll();
            cashregisterService.movimentlistbyevent(id, date, 0, this.form.id_ticketoffice_cashregister).then(response => { 
                    this.hideWaitAboveAll(); if (this.validateJSON(response)) { this.grids.movsbyevent.items = response; this.grids.movsbyevent.loaded = true; }
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução."); }
            );

            this.showWaitAboveAll();
            cashregisterService.movimentlistbybase(id, date, 0, this.form.id_ticketoffice_cashregister).then(response => { 
                    this.hideWaitAboveAll(); if (this.validateJSON(response)) { this.grids.movsbybase.items = response; this.grids.movsbybase.loaded = true; }
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução."); }
            );
        },
        print() {
            printService.moviment(this.get_id_base(),this.getLoggedId(), this.form.date, this.form.codMovimentacao);
        },
        detail(type) {
            let typeAux = "";
            switch (type) {
                case -1:
                    typeAux = "cashdepositopen";
                break;
                case -2:
                    typeAux = "cashdeposit";
                break;
                case -3:
                    typeAux = "withdraw";
                break;
            }
            let id = this.getLoggedId();
            if (this.mayI('to-cashregister-closeother')) {
                if (this.form.id_operator!=null && this.form.id_operator!=0) {
                    id = this.form.id_operator;
                }
            }

            let date = "open";

            if (this.form.datePTBR != "" && this.form.datePTBR != null) {
                date = this.form.datePTBR;
            }

            this.showWaitAboveAll();
            cashregisterService.movimentlistdetail(id, date, typeAux).then(response => { 
                    this.hideWaitAboveAll(); if (this.validateJSON(response)) { 
                            this.popups.detail.grids.detail.items = response;
                            this.popups.detail.grids.detail.loaded = true; 
                            this.$refs.detailModal.show();
                    }
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução."); }
            );
        },
    }
}
</script>

<style>
    .green {
        color: green;
    }
    .red {
        color: red;
    }
    .movimentmodal .modal-content {
        min-width: 620px;
    }
    .clickable {
        cursor: pointer;
    }
    .fakebs {
        height: calc(1.8125rem + 2px);
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        line-height: 1.5;
        border-radius: 0.2rem;
    }
</style>
