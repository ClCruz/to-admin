import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const bookingService =  {
    book,
    bookNotNumered,
    bookornot,
    remove,
    clear,
    getCodeReservation,
    list,
    cancel,
    listReservation,
}

function listReservation(id_base, loggedid, id_apresentacao) {
    let url = config.api + `/v1/purchase/reservation/select`
    
    let obj = {
        id_base,
        id_apresentacao,
        loggedid
    };

    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.post(url, obj, { emulateJSON: true }).then(res => {
                resolve(res.body);
            }, err => {
                reject({
                    error: true,
                    msg: err
                });
            });    
        }
    );
    return ret;
}

function bookornot(id_base, id_apresentacao, indice, id, nin, codCliente = "", codReserva = "", overwrite = "0") {
    let url = config.api + `/v1/purchase/reservation/addmultiple`
    
    let obj = {
        id_base,
        id_apresentacao,
        indice,
        id,
        nin,
        codCliente,
        codReserva,
        overwrite: overwrite == 1 || overwrite == true ? 1 : 0,
    };

    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.post(url, obj, { emulateJSON: true }).then(res => {
                resolve(res.body);
            }, err => {
                reject({
                    error: true,
                    msg: err
                });
            });    
        }
    );
    return ret;
}
function book(id_base, id_apresentacao, indice, id, nin, codCliente = "", codReserva = "") {
    let url = config.api + `/v1/purchase/reservation/add?id_base=${id_base}&id_apresentacao=${id_apresentacao}&indice=${indice}&id=${id}&nin=${nin}&codCliente=${codCliente}&codReserva=${codReserva}`;

    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.get(url).then(res => {
                resolve(res.body);
            }, err => {
                reject({
                    error: true,
                    msg: err
                });
            });    
        }
    );
    return ret;
}
function bookNotNumered(id_base, id_apresentacao, id, qtd, nin, caller, codReserva, codCliente, sellreservation) {
    let url = config.api + `/v1/purchase/reservation/addnotnumered`;
    
    let obj = {
        id_base,
        id_apresentacao,
        id,
        qtd,
        nin,
        caller,
        codReserva,
        codCliente,
        sellreservation
    };
  
    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.post(url, obj, { emulateJSON: true }).then(res => {
                resolve(res.body);
            }, err => {
                reject({
                    error: true,
                    msg: err
                });
            });    
        }
    );
    return ret;
}
function remove(id_base, id_apresentacao, indice, id) {
    let url = config.api + `/v1/purchase/reservation/delete?id_base=${id_base}&id_apresentacao=${id_apresentacao}&indice=${indice}&id=${id}`;

    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.get(url).then(res => {
                resolve(res.body);
            }, err => {
                reject({
                    error: true,
                    msg: err
                });
            });    
        }
    );
    return ret;
}
function clear(id_base, id, all) {
    let url = config.api + `/v1/purchase/reservation/clear?id_base=${id_base}&id=${id}&all=${all}`;

    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.get(url).then(res => {
                resolve(res.body);
            }, err => {
                reject({
                    error: true,
                    msg: err
                });
            });    
        }
    );
    return ret;
}
function getCodeReservation(codCliente) {
    let url = config.api + `/v1/purchase/reservation/code?&id=${id}`;

    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.get(url).then(res => {
                resolve(res.body);
            }, err => {
                reject({
                    error: true,
                    msg: err
                });
            });    
        }
    );
    return ret;
}
function list(id_base, nin, codReserva, id_apresentacao, name) {
    let url = config.api + `/v1/purchase/reservation/list`
    
        let obj = {
        id_base,
        nin,
        codReserva,
        id_apresentacao,
        name
    };
  
    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.post(url, obj, { emulateJSON: true }).then(res => {
                resolve(res.body);
            }, err => {
                reject({
                    error: true,
                    msg: err
                });
            });    
        }
    );
    return ret;
}
function cancel(id_base, id_ticketuser, codReserva, indice) {
    let url = config.api + `/v1/purchase/reservation/cancel?&id_base=${id_base}&id_ticketuser=${id_ticketuser}&codReserva=${codReserva}&indice=${indice}`;

    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.get(url).then(res => {
                resolve(res.body);
            }, err => {
                reject({
                    error: true,
                    msg: err
                });
            });    
        }
    );
    return ret;
}
