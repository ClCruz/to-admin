import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const userService = {
  get,
  list,
  save,
  authList,
  authSave,
  baseList,
  baseSave,
  partnerList,
  partnerSave,
  baseSelect,
  pair,
  changepass,
  ticketofficeuserwithpermission
}
function changepass(loggedId, oldpass, newpass) {
    let url = config.api + `/v1/admin/user/changepass`;

    let obj = {
        id: loggedId,
        oldpass,
        newpass
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
function pair(loggedId) {
    let url = config.api + `/v1/admin/user/pair/generate`;

    let obj = {
        id: loggedId,
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
function ticketofficeuserwithpermission(id_base) {
    let url = config.api + `/v1/admin/user/ticketoffice/list?id_base=${id_base}`;

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
function baseSelect(id_user) {
    let url = config.api + `/v1/admin/base/select?id_user=${id_user}`;

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

function baseList(id) {
    let url = config.api + `/v1/admin/user/base/list?id=${id}`;

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
function partnerList(id) {
    let url = config.api + `/v1/admin/user/partner/list?id=${id}`;

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
function partnerSave(loggedId, id, id_partner) {
    let url = config.api + `/v1/admin/user/partner/save`;

    let obj = {
        loggedId,
        id,
        id_partner,
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
function baseSave(loggedId, id, id_base) {
    let url = config.api + `/v1/admin/user/base/save`;

    let obj = {
        loggedId,
        id,
        id_base,
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

function authList(id) {
    let url = config.api + `/v1/admin/user/authorization/list?id=${id}`;

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
function authSave(loggedId, id, id_auth) {
    let url = config.api + `/v1/admin/user/authorization/save`;

    let obj = {
        loggedId,
        id,
        id_auth,
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

function list(search, currentPage, perPage) {
    let url = config.api + `/v1/admin/user/list?search=${search}`;
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
function get(id) {
    let url = config.api + `/v1/admin/user/get?id=${id}`;
    
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
function save(id, name, login, email, document, active) {
    let url = config.api + `/v1/admin/user/save`;

    let obj = {
        id: id != undefined && id != null ? id : '',
        name,
        login,
        email,
        document,
        active
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