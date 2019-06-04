<template>
  <div class="userInfo flex-align__center">
    <img class="userInfo__avatar vux-1px" src="./F0E.jpg" alt>
    <div class="userInfo__label">
      <div class="name">欧阳娜娜</div>
      <div class="phone">手机号: 18124008700</div>
    </div>
  </div>
</template>

<script>
export default {}
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
