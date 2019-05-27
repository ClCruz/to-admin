import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const quotapartnerService = {
  get,
  list,
  select,
  save,
}

function list(loggedId, search, currentPage, perPage) {
    let url = config.api + `/v1/admin/quotapartner/list?loggedId=${loggedId}&search=${search}`;
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
function select(loggedId) {
    let url = config.api + `/v1/admin/quotapartner/select?loggedId=${loggedId}`;

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
    let url = config.api + `/v1/admin/quotapartner/get?loggedId=${loggedId}&id=${id}`;
    
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
function save(loggedId,id,name,active) {
    let url = config.api + `/v1/admin/quotapartner/save`;

    let obj = {
        id_user: loggedId
        ,id
        ,name
        ,active
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