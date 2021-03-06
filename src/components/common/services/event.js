import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const eventService = {
    list,
    get,
    save,
    base64,
    select,
    selectDays,
    selectDayHours,
    selectPresentation,
    borderokey,
    borderourl,
    borderohtml,
    searchPage,
    borderolinksend
}

function borderolinksend(loggedId, id_evento, date, hour, email, pass) {
    let url = config.api + `/v1/print/report/accounting_link`;

    let obj = { loggedId, id_evento, date, hour, email, pass };

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

function borderourl(key, id_base, print) {
    let url = config.api + `/v1/print/report/accounting?id_base=${id_base}&print=${print}&id=${key}&${config.getapikeyQS()}`;
    return url;
}

function borderohtml(url) {
    //let url = borderourl();

    //let obj = { loggedId, id_evento, date, hour };
    let obj = {};

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

function borderokey(loggedId, id_evento, date, hour, id_base) {
    let url = config.api + `/v1/print/report/key/accounting`;

    let obj = { loggedId, id_evento, date, hour };

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

function base64(id, type) {
    let url = config.api + `/v1/admin/event/base64`;

    let obj = { id, type };

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

function get(loggedId, id_evento, id_base) {
    console.log(`/v1/admin/event/get?id_user=${loggedId}&id_evento=${id_evento}&id_base=${id_base}`);
    let url = config.api + `/v1/admin/event/get?id_user=${loggedId}&id_evento=${id_evento}&id_base=${id_base}`;

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

function searchPage(type, input, startAt, howMany, city, state) {
    let url = config.api + `/v1/search/result?input=${input}&type=${type}`;
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
function list(loggedId, search, currentPage, perPage) {
    let url = config.api + `/v1/admin/event/list?loggedId=${loggedId}&search=${search}`;
    url = config.system.applyPagination(url, currentPage, perPage);

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

function selectPresentation(loggedId, id_evento) {
    let url = config.api + `/v1/admin/event/selectpresentation?loggedId=${loggedId}&id_evento=${id_evento}`;

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

function select(loggedId, id_base) {
    let url = config.api + `/v1/admin/event/select?loggedId=${loggedId}&id_base=${id_base}`;

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
function selectDays(loggedId, id_base, id_evento) {
    let url = config.api + `/v1/admin/event/selectdays?id_base=${id_base}&id_evento=${id_evento}&loggedId=${loggedId}`;

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
function selectDayHours(loggedId, id_base, id_evento, datePresentation) {
    let url = config.api + `/v1/admin/event/selecthours?id_base=${id_base}&id_evento=${id_evento}&datePresentation=${datePresentation}&loggedId=${loggedId}`;

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

function save(id_to_admin_user, id_base, id_produtor
    , CodPeca, NomPeca, CodTipPeca
    , TemDurPeca, CenPeca, id_local_evento
    , ValIngresso, description, meta_description
    , meta_keyword, opening_time, insurance_policy
    , showInBanner, bannerDescription, QtIngrPorPedido
    , in_obriga_cpf, qt_ingressos_por_cpf, ticketoffice_askemail
    , imagechanged, imagebase64, free_installments
    , max_installments, interest_rate, ticketoffice_ticketmodel
    , showonline, minAmount, maxAmount
    , in_entrega_ingresso, external_uri, mmAmountIsPer, qt_hr_anteced, descriptionVoucher, descriptionVoucher2) {



    let url = config.api + `/v1/admin/event/save`;

    let obj = {
        id_base, id_produtor, id_to_admin_user
        , CodPeca, NomPeca, CodTipPeca
        , TemDurPeca, CenPeca, id_local_evento
        , ValIngresso, description, meta_description
        , meta_keyword, opening_time, insurance_policy
        , showInBanner, bannerDescription, QtIngrPorPedido
        , in_obriga_cpf, qt_ingressos_por_cpf, ticketoffice_askemail
        , imagechanged, imagebase64, free_installments
        , max_installments, interest_rate, ticketoffice_ticketmodel
        , showonline, minAmount, maxAmount
        , in_entrega_ingresso, external_uri, mmAmountIsPer
        , qt_hr_anteced, descriptionVoucher, descriptionVoucher2
    };


    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.post(url, obj, { emulateJSON: true }).then(res => {
                resolve(res.body);
            },
                (err) => {
                    console.log("Err", err);
                })
                .catch((e) => {
                    console.log("Caught", e);
                })
        }
    );
    return ret;
}