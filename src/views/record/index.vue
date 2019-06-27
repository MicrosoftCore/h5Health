<template>
  <div class="flex-column">
    <x-header :title="$route.meta.title"/>
    <div class="record flex-column__stretch">
      <div v-if="records.length">
        <div class="record-tips">
          <div>如果您打算进一步联系区域联系人参加免费检测, 使得评估结果更加可靠并且能提示可能的疾病种类, 请选择一份问卷结果作为代表结果进行申请。</div>
          <div>提示:&nbsp;&nbsp;如果您多次申请, 填写个人信息, 将以最后一次提交的个人信息为准。</div>
        </div>
        <timeline>
          <timeline-item v-for="(item, index) in records" :key="index">
            <div class="record-card flex-align__center blue" @click="onClick(item.idqtnaire)">
              <div class="left flex-center">
                <span class="iconfont yundong"></span>
              </div>
              <div class="right">
                <div class="top flex-align__center">
                  <span class="span1">问卷版本号 {{ item.qtnaireversion }}</span>
                </div>
                <div class="bottom">答题时间: {{ item.fillingTime }}</div>
              </div>
            </div>
          </timeline-item>
        </timeline>
      </div>
      <div class="record-empty flex-justify__center" v-if="!records.length && requested">
        <div class="wrapper">
          <span class="iconfont wujilu"></span>
          <div class="label1">没有任何答题记录</div>
          <div class="label2">先去填写问卷吧~</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Timeline, TimelineItem, XHeader } from 'vux'
import service from '@/common/service'

export default {
  components: {
    Timeline,
    TimelineItem,
    XHeader
  },
  data() {
    return {
      records: [],
      requested: false
    }
  },
  computed: {
    ...mapState('account', {
      userinfo: state => state.userinfo
    })
  },
  methods: {
    onClick(idqtnaire) {
      this.$router.push({
        name: 'assess',
        query: {
          idqtnaire
        }
      })
    }
  },
  async created() {
    this.records = await service['cdcqtnaire.queryRecords']({
      params: {
        idwechat: this.userinfo.idwechat
      }
    })
    this.requested = true
  }
}
</script>

<style lang="less" scoped>
.record {
  background-color: #eeeff1;
  .record-tips {
    line-height: 24px;
    margin: 20px 15px 0;
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #e5e6ea;
    text-align: justify;
    font-size: 14px;
    color: #6e7b8e;
  }
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
      letter-spacing: 1px;
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
  .record-empty {
    height: 100%;
    padding-top: 40%;
    .wrapper {
      text-align: center;
      .iconfont {
        font-size: 65px;
        color: #95a0a4;
      }
      .label1,
      .label2 {
        font-size: 15px;
        color: #95a0a4;
      }
      .label1 {
        margin-top: 15px;
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
