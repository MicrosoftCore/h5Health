<template>
  <div class="flex-column">
    <x-header :title="$route.meta.title"/>
    <div class="record flex-column__stretch">
      <timeline v-if="records.length">
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
      <div class="record-empty flex-center" v-if="!records.length && requested">
        <div class="wrapper">
          <span class="iconfont baogao"></span>
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
    .wrapper {
      text-align: center;
      .iconfont {
        font-size: 80px;
        color: #eaeaea;
      }
      .label1,
      .label2 {
        font-size: 15px;
        color: #848484;
      }
      .label1 {
        margin-top: 10px;
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
