import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const clientService = {
  list,
  list_printurl,
  byevent,
  byevent_printurl,
}
function list_printurl(loggedId, id_base) {
  let url = config.api + `/v1/print/report/clientsall?exportto=sheet&loggedId=${loggedId}&id_base=${id_base}&${config.getapikeyQS()}`;
  return url;
}
function list(loggedId, id_base) {
  let url = config.api + `/v1/admin/report/client/all?loggedId=${loggedId}&id_base=${id_base}`;

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

function byevent_printurl(loggedId, id_base, id_evento, date, hour) {
  let url = config.api + `/v1/print/report/clientbyevent?exportto=sheet&loggedId=${loggedId}&id_base=${id_base}&id_evento=${id_evento}&date=${date}&hour=${hour}&${config.getapikeyQS()}`;
  return url;
}
function byevent(loggedId, id_base, id_evento, date, hour) {
  let url = config.api + `/v1/admin/report/client/byevent?loggedId=${loggedId}&id_base=${id_base}&id_evento=${id_evento}&date=${date}&hour=${hour}`;

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