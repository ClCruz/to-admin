import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const quotapartnerService = {
  list,
  detail,
  select,
  printurl,
}
function printurl(init, end, amount, id_quotapartner) {
    let url = config.api + `/v1/print/report/quotasale?id_quotapartner=${id_quotapartner}&init=${init}&end=${end}&amount=${amount}&${config.getapikeyQS()}`;
    return url;
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
function list(loggedId, start, end, amount, id_quotapartner) {
    let url = config.api + `/v1/admin/report/quotasale/list?loggedId=${loggedId}&start=${start}&end=${end}&amount=${amount}&id_quotapartner=${id_quotapartner}`;
    //url = config.system.applyPagination(url, currentPage, perPage);
  
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
  
  function detail(loggedId, codVenda, amount, id_base, id_quotapartner) {
    let url = config.api + `/v1/admin/report/quotasale/detail?loggedId=${loggedId}&codVenda=${codVenda}&amount=${amount}&id_base=${id_base}&id_quotapartner=${id_quotapartner}`;
  
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
  
  