import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const paymenttypeService = {
  typeget,
  typesave,
  typelist,
  typeselect,
}

function typeselect(loggedId, id_base) {
    let url = config.api + `/v1/admin/typepaymenttype/select?id_base=${id_base}`;
  
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
function typeget(loggedId, id, id_base) {
    let url = config.api + `/v1/admin/typepaymenttype/get`;
  
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
  function typesave(loggedId
                ,CodTipForPagto
                ,id_base
                ,ClassifPagtoSAP
                ,StaTipForPagto
                ,TipForPagto) {
    let url = config.api + `/v1/admin/typepaymenttype/save`;

    let obj = {
        loggedId
        ,id_base
        ,CodTipForPagto
        ,ClassifPagtoSAP
        ,StaTipForPagto
        ,TipForPagto
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
  function typelist(loggedId, id_base, text, currentPage, perPage) {
    let url = config.api + `/v1/admin/typepaymenttype/list`;

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
      