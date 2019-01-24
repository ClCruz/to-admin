<template>
    <div>
      <b-container>
        <b-modal ref="gmapsModal" hide-footer title="Google Maps">
          <div class="d-block text-center">
            <h4>Maps para o endereço: {{popups.gmaps.name}}</h4>
          </div>
          <iframe v-if="this.form.ds_googlemaps.length>0" :src="googlemapsURI" height="200" width="300"></iframe>
          <b-btn class="mt-3" variant="outline-info" block @click="gmapsClose">Fechar</b-btn>
        </b-modal>

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
                                  v-model="form.ds_local_evento"
                                  placeholder="Digite o nome">
                      </b-form-input>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Estado:
                      </b-input-group-prepend>
                      <b-form-select v-on:change="selState" v-model="form.id_estado" :options="selects.state" size="sm" />
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Cidade:
                      </b-input-group-prepend>
                      <b-form-select v-model="form.id_municipio" :options="selects.city" size="sm" />
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Tipo:
                      </b-input-group-prepend>
                      <b-form-select v-model="form.id_tipo_local" :options="selects.placetype" size="sm" />
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-input-group-prepend is-text class="firstLabel">
                          Endereço:
                      </b-input-group-prepend>
                      <b-form-input id="name"
                                  type="text"
                                
                                  name="name"
                                  maxlength="600"
                                  v-model="form.ds_googlemaps"
                                  placeholder="Digite o endereço">
                      </b-form-input>
                      <b-button type="button" variant="outline-info" size="sm"  @click="openMaps">
                        <span>Ver no Google Maps</span>
                      </b-button>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
                  <b-input-group size="sm">
                      <b-form-checkbox id="active"
                                      v-model="form.in_ativo"
                                    
                                      value="1">
                      <span v-if="form.in_ativo == 1">Ativo</span>
                      <span v-else>Inativo</span>
                      </b-form-checkbox>
                  </b-input-group>
              </b-row>
              <b-row class="mb-3">
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
import config from "@/config";
import { func } from "@/functions";
import { cityService } from '../../components/common/services/city';
import { stateService } from '../../components/common/services/state';
import { placetypeService } from '../../components/common/services/placetype';
import { placeService } from '../../components/common/services/place';


Vue.use(VueHead);

export default {
  mixins: [func],
  props: ['id'],
  name: 'place-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Gênero - ${this.typeOf}`,
      }
    },
  },
  created() {
    this.populatePlaceType();
    this.populateState();
    if (!this.isAdd) {
      this.get();
    }
  },
  computed: {
    mayIsee() {
      return this.mayI('place-add', 'place-viewer');
    },
    typeOf() {
      return this.isAdd ? "Adicionar" : "Alterar";
    },
    isAdd() {
      return this.id == '' || this.id == null || this.id == undefined;
    },
    googlemapsURI() {
      //return "https://www.google.com/maps/embed?q=acquplay"
      return `http://maps.google.com/?q=${this.form.ds_googlemaps}&output=embed`;
    }
  },
  methods: {
    gmapsClose() {
      this.$refs.gmapsModal.hide();
    },
    selState() {
      Vue.nextTick().then(response => {
        this.populateCity();
      });
    },
    openMaps() {
      this.popups.gmaps.name = this.form.ds_local_evento;
      this.$refs.gmapsModal.show();
      //window.open("http://maps.google.com/?q="+this.form.ds_googlemaps);
    },
    save() {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocessSave");
      this.showWaitAboveAll();

      placeService.save(this.getLoggedId(), this.isAdd ? '' : this.id, this.form.ds_local_evento, this.form.ds_googlemaps, this.form.in_ativo, this.form.id_municipio, this.form.id_tipo_local).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocessSave");

          if (this.validateJSON(response))
          {
             if (response.success) {
               this.toastSuccess("Salvo com sucesso");
               this.$router.push(`/place/list`);
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
    populatePlaceType() {
      this.showWaitAboveAll();
      placetypeService.select().then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
            this.selects.placetype = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );     
    },
    populateState() {
      this.showWaitAboveAll();
      stateService.select().then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
            this.selects.state = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );     
    },
    populateCity() {
      this.showWaitAboveAll();
      cityService.select(this.form.id_estado).then(
        response => {
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
            this.selects.city = response;
          }
        },
        error => {
          this.hideWaitAboveAll();
          this.toastError("Falha na execução.");
        }
      );     
    },
    get() {
      if (this.processing) return;

      this.processing = true;

      this.$wait.start("inprocess");
      this.showWaitAboveAll();
      placeService.get(this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();
          this.$wait.end("inprocess");

          //debugger;

          if (this.validateJSON(response))
          {
            this.form.loaded = this.validateJSONisNotEmpty(response);
              if (this.form.loaded) {
                this.form.ds_local_evento = response.ds_local_evento;
                this.form.ds_googlemaps = response.ds_googlemaps == null ? "" : response.ds_googlemaps;
                this.form.in_ativo = response.in_ativo;
                this.form.id_municipio = response.id_municipio;
                this.form.id_tipo_local = response.id_tipo_local;
                this.form.id_estado = response.id_estado;
                this.populateCity();
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
        selects: {
          city: [],
          state: [],
          placetype: [],
        },
        popups: {
          gmaps: {
            loaded: false,
            name: '',
          }
        },
        form: {
          loaded: false,
          ds_local_evento: '',
          ds_googlemaps: '',
          in_ativo: 1,
          id_municipio: '',
          id_tipo_local: '',
          id_estado: '',
        }
    }
  }
}
</script>

<style>

</style>
