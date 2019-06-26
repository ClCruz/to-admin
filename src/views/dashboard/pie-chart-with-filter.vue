<template>
<div class="col-lg-5 col-12 col-xl-5">
  <div class="card">
    <div class="card-header">
      <h3 class="card-title pr-3">{{title}}</h3>
      <div class="form-group" v-if="hasFilter">
        <div class="selectgroup selectgroup-pills">
          <label class="selectgroup-item">
            <input type="radio" name="icon-input" value="1" class="selectgroup-input" checked="true" @click="filterAll()">
              <span class="selectgroup-button selectgroup-button-icon">Todos</span>
            </label>
          <label class="selectgroup-item">
            <input type="radio" name="icon-input" value="2" class="selectgroup-input" @click="filterWeb()">
              <span class="selectgroup-button selectgroup-button-icon"><i class="fab fa-chrome"></i> Web </span>
            </label>
          <label class="selectgroup-item">
            <input type="radio" name="icon-input" value="3" class="selectgroup-input" @click="filterTicketoffice()">
              <span class="selectgroup-button selectgroup-button-icon"><i class="fas fa-ticket-alt"></i> Bilheteria</span>
            </label>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div :id="'chart-donut_'+key" class="c3"></div>
    </div>
  </div>
</div>
</template>

<script>
// import config from '@/config';
import c3 from "c3";
import {
  format
} from "d3";
import $ from 'jquery';

export default {
  name: "pieChartWithFilter",
  computed: {
    key() {
      return this.$vnode.key;
    }

  },
  data() {
    return {
      chart: null,
      originalValues: null,
    }

  },
  props: ['data', 'title', 'hasFilter'],
  // [["Disponivel",177],["Vendido",36],["Gratuito",0],["Aguardando pagamento",18],["Reservado",36]]
  methods: {
    filterAll() {
      this.chart.unload();
      this.chart.load({
        columns: this.data.all

      });
    },
    filterWeb() {
      this.chart.unload();
      this.chart.load({
        columns: this.data.web
      });
    },
    filterTicketoffice() {
      this.chart.unload();
      this.chart.load({
        columns: this.data.ticketoffice
      });
    },
  },
  mounted() {
    this.chart = c3.generate({
      bindto: '#chart-donut_' + this.key, // id of chart wrapper
      data: {
        columns: this.data.all,
        type: 'pie', // default type of chart
      },
      color: {
        pattern: ['rgb(73,129,204)', 'rgb(244,111,155)', 'rgb(251,150,77)', 'rgb(55,202,186)', 'rgb(126,208,66)']
      },
      pie: {
        label: {
          format: function (value, ratio, id) {
            return format('')(value);
          }
        }
      },

    });

    this.chart;
  }
};
</script>
