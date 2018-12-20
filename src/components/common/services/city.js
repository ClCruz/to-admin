import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const cityService = {
  list,
}

function list(id_state) {
    let url = config.api + `/v1/admin/city/list?id_state=${id_state}`;

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
