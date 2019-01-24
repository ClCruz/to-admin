import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const placeService = {
  list,
  save,
  get,
  select,
  link,
}

function select(id_municipio) {
    let url = config.api + `/v1/admin/place/select?id_city=${id_municipio}`;

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


function get(id) {
  if (id==undefined || id==null)
      id = '';
      
  let url = config.api + `/v1/admin/place/get?id_local_evento=${id}`;
  
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

function save(loggedId, id_local_evento, ds_local_evento, ds_googlemaps, in_ativo, id_municipio, id_tipo_local) {
  let url = config.api + `/v1/admin/place/save`;

  let obj = {
      id_user: loggedId, id_local_evento, ds_local_evento, ds_googlemaps, in_ativo, id_municipio, id_tipo_local
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


function link(loggedId, id_local_evento) {
    let url = config.api + `/v1/admin/place/link`;
  
    let obj = {
        id_user: loggedId, id_local_evento
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

function list(search, id_state, id_city, in_ativo, currentPage, perPage) {
  let url = config.api + `/v1/admin/place/list?&search=${search}&id_state=${id_state}&id_city=${id_city}&in_ativo=${in_ativo}`;
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
