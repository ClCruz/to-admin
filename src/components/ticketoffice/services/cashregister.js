import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const cashregisterService =  {
    open,
    shoppingCart,
    current,
    close,
    entry,
    list,
    isok,
    sendemail,
    movimentlist,
    movimentlistbyevent,
    movimentlistbybase,
    movimentlistbypayment,
    movimentlistdetail,
    opendate,
    listclosed
}
function sendemail(id_user, id_base, codVenda, email) {
    let url = config.api + `/v1/email/purchase`;

    let obj = {
        id_user,
        id_base,
        codVenda,
        email
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
function isok(id_base, id) {
    let url = config.api + `/v1/ticketoffice/cashregister/isok?id=${id}&id_base=${id_base}`;

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
function open(id, id_base) {
    let url = config.api + `/v1/ticketoffice/cashregister/open`;

    let obj = {
        id,
        id_base
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
function shoppingCart(id, id_base) {
    let url = config.api + `/v1/ticketoffice/cashregister/shoppingcart?id=${id}&id_base=${id_base}`;

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
function current(id_base, id) {
    let url = config.api + `/v1/ticketoffice/cashregister/current?id=${id}&id_base=${id_base}`;

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

function movimentlistdetail(id, date, type) {
    if (date == null || date == "") {
        date = "open";
    }
    let url = config.api + `/v1/ticketoffice/cashregister/moviment/detail?id_user=${id}&date=${date}&type=${type}`;

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
function opendate(id, id_base) {
    let url = config.api + `/v1/ticketoffice/cashregister/openeddate`;

    let obj = {
        id,
        id_base
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
function movimentlist(id, date, id_base, id_ticketoffice_cashregister) {
    if (date == null || date == "") {
        date = "open";
    }
    let url = config.api + `/v1/ticketoffice/cashregister/moviment/list?id_user=${id}&date=${date}&id_base=${id_base}&result=resultbyall&id_ticketoffice_cashregister=${id_ticketoffice_cashregister}`;

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
function movimentlistbyevent(id, date, id_base, id_ticketoffice_cashregister) {
    if (date == null || date == "") {
        date = "open";
    }
    let url = config.api + `/v1/ticketoffice/cashregister/moviment/listbyevent?id_user=${id}&date=${date}&id_base=${id_base}&result=resultbyevent&id_ticketoffice_cashregister=${id_ticketoffice_cashregister}`;

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
function movimentlistbybase(id, date, id_base, id_ticketoffice_cashregister) {
    if (date == null || date == "") {
        date = "open";
    }
    let url = config.api + `/v1/ticketoffice/cashregister/moviment/listbybase?id_user=${id}&date=${date}&id_base=${id_base}&result=resultbybase&id_ticketoffice_cashregister=${id_ticketoffice_cashregister}`;

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
function movimentlistbypayment(id, date, id_base, id_ticketoffice_cashregister) {
    if (date == null || date == "") {
        date = "open";
    }
    let url = config.api + `/v1/ticketoffice/cashregister/moviment/listbypayment?id_user=${id}&date=${date}&id_base=${id_base}&result=resultbypayment&id_ticketoffice_cashregister=${id_ticketoffice_cashregister}`;

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

function close(id_base, id, amount, justificative) {
    let url = config.api + `/v1/ticketoffice/cashregister/close?id_base=${id_base}`;

    let obj = {
        id_ticketoffice_user: id,
        amount,
        justificative
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

function listclosed(id_base, id_ticketoffice_user, date) {
    let url = config.api + `/v1/ticketoffice/cashregister/listclosed`;

    let obj = {
        id_base, id_ticketoffice_user, date
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


function entry(id_base, id_ticketoffice_user, type, amount, justification) {
    let url = config.api + `/v1/ticketoffice/cashregister/entry`;

    let obj = {
        id_base, id_ticketoffice_user, type, amount, justification
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
function list(id_base, id, date, codMovimento) {
    let url = config.api + `/v1/ticketoffice/cashregister/moviment/list?id=${id}&id_base=${id_base}&date=${date}&codMovimento=${codMovimento}`;

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