import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const searchService = {
    shoppingfail,
}

function shoppingfail(loggedId, client_name, client_document, id_evento, id_apresentacao, currentPage, perPage) {
    let url = config.api + `/v1/admin/searchs/shoppingfail`;

    url = config.system.applyPagination(url, currentPage, perPage);

    let obj = { loggedId, client_name, client_document, id_evento, id_apresentacao };

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
    