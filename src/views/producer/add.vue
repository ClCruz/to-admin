<template>
    <div>
      <b-container>
        <b-row>
          <b-col>
              <b-row>
                  <b-input-group size="sm">
                      <b-form-select v-model="form.documentType" size="sm">
                        <option value="###.###.###-##">CPF</option>
                        <option value="##.###.###/####-##">CNPJ</option>
                        <option value="">Outros</option>
                      </b-form-select>
                      <b-form-input id="name"
                                  type="text"
                                  name="document"
                                  maxlength="14"
                                  v-mask="form.documentType"
                                  v-model.lazy="form.cd_cpf_cnpj"
                                  placeholder="Digite o documento">
                      </b-form-input>
                      <b-btn v-if="isAdd" variant="outline-info" @click="get" size="sm">
                        <v-wait for="inprocess">
                            <template slot="waiting">
                                Carregando...
                            </template>
                        </v-wait>
                        <span v-if="!processing">Buscar</span>
                      </b-btn>
                  </b-input-group>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Nome:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="name"
                                  maxlength="200"
                                  v-model="form.ds_razao_social"
                                  placeholder="Digite o nome">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Email:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="email"
                                  maxlength="100"
                                  v-model="form.cd_email"
                                  placeholder="Digite o e-mail">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Endereço:
                      </b-input-group-prepend>
                      <b-form-input id="address"
                                  type="text"
                                  name="address"
                                  maxlength="500"
                                  v-model="form.ds_endereco"
                                  placeholder="Digite o endereço">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Celular:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="cellphone"
                                  v-mask="'(##) ####-#####'"
                                  maxlength="100"
                                  v-model="form.ds_celular"
                                  placeholder="Digite o celular">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Telefone:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="phone"
                                  v-mask="'(##) ####-####'"
                                  maxlength="100"
                                  v-model="form.ds_telefone"
                                  placeholder="Digite o telefone">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row>
                  <b-input-group size="sm">
                      <b-form-checkbox id="active"
                                      v-model="form.in_ativo"
                                      value="1"
                                      unchecked-value="not_accepted">
                      <span v-if="form.in_ativo == 1">Ativo</span>
                      <span v-else>Inativo</span>
                      </b-form-checkbox>
                  </b-input-group>
              </b-row>
              <b-row>
                <b-button type="button" variant="success" size="sm" @click="save">
                  <v-wait for="inprocess">
                      <template slot="waiting">
                          Carregando...
                      </template>
                  </v-wait>
                  <v-wait for="inprocessSave">
                      <template slot="waiting">
                          Salvando...
                      </template>
                  </v-wait>
                  <span v-if="!processing">Salvar</span>
                </b-button>
              </b-row>
          </b-col>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import VueMask from 'v-mask';
import config from "@/config";
import { func } from "@/functions";
import { producerService } from '../../components/common/services/producer';

Vue.use(VueHead);
Vue.use(VueMask);

export default {
  mixins: [func],
  props: ['id'],
  name: 'user-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Usuário - ${this.typeOf}`,
      }
    },
  },
  created() {
    if (!this.isAdd) {
      this.get();
    }
  },
  computed: {
    mayIsee() {
      return this.mayI('user-add', 'user-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    }
  },
  methods: {
    save() {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocessSave");
      this.showWaitAboveAll();

      let cellphone = this.form.ds_celular.replace(/[&\/\-\\#,+()$ ~%.'":*?<>{}]/g,'');
      let phone = this.form.ds_telefone.replace(/[&\/\-\\#,+()$ ~%.'":*?<>{}]/g,'');

      let ddd_cellphone = cellphone.substring(0,2);
      cellphone = cellphone.substring(2,cellphone.lenght);

      let ddd_phone = phone.substring(0,2);
      phone = phone.substring(2,phone.lenght);

      producerService.save(this.getLoggedId(), this.isAdd ? '' : this.id, this.form.cd_cpf_cnpj,
                            this.form.cd_email, ddd_cellphone, cellphone,
                            ddd_phone, phone, this.form.ds_endereco,
                            this.form.ds_razao_social, this.form.in_ativo).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
             if (response.success) {
               this.toastSuccess("Salvo com sucesso");
               this.$router.push(`/producer/list`);
             }
             else {
               this.toastError(response.msg);
             }
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");
          this.toastError("Falha na execução.");
        }
      );      
    },
    get() {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      producerService.get(this.getLoggedId(), this.id, this.form.cd_cpf_cnpj).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = this.validateJSONisNotEmpty(response);
              if (this.form.loaded) {
                this.form.id_produtor = response.id_produtor;
                this.form.ds_razao_social = response.ds_razao_social;
                this.form.cd_email = response.cd_email;
                this.form.cd_cpf_cnpj = response.cd_cpf_cnpj;
                this.form.ds_celular = response.ds_ddd_celular+response.ds_celular;
                this.form.ds_telefone = response.ds_ddd_telefone+response.ds_telefone;
                this.form.ds_endereco = response.ds_endereco;
              }
          }
        },
        error => {
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
          documentType:"###.###.###-##",
          loaded: false,
          ds_razao_social: '',
          cd_email: '',
          cd_cpf_cnpj: '',
          ds_celular: '',
          ds_telefone: '',
          ds_endereco: '',
          in_ativo: 1,
        }
    }
  }
}
</script>

<style>

</style>
