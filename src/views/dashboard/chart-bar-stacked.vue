<template>
<div class="col-lg-8 col-12 col-xl-8">
  <div class="card">
    <div class="card-header d-flex ">
      <h3 class="card-title pr-3">{{title}}</h3>
      <div class="form-group">
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
    filterAll() {
      this.chart.load({
        columns: [
          this.originalValues.web,
          this.originalValues.ticketoffice
        ]
      });
    },
    filterWeb() {
      this.chart.load({
        columns: [
          this.originalValues.web
        ]
      });
      this.chart.load({
        unload: ['ticketoffice'],
      });
    },
    filterTicketoffice() {
   this.chart.load({
        columns: [
          this.originalValues.ticketoffice
        ]
      });
      this.chart.load({
        unload: ['web'],
      });
    },
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
    // console.log(this.data.web)
    // console.log(this.data.ticketoffice)
  
    // MOBILE
    if ($(window).width()	< 700) {
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
        width: 6
      },
      legend: {
        show: true, //hide legend
      },
      padding: {
        bottom: 20,
        top: 0,
        right: 0,
        left: 24
      },
    });

    } else {
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
        width: 10
      },
      legend: {
        show: true, //hide legend
      },
      padding: {
        bottom: 0,
        top: 0,
      },
    });

    }
    this.chart;
    this.chart.resize({bar: 20})
    

    this.originalValues = this.data;

  }
};
</script>
