<template>
<div class="col-lg-4 col-12 col-xl-4">
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">{{title}}</h3>
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
  name: "PieChart",
  computed: {
    key() {
      return this.$vnode.key;
    }

  },
    props: ['data', 'title'],

  // [["Disponivel",177],["Vendido",36],["Gratuito",0],["Aguardando pagamento",18],["Reservado",36]]
  methods: {
    filterAll() {
      this.chart.load({
        columns: [
          
        ]
      });
    },
    filterWeb() {
      this.chart.load({
        columns: [
        ]
      });
      this.chart.load({
        unload: [''],
      });
    },
    filterTicketoffice() {
      this.chart.load({
        columns: [
        ]
      });
      this.chart.load({
        unload: [''],
      });
    },
  },
  mounted() {
    c3.generate({
      bindto: '#chart-donut_' + this.key, // id of chart wrapper
      data: {
        columns: this.data,
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
  }
};
</script>
