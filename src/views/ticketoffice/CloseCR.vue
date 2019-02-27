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
                <b-row v-if="mayI('to-cashregister-closeother') && !printmode" class="my-1 mb-3">
                    <b-input-group size="sm">
                        <b-input-group-prepend is-text class="firstLabel">
                            Operadores:
                        </b-input-group-prepend>
                        <b-form-select id="operators" v-model="form.id_operator" :options="operators" v-on:change="selected">
                            <template slot="first">
                                <option :value="null">-- Selecione --</option>
                            </template>
                        </b-form-select>
                    </b-input-group>
                </b-row>
                <b-row class="my-1 mb-3" v-if="!printmode">
                    <b-input-group size="sm">
                        <b-input-group-prepend is-text class="firstLabel">
                            Data de abertura do caixa:
                        </b-input-group-prepend>
                        <b-input-group-prepend is-text class="firstLabel">
                            {{dateOpen}}
                        </b-input-group-prepend>
                    </b-input-group>
                </b-row>
                <b-container id="toprint">
                    <b-form-row>
                        <b-alert show v-if="printinfo.loaded && printmode">
                            Informações de fechamento
                            <br />
                            Data de abertura: {{printinfo.created}}
                            <br />
                            Data de fechamento: {{printinfo.closed}} 
                            <br /> 
                            Fechamento realizado por: {{printinfo.name}} ({{printinfo.login}})
                            <br />
                            Teve diferença? <span v-if="hasDiff">Sim</span> <span v-else>Não</span>
                            <br v-if="printinfo.justification_closed!='' && printinfo.justification_closed != null" />
                            <span v-if="printinfo.justification_closed!='' && printinfo.justification_closed != null">Justificativa: {{printinfo.justification_closed}} </span> 
                        </b-alert>
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
                        <span v-if="printmode">
                        <br />
                        <br />
                        <br />
                        <br />
                        __________________________________
                        <br />
                        Assinatura
                        </span>
                    </b-form-row>
                </b-container>
            </b-col>
            <b-col>
                <b-row v-if="!printmode">
                    <b-table striped="striped"
                            outlined="outlined"
                            small="small"
                            hover="hover"
                            responsive
                            show-empty
                            empty-text="Não foram encontrados registros."
                            v-if="grids.movsbypayment.loaded"
                            :items="grids.movsbypayment.items"
                            :fields="grids.movsbypayment.fields">

                        <template slot="amountbypayment" slot-scope="data">
                            <span>{{data.item.amountbypayment | money}}</span>
                        </template>

                        <template slot="amountbypaymentinput" slot-scope="data">
                            <b-input-group size="sm" prepend="R$"><b-form-input prepend="R$" type="text" v-on:change="inputValChange" v-model.lazy="data.item.amountbypaymentinput" v-money="money"></b-form-input></b-input-group>
                        </template>

                        <template slot="diff" slot-scope="data">
                            <span>{{calc(data) | money}}</span>
                        </template>
                        
                        <template slot="FOOT" slot-scope="data">
                        </template>
                    </b-table>
                </b-row>
                <b-row v-if="!printmode">
                    <b-input-group size="sm">
                        <b-input-group-prepend is-text style="height: 31px">
                            <span>Justificativa</span>
                        </b-input-group-prepend>
                        <b-form-input :disabled="!hasDiff" id="justification" type="text" placeholder="Escreva a justificativa" v-model="form.justification" maxlength="250"></b-form-input>
                        <b-input-group-append>
                            <b-btn variant="success" @click="closeCR">
                                <v-wait for="inprocess">
                                    <template slot="waiting">
                                    Realizando operação...
                                    </template>
                                </v-wait>
                                <span v-if="!processing">Fechar Caixa</span>
                            </b-btn>
                        </b-input-group-append>
                    </b-input-group>

                </b-row>
            </b-col>
        </b-container>
</template>

<script>
// :disabled="form.selected == 'cashdepositopen'"
import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';
import { func } from '@/functions';
import { funcOperation } from '../../components/ticketoffice/services/functions';
import { cashregisterService } from "../../components/ticketoffice/services/cashregister";
import { printService } from '../../components/ticketoffice/services/print';
import { userService } from '../../components/common/services/user';
import { VMoney } from 'v-money';
import { mask } from 'vue-the-mask';
import { Datetime } from 'vue-datetime';
import print from 'print-js';

import moment from 'moment';

Vue.use(moment);

import 'vue-datetime/dist/vue-datetime.css';

export default {
    name: 'movs',
    mixins: [func, funcOperation],
    directives: { mask, money: VMoney},
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
                case "cashdepositopen":
                    ret = "-";
                break;
                case "cashdeposit":
                    ret = "-";
                break;
                case "diff":
                    ret = "-";
                break;
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
            money: {
                decimal: '.',
                thousands: '',
                //prefix: 'R$ ',
                //suffix: ' #',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            printmode: false,
            printcheck: {
                info: false,
                bybase: false,
                byevent: false,
                byall: false,
            },
            hasDiff: false,
            processing: false,
            loading: false,
            result: null,
            movsDay: [],
            operators: [],
            dateOpen: '',
            printinfo: {
                loaded: false,
                id: '',
                name: '',
                login: '',
                email: '',
                justification: '',
                created: '',
                closed: '',
                hasDiff: false,
            },
            form: {
                id_operator: 0,
                date: null,
                datePTBR: null,
                justification: '',
                id: '00000000-0000-0000-0000-000000000000'
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
                movsbyevent: {
                    loaded: false,
                    items: [],
                },
                movsbybase: {
                    loaded: false,
                    items: [],
                },
                movsbypayment: {
                    loaded: false,
                    items: [],
                    fields: {
                        desc: { label: 'Forma de Pagamento', sortable: false },
                        amountbypayment: { label: 'Valor Recebido', sortable: false },
                        amountbypaymentinput: { label: 'Valor em Caixa', sortable: false },
                        diff: { label: 'Diferença', sortable: false },
                    },
                }
            }
        }
    },
    created() {
        if (this.mayI('to-cashregister-closeother')) {
            this.populateOperators();
        }
        //this.isCashRegisterOpenAndOk(this.initMe);
        this.initMe();
    },
    computed: {
    },
    methods: {
        teste() {
            this.printfinal();
        },
        inputValChange() {
            Vue.nextTick().then(response => {
                this.calcDiff();
            });
        },
        calcDiff() {
            let ret = false;
            
            for (let index = 0; index < this.grids.movsbypayment.items.length; index++) {
                const element = this.grids.movsbypayment.items[index];
                let input = parseInt(parseFloat(element.amountbypaymentinput)*100);
                let amount = element.amountbypayment;

                if (input == undefined || input == NaN)
                    input = 0;

                let diff = parseInt(input)-parseInt(amount);

                if (diff!=0) {
                    ret = true;
                }
                
            }
            this.hasDiff = ret;
        },
        calc(data) {
            let input = parseInt(parseFloat(data.item.amountbypaymentinput)*100);
            let amount = data.item.amountbypayment;

            if (input == undefined)
                input = 0;

            return parseInt(input)-parseInt(amount);
        },
        initMe() {
            if (this.getLoggedId() && this.get_id_base()) {
                this.showWaitAboveAll();
                cashregisterService.isok(this.get_id_base(), this.getLoggedId()).then(
                    response => {
                        this.hideWaitAboveAll();
                        if (this.validateJSON(response)) {
                            if (response.isopen)
                            {
                                this.getdate();
                            }
                            else {
                                this.$swal({
                                    type: 'error',
                                    text: "Caixa não encontra-se aberto.",
                                    showConfirmButton: true,
                                }).then((result) => {
                                    this.gotoHomeTicketOffice();
                                });
                                return false;
                            }
                        }
                    },
                    error => {
                        this.hideWaitAboveAll();
                        this.toastError("Falha na execução.");        
                    }
                );
            }
        },
        getInput() {
            let ret = "";
            for (let x in this.grids.movsbypayment.items) {  
                let currentLine = "" + this.grids.movsbypayment.items[x].codForPagto + "#";

                let input = parseInt(parseFloat(this.grids.movsbypayment.items[x].amountbypaymentinput)*100);
                let amount = this.grids.movsbypayment.items[x].amountbypayment;

                if (input == undefined)
                    input = 0;

                let diff = parseInt(input)-parseInt(amount);

                currentLine += diff;
                ret+= (ret == "" ? "" : "|") + currentLine;
            }
            return ret;
        },
        closeCRIntern() {
            this.showWaitAboveAll();
            cashregisterService.close(this.get_id_base(), this.getLoggedId(), this.getInput(), this.form.justification).then(
                    response => {
                        this.hideWaitAboveAll();
                        this.processing = false;
                        this.$wait.end("inprocess");
                        if (this.validateJSON(response)) {
                            if (response.success) {
                                this.$swal({
                                    type: 'success',
                                    title: 'Processo de fechamento de caixa',
                                    text: 'Caixa fechado com sucesso.',
                                });
                                printService.crclose(response.id);
                                //this.loadclosed(response.id);
                                this.gotoHomeTicketOffice();
                            }
                            else {
                                this.$swal({
                                    type: 'error',
                                    title: 'Processo de fechamento de caixa',
                                    text: 'Ocorreu uma falha para fechar o caixa.',
                                });
                            }
                        }
                },
                error => {
                    this.processing = false;
                    this.hideWaitAboveAll();
                    this.toastError("Falha na execução.");        
                }
            );
        },
        closeCR() {
            
            let msg = "Continuar com o fechamento do caixa?";

            if (this.hasDiff) {
                msg = "Continuar com o fechamento do caixa mesmo com diferença?";

                if (this.form.justification == '' || this.form.justification == undefined) {
                    this.toastError("Obrigatório o preenchimento da justificativa.");
                    return;
                }
                else {
                    if (this.form.justification.length < 25) {
                        this.toastError("Justificativa inválida.");
                        return;
                    }
                }
            }
            this.processing = true;
            this.$wait.start("inprocess");

            this.$swal({
                allowEscapeKey: false,
                allowOutsideClick: false,
                allowEnterKey: false,
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                title: 'Processo de fechamento de caixa',
                text: msg,
            }).then((result) => {
                if (result.value) {
                    this.closeCRIntern();
                }
                else if (result.dismiss === this.$swal.DismissReason.cancel) {
                    this.processing = false;
                    this.$wait.end("inprocess");
                }
            });
        },
        selected() {
            Vue.nextTick().then(response => {
                this.getdate();
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
            this.loadme("", '00000000-0000-0000-0000-000000000000', false);
        },
        searchByDate() {
            if (this.form.datePTBR == "" || this.form.datePTBR == null) {
                this.toastError("Preencha a data de fechamento");
                return;
            }
            this.loadme(this.form.datePTBR, '00000000-0000-0000-0000-000000000000', false);
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
                }
                else {
                    this.form.datePTBR = null;
                }
            });
        },
        movChange() {
            Vue.nextTick().then(response => {
                this.search();
            });
        },
        getdate() {
            let id = this.getLoggedId();
            if (this.mayI('to-cashregister-closeother')) {
                if (this.form.id_operator!=null && this.form.id_operator!=0) {
                    id = this.form.id_operator;
                }
            }

            cashregisterService.opendate(id, this.get_id_base()).then(response => { 
                this.hideWaitAboveAll(); 
                    this.dateOpen = response.opendate;
                    this.searchOpened();
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução.");}
            );
        },
        loadclosed(id_ticketoffice_cashregister) {
            let id = this.getLoggedId();
            if (this.mayI('to-cashregister-closeother')) {
                if (this.form.id_operator!=null && this.form.id_operator!=0) {
                    id = this.form.id_operator;
                }
            }

            this.showWaitAboveAll();
            cashregisterService.listclosed(this.get_id_base(), id, this.form.datePTBR, id_ticketoffice_cashregister).then(response => { 
                    this.hideWaitAboveAll(); 
                    if (this.validateJSON(response)) 
                    { 
                        this.printcheck.info = true;
                        this.printmode = true;
                        this.printinfo.loaded = true;
                        this.printinfo.id = response[0].id;
                        this.printinfo.name = response[0].name;
                        this.printinfo.login = response[0].login;
                        this.printinfo.email = response[0].email;
                        this.printinfo.justification_closed = response[0].justification_closed;
                        this.printinfo.created = response[0].created;
                        this.printinfo.closed = response[0].closed;
                        this.printinfo.hasDiff = response[0].hasDiff;         
                        this.loadme(response[0].closed, response[0].id, true);
                    }
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução.");}
            );
        },        
        loadme(date, id_ticketoffice_cashregister, print) {
            this.showWaitAboveAll();
            let id = this.getLoggedId();
            if (this.mayI('to-cashregister-closeother')) {
                if (this.form.id_operator!=null && this.form.id_operator!=0) {
                    id = this.form.id_operator;
                }
                
            }
            cashregisterService.movimentlist(id, date, this.get_id_base(), id_ticketoffice_cashregister).then(response => { 
                this.hideWaitAboveAll(); if (this.validateJSON(response)) { 
                        this.grids.movs.items = response; 
                        this.grids.movs.loaded = true; 
                        if (print) {
                            this.printcheck.byall = true;
                            this.printfinal();
                        }
                    }
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução.");}
            );


            this.showWaitAboveAll();
            cashregisterService.movimentlistbyevent(id, date, this.get_id_base(), id_ticketoffice_cashregister).then(response => { 
                    this.hideWaitAboveAll(); if (this.validateJSON(response)) { 
                            this.grids.movsbyevent.items = response; 
                            this.grids.movsbyevent.loaded = true; 
                            if (print) {
                                this.printcheck.byevent = true;
                                this.printfinal();
                            }
                        }
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução."); }
            );


            this.showWaitAboveAll();
            cashregisterService.movimentlistbybase(id, date, this.get_id_base(), id_ticketoffice_cashregister).then(response => { 
                    this.hideWaitAboveAll(); if (this.validateJSON(response)) { 
                            this.grids.movsbybase.items = response; 
                            this.grids.movsbybase.loaded = true; 
                            if (print) {
                                this.printcheck.bybase = true;
                                this.printfinal();
                            }
                        }
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução."); }
            );

            this.showWaitAboveAll();
            cashregisterService.movimentlistbypayment(id, date, this.get_id_base(), id_ticketoffice_cashregister).then(response => { 
                    this.hideWaitAboveAll(); if (this.validateJSON(response)) { this.grids.movsbypayment.items = response; this.grids.movsbypayment.loaded = true; }
                    this.calcDiff();
                },
                error => { this.hideWaitAboveAll(); this.toastError("Falha na execução."); }
            );
        },
        printfinal() {
            if (this.printcheck.info && this.printcheck.bybase && this.printcheck.byevent && this.printcheck.byall) {
                let myobj = this;
                Vue.nextTick().then(response => {
                    printJS({printable:'toprint', type:'html', css: `/assets/css/localhost/main.css`});
                    //this.gotoHomeTicketOffice();
                });
            }
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
