<template>
<div v-if="mayIsee">
  <div class="container">
    <div class="row">
      <h2 @click="teste">Criação de salas</h2>
      <div class="col-12 pl-0 ml-0 border-0">
        <div id="sidebar_create" class="btn-group-sm">
          <p class="mt-4">Opções</p>
          <form>
            <fieldset>
              <div class="">
                <div class="form-inline mt-2">
                  <label class="mb-2" for="">Quantidade de assentos</label>
                  <input class="input-small form-control" id="row-name" type="text" placeholder="Nome do fileira (Ex: A)">
                  <input type="number" class=" form-control input-small" id="seats-quantity" placeholder="Quantidade assentos">
                  <input type="number" class=" form-control input-small" id="space-between" placeholder="Espaço entre assentos">
                </div>
                  <div class="form-group mt-3">
                    <div class="form-check mb-2">
                      <input id="enable-seats" class="form-check-input" type="checkbox">
                      <label class="form-check-label checkbox inline">Pular assentos</label>
                    </div>
                    <div class="form-inline">
                      <input class="form-control " id="steps-quantity" type="text" placeholder="Quantidade entre cada assento" disabled="">
                      <input class="form-control input-small" id="initial-value" type="number" placeholder="Número inicial" disabled="">
                  </div>
                    </div>
                    <div class="exemplo mt-3">
                      <p>Resultado:</p>
                      <br>
                      <span id="result"></span>
                    </div>
                  </div>
                  <a class="btn btn-small non-routed" id="btn-apply-options" href="#" title="Copy generated code to clipboard" data-clipboard-target="#code-anim-keyframes" onclick="apply()">Simular</a>
            </fieldset>
          </form>
        </div>
        <div id="sidebar_edit" class="btn-group-sm form-control">
          <p>Editar assentos</p>
          <div class="form-inline mt-2">
            <label class="mb-2" for="">Nome do assento:&nbsp;<span id="seat_name"></span></label>
            <input class="input-small" id="new_seat_name" type="text" placeholder="Novo nome (Ex: AA 03)">
            <button type="button" id="update_first_seat" class="btn btn-info">
            <i class="fa fa-save"></i>
            </button>
          </div>
          <p>Quantidade selecionada: <span id="markers_quantity"></span></p>
          <label class="" for="move_quantity">Quantidade para movimentar</label>
          <input type="number" name="move_quantity" class="" id="move_quantity" placeholder="quantidade">
          <br>
          <br>
          <button type="button" id="move_left" class="btn btn-info">
          <i class="fa fa-arrow-left"></i>
          </button>
          <button type="button" id="move_right" class="btn btn-info">
          <i class="fa fa-arrow-right"></i>
          </button>
          <button type="button" id="move_up" class="btn btn-info">
          <i class="fa fa-arrow-up"></i>
          </button>
          <button type="button" id="move_down" class="btn btn-info">
          <i class="fa fa-arrow-down"></i>
          </button>
          <br>
          <br>
          <button style="font-size: 0.78rem" type="button" id="accessible_markers" class="btn btn-info">
          <i class="fab fa-accessible-icon"></i>
          Transformar em assento acessível
          </button>
          <br>
          <div id="seats_to_edit">
          </div>
          <br>
          <button type="button" id="reset_markers" class="btn btn-info">
          <i class="fa fa-undo"></i>
          </button>
          <button type="button" id="delete_markers" class="btn btn-danger">
          <i class="fa fa-times"></i>
          </button>
          <button type="button" id="save_markers" class="btn btn-dark">
          <i class="fa fa-save"></i>
          </button>
        </div>
        <div id="map" style="width: 960px; height: 610px; border: 1px solid #fff"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Vue from "vue";
import VueHead from 'vue-head';
import VueQuillEditor from 'vue-quill-editor';
import PictureInput from 'vue-picture-input';
import VueMask from 'v-mask';
import Vuelidate from 'vuelidate';
import dateadd from '../presentation/add';

import config from "@/config";
import {
  func
} from "@/functions";
import {
  userService
} from '../../components/common/services/user';
import {
  genreService
} from '../../components/common/services/genre';
import {
  cityService
} from '../../components/common/services/city';
import {
  stateService
} from '../../components/common/services/state';
import {
  placeService
} from '../../components/common/services/place';
import {
  producerService
} from '../../components/common/services/producer';
import {
  eventService
} from '../../components/common/services/event';
import {
  roomEventService
} from '../../components/common/services/room/event';
import {
  bookingService
} from '../../components/common/services/room/booking';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import $ from 'jquery';

import {
  required,
  minLength
} from 'vuelidate/lib/validators';

Vue.use(VueHead);
Vue.use(VueQuillEditor);
Vue.use(VueMask);
Vue.use(Vuelidate);

export default {
  mixins: [func],
  components: {},
  props: ['id', 'base'],
  name: 'event-add',
  head: {
    title: function () {
      return {
        inner: `TicketOffice | Admin`,
        separator: " | ",
        complement: `Evento - ${this.typeOf}`,
      }
    },
  },
  created() {

  },
  computed: {
    mayIsee() {
      return this.mayI('place-add', 'place-viewer');
    },
    room() {},
  },
  methods: {
    teste() {
      insertSeats(pointsForJson);
    },
    getSeats() {
      roomEventService.getSeats(216, 167538, "8CC26A74-7E65-411E-B854-F7B281A46E01").then(response => {
        if (this.validateJSON(response)) {
          this.seats = response;
          this.setSeats();
        }
      }, error => {
        this.toastError("Falha na execução.");
      });
    },

    
    setSeats() {
      Vue.nextTick().then(response => {
        if (this.showClientAdd)
          return;

        let seatsFiltered = this.seats.filter(o => o.status != 'O' && o.status != 'C');
        for (let x in seatsFiltered) {
          if (this.codCliente != null && this.codCliente != "" && seatsFiltered[x].status == 'R' && seatsFiltered[x].codCliente != this.codCliente) continue;

          if (seatsFiltered[x].Indice)
            this.movSeat(this.createSeatSelectedObject(seatsFiltered[x].Indice, seatsFiltered[x].NomObjeto, seatsFiltered[x].NomSetor), false);
        }

        console.log(this.seats);
        teste2 = this.seats;

        addSeatJS($("#mapa_de_plateia"), annotation, this.seats, this.chooseSeat, this.indiceInProcess, this.codCliente, this.codReserva);
        setup_without_touch();

        //mapa_de_plateia[0].removeAnnotations();
        //$mapa_de_plateia.addAnnotations(annotation, this.seats);
      });
    },
  },
  directives: {

  },
  mounted() {
    const plugin = document.createElement("script");
    plugin.setAttribute(
      "src",
      "/assets/libs/basic.js"
    )
    document.head.appendChild(plugin);

    this.getSeats()
  },
  validations: {

  },
  data() {
    return {
      timers: {
        getSeats: null,
      },
      isMap: true,
      processing: false,
      showClientAdd: false,
      codCliente: null,
      codReserva: null,
      seats: [],
      selected: [],
      hasSeatNumber: false,
      maxSeatsAvailableToBuy: 0,
      indiceInProcess: [],
      infoMap: {
        img: null,
        width: '960',
        height: '610'
      },
    }
  }

}
    function addSeatJS() {
      return '';
    }
</script>

<style>
.imgthumb {
  margin: 0 auto;
  text-align: center;
  width: 25%;
  height: 50%;
  cursor: pointer;
}

#quill-container {
  height: auto;
  min-height: 100%;
  padding: 50px;
}

#quill-container .ql-editor {
  font-size: 18px;
  overflow-y: visible;
}

/* Specify our own scrolling container */
#scrolling-container {
  height: 100%;
  min-height: 100%;
  overflow-y: auto;
}

.errorFormValidate {
  margin-top: 5px !important;
  margin-bottom: -10px;
}

.errorFormValidateHack {
  margin-top: -100px !important;
}

.errorFormValidateHack2 {
  padding-left: 12px;
}

.modal-dialog {
  width: fit-content;
  max-width: 740px !important;
  width: 740px !important
}

.leaflet-marker-icon {
  background: darkolivegreen;
  border-radius: 50%;
}

.leaflet-sidebar .close {
  z-index: 5000;
}

.leaflet-marker-icon,
.leaflet-marker-shadow {
  display: block;

  margin-left: 0 !important;
  margin-top: 0 !important;
}

.leaflet-sidebar {
  height: 90%;
}

.leaflet-interactive {
  background: darkolivegreen;
  border-radius: 50%;
}

.seat__clicked {
  background: yellow;
}

.seat__accessibility {
  border: 2px solid blue;
  box-sizing: border-box;
}

.leaflet-sidebar {
  width: 230px;
}

#sidebar_create .leaflet-sidebar {}

.leaflet-sidebar.right.visible~.leaflet-right {
  right: 0;
}

#delete_markers {
  position: absolute;
  bottom: 5px;
  left: 5px;
}

#save_markers {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.leaflet-sidebar>.leaflet-control {
  padding: 5px;
}

.leaflet-sidebar p {
  font-size: 14px;
  font-weight: bold;
}
</style>
