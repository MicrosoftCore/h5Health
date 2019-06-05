<template>
  <div class="home">
    <UserInfo/>
    <div v-for="(json, jsonIndex) in questionsJson" :key="jsonIndex">
      <div v-for="(card, cardIndex) in json.pages" :key="cardIndex">
        <div
          class="home-card"
          v-if="card.title && visible[jsonIndex] && visible[jsonIndex].includes(card.title[json.locale]) || visible[jsonIndex] && cardIndex == 0 || jsonIndex == 0 && cardIndex == 0"
          @click="onClick(jsonIndex, card.name)"
        >
          <div class="home-card__top">
            <div class="title">{{ json.title }} - {{ card.title[json.locale] }}</div>
            <div>
              <span class="status">
                <!-- <span class="status1">
                  <span class="iconfont wenjuan"></span>
                  <span>未答题</span>
                </span>
                <span class="status2">
                  <span class="iconfont zhuangtai"></span>
                  <span>进行中</span>
                </span>-->
                <span class="status3">
                  <span class="iconfont chenggong"></span>
                  <span>已答完</span>
                </span>
              </span>
              <!-- <span class="mark">健康度: 100分</span> -->
              <!-- <span class="mark">完成度: {{ 100 }}%</span> -->
            </div>
          </div>
          <!-- <div class="home-card__bottom">
            <div class="flex-justify__between">
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
                <span class="label">评估</span>
              </div>
              <div>
                <span class="iconfont gengduo"></span>
                <span class="label">更多</span>
              </div>
            </div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UserInfo from '@/components/basic/UserInfo'
export default {
  components: {
    UserInfo
  },
  computed: {
    ...mapState('account', {
      userinfo: state => state.userinfo
    }),
    ...mapState('question', {
      questions: state => state.questions,
      visible: state => state.visible
    }),
    questionsJson() {
      try {
        return this.questions.map(item => ({
          ...JSON.parse(item.jsonstr),
          title: item.title
        }))
      } catch (error) {
        return []
      }
    }
  },
  methods: {
    ...mapActions('question', ['get', 'post']),
    onClick(jsonIndex, name) {
      this.post({
        idwechat: this.userinfo.idwechat,
        gender: '男',
        qtnaireversion: this.questions[0].qtnaireversion
      })
      this.$router.push({
        name: 'survey',
        params: {
          jsonIndex,
          name
        }
      })
    }
  },
  async created() {
    if (!this.questions.length) await this.get()
  }
}
</script>

<style lang="less" scoped>
.home {
  .home-card {
    margin: 10px;
    margin-bottom: 10px;
    border-radius: 3px;
    // border-top-left-radius: 3px;
    // border-top-right-radius: 3px;
    background-color: #ffffff;
    .home-card__top {
      padding: 20px;
      border-color: #f0f0f0;
      font-size: 14px;
      .title {
        margin-bottom: 10px;
        font-size: 16px;
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
      font-size: 14px;
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
