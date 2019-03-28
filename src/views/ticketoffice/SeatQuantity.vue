<template>
        <b-container>
            <b-form @submit="onSubmit">
                <b-form-row v-if="operation.step1.type == 'sell'" class="mb-3">
                    <b-col>
                        <b-input-group size="sm">
                            <b-input-group-prepend is-text class="firstLabel">
                                Reserva?
                            </b-input-group-prepend>
                            <b-form-select id="days"
                                            :options="selects.reservations"
                                            v-on:change="changereservation"
                                            v-model="form.codReservaChoose">
                                <template slot="first">
                                    <option :value="''" >Sem reserva</option>
                                </template>
                            </b-form-select>
                        </b-input-group>
                    </b-col>
                </b-form-row>
                <b-form-row class="mb-3">
                    <b-col>
                        <b-input-group>
                            <b-input-group-prepend is-text>
                            Quantidade:
                            </b-input-group-prepend>
                            <b-form-input id="quantity"
                                        type="number"
                                        v-model="form.quantity"
                                        :max="form.max"
                                        :min="form.min"
                                        :step="form.step"
                                        >
                            </b-form-input>
                        </b-input-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-button type="submit" variant="primary" v-if="!form.isReservation && !form.isSellReservation">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                            Aguarde...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Continuar</span>
                    </b-button>
                    <b-button type="submit" variant="primary" v-if="form.isSellReservation">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                            Aguarde...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Vender reserva</span>
                    </b-button>
                    <b-button type="submit" variant="primary" v-if="form.isReservation">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                            Aguarde...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Reservar</span>
                    </b-button>
                    <b-button type="button" variant="secondary" @click="cancel">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                            Aguarde...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Cancelar</span>
                    </b-button>
                </b-form-row>
            </b-form>
        </b-container>
</template>

<script>
import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';
import { func } from '@/functions';
import { funcOperation } from '../../components/ticketoffice/services/functions';
import { bookingService } from '../../components/common/services/booking';


export default {
    name: 'seatquantity',
    mixins: [func, funcOperation],
    props: ['max', 'codReserva'],
    data () {
        return {
            processing: false,
            loading: false,
            selects: {
                reservations: [],
            },
            form: {
                codReservaChoose: '',
                quantity: 1,
                max: this.max,
                min: 1,
                step: 1,
                isReservation: false,
                isSellReservation: false,
            }
        }
    },
    computed: {
        operation() {
            return this.retrieve();
        }
    },
    created() {
        this.load();
//        console.log(this.codReserva);
        this.form.isReservation = this.operation.step1.type != "sell";
    },
    methods: {
        changereservation() {
            Vue.nextTick().then(response => {
                this.form.isSellReservation = false;
                this.form.isReservation = this.form.codReservaChoose != '';

                if (this.form.codReservaChoose != '' && this.operation.step1.type == "sell") {
                    let obj = this.selects.reservations.filter(o=> o.CodReserva == this.form.codReservaChoose);
                    if (obj!=null && obj.length>0) {
                        this.form.isSellReservation = true;
                        this.form.isReservation = false;
                        this.form.max = obj[0].howmany;
                        if (this.form.quantity > obj[0].howmany) {
                            this.form.quantity = obj[0].howmany;
                        }
                    }
                    else {
                        this.form.max = this.max;
                        if (this.form.quantity > this.max) {
                            this.form.quantity = this.max;
                        }
                    }
                }
            });
        },
        cancel() {
            this.$parent.getHeader().cancelingReservationProcess();
            this.$router.push("/ticketoffice/");
        },
        onSubmit (evt) {
            evt.preventDefault();
            this.save();
        },
        load() {
            this.populateReservation();
        },
        populateReservation(check) {
            this.processing = true;
            this.showWaitAboveAll();

            bookingService.listReservation(this.get_id_base(), this.getLoggedId(), this.operation.step1.id_apresentacao).then(
                    response => {
                        this.hideWaitAboveAll();
                        this.processing = false;
                        this.selects.reservations = response;
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
            let sellreservation = 0;
            
            if (this.form.codReservaChoose != '' && this.operation.step1.type == "sell") {
                sellreservation = 1;
            }
            this.$parent.showSeatsNotNumbered = false;
            Vue.nextTick().then(response => {
                this.$parent.reserveSeats(this.form.quantity, sellreservation, this.form.codReservaChoose);
            });

        }
    }
}
</script>

<style>

</style>
