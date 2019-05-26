<template>
  <div class="full-height">
    <view-box>
      <sticky>
        <x-header title="我的问卷"/>
      </sticky>
      <router-view/>
      <tabbar>
        <tabbar-item selected>
          <span slot="icon" class="iconfont tabbar-wenjuan"></span>
          <span slot="icon-active" class="iconfont tabbar-wenjuan"></span>
          <span slot="label">问卷</span>
        </tabbar-item>
        <tabbar-item show-dot>
          <span slot="icon" class="iconfont tabbar-pinggu"></span>
          <span slot="icon-active" class="iconfont tabbar-pinggu"></span>
          <span slot="label">评估</span>
        </tabbar-item>
        <tabbar-item badge="2">
          <span slot="icon" class="iconfont tabbar-wo"></span>
          <span slot="icon-active" class="iconfont tabbar-wo"></span>
          <span slot="label">我</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
import { XHeader, Sticky, Tabbar, TabbarItem, ViewBox } from 'vux'
export default {
  components: {
    XHeader,
    Sticky,
    Tabbar,
    TabbarItem,
    ViewBox
  }
}
</script>

<style lang="less" scoped>
.full-height {
  .iconfont {
    font-size: 18px;
    color: #999999;
  }
}
</style>
