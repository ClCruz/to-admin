import Vue from 'vue';
import VueResource from "vue-resource";
import config from '@/config';

Vue.use(VueResource);

config.setapikey();

export const eventService = {
  list,
  get,
  save,
  base64
}

function base64(id, type) {
    let url = config.api + `/v1/admin/event/base64`;

    let obj = { id, type };

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

function list(loggedId, search, currentPage, perPage) {
    let url = config.api + `/v1/admin/event/list?loggedId=${loggedId}&search=${search}`;
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

function save(id_to_admin_user, id_base,id_produtor
    ,CodPeca,NomPeca,CodTipPeca
    ,TemDurPeca,CenPeca,id_local_evento
    ,ValIngresso,description,meta_description
    ,meta_keyword,opening_time,insurance_policy
    ,showInBanner,bannerDescription,QtIngrPorPedido
    ,in_obriga_cpf,qt_ingressos_por_cpf,ticketoffice_askemail
    ,imagechanged,imagebase64,free_installments
    ,max_installments,interest_rate,ticketoffice_ticketmodel
    ,showonline,minAmount,maxAmount) {

    let url = config.api + `/v1/admin/event/save`;

    let obj = {
        id_base,id_produtor,id_to_admin_user
        ,CodPeca,NomPeca,CodTipPeca
        ,TemDurPeca,CenPeca,id_local_evento
        ,ValIngresso,description,meta_description
        ,meta_keyword,opening_time,insurance_policy
        ,showInBanner,bannerDescription,QtIngrPorPedido
        ,in_obriga_cpf,qt_ingressos_por_cpf,ticketoffice_askemail
        ,imagechanged,imagebase64,free_installments
        ,max_installments,interest_rate,ticketoffice_ticketmodel
        ,showonline,minAmount,maxAmount
    };


    var ret = new Promise(
        function (resolve, reject) {
            Vue.http.post(url, obj, { emulateJSON: true }).then(res => {
                resolve(res.body);
            },
            (err) => {
                console.log("Err", err);
              })
            .catch((e) => {
              console.log("Caught", e);
            })
        }
    );
    return ret;
}