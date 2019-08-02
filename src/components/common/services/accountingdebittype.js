import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const accountingdebittypeService = {
  list,
  get,
  save,
  select,
  eventlist,
  eventremove,
  eventsave
}

function eventlist(loggedId, id_evento, id_base) {
  let url = config.api + `/v1/admin/event/accountingdebittype/list`;

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
function eventsave(loggedId
  ,id_base
  ,id_evento
  ,CodTipDebBordero
  ,start
  ,end) {

  let url = config.api + `/v1/admin/event/accountingdebittype/save`;

  let obj = {
      loggedId
      ,id_base
      ,CodTipDebBordero
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
  ,CodTipDebBordero) {

  let url = config.api + `/v1/admin/event/accountingdebittype/delete`;

  let obj = {
      loggedId
      ,id_base
      ,CodTipDebBordero
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

  function list(loggedId, id_base, text, currentPage, perPage) {
    let url = config.api + `/v1/admin/accountingdebittype/list`;

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
      
  function get(loggedId, id, id_base) {
    let url = config.api + `/v1/admin/accountingdebittype/get`;
  
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

  function select(loggedId, id_base) {
    let url = config.api + `/v1/admin/accountingdebittype/select?id_base=${id_base}`;
  
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

  function save(loggedId
        ,CodTipDebBordero
        ,id_base
        ,DebBordero
        ,in_DescontaCartao
        ,PerDesconto
        ,QtdLimiteIngrParaVenda
        ,StaDebBordero
        ,StaDebBorderoLiq
        ,TipValor
        ,ValIngressoExcedente
        ,VlMinimo
        ) {
    let url = config.api + `/v1/admin/accountingdebittype/save`;

    let obj = {
      loggedId
      ,CodTipDebBordero
      ,id_base
      ,DebBordero
      ,in_DescontaCartao
      ,PerDesconto
      ,QtdLimiteIngrParaVenda
      ,StaDebBordero
      ,StaDebBorderoLiq
      ,TipValor
      ,ValIngressoExcedente
      ,VlMinimo
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
