<template>
<li class="nav-item" :code="code" v-if="child == null">
  <a :href="link" class="nav-link">
    <i :class="icon"></i>{{title}}
    <template v-if="child != null">
      
    </template>
  </a>
</li>
<li class="nav-item dropdown" :code="code" v-else>
  <a href="javascript:void(0)" class="nav-link" data-toggle="dropdown" aria-expanded="false"><i :class="icon"></i>{{title}}</a>
  <div class="dropdown-menu dropdown-menu-arrow" x-placement="bottom-start" style="position: absolute; transform: translate3d(12px, 55px, 0px); top: 0px; left: 0px; will-change: transform;">
    <a v-for="(item, index) in child" :key="index" :href="item.href" class="dropdown-item">
      {{item.title}}
        <a v-for="(item, index) in item.child" :key="index" :href="item.href" class="dropdown-item">
          {{item.title}}
        </a>
    </a>
  </div>
</li>
</template>

<script>
import config from '@/config';

export default {
  name: "LinkMenu",
  computed: {
    
  },
  props: {
    code: String,
    icon: String,
    title: String,
    link: String,
    child: Array
  },
  methods: {

  }
};
</script>
