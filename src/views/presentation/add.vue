<template>
    <div v-if="mayIsee">
      <b-container>

<ctk-date-time-picker
  v-model="form.data"
  formatted="HH:mm"
  time-format="HH:mm"
  format="HH:mm"
  auto-close
  label="Escolha a hora"
  :minute-interval="1"
  disable-date
  />


        <b-table striped="striped"
              outlined="outlined"
              class="fontSize bg-white"
              small="small"
              hover="hover"
              responsive
              show-empty
              empty-text="Não foram encontrados registros."
              v-if="this.grids.result.loaded"
              :items="this.grids.result.items"
              :fields="this.grids.result.fields">

          <template slot="active" slot-scope="data">
            <b-button size="sm" @click="changeAuth('add', data.item)" title="Adicionar permissão" variant="outline-success" v-if="data.item.active != 1">
                Adicionar
            </b-button>
            <b-button size="sm" @click="changeAuth('del', data.item)" title="Remover permissão" variant="danger" v-if="data.item.active == 1">
                Remover
            </b-button>
          </template>
        </b-table>


      </b-container>
    </div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import config from "@/config";
import { func } from "@/functions";
import { presentationService } from '../../components/common/services/presentation';

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';

import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

Vue.use(VueHead);

export default {
  mixins: [func],
  props: ['id', 'id_base'],
  components: {
    'ctk-date-time-picker': VueCtkDateTimePicker
  },
  name: 'pres-add',
  head: {
    title: function () {
      return { 
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Apresentação - ${this.typeOf}`,
      }
    },
  },
  created() {
  },
  computed: {
    mayIsee() {
      return this.mayI('presentation-add', 'presentation-viewer');
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
    },
    populateGrid() {
      if (this.processing) return;

      this.processing = true;

      this.showWaitAboveAll();
      presentationService.list(this.getLoggedId(), this.id_base, this.id).then(
        response => {
          this.processing = false;
          this.hideWaitAboveAll();

          if (this.validateJSON(response))
          {
              this.grids.result.loaded = true;
              this.grids.result.items = response;
          }
        },
        error => {
          this.processing = false;
          this.hideWaitAboveAll();
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
          data: '',
        },
        grids: {
          result: {
            processing: false,
            loaded: false,
            total: 0,
            currentPage: 1,
            perPage: 1000,
            items: [],
            fields: {
                NomSala: { label: 'Sala', sortable: false },
                weekdayName: { label: 'Dia da Semana', sortable: false },
                DatApresentacao: { label: 'Data', sortable: false },
                HorSessao: { label: 'Hora', sortable: false },
                ValPeca: { label: 'Valor', sortable: false },
                StaAtivoWeb: { label: 'Ativo Web?', sortable: false },
                StaAtivoBilheteria: { label: 'Ativo Bilheteria?', sortable: false },
                actions: { label: 'Ações' }
            },
          }
        }
    }
  }
}
</script>

<style scoped>
</style>
