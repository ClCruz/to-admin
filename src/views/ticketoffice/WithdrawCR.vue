<template>
        <b-container>
            <b-form-row class="mb-3">
                <b-input-group size="sm">
                    <b-input-group-prepend is-text style="height: 31px">
                        <span>R$</span>
                    </b-input-group-prepend>
                    <b-form-input prepend="R$" id="amount" type="text" style="max-width:96px"
                                    v-model.lazy="form.amountInput" v-money="money">
                    </b-form-input>
                    <b-form-select v-model="form.selected" :options="selects.types" size="sm" style="max-width:190px" v-on:change="sel" />
                    <b-form-input id="justification" type="text" placeholder="Escreva a justificativa"
                                    v-model="form.justificative" maxlength="250" :disabled="form.selected == 'cashdepositopen'">
                    </b-form-input>
                    <b-input-group-append>
                        <b-btn variant="success" @click="dofunction">
                            <v-wait for="inprocess">
                                <template slot="waiting">
                                Realizando operação...
                                </template>
                            </v-wait>
                            <span v-if="!processing">Realizar</span>
                        </b-btn>
                    </b-input-group-append>
                </b-input-group>
            </b-form-row>
            <b-container id="print" v-show="printInfo.id !== ''">
                    <table class="table table-sm table-bordered table-hover" style="background-color: #fff; max-width: 200px">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                                <td scope="col">{{printInfo.id |  replace()}}</td>
                             
                        </tbody>
                        <thead>
                            <tr>
                                <th scope="col">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                                <td scope="col">{{printInfo.created}}</td>
                        </tbody>
                        <thead>
                            <tr>
                                <th scope="col" colspan="1">Justificativa</th>
                            </tr>
                        </thead>
                        <tbody>
                                <td scope="col">{{printInfo.justificative}} </td>
                        </tbody>
                        <thead>
                            <tr>
                                <th scope="col">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                                <td scope="col">{{printInfo.currentAmount}}</td>  
                        </tbody>
                    </table>
                    <br>
                    <br>
                    ______________________________________
                    <br>
                    <i>Assinatura</i>
                    <br>
            </b-container>
        </b-container>
</template>

<script>
import printJS from 'print-js'

import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';
import { func } from '@/functions';
import { funcOperation } from '../../components/ticketoffice/services/functions';
import { cashregisterService } from "../../components/ticketoffice/services/cashregister";
import { printService } from '../../components/ticketoffice/services/print';
import { VMoney } from 'v-money';
import {mask} from 'vue-the-mask';

export default {
    name: 'withdrawCR',
    mixins: [func, funcOperation],
    directives: {mask,money: VMoney},
    filters: {
        money: function (value) {
            //if (!value) return ''
            return `R$ ${value}`;
        },
        truefalse: function (value) {
            return value == 1 || value == "1" || value == true ? "Sim" : "Não";
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
            printInfo: {
                id: '',
                date: '',
                justificative: '',
                currentAmount: 0,
            },
            selects: {
                types: [
                    { value: "select", text: 'Selecione a operação...' },
                    { value: 'cashdepositopen', text: 'Inclusão de abertura de caixa' },
                    { value: 'cashdeposit', text: 'Inclusão de valor manual' },
                    { value: 'withdraw', text: 'Saque de valor' },
                ],
            },
            processing: false,
            loading: false,
            result: null,
            form: {
                justificative:'',
                payment:'',
                selected: "select",
                code: null,
                currentAmount: null,
                amountInput: null,
            },
            grids: {
                movs : {
                    loaded: false,
                    items: [],
                    fields: {
                        TipForPagto: { label: 'Forma de Pagamento', sortable: false },
                        amount: { label: 'Valor Recebido', sortable: false },
                    },
                }
            }
        }
    },
    created() {
        this.showWaitAboveAll();
        cashregisterService.current(this.get_id_base(), this.getLoggedId()).then(
            response => {
                this.hideWaitAboveAll();
                    this.processing = false;
                    if (this.validateJSON(response)) {
                        if (!response.isopen) {
                            this.$swal({
                                type: 'error',
                                title: 'Fechamento de Caixa',
                                text: 'O caixa não está aberto.',
                            });
                            this.gotoHomeTicketOffice();
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
    methods: {

        sel() {
            Vue.nextTick().then(response => {

            });
        },
        getDate() {
            var currentdate = new Date();
            var datetime = currentdate.getDay() + "/"+currentdate.getMonth() 
            + "/" + currentdate.getFullYear() + " @ " 
            + currentdate.getHours() + ":" 
            + currentdate.getMinutes() + ":" + currentdate.getSeconds();

            return datetime;
        },
        dofunction() {
            if (this.form.amountInput == null || parseFloat(this.form.amountInput) <= 0) {
                this.popupError("Valor de saque tem que ser acima de zero");
                return;
            }

            if (this.form.selected != 'cashdepositopen' && this.form.justificative.length<25 || this.form.justificative.length>250) {
                this.popupError("Justificativa inválida.");
                return;
            }

            this.processing = true;
            this.$wait.start("inprocess");

            let msg = "Continuar com a operação?";

            this.$swal({
                allowEscapeKey: false,
                allowOutsideClick: false,
                allowEnterKey: false,
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                title: 'Processo de lançamento',
                text: msg,
            }).then((result) => {
                if (result.value) {
                    
                    this.dofunctionIntern();
                }
                else if (result.dismiss === this.$swal.DismissReason.cancel) {
                    this.processing = false;
                    this.$wait.end("inprocess");
                }
            });
        },
        dofunctionIntern() {
            this.showWaitAboveAll();
            let amounthelper = parseInt(parseFloat(this.form.amountInput)*100);

            cashregisterService.entry(this.get_id_base(), this.getLoggedId(), this.form.selected,amounthelper, this.form.justificative).then(
                    response => {
                        this.hideWaitAboveAll();
                        this.processing = false;
                        this.$wait.end("inprocess");
                        if (this.validateJSON(response)) {

                            if (response.success) {
                                this.toastSuccess(response.msg);
                                // debugger;
                                
                                switch (this.form.selected) {
                                    case "withdraw":
                                        printService.moviment(response.id);
                                    break;
                                }                        
                                            
                                this.form.justificative = '';
                                this.form.selected =  "select";
                                this.form.currentAmount =  null;
                                this.form.amountInput = "";

                                this.gotoHomeTicketOffice();
                            }
                            else {
                                this.toastError(response.msg);
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
    },
    mounted() {
        },
    filters: {
        replace: function (message) {
            return message.split('-').join('')
        },
    }
}
</script>

<style>

</style>
