<template>
  <div>
    <checker
      v-model="vmodel"
      :type="type"
      default-item-class="default-item"
      selected-item-class="selected-item vux-1px"
    >
      <checker-item value="1">
        <span class="iconfont radio" v-if="type === 'radio'"></span>
        <span class="iconfont checkbox" v-if="type === 'checkbox'"></span>
        <span class="value">意大利</span>
      </checker-item>
      <checker-item value="2">
        <span class="iconfont radio" v-if="type === 'radio'"></span>
        <span class="iconfont checkbox" v-if="type === 'checkbox'"></span>
        <span class="value">意大利</span>
      </checker-item>
    </checker>
  </div>
</template>

<script>
import { Checker, CheckerItem } from 'vux'
export default {
  components: {
    Checker,
    CheckerItem
  },

  props: {
    type: {
      type: String,
      default: 'radio'
    }
  },

  data() {
    return {
      vmodel: ''
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/variable.less';
.vux-checker-box {
  .default-item {
    display: block;
    margin-top: 10px;
    padding: 10px;
    .iconfont {
      margin-right: 10px;
      font-size: 15px;
      &.radio::before {
        content: '\e61d';
      }
      &.checkbox::before {
        content: '\e614';
      }
    }
  }

  .selected-item {
    &::before {
      border-color: @header-background-color;
    }
    .iconfont {
      color: @header-background-color;
      &.radio::before {
        content: '\e632';
      }
      &.checkbox::before {
        content: '\e613';
      }
    }
  }
}
</style>
