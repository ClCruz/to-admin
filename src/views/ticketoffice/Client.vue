<template>
        <b-container>
            <b-form @submit="onSubmit">
                <b-form-row v-if="form.partner">
                    <b-col>
                        <b-form-group id="namegroup"
                                        label-for="name">
                            <b-form-input id="name"
                                        type="text"
                                        v-model="form.name"
                                        maxlength="50"
                                        placeholder="Nome">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row v-if="!form.partner">
                    <b-col>
                        <b-form-group id="ningroup"
                                        label-for="cpf"
                                        description="">
                            <b-input-group>
                                <b-form-input id="cpf"
                                            type="text"
                                            name="cpf"
                                            v-mask="['###.###.###-##']"
                                            maxlength="14"
                                            v-model="form.cpf"
                                            v-validate
                                            :class="{'input': true, 'is-danger': errors.has('cpf') }"
                                            placeholder="CPF">
                                </b-form-input>
                                <b-input-group-append>
                                    <b-btn variant="info" @click="get(true)">Buscar</b-btn>
                                </b-input-group-append>
                            </b-input-group>
                            <i v-show="errors.has('cpf')" class="fa fa-warning"></i>
                            <span v-show="errors.has('cpf')" class="help is-danger">{{ errors.first('cpf') }}</span>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group id="rggroup"
                                        label-for="rg">
                            <b-form-input id="rg"
                                        type="text"
                                        v-model="form.rg"
                                        v-mask="['###############']"
                                        maxlength="15"
                                        placeholder="RG">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row v-if="!form.partner">
                    <b-col>
                        <b-form-group id="namegroup"
                                        label-for="name">
                            <b-form-input id="name"
                                        type="text"
                                        v-model="form.name"
                                        maxlength="50"
                                        placeholder="Nome">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row v-if="!form.partner">
                    <b-col>
                        <b-form-group id="emailgroup"
                                        label-for="email">
                            <b-form-input id="email"
                                        type="email"
                                        v-model="form.email"
                                        maxlength="150"
                                        placeholder="E-mail">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group id="phonegroup"
                                        label-for="telefone">
                            <b-input-group>
                                <b-form-input id="ddd"
                                            type="text"
                                            v-model="form.ddd"
                                            v-mask="['##']"
                                            maxlength="2"
                                            placeholder="DDD">
                                </b-form-input>
                                <b-form-input id="telefone"
                                            type="text"
                                            v-model="form.phone"
                                            v-mask="['#########']"
                                            maxlength="20"
                                            placeholder="Telefone">
                                </b-form-input>
                                <b-form-input id="ramal"
                                            type="text"
                                            v-model="form.ramal"
                                            v-mask="['####']"
                                            maxlength="4"
                                            placeholder="Ramal">
                                </b-form-input>                                
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-button type="submit" variant="primary">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                            Salvando...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Salvar</span>
                    </b-button>
                    <b-button type="button" variant="secondary" @click="cancel">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                            Aguarde...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Fechar</span>
                    </b-button>
                    <b-button type="button" variant="warning" @click="form.partner=true;" v-if="!form.partner">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                            Salvando...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Reserva para parceiro</span>
                    </b-button>
                    <b-button type="button" variant="warning" @click="form.partner=false;" v-if="form.partner">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                            Salvando...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Reserva para cliente</span>
                    </b-button>
                </b-form-row>
            </b-form>
        </b-container>
</template>

<script>
import Vue from 'vue';
import VueResource from "vue-resource";
import VeeValidate from 'vee-validate';
import config from '@/config';
import { func } from '@/functions';
import { funcOperation } from '../../components/ticketoffice/services/functions';
import { clientService } from "../../components/ticketoffice/services/client";

import {mask} from 'vue-the-mask'

Vue.use(VeeValidate, {
    fieldsBagName: 'vvFields',
});

export default {
    name: 'client',
    mixins: [func, funcOperation],
    directives: {mask},
    props: ['needCPF', 'needRG', 'needPhone', 'needName', 'needCardBin', 'showCardBin', 'code'],
    data () {
        return {
            isClient: true,
            isClientAdd: true,
            processing: false,
            loading: false,
            result: null,
            form: {
                partner: false,
                code: '',
                cpf: '',
                rg: '',
                ddd: '',
                phone: '',
                ramal: '',
                name: '',
                email: '',
                bincard: '',
            }
        }
    },
    created() {
        this.load();
    },
    methods: {
        cancel() {
            if (this.$route.fullPath == "/ticketoffice/operation/reservation/seat") 
            {
                this.$parent.getHeader().cancelingReservationProcess();
                this.$router.push("/ticketoffice/");
            }
            else {
                this.$parent.getCashRegister().hideClient();
            }
        },
        onSubmit (evt) {
            evt.preventDefault();
            this.save();
        },
        load() {
            if (this.$props["code"] != "" && this.$props["code"] != null) {
                this.form.code = this.$props["code"];
                this.get(false);
            }
        },
        get(check) {
            if (this.processing) return;
            if (check) {
                if (this.form.cpf == "") {
                    this.toastError("CPF é obrigatório.");
                    return;
                }
            }
            this.processing = true;
            this.showWaitAboveAll();

            clientService.get(this.get_id_base(), this.form.cpf, this.form.code).then(
                    response => {
                        this.hideWaitAboveAll();
                        this.processing = false;

                        if (response.length == 0) {
                            this.toastError("Nenhum cliente encontrado com o CPF informado.");
                            return;
                        }
                        if (this.validateJSON(response)) {
                            this.form.cpf = response.cpfclean;
                            this.form.rg = response.RG;
                            this.form.ddd = response.DDD;
                            this.form.phone = response.Telefone;
                            this.form.ramal = response.Ramal;
                            this.form.name = response.Nome;
                            this.form.email = response.EMail;
                            this.form.bincard = response.CardBin;
                        }
                },
                error => {
                    this.processing = false;
                    this.hideWaitAboveAll();
                    this.toastError("Falha na execução.");        
                }
            );
        },
        save() {
            if (this.processing) return;

            if ((this.$props["needName"] == true || this.$props["needName"]=="true") && this.form.name == "") {
                this.toastError("Nome é obrigatório.");
                return;
            }

            if (this.form.partner) {

            }
            else {
                if ((this.$props["needCPF"] == true || this.$props["needCPF"] == "true") && this.form.cpf == "") {
                    this.toastError("CPF é obrigatório.");
                    return;
                }
                if ((this.$props["needRG"] == true || this.$props["needRG"] == "true") && this.form.rg == "") {
                    this.toastError("RG é obrigatório.");
                    return;
                }
                if ((this.$props["needPhone"] == true || this.$props["needPhone"] == "true") && (this.form.phone == "" || this.form.ddd == "")) {
                    this.toastError("Telefone é obrigatório.");
                    return;
                }
                if ((this.$props["needCardBin"] == true || this.$props["needCardBin"] == "true") && this.form.bincard == "") {
                    this.toastError("Bin do Cartão é obrigatório.");
                    return;
                }

            }


            this.processing = true;
            this.showWaitAboveAll();

            let makeCode = false;

            if (this.$route.fullPath == "/ticketoffice/operation/reservation/seat") 
                makeCode = true;

            clientService.add(this.get_id_base(), this.form.cpf, this.form.rg, this.form.name, this.form.email, this.form.ddd, this.form.phone, this.form.ramal, this.form.bincard, makeCode, this.form.partner).then(
                    response => {
                        this.hideWaitAboveAll();
                        this.processing = false;
                        if (this.validateJSON(response)) {
                            if (response.added == "1" || response.add == 1) {
                                this.toastSuccess("Cliente cadastrado com sucesso.");
                            }
                            else {
                                this.toastSuccess("Cliente escolhido com sucesso.");
                            }
                            this.result = response.codigo;

                            if (this.$route.fullPath == "/ticketoffice/operation/reservation/seat") 
                            {
                                this.$parent.codCliente = response.codigo;
                                this.$parent.codReserva = response.codReserva;
                                Vue.nextTick().then(d => {
                                    this.$parent.hideClientWhenForced();
                                });
                            }
                            else {
                                this.$parent.getCashRegister().form.clientCode = response.codigo;
                                this.$parent.getCashRegister().form.cardBin = this.form.bincard;
                                Vue.nextTick().then(response => {
                                    this.$parent.getCashRegister().hideClient();
                                    this.$parent.getCashRegister().checkIfCanSell();
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

        }
    }
}
</script>

<style>

</style>
