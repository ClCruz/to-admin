import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const partnersaleService = {
  list,
  detail,
}

function list(loggedId, start, end, amount) {
  let url = config.api + `/v1/admin/report/partnersale/list?loggedId=${loggedId}&start=${start}&end=${end}&amount=${amount}`;
  //url = config.system.applyPagination(url, currentPage, perPage);

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

function detail(loggedId, id_pedido_venda, amount) {
  let url = config.api + `/v1/admin/report/partnersale/detail?loggedId=${loggedId}&id_pedido_venda=${id_pedido_venda}&amount=${amount}`;

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

