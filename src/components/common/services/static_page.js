import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const staticpageService = {
  get,
  save,
  select,
}
function get(loggedId,api,id_static_page) {
  let url = config.api + `/v1/admin/static_content/get`;

  let obj = { loggedId, api, id_static_page };

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

function select(loggedId, api) {
  let url = config.api + `/v1/admin/static_content/select`;

  let obj = { loggedId, api };

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

function save(api, id_static_page, id_to_admin_user, isvisible, title, content) {
  let url = config.api + `/v1/admin/static_content/save`;

  let obj = {
    api, id_static_page, id_to_admin_user, isvisible, title, content
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
