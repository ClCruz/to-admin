import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const adService = {
  get,
  save,
  list,
  base64,
}

function base64(id, type) {
    let url = config.api + `/v1/admin/ad/base64`;

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
function get(id) {
    let url = config.api + `/v1/admin/ad/get`;
  
    let obj = { id };
  
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
  function save(loggedId,id,id_partner,isactive
    ,startdate,enddate,title
    ,content,link,type
    ,image,campaign,name
    ,priority,index,saveimage) {
    let url = config.api + `/v1/admin/ad/save`;
  
    let obj = { loggedId,id,id_partner,isactive
        ,startdate,enddate,title
        ,content,link,type
        ,image,campaign,name
        ,priority,index,saveimage: (saveimage == true ? 1 : 0) };
  
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
  function list(text, currentPage, perPage) {
    let url = config.api + `/v1/admin/ad/list`;

    url = config.system.applyPagination(url, currentPage, perPage);
  
    let obj = { text };
  
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
      