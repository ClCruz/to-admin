let environment = '';

import Vue from 'vue';
import VueResource from "vue-resource";
import multi from "./multi";
import myconf from "./configs/config-vars";
import myinfo from "./configs/config-info";

Vue.use(VueResource);

environment = multi.env;

const configHelp = {
  environment,
  setapikey,
  info: myinfo,
  system: {
    perPage: 10,
    perPageLabel: "__perPage",
    currentPageLabel: "__currentPage",
    totalCount: "totalCount",
    applyPagination,
  }
}

const defaultConfig = Object.assign({}, myconf, configHelp);

function applyPagination(url, currentPage, perPage) {
  let separator = "?";
  if (url.indexOf("?")>-1) {
    separator = "&";
  }

  if (currentPage == "" || currentPage == undefined || currentPage == null)
    currentPage = 1;

  if (perPage == undefined || perPage == null || perPage == "")
    perPage = defaultConfig.system.perPage;

  let ret = `${url}${separator}${defaultConfig.system.currentPageLabel}=${currentPage}&${defaultConfig.system.perPageLabel}=${perPage}`;
  return ret;
}

function setapikey() {
  Vue.http.interceptors.push((request, next) => {
      if (request.url.startsWith(defaultConfig.api)) {
        if (request.url.indexOf("apikey=")==-1) {
          if (request.url.indexOf("?")>-1) {
              request.url+="&apikey="+defaultConfig.apikey;
            }
            else {
              request.url+="?apikey="+defaultConfig.apikey;
            }
          }
      }
      next();
  });

}

export default Object.assign({}, defaultConfig);