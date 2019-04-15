import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const printService =  {
    ticket,
    booking,
    crclose,
    moviment,
}

function ticket(id_base, codVenda, indice, loggedid) {
    let url = config.api + `/v1/print/ticket?id_base=${id_base}&id=${codVenda}&indice=${indice}&loggedid=${loggedid}`;
    window.open(url);
}

function booking(id_base, codReserva, indice) {
    let url = config.api + `/v1/print/reservation?id_base=${id_base}&id=${codReserva}&indice=${indice}`;
    window.open(url);
}
function crclose(id) {
    let url = config.api + `/v1/print/cashregister/signature_close.php?id=${id}`;
    window.open(url);
}
function moviment(id) {
    let url = config.api + `/v1/print/cashregister/signature_moviment.php?id=${id}`;
    window.open(url);
}