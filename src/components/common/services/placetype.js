import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const placetypeService = {
  list,
}

function list() {
    let url = config.api + `/v1/admin/placetype/list`;

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
