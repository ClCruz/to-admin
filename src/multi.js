const domains = require('./jsons/domains.json');

let json = {};
let domain = domains[window.location.hostname];

if (domain == undefined || domain == "") {
    domain = "localhost";
}

const jsonName = `./jsons/${domain}.json`;

json = require(`./jsons/${domain}.json`);

// if (json.env === 'dev') {
//   require(`@/scss/themes/${json.template}/main.scss`);
// }

// console.log(`${json.uri}/assets/css/${json.template}/main.css`);
// require(`${json.uri}/assets/css/${json.template}/main.css`);

export default Object.assign({}, json);
