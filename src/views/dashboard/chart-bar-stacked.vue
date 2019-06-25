<template>
<div class="col-lg-8 col-12 col-xl-8">
  <div class="card">
    <div class="card-header d-flex ">
      <h3 class="card-title">{{title}}</h3>
     <div class="form-group">
                        <div class="selectgroup selectgroup-pills">
                          <label class="selectgroup-item">
                            <input type="radio" name="icon-input" value="1" class="selectgroup-input" checked="">
                            <span class="selectgroup-button selectgroup-button-icon">Todos</span>
                          </label>
                          <label class="selectgroup-item">
                            <input type="radio" name="icon-input" value="2" class="selectgroup-input">
                            <span class="selectgroup-button selectgroup-button-icon"><i class="fab fa-chrome"></i> Web </span>
                          </label>
                          <label class="selectgroup-item">
                            <input type="radio" name="icon-input" value="3" class="selectgroup-input">
                            <span class="selectgroup-button selectgroup-button-icon"><i class="fas fa-ticket-alt"></i> Bilheteria</span>
                          </label>
                        </div>
                      </div>
    </div>
    <div class="card-body">
      <div id="chart-bar-stacked" style=""></div>
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
  name: "ChartBarStacked",
  computed: {},
  methods: {
    removeTicketoffice() {
      this.chart.load({
        // columns: [
        //   ['web', 130, 120, 150, 140, 160, 150],
        //   ['ticketoffice', 30, 20, 50, 40, 60, 50],
        // ],
        // unload: ['web']
      });
    }
  },
  props: {
    data: Object,
    title: String
  },
  data() {
    return {
      chart: null,
      originalValues: null,
    }

  },

  // [["Disponivel",177],["Vendido",36],["Gratuito",0],["Aguardando pagamento",18],["Reservado",36]]

  mounted() {
    console.log(this.data.web)
    console.log(this.data.ticketoffice)
    this.chart = c3.generate({
      bindto: '#chart-bar-stacked', // id of chart wrapper
      data: {
        columns: [
          // each columns data
          // ['web', 16, 8, 15, 11, 8, 15, 11, 8, 15, 11, 8, 15, 11, 8, 15, 11, 8, 15, 11, 8, 15, 11, 8, 15],
          // ['ticketoffice', 16, 7, 5, 7, 11, 8, 15, 11, 8, 15, 11, 8, 15, 11, 8, 15, 11, 8, 15, 11, 8, 15, 11, 8, 15]
          this.data.web,
          this.data.ticketoffice
        ],
        type: 'bar', // default type of chart
        groups: [
          ['web', 'ticketoffice']
        ],
        names: {
          // name of each serie
          'web': 'Internet',
          'ticketoffice': 'Bilheteria'
        },
        colors: {
          'web': '#467fcf',
          'ticketoffice': '#fd9644'
        }
      },
      axis: {
        x: {
          type: 'category',
          // name of each category
          categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
        },
      },
      bar: {
        width: 16
      },
      legend: {
        show: true, //hide legend
      },
      padding: {
        bottom: 0,
        top: 0
      },
    });

    this.chart;
    this.originalValues = this.data;

    let ctx = this;

    setTimeout(function () {
      ctx.removeTicketoffice();
    }, 2000);

  }
};
</script>
