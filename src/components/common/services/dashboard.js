import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const dashboardService = {
  purchasebyboleto,
  purchasebychannel,
  purchasebypaymenttype,
  purchasebytimetable,
  purchaseoccupation,
  purchasevalues,
}

function purchasebyboleto(loggedId, id_evento, id_apresentacao, date, hour, periodtype, customPeriodInit, customPeriodEnd) {
    let url = config.api + `/v1/dashboard/purchaseboleto?loggedId=${loggedId}&id_evento=${id_evento}&id_apresentacao=${id_apresentacao}&date=${date}&hour=${hour}&periodtype=${periodtype}&customPeriodInit=${customPeriodInit}&customPeriodEnd=${customPeriodEnd}`;

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
function purchasebychannel(loggedId, id_evento, id_apresentacao, date, hour, periodtype, customPeriodInit, customPeriodEnd) {
    let url = config.api + `/v1/dashboard/purchasebychannel?loggedId=${loggedId}&id_evento=${id_evento}&id_apresentacao=${id_apresentacao}&date=${date}&hour=${hour}&periodtype=${periodtype}&customPeriodInit=${customPeriodInit}&customPeriodEnd=${customPeriodEnd}`;

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
function purchasebypaymenttype(loggedId, id_evento, id_apresentacao, date, hour, periodtype, customPeriodInit, customPeriodEnd) {
    let url = config.api + `/v1/dashboard/purchasebypaymenttype?loggedId=${loggedId}&id_evento=${id_evento}&id_apresentacao=${id_apresentacao}&date=${date}&hour=${hour}&periodtype=${periodtype}&customPeriodInit=${customPeriodInit}&customPeriodEnd=${customPeriodEnd}`;

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
function purchasebytimetable(loggedId, id_evento, id_apresentacao, date, hour, periodtype, customPeriodInit, customPeriodEnd) {
    let url = config.api + `/v1/dashboard/purchasebytimetable?loggedId=${loggedId}&id_evento=${id_evento}&id_apresentacao=${id_apresentacao}&date=${date}&hour=${hour}&periodtype=${periodtype}&customPeriodInit=${customPeriodInit}&customPeriodEnd=${customPeriodEnd}`;

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
function purchaseoccupation(loggedId, id_evento, id_apresentacao, date, hour, periodtype, customPeriodInit, customPeriodEnd) {
    let url = config.api + `/v1/dashboard/purchaseoccupation?loggedId=${loggedId}&id_evento=${id_evento}&id_apresentacao=${id_apresentacao}&date=${date}&hour=${hour}&periodtype=${periodtype}&customPeriodInit=${customPeriodInit}&customPeriodEnd=${customPeriodEnd}`;

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
function purchasevalues(loggedId, id_evento, id_apresentacao, date, hour, periodtype, customPeriodInit, customPeriodEnd) {
    let url = config.api + `/v1/dashboard/purchasevalues?loggedId=${loggedId}&id_evento=${id_evento}&id_apresentacao=${id_apresentacao}&date=${date}&hour=${hour}&periodtype=${periodtype}&customPeriodInit=${customPeriodInit}&customPeriodEnd=${customPeriodEnd}`;

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
