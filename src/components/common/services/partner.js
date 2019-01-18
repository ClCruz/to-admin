import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const partnerService = {
  list,
  get,
  save,
  regen,
  getwl,
  confdb,
  confdbuser,
}

function confdb(loggedId,id) {
    let url = config.api + `/v1/admin/partner/confdb`;

    let obj = {
        id_user: loggedId
        ,id
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
function confdbuser(loggedId,id) {
    let url = config.api + `/v1/admin/partner/confdbuser`;

    let obj = {
        id_user: loggedId
        ,id
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

function regen(loggedId,id, keyTo) {
    let url = config.api + `/v1/admin/partner/gen`;

    let obj = {
        id_user: loggedId
        ,id
        ,keyTo
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
function save(loggedId,id, uniquename, name, domain, dateStart, dateEnd, type, active) {
    let url = config.api + `/v1/admin/partner/save`;

    let obj = {
        id_user: loggedId
        ,id
        ,uniquename
        ,name
        ,domain
        ,dateStart
        ,dateEnd
        ,type
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

function get(loggedId, id) {
    let url = config.api + `/v1/admin/partner/get?loggedId=${loggedId}&id=${id}`;

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

function getwl(loggedId, id) {
    let url = config.api + `/v1/admin/partner/getforwl?loggedId=${loggedId}&id=${id}`;

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

function list(loggedId, search, currentPage, perPage) {
    let url = config.api + `/v1/admin/partner/list?loggedId=${loggedId}&search=${search}`;
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
