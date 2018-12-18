import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const authService = {
  login,
  loginbytoken,
  codes,
}

function codes(id) {
  let url = config.api + `/v1/admin/authorization/code`;

  let obj = {
      id,
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


function login(login, pass) {
  let url = config.api + `/v1/auth/admin/login?login=${login}`;

  let obj = {
      pass,
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

function loginbytoken(token) {
  if (token == "" || token == undefined || token == null)
    return;

  let url = config.api + `/v1/auth/admin/token?token=${token}`;
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
