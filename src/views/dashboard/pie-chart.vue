<template>
<div class="col-lg-5 col-xl-4">
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">{{title}}</h3>
    </div>
    <div class="card-body">
      <div id="chart-donut" class="c3"></div>
    </div>
  </div>
</div>
</template>

<script>
// import config from '@/config';
import c3 from "c3";
import {format} from "d3";
import $ from 'jquery';

export default {
  name: "CardInfo",
  computed: {},
  methods: {

  },
  props: {
    data: Array,
    title: String
  },

// [["Disponivel",177],["Vendido",36],["Gratuito",0],["Aguardando pagamento",18],["Reservado",36]]

  mounted() {
    c3.generate({
      bindto: '#chart-donut', // id of chart wrapper
      data: {
        columns: this.data,
        type: 'pie', // default type of chart
      },
      pie: {
        label: {
            format: function (value, ratio, id) {
                return format('')(value);
            }
        }
    }
    });
  }
};
</script>
