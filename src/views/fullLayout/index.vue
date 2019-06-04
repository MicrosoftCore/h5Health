<template>
  <div class="flex-column">
    <x-header v-bind="options"/>
    <div class="flex-column__stretch">
      <router-view/>
    </div>
    <tabbar>
      <tabbar-item badge="4" link="/home" :selected="$route.path == '/home'">
        <span slot="icon" class="iconfont tabbar-wenjuan"></span>
        <span slot="icon-active" class="iconfont tabbar-wenjuan"></span>
        <span slot="label">问卷</span>
      </tabbar-item>
      <tabbar-item show-dot link="/assess" :selected="$route.path == '/assess'">
        <span slot="icon" class="iconfont tabbar-pinggu"></span>
        <span slot="icon-active" class="iconfont tabbar-pinggu"></span>
        <span slot="label">评估</span>
      </tabbar-item>
      <tabbar-item link="/profile" :selected="$route.path == '/profile'">
        <span slot="icon" class="iconfont tabbar-wo"></span>
        <span slot="icon-active" class="iconfont tabbar-wo"></span>
        <span slot="label">我</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { XHeader, Tabbar, TabbarItem } from 'vux'
export default {
  components: {
    XHeader,
    Tabbar,
    TabbarItem
  },
  computed: {
    options() {
      return {
        title: this.$route.meta.title,
        rightOptions: {
          showMore: true
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.flex-column {
  .iconfont {
    font-size: 18px;
    color: #999999;
  }
}
</style>
