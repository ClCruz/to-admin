import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const placeService = {
  list,
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
