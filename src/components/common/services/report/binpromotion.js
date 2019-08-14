import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const binpromotionService = {
  list,
  printurl
}

function printurl(loggedId, start, end) {
  let url = config.api + `/v1/print/report/binpromotion?exportto=sheet&loggedId=${loggedId}&start=${start}&end=${end}&${config.getapikeyQS()}`;
  return url;
}

function list(loggedId, start, end) {
  let url = config.api + `/v1/admin/report/binpromotion/list?loggedId=${loggedId}&start=${start}&end=${end}`;

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

