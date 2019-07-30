import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const cityService = {
    select,
    get,
    save,
    list,  
    base64,
}

function base64(id, type) {
    let url = config.api + `/v1/admin/city/base64`;

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

function select(id_state) {
    let url = config.api + `/v1/admin/city/select?id_state=${id_state}`;

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
function get(loggedId, id) {
    let url = config.api + `/v1/admin/city/get`;
  
    let obj = { loggedId, id };
  
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
                ,id_municipio
                ,ds_municipio
                ,id_estado
                ,imagechanged,imagebase64
                ,imagechanged_extra,imagebase64_extra) {
    let url = config.api + `/v1/admin/city/save`;

    let obj = {
        loggedId
        ,id_municipio
        ,ds_municipio
        ,id_estado
        ,imagechanged,imagebase64
        ,imagechanged_extra,imagebase64_extra
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
  function list(loggedId, text, currentPage, perPage) {
    let url = config.api + `/v1/admin/city/list`;

    url = config.system.applyPagination(url, currentPage, perPage);
  
    let obj = { loggedId, text };
  
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
      