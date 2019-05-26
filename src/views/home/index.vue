<template>
  <div class="home">
    <div class="home-header flex-ac">
      <img class="home-header__avatar vux-1px" src="./F0E.jpg" alt>
      <div class="home-header__label">
        <div class="name">诸葛亮</div>
        <div class="phone">手机号: 18124008700</div>
      </div>
    </div>
    <div
      class="home-card"
      :class="{ 'opacity': item.status == -1 }"
      :key="index"
      v-for="(item, index) in lists"
    >
      <div class="home-card__top vux-1px-b">
        <div class="title">{{ item.title }}</div>
        <div>
          <span class="status">
            <span class="status1" v-if="item.status == -1">
              <span class="iconfont wenjuan"></span>
              <span>未答题</span>
            </span>
            <span class="status2" v-if="item.status == 0">
              <span class="iconfont zhuangtai"></span>
              <span>进行中</span>
            </span>
            <span class="status3" v-if="item.status == 1">
              <span class="iconfont chenggong"></span>
              <span>已答完</span>
            </span>
          </span>
          <span class="mark" v-if="item.status == 1">健康度: {{ item.mark }}分</span>
          <span class="mark" v-else>完成度: {{ item.mark }}%</span>
        </div>
      </div>
      <div class="home-card__bottom">
        <div class="flex-js">
          <div>
            <span class="iconfont bianji"></span>
            <span class="label">编辑</span>
          </div>
          <div>
            <span class="iconfont fenxiang"></span>
            <span class="label">分享</span>
          </div>
          <div>
            <span class="iconfont shuju"></span>
            <span class="label">数据</span>
          </div>
          <div>
            <span class="iconfont gengduo"></span>
            <span class="label">更多</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /**
       * 1 - 已答题
       * 0 - 进行中
       * -1 - 未答题
       */
      lists: [
        {
          title: '基本信息',
          status: 1,
          mark: 88
        },
        {
          title: '疾病史、家族史、和用药史',
          status: 0,
          mark: 33
        },
        {
          title: '生育史',
          status: -1,
          mark: 0
        }
      ]
    }
  },
  created() {
    this.$axios.get('/api/cdcquestionjson/list').then(resp => {
      console.log(resp)
      // this.lists = resp
    })
  }
}
</script>

<style lang="less" scoped>
.home {
  .home-header {
    padding: 15px;
    margin-bottom: 10px;
    background-color: #ffffff;
    .home-header__avatar {
      width: 70px;
      height: 70px;
      margin-right: 20px;
      border-color: #f8f8ff;
    }
    .home-header__label {
      line-height: 25px;
      .name {
        font-size: 18px;
        font-weight: bold;
      }
      .phone {
        color: #999999;
      }
    }
  }

  .home-card {
    margin: 10px;
    margin-bottom: 10px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    background-color: #ffffff;
    .home-card__top {
      padding: 20px;
      border-color: #f0f0f0;
      .title {
        margin-bottom: 10px;
        font-size: 18px;
      }
      .status {
        margin-right: 10px;
        .status1 {
          color: #ffbe00;
        }
        .status2 {
          color: #10aeff;
        }
        .status3 {
          color: #09bb07;
        }
      }
      .mark {
        color: #999999;
      }
    }
    .home-card__bottom {
      padding: 10px 20px;
      background-color: #fafafa;
      .iconfont {
        font-size: 14px;
        color: #35495e;
      }
      .label {
        color: #999999;
      }
    }
  }
}
</style>
