<template>
  <div class="vux-1px">
    <x-input placeholder="请输入内容"></x-input>
  </div>
</template>

<script>
import { XInput } from 'vux'
export default {
  components: {
    XInput
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/variable.less';
.vux-1px {
  &::before {
    border-color: @header-background-color;
  }
  .weui-cell {
    padding: 8px 15px !important;
  }
}
</style>
