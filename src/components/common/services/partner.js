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
  resetgit,
  videoupload,
  listbase,
  listbaseselect,
  savebase,
  withpermission,
  withpermissionbases,
  listpaymenttype,
  savepaymenttype,
  listpaymenttypeonbase,
}

function withpermissionbases(loggedId) {
    let url = config.api + `/v1/admin/partner/selectwithpermissionbases`;
    
    let obj = { loggedId };

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
function withpermission(loggedId) {
    let url = config.api + `/v1/admin/partner/selectwithpermission`;
    
    let obj = { loggedId };

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
function listbase(id_partner) {
    let url = config.api + `/v1/admin/partner/base/list?id=${id_partner}`;

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
function listbaseselect(id_partner) {
    let url = config.api + `/v1/admin/partner/base/select?id=${id_partner}`;

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
function savepaymenttype(id_partner, loggedId, id_base, id_meio_pagamento, codForPagto) {
    let url = config.api + `/v1/admin/partner/paymenttype/save`;

    let obj = { id_partner, loggedId, id_base, id_meio_pagamento, codForPagto };

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
function listpaymenttype(id_partner, id_base) {
    let url = config.api + `/v1/admin/partner/paymenttype/list?id=${id_partner}&id_base=${id_base}`;

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
function listpaymenttypeonbase(id_base) {
    let url = config.api + `/v1/admin/partner/paymenttype/select_onbase?id_base=${id_base}`;

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
function savebase(loggedId, id_partner, id_base) {
    let url = config.api + `/v1/admin/partner/base/save`;

    let obj = { loggedId, id_partner, id_base };

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

function videoupload(form) {
    // debugger;
    let url = config.api + `/v1/admin/partner/scaffoldervideoupload`;

    var ret = new Promise(
        function (resolve, reject) {
            // debugger;
            Vue.http.post(url, form).then(res => {
                // debugger;
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
function resetgit(loggedId) {
    let url = config.api + `/v1/admin/partner/scaffolderreset`;

    let obj = { id_user: loggedId };

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

function scaffolder(loggedId, id_partner,json_meta_description, json_meta_keywords, json_template, json_info_title, json_info_cnpj, json_info_companyname, json_info_companyaddress, json_ga, scss_colors_primary, scss_colors_secondary, changedImage, imagebase64, generate, scss_colors_text, scss_image_background) {
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
        ,scss_colors_text
        ,scss_image_background
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
function save(loggedId,id, uniquename, name, domain, dateStart, dateEnd, type, active, fb_appid, recaptchaid, sell_email, send_sell_email,ga_id,show_partner_info) {
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
        ,fb_appid
        ,recaptchaid
        ,sell_email
        ,send_sell_email
        ,ga_id
        ,show_partner_info
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
