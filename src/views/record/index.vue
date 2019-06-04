<template>
  <div class="record">
    <timeline>
      <timeline-item v-for="(item, index) in 6" :key="index">
        <div class="record-card flex-align__center blue">
          <div class="left flex-center">
            <span class="iconfont yundong"></span>
          </div>
          <div class="right">
            <div class="top flex-align__center">
              <span class="span1">在线问诊</span>
            </div>
            <div class="bottom">答题时间: 11月27日 09:00-10:00</div>
          </div>
        </div>
      </timeline-item>
    </timeline>
  </div>
</template>

<script>
import { Timeline, TimelineItem } from 'vux'
import service from '@/common/service'
export default {
  components: {
    Timeline,
    TimelineItem
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
.record {
  height: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #ffffff;
  .record-card {
    display: flex;
    margin: 0 20px;
    padding: 17px 10px;
    border-radius: 8px;
    color: #ffffff;
    .left {
      width: 50px;
      margin-right: 10px;
      font-size: 30px;
      .jiankang2 {
        font-size: 25px;
      }
    }
    .right {
      flex: 1;
      .top {
        .span1 {
          margin-right: 10px;
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
  .blue {
    background: -webkit-linear-gradient(left, #359fdd, #3670dc);
    background: -o-linear-gradient(right, #359fdd, #3670dc);
    background: -moz-linear-gradient(right, #359fdd, #3670dc);
    background: linear-gradient(to right, #359fdd, #3670dc);
  }
  /deep/.vux-timeline {
    ul {
      padding: 0;
    }
  }
}
</style>
