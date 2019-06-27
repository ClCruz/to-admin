<template>
<div class="col-12 col-sm-4 col-lg-2" :class="{'col-lg-3 col-sm-6 col-6': size == 'large'}">
  <div class="card">
    <div class="card-body p-3 text-center">
      <div class="text-right" :class="{'text-green': status == 'increase', 'text-red': status == 'decrease'}">

        {{percentage !== '' ? percentage : '&nbsp;'}}

        <i class="fe fe-chevron-up" v-show="status == 'increase'"></i>
        <i class="fe fe-chevron-down" v-show="status == 'decrease'"></i>
      </div>
      <div class="h1 m-0">{{value}}</div>
      <div class="text-muted mb-4 mt-2">{{title}}</div>
    </div>
  </div>
</div>
</template>

<script>
// import config from '@/config';

export default {
  name: "CardInfo",

  methods: {

  },
  props: ['title', 'value', 'percentage', 'status', 'size'],
};
</script>
