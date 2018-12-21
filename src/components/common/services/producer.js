import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const producerService = {
  get,
  list,
  save,
  select,
}
function select(loggedId) {
    let url = config.api + `/v1/admin/producer/select?loggedId=${loggedId}`;

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
    let url = config.api + `/v1/admin/producer/list?loggedId=${loggedId}&search=${search}`;
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
function get(loggedId, id, document) {
    if (id==undefined || id==null)
        id = '';
        
    let url = config.api + `/v1/admin/producer/get?loggedId=${loggedId}&id_produtor=${id}&document=${document}`;
    
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
function save(loggedId, id_produtor,cd_cpf_cnpj
    ,cd_email,ds_ddd_celular,ds_celular
    ,ds_ddd_telefone,ds_telefone,ds_endereco
    ,ds_razao_social,in_ativo) {
    let url = config.api + `/v1/admin/producer/save`;

    let obj = {
        id_user: loggedId, id_produtor,cd_cpf_cnpj
        ,cd_email,ds_ddd_celular,ds_celular
        ,ds_ddd_telefone,ds_telefone,ds_endereco
        ,ds_razao_social,in_ativo
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