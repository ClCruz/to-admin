import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const roomService = {
  list,
  get,
  save,
  select
}


function list(loggedId, id_base, id_local_evento, text, currentPage, perPage) {
  let url = config.api + `/v1/admin/room/list`;

  url = config.system.applyPagination(url, currentPage, perPage);

  let obj = { loggedId, id_base, id_local_evento, text };

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
  let url = config.api + `/v1/admin/room/get`;

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

function select(loggedId, id_base, id_local_evento) {
  let url = config.api + `/v1/admin/room/select?id_base=${id_base}&id_local_evento=${id_local_evento}`;

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
              ,CodSala
              ,NomSala
              ,NomRedSala
              ,nameonsite
              ,id_local_evento
              ,StaSala) {
      let url = config.api + `/v1/admin/room/save`;

      let obj = {
          loggedId
          ,CodSala
          ,NomSala
          ,NomRedSala
          ,nameonsite
          ,id_local_evento
          ,StaSala
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

