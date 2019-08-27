import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const tickettypeService = {
  get,
  save,
  list,
  base64,
  eventlist,
  eventsave,
  eventremove,
  select,
  partnerlist,
  partnersave,
}
function partnerlist(id_base,CodTipBilhete) {
    let url = config.api + `/v1/admin/tickettype/partner/list?id_base=${id_base}&CodTipBilhete=${CodTipBilhete}`;

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
function partnersave(loggedId, id_base, CodTipBilhete, id_partner) {
    let url = config.api + `/v1/admin/tickettype/partner/save`;

    let obj = {
        loggedId,
        id_base, CodTipBilhete, id_partner
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

function eventsave(loggedId
    ,id_base
    ,id_evento
    ,CodTipBilhete
    ,start
    ,end) {

    let url = config.api + `/v1/admin/event/tickettype/save`;

    let obj = {
        loggedId
        ,id_base
        ,CodTipBilhete
        ,start
        ,end
        ,id_evento
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

function eventremove(loggedId
    ,id_base
    ,id_evento
    ,CodTipBilhete) {

    let url = config.api + `/v1/admin/event/tickettype/delete`;

    let obj = {
        loggedId
        ,id_base
        ,CodTipBilhete
        ,id_evento
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

function select(loggedId, id_base, showto, principal, fixed, half, plus, allotment) {
    let url = config.api + `/v1/admin/tickettype/select?id_base=${id_base}&showto=${showto}&principal=${principal}&fixed=${fixed}&half=${half}&plus=${plus}&allotment=${allotment}`;
  
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
function eventlist(loggedId, id_evento, id_base) {
    let url = config.api + `/v1/admin/event/tickettype/list`;

    //url = config.system.applyPagination(url, currentPage, perPage);
  
    let obj = { loggedId, id_evento, id_base };
  
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
function base64(local, id) {
    let url = config.api + `/v1/admin/tickettype/base64`;

    let obj = { local, id };

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
function get(loggedId, id, id_base) {
    let url = config.api + `/v1/admin/tickettype/get`;
  
    let obj = { loggedId, id, id_base };
  
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
  function save(loggedId
                ,id
                ,id_base
                ,nameWeb
                ,nameTicketOffice
                ,nameAPI
                ,description
                ,in_dom
                ,in_seg
                ,in_ter
                ,in_qua
                ,in_qui
                ,in_sex
                ,in_sab
                ,allowweb
                ,allowticketoffice
                ,allowapi
                ,isPrincipal
                ,isDiscount
                ,isHalf
                ,isFixed
                ,isPlus
                ,isNoValue
                ,isPOS
                ,vl_preco_fixo
                ,PerDesconto
                ,CotaMeiaEstudante
                ,StaCalculoMeiaEstudante
                ,isAllotment
                ,QtdVendaPorLote
                ,StaTipBilhete
                ,allpartner
                ,saveimage
                ,imagebase64) {
    let url = config.api + `/v1/admin/tickettype/save`;

    let obj = {
        loggedId
        ,id
        ,id_base
        ,nameWeb
        ,nameTicketOffice
        ,nameAPI
        ,description
        ,in_dom: (in_dom == true ? 1 : 0)
        ,in_seg: (in_seg == true ? 1 : 0)
        ,in_ter: (in_ter == true ? 1 : 0)
        ,in_qua: (in_qua == true ? 1 : 0)
        ,in_qui: (in_qui == true ? 1 : 0)
        ,in_sex: (in_sex == true ? 1 : 0)
        ,in_sab: (in_sab == true ? 1 : 0)
        ,allowweb: (allowweb == true ? 1 : 0)
        ,allowticketoffice: (allowticketoffice == true ? 1 : 0)
        ,allowapi: (allowapi == true ? 1 : 0)
        ,isPrincipal: (isPrincipal == true ? 1 : 0)
        ,isDiscount: (isDiscount == true ? 1 : 0)
        ,isHalf: (isHalf == true ? 1 : 0)
        ,isFixed: (isFixed == true ? 1 : 0)
        ,isPlus: (isPlus == true ? 1 : 0)
        ,isNoValue: (isNoValue == true ? 1 : 0)
        ,isPOS: (isPOS == true ? 1 : 0)
        ,vl_preco_fixo
        ,PerDesconto
        ,CotaMeiaEstudante
        ,StaCalculoMeiaEstudante
        ,isAllotment: (isAllotment == true ? 1 : 0)
        ,QtdVendaPorLote
        ,StaTipBilhete
        ,allpartner: (allpartner == true ? 1 : 0)
        ,saveimage: (saveimage == true ? 1 : 0)
        ,imagebase64
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
  function list(loggedId, id_base, text, currentPage, perPage) {
    let url = config.api + `/v1/admin/tickettype/list`;

    url = config.system.applyPagination(url, currentPage, perPage);
  
    let obj = { loggedId, id_base, text };
  
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
      