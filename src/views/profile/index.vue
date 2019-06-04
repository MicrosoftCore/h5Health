<template>
  <div class="profile">
    <UserInfo/>
    <group>
      <cell-box is-link link="/record">
        <span class="iconfont pinggu"></span>
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
import { CellBox, Group } from 'vux'
import UserInfo from '@/components/basic/UserInfo'

export default {
  components: {
    CellBox,
    Group,
    UserInfo
  }
}
</script>

<style lang="less" scoped>
.profile {
  .iconfont,
  .title {
    color: #333333;
  }
  .title {
    margin-left: 15px;
    font-size: 15px;
  }
  .pinggu {
    color: #3c8dd9;
  }
  .wenti {
    color: #ff8000;
  }
  .guanyu {
    color: #6abd0b;
  }
}
</style>
