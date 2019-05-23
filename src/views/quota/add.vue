<template>
    <div>
      <b-container>
        <b-row>
          <b-col>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Nome:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                  name="name"
                                  maxlength="100"
                                  v-model="form.name"
                                  placeholder="Digite o nome">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3" v-if="!isAdd">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text>
                          API KEY:
                      </b-input-group-prepend>
                      <b-input-group-prepend is-text>
                        <span v-b-tooltip.hover :title="'Chave de produção -'+form.key+' (Clique para copiar)'" 
                            style="padding-right:10px;cursor:pointer;"
                            v-clipboard:copy="form.key"
                            v-clipboard:success="clipboardSuccess"
                            v-clipboard:error="clipboardError"><i class="fas fa-key"></i></span>
                      </b-input-group-prepend>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-form-checkbox id="active"
                                      v-model="form.active"
                                      value="1">
                      <span v-if="form.active == 1">Ativo</span>
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
import VueClipboard from 'vue-clipboard2';
import config from "@/config";
import { func } from "@/functions";
import { quotapartnerService } from '../../components/common/services/quotapartner';

Vue.use(VueClipboard);
Vue.use(VueHead);

export default {
  mixins: [func],
  props: ['id'],
  name: 'quotapartner-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Parceiro para cota - ${this.typeOf}`,
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
      return this.mayI('quotapartner-add', 'quotapartner-viewer');
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

      quotapartnerService.save(this.getLoggedId(), this.isAdd ? '' : this.id, this.form.name, this.form.active).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
             if (response.success) {
               this.toastSuccess("Salvo com sucesso");
               this.$router.push(`/quota/list`);
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
      quotapartnerService.get(this.getLoggedId(), this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          if (this.validateJSON(response))
          {
              this.form.loaded = this.validateJSONisNotEmpty(response);
              if (this.form.loaded) {
                this.form.name = response.name;
                this.form.key = response.key;
                this.form.active = response.active;
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
          loaded: false,
          name: '',
          key: '',
          active: 1,
        }
    }
  }
}
</script>

<style>

</style>
