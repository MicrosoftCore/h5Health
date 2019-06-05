<template>
  <div class="userInfo flex-align__center">
    <img class="userInfo__avatar vux-1px" :src="userinfo.headimgurl" alt>
    <div class="userInfo__label">
      <div class="name">{{ userinfo.nickname }}</div>
      <div class="phone">位置: {{ userinfo.province }}省{{ userinfo.city }}市</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('account', ['userinfo'])
  }
}
</script>

<style lang="less" scoped>
.userInfo {
  padding: 15px;
  background-color: #ffffff;
  .userInfo__avatar {
    width: 60px;
    height: 60px;
    margin-right: 20px;
    border-color: #f8f8ff;
  }
  .userInfo__label {
    line-height: 25px;
    .phone {
      font-size: 14px;
      color: #999999;
    }
  }
}
</style>
