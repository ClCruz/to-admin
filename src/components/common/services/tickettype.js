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
                ,isPrincipal
                ,isDiscount
                ,isHalf
                ,isFixed
                ,isPlus
                ,vl_preco_fixo
                ,PerDesconto
                ,CotaMeiaEstudante
                ,StaCalculoMeiaEstudante
                ,isAllotment
                ,QtdVendaPorLote
                ,StaTipBilhete
                ,saveimage
                ,imagebase64) {
    let url = config.api + `/v1/admin/tickettype/save`;

    let obj = {
        loggedId
        ,id
        ,id_base
        ,nameWeb
        ,nameTicketOffice
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
        ,isPrincipal: (isPrincipal == true ? 1 : 0)
        ,isDiscount: (isDiscount == true ? 1 : 0)
        ,isHalf: (isHalf == true ? 1 : 0)
        ,isFixed: (isFixed == true ? 1 : 0)
        ,isPlus: (isPlus == true ? 1 : 0)
        ,vl_preco_fixo
        ,PerDesconto
        ,CotaMeiaEstudante
        ,StaCalculoMeiaEstudante
        ,isAllotment: (isAllotment == true ? 1 : 0)
        ,QtdVendaPorLote
        ,StaTipBilhete
        ,saveimage: (saveimage == true ? 1 : 0)
        ,imagebase64
    };
    
    console.log(obj);

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
      