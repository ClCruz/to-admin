import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const presentationService = {
  list,
  get,
  save,
}

function get(loggedId, id_evento, id_base) {
    let url = config.api + `/v1/admin/event/get?id_user=${loggedId}&id_evento=${id_evento}&id_base=${id_base}`;

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

function list(loggedId, id_base, id_evento) {
    let url = config.api + `/v1/admin/event/presentation/list?loggedId=${loggedId}&id_base=${id_base}&id_evento=${id_evento}`;
//    url = config.system.applyPagination(url, currentPage, perPage);

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

function save(id_to_admin_user, id_base,id_produtor
    ,CodPeca,NomPeca,CodTipPeca
    ,TemDurPeca,CenPeca,id_local_evento
    ,ValIngresso,description,meta_description
    ,meta_keyword,opening_time,insurance_policy
    ,showInBanner,bannerDescription,QtIngrPorPedido
    ,in_obriga_cpf,qt_ingressos_por_cpf
    ,imagechanged,imagebase64) {

    let url = config.api + `/v1/admin/event/save`;

    let obj = {
        id_base,id_produtor,id_to_admin_user
        ,CodPeca,NomPeca,CodTipPeca
        ,TemDurPeca,CenPeca,id_local_evento
        ,ValIngresso,description,meta_description
        ,meta_keyword,opening_time,insurance_policy
        ,showInBanner,bannerDescription,QtIngrPorPedido
        ,in_obriga_cpf,qt_ingressos_por_cpf
        ,imagechanged,imagebase64
    };

    console.log(obj);

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