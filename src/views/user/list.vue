<template>
    <div v-if="mayIsee">
      <b-modal ref="authModal" hide-footer title="Usuário x Permissão" size="lg">
        <div class="d-block text-center">
          <h4>Permissão para {{popups.auth.name}}</h4>
        </div>
        <b-table striped="striped"
                  outlined="outlined"
                  class="fontSize tableClicked bg-white"
                  small="small"
                  hover="hover"
                  responsive
                  show-empty
                  empty-text="Não foram encontrados registros."
                  v-if="this.popups.auth.grids.auth.loaded"
                  :items="this.popups.auth.grids.auth.items"
                  :fields="this.popups.auth.grids.auth.fields">

              <template slot="active" slot-scope="data">
                <b-button size="sm" @click="changeAuth('add', data.item)" title="Adicionar permissão" variant="outline-success" v-if="data.item.active != 1">
                    Adicionar
                </b-button>
                <b-button size="sm" @click="changeAuth('del', data.item)" title="Remover permissão" variant="danger" v-if="data.item.active == 1">
                    Remover
                </b-button>
              </template>
        </b-table>
        <b-btn class="mt-3" variant="outline-info" block @click="authorizationClose">Fechar</b-btn>
      </b-modal>
      <b-modal ref="baseModal" hide-footer title="Usuário x Base">
        <div class="d-block text-center">
          <h4>Permissão nas bases para {{popups.auth.name}}</h4>
        </div>
        <b-table striped="striped"
                  outlined="outlined"
                  class="fontSize tableClicked bg-white"
                  small="small"
                  hover="hover"
                  responsive
                  show-empty
                  empty-text="Não foram encontrados registros."
                  v-if="this.popups.base.grids.base.loaded"
                  :items="this.popups.base.grids.base.items"
                  :fields="this.popups.base.grids.base.fields">

              <template slot="active" slot-scope="data">
                <b-button size="sm" @click="changeBase('add', data.item)" title="Adicionar permissão" variant="outline-success" v-if="data.item.active != 1">
                    Adicionar
                </b-button>
                <b-button size="sm" @click="changeBase('del', data.item)" title="Remover permissão" variant="danger" v-if="data.item.active == 1">
                    Remover
                </b-button>
              </template>
        </b-table>
        <b-btn class="mt-3" variant="outline-info" block @click="baseClose">Fechar</b-btn>
      </b-modal>
      <b-modal ref="partnerModal" hide-footer title="Usuário x Parceiro" size="lg">
        <div class="d-block text-center">
          <h4>Permissão nos parceiros para {{popups.partner.name}}</h4>
        </div>
        <b-table striped="striped"
                  outlined="outlined"
                  class="fontSize tableClicked bg-white"
                  small="small"
                  hover="hover"
                  responsive
                  show-empty
                  empty-text="Não foram encontrados registros."
                  v-if="this.popups.partner.grids.partner.loaded"
                  :items="this.popups.partner.grids.partner.items"
                  :fields="this.popups.partner.grids.partner.fields">

              <template slot="active" slot-scope="data">
                <b-button size="sm" @click="changePartner('add', data.item)" title="Adicionar parceiro" variant="outline-success" v-if="data.item.active != 1">
                    Adicionar
                </b-button>
                <b-button size="sm" @click="changePartner('del', data.item)" title="Remover parceiro" variant="danger" v-if="data.item.active == 1">
                    Remover
                </b-button>
              </template>
        </b-table>
        <b-btn class="mt-3" variant="outline-info" block @click="partnerClose">Fechar</b-btn>
      </b-modal>

      <b-container>
        <b-row>
          <b-col>
              <b-row>
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Buscar:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  @keyup.enter.native="search"
                                  v-model="form.search"
                                  placeholder="Digite o nome, login, email ou documento">
                      </b-form-input>
                      <b-button type="button" variant="primary" size="sm" @click="search">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Consultando...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Consultar</span>
                      </b-button>

                  </b-input-group>
              </b-row>
          </b-col>

        </b-row>
        <b-row>
          <b-table striped="striped"
                  outlined="outlined"
                  class="fontSize tableClicked bg-white"
                  small="small"
                  hover="hover"
                  responsive
                  show-empty
                  empty-text="Não foram encontrados registros."
                  :per-page="grids.users.perPage"
                  v-if="grids.users.loaded"
                  :items="grids.users.items"
                  :fields="grids.users.fields">

              <template slot="actions" slot-scope="data">
                  <span v-if="!mayI('user-add')">-</span>
                  <b-button-group size="sm" v-if="mayI('user-add')">
                      <b-button title="Editar" v-if="mayI('user-add')" @click.stop="edit(data.item,$event.target)">
                        <span v-if="!processing">
                          Editar
                        </span>
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Carregando...
                            </template>
                        </v-wait>
                      </b-button>
                      <b-button title="Bases" v-if="mayI('user-add')" @click.stop="base(data.item,$event.target)">
                        <span v-if="!processing">
                          Bases
                        </span>
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Carregando...
                            </template>
                        </v-wait>
                      </b-button>
                      <b-button title="Bases" v-if="mayI('user-add-partner')" @click.stop="partner(data.item,$event.target)">
                        <span v-if="!processing">
                          Parceiro
                        </span>
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Carregando...
                            </template>
                        </v-wait>
                      </b-button>
                      <b-button title="Permissão" v-if="mayI('user-add-auth')" @click.stop="authorization(data.item,$event.target)">
                        <span v-if="!processing">
                          Permissão
                        </span>
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Carregando...
                            </template>
                        </v-wait>
                      </b-button>
                  </b-button-group>
              </template>
              <template slot="active" slot-scope="data">
                  <span v-if="data.item.active == 1">Ativo</span>
                  <span v-else>Inativo</span>
              </template>
          </b-table>
          <b-pagination @change="pagto" size="sm" v-if="grids.users.loaded && grids.users.total>grids.users.perPage" :total-rows="grids.users.total" v-model="grids.users.currentPage" :per-page="grids.users.perPage">
          </b-pagination>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import { func } from "@/functions";
import { userService } from '../../components/common/services/user';

Vue.use(VueHead);

export default {
  mixins: [func],
  name: 'user-list',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: "Usuário - Lista",
      }
    },
  },
  computed: {
    mayIsee() {
      return this.mayI('user-viewer', 'user-add', 'user-add-auth');
    }
  },
  methods: {
    changeAuth(type, item) {
      if (this.processing) return;

      this.processing = true;

      this.showWaitAboveAll();
      userService.authSave(this.getLoggedId(), this.popups.auth.id, item.id).then(
        response => {
          this.processing = false;

          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              this.toastSuccess("Salvo com sucesso.");
              this.refreshAuthorization();
            }
            else {
              this.toastError(response.msg);
            }
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    changeBase(type, item) {
      if (this.processing) return;

      this.processing = true;

      this.showWaitAboveAll();
      userService.baseSave(this.getLoggedId(), this.popups.base.id, item.id_base).then(
        response => {
          this.processing = false;

          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              this.toastSuccess("Salvo com sucesso.");
              this.refreshBase();
            }
            else {
              this.toastError(response.msg);
            }
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    changePartner(type, item) {
      if (this.processing) return;

      this.processing = true;

      this.showWaitAboveAll();
      userService.partnerSave(this.getLoggedId(), this.popups.partner.id, item.id).then(
        response => {
          this.processing = false;

          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
            if (response.success) {
              this.toastSuccess("Salvo com sucesso.");
              this.refreshPartner();
            }
            else {
              this.toastError(response.msg);
            }
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          //this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    refreshPartner() {
      this.partner({ name: this.popups.partner.name, id: this.popups.partner.id });
    },
    refreshBase() {
      this.base({ name: this.popups.base.name, id: this.popups.base.id });
    },
    base(item) {
      if (this.processing) return;

      this.popups.base.name = item.name;
      this.popups.base.id = item.id;

      this.popups.base.grids.base.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      userService.baseList(item.id).then(
        response => {
          this.processing = false;
          this.popups.base.grids.base.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.popups.base.grids.base.loaded = true;
              this.popups.base.grids.base.items = response;
              this.$refs.baseModal.show();
          }
        },
        error => {
          this.popups.base.grids.base.processing = false;
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    partner(item) {
      if (this.processing) return;

      this.popups.partner.name = item.name;
      this.popups.partner.id = item.id;

      this.popups.partner.grids.partner.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      userService.partnerList(item.id).then(
        response => {
          this.processing = false;
          this.popups.partner.grids.partner.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.popups.partner.grids.partner.loaded = true;
              this.popups.partner.grids.partner.items = response;
              this.$refs.partnerModal.show();
          }
        },
        error => {
          this.popups.partner.grids.partner.processing = false;
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    refreshAuthorization() {
      this.authorization({ name: this.popups.auth.name, id: this.popups.auth.id });
    },
    authorization(item) {
      if (this.processing) return;
      
      this.processing = true;

      this.popups.auth.name = item.name;
      this.popups.auth.id = item.id;

      this.popups.auth.grids.auth.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      userService.authList(item.id).then(
        response => {

          if (this.validateJSON(response))
          {
              this.popups.auth.grids.auth.loaded = true;
              this.popups.auth.grids.auth.items = response;
              this.$refs.authModal.show();
          }
          this.processing = false;
          this.popups.auth.grids.auth.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");
        },
        error => {
          this.popups.auth.grids.auth.processing = false;
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    },
    partnerClose() {
      this.$refs.partnerModal.hide();
    },
    baseClose() {
      this.$refs.baseModal.hide();
    },
    authorizationClose() {
      this.$refs.authModal.hide();
    },
    edit(item) {
      this.$router.push(`/user/edit/${item.id}`);
    },
    pagto(to) {
      this.grids.users.currentPage = to;
      this.search();
    },
    search() {
      if (this.processing) return;

      this.grids.users.processing = true;
      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      let search = this.form.search;

      if (search == "@me") {
        search = this.ls_get("name");
      }

      userService.list(search, this.grids.users.currentPage, this.grids.users.perPage).then(
        response => {
          this.processing = false;
          this.grids.users.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.grids.users.loaded = true;
              this.grids.users.items = response;
              this.grids.users.currentPage = response.length == 0 ? 1 : response[0]["currentPage"];
              this.grids.users.total = response.length == 0 ? 0 : response[0][config.system.totalCount];
          }
        },
        error => {
          this.grids.users.processing = false;
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");
          this.toastError("Falha na execução.");
        }
      );      
    }
  },
  data () {
    return {
        processing: false,
        loading: false,
        form: {
          search: '',
        },
        popups: {
          auth: {
            loaded: false,
            name: '',
            id: '',
            grids: {
              auth: {
                processing: false,
                loaded: false,
                items: [],
                fields: {
                  group: { label: 'Grupo', sortable: false },
                  name: { label: 'Nome', sortable: false },
                  description: { label: 'Descrição', sortable: false },
                  active: { label: '', sortable: false },
                },
              }
            }
          },
          base: {
            loaded: false,
            name: '',
            id: '',
            grids: {
              base: {
                processing: false,
                loaded: false,
                items: [],
                fields: {
                  ds_nome_teatro: { label: 'Nome', sortable: false },
                  active: { label: '', sortable: false },
                },
              }
            }
          },
          partner: {
            loaded: false,
            name: '',
            id: '',
            grids: {
              partner: {
                processing: false,
                loaded: false,
                items: [],
                fields: {
                  name: { label: 'Nome', sortable: false },
                  domain: { label: 'Dominio', sortable: false },
                  active: { label: '', sortable: false },
                },
              }
            }
          }
        },
        grids: {
            users: {
                processing: false,
                loaded: false,
                total: 0,
                currentPage: 1,
                perPage: 10,
                items: [],
                fields: {
                    name: { label: 'Nome', sortable: false },
                    login: { label: 'Login', sortable: false },
                    email: { label: 'E-mail', sortable: false },
                    document: { label: 'Documento', sortable: false },
                    active: { label: 'Ativo?', sortable: false },
                    created: { label: 'Criado em', sortable: false },
                    updated: { label: 'Atualizado em', sortable: false },
                    actions: { label: 'Ações' }
                },
            }
        }
    }
  }
}
</script>

<style>

</style>
