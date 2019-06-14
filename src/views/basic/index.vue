<template>
  <div class="flex-column">
    <x-header v-bind="headerOptions" @on-click-more="showAction = true"/>
    <div class="flex-column__stretch">
      <router-view/>
    </div>
    <tabbar>
      <tabbar-item link="/home" :selected="$route.path == '/home'">
        <span slot="icon" class="iconfont tabbar-wenjuan"></span>
        <span slot="icon-active" class="iconfont tabbar-wenjuan"></span>
        <span slot="label">问卷</span>
      </tabbar-item>
      <tabbar-item
        link="/assess"
        :selected="$route.path == '/assess'"
        :show-dot="showAssessDot"
        @on-item-click="set_assess_dot(false)"
      >
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
    <confirm v-model="showConfirm" title="提示" @on-confirm="reset">
      <p style="text-align: center;">确认重新填写吗?</p>
    </confirm>
    <div v-transfer-dom>
      <actionsheet
        v-model="showAction"
        v-bind="sheetOptions"
        @on-click-menu-reset="showConfirm = true"
        @on-click-menu-clear="clear"
      ></actionsheet>
    </div>
  </div>
</template>

<script>
import {
  Actionsheet,
  Confirm,
  Tabbar,
  TabbarItem,
  TransferDom,
  XHeader
} from 'vux'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  components: {
    Actionsheet,
    Confirm,
    Tabbar,
    TabbarItem,
    XHeader
  },
  data() {
    return {
      sheetOptions: {
        showCancel: true,
        menus: [
          {
            label:
              '重新答题<br/><span style="color: #666; font-size: 12px;">本次答题不满意，再答一次更准确</span>',
            value: 'reset'
          },
          {
            label: '清除全部缓存',
            value: 'clear'
          }
        ]
      },
      showAction: false,
      showConfirm: false
    }
  },
  computed: {
    ...mapState('question', ['showAssessDot']),
    headerOptions() {
      return {
        title: this.$route.meta.title,
        rightOptions: {
          showMore: true
        }
      }
    }
  },
  methods: {
    ...mapActions('action', ['reset', 'clear']),
    ...mapMutations('question', ['set_assess_dot'])
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
