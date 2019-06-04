<template>
  <div class="risk flex-column">
    <x-header title="评估详情"/>
    <div class="flex-column__stretch">
      <div class="risk-card flex-align__center orange">
        <div class="left flex-center">
          <span class="iconfont jiankang2"></span>
        </div>
        <div class="right">
          <div class="top flex-align__center">
            <span class="span2">昨天</span>
            <span class="span1">1726</span>
            <span class="span2">步</span>
          </div>
          <div class="bottom">您预约了11月27日 09:00-10:00 的挂号服务</div>
        </div>
      </div>
      <div class="risk-card flex-align__center green">
        <div class="left flex-center">
          <span class="iconfont jiankang1"></span>
        </div>
        <div class="right">
          <div class="top flex-align__center">
            <span class="span1">09:00</span>
            <span class="span2">就诊提醒</span>
          </div>
          <div class="bottom">您预约了11月27日 09:00-10:00 的挂号服务</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import service from '@/common/service'
export default {
  components: {
    XHeader
  },
  data() {
    return {}
  },
  async created() {
    // let result2 = await service['description.queryinfos']({
    //   params: {
    //     idqtnaire: this.$route.params.idqtnaire
    //   }
    // })
    // console.log(result2)
  }
}
</script>

<style lang="less" scoped>
.risk {
  .flex-column__stretch {
    background-color: #ffffff;
    .risk-card {
      display: flex;
      margin: 20px;
      padding: 17px 10px;
      border-radius: 8px;
      color: #ffffff;
      .left {
        width: 50px;
        margin-right: 10px;
        font-size: 35px;
        .jiankang2 {
          font-size: 25px;
        }
      }
      .right {
        flex: 1;
        .top {
          .span1 {
            margin-right: 10px;
            font-size: 25px;
          }
          .span2 {
            margin-right: 10px;
            font-size: 14px;
          }
        }
        .bottom {
          margin-top: 3px;
          font-size: 12px;
        }
      }
    }
    .green {
      background: -webkit-linear-gradient(left, #4eb18d, #75be43);
      background: -o-linear-gradient(right, #4eb18d, #75be43);
      background: -moz-linear-gradient(right, #4eb18d, #75be43);
      background: linear-gradient(to right, #4eb18d, #75be43);
    }
    .orange {
      background: -webkit-linear-gradient(left, #f79238, #eb535f);
      background: -o-linear-gradient(right, #f79238, #eb535f);
      background: -moz-linear-gradient(right, #f79238, #eb535f);
      background: linear-gradient(to right, #f79238, #eb535f);
    }
  }
}
</style>
