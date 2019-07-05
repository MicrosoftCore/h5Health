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
                <span v-if="onValidate(card, jsonIndex)">
                  <span class="status4">
                    <span class="iconfont cuowu"></span>
                    <span>答题有误, 请检查</span>
                  </span>
                </span>
                <span v-else>
                  <span v-if="onProgress(card, jsonIndex) === 0">
                    <span class="status1">
                      <span class="iconfont wenjuan"></span>
                      <span>未答题</span>
                    </span>
                  </span>
                  <span v-if="onProgress(card, jsonIndex) > 0 && onProgress(card, jsonIndex) < 100">
                    <span class="status2">
                      <span class="iconfont zhuangtai"></span>
                      <span>进行中</span>
                    </span>
                  </span>
                  <span v-if="onProgress(card, jsonIndex) === 100">
                    <span class="status3">
                      <span class="iconfont chenggong"></span>
                      <span>已答完</span>
                    </span>
                  </span>
                </span>
              </span>
              <!-- <span class="mark">健康度: 100分</span> -->
              <span
                class="mark"
                v-if="onProgress(card, jsonIndex) !== 100"
              >完成度: {{ onProgress(card, jsonIndex) }}%</span>
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
    <box gap="10px 10px">
      <x-button type="primary" v-if="showAssess" @click.native="onReset">重新答题</x-button>
    </box>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Box, XButton } from 'vux'
import UserInfo from '@/components/basic/UserInfo'

export default {
  components: {
    Box,
    XButton,
    UserInfo
  },
  computed: {
    ...mapState('account', ['userinfo']),
    ...mapState('answer', ['progress', 'validate']),
    ...mapState('question', ['questions', 'showAssess', 'visible']),
    questionsJson() {
      try {
        return this.questions.map(item => ({
          ...JSON.parse(item.jsonstr),
          title: item.title
        }))
      } catch (error) {
        return []
      }
    },
    validateJson() {
      return Object.values(this.validate)
    }
  },
  methods: {
    ...mapActions('action', ['reset']),
    ...mapActions('question', ['get', 'post']),
    onClick(jsonIndex, name) {
      const sexMap = {
        1: '男',
        2: '女',
        0: '未知'
      }
      this.post({
        idwechat: this.userinfo.idwechat,
        gender: sexMap[this.userinfo.sex] || '女',
        qtnaireversion: this.questions[0].qtnaireversion
      })
      this.$router.push({
        name: 'survey',
        params: {
          jsonIndex,
          name
        }
      })
    },
    onReset() {
      this.$vux.confirm.show({
        title: '提示',
        content: '确定要重新答题吗?',
        onConfirm: this.reset
      })
    },
    onProgress(card, jsonIndex) {
      try {
        return this.progress[jsonIndex][card.name] || 0
      } catch (error) {
        return 0
      }
    },
    onValidate(card, jsonIndex) {
      return (
        this.validateJson.filter(item => {
          return (
            item.jsonIndex == jsonIndex &&
            item.name == card.name &&
            item.isCurrentPageHasErrors
          )
        }).length > 0
      )
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
        .status4 {
          color: #e65c65;
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
