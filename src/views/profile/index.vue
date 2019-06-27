<template>
  <div class="profile">
    <UserInfo/>
    <group>
      <cell>
        <span class="iconfont bianhao" slot="icon"></span>
        <span class="title" slot="title">用户编号</span>
        <span>{{ userinfo.idwechat }}</span>
      </cell>
      <cell-box is-link link="/record">
        <span class="iconfont jilu"></span>
        <span class="title">答题记录</span>
      </cell-box>
    </group>
    <!-- <group>
      <cell-box is-link>
        <span class="iconfont wenti"></span>
        <span class="title">常见问题</span>
      </cell-box>
      <cell-box is-link>
        <span class="iconfont guanyu"></span>
        <span class="title">关于</span>
      </cell-box>
    </group>-->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Cell, CellBox, Group } from 'vux'
import UserInfo from '@/components/basic/UserInfo'

export default {
  components: {
    Cell,
    CellBox,
    Group,
    UserInfo
  },
  computed: {
    ...mapState('account', ['userinfo'])
  }
}
</script>

<style lang="less" scoped>
.profile {
  .iconfont {
    font-size: 19px;
  }
  .title {
    margin-left: 15px;
    font-size: 15px;
    color: #333333;
  }
  .jilu {
    color: #6abd0b;
  }
  .wenti {
    color: #ff8000;
  }
  .guanyu {
    color: #6abd0b;
  }
  .bianhao {
    color: #4e8cee;
  }
}
/deep/ .weui-cell {
  &::before {
    left: 50px;
  }
  .weui-cell__ft {
    font-size: 16px;
  }
}
</style>
