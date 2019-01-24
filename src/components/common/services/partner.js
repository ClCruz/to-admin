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
  scaffolder,
}

function scaffolder(loggedId, id_partner,json_meta_description, json_meta_keywords, json_template, json_info_title, json_info_cnpj, json_info_companyname, json_info_companyaddress, json_ga, scss_colors_primary, scss_colors_secondary, changedImage, imagebase64, generate) {
    let url = config.api + `/v1/admin/partner/scaffolder`;

    let obj = {
        id_user: loggedId
        ,id_partner
        ,json_info_description: json_meta_description
        ,json_meta_description
        ,json_meta_keywords
        ,json_template
        ,json_info_title
        ,json_info_cnpj
        ,json_info_companyname
        ,json_info_companyaddress
        ,json_ga
        ,scss_colors_primary
        ,scss_colors_secondary
        ,changedImage
        ,imagebase64
        ,generate
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
