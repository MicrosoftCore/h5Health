<template>
  <div class="flex-column">
    <x-header :title="title"/>
    <div class="flex-column__stretch">
      <survey :survey="survey" v-if="questions.length"></survey>
    </div>
    <toast v-model="show1" v-bind="toastOptions">
      <spinner type="lines"></spinner>
      <span>正在生成评估 {{ text1 }}</span>
    </toast>
  </div>
</template>

<script>
import { XHeader, Toast, Spinner } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'
import { Model, StylesManager, Survey } from 'survey'
StylesManager.applyTheme('darkblue')

let timerId = 0
let polling = 60000

export default {
  components: {
    Survey,
    XHeader,
    Toast,
    Spinner
  },
  data() {
    return {
      show1: false,
      text1: '',
      survey: new Model(),
      toastOptions: {
        type: 'text',
        width: '13em',
        position: 'middle',
        isShowMask: true
      }
    }
  },
  computed: {
    ...mapState('question', {
      questions: state => state.questions
    }),
    jsonIndex() {
      return this.$route.params.jsonIndex
    },
    pageIndex() {
      return this.$route.params.name.replace('page', '')
    },
    question() {
      return this.questions[this.jsonIndex]
    },
    questionjson() {
      try {
        return JSON.parse(this.question.jsonstr)
      } catch (error) {
        return new Model()
      }
    },
    title() {
      try {
        return this.survey.currentPage.title
      } catch (error) {
        return ''
      }
    }
  },
  methods: {
    ...mapActions('answer', ['get_state', 'set_state', 'save_server']),
    ...mapActions('question', ['get', 'put']),
    ...mapMutations('answer', ['set_model', 'set_progress']),
    ...mapMutations('question', ['set_visible']),
    killTimer() {
      clearInterval(timerId)
    }
  },
  async created() {
    if (!this.questions.length) await this.get()
    this.survey = new Model(
      Object.assign(this.questionjson, {
        clearInvisibleValues: 'none',
        sendResultOnPageNext: true,
        showProgressBar: 'top'
      })
    )

    this.set_model(this.survey)

    this.survey.onValueChanged.add((sender, options) => {
      let name = options.question.page.name
      this.set_state(this.jsonIndex)
      this.set_progress({
        jsonIndex: this.jsonIndex,
        name
      })
    })

    this.survey.onCurrentPageChanged.add(sender => {
      this.set_visible({
        jsonIndex: this.jsonIndex,
        title: sender.currentPage.title
      })
    })

    this.survey.onPartialSend.add(() => {
      this.save_server()
    })

    this.survey.onComplete.add(() => {
      this.set_visible({
        jsonIndex: this.jsonIndex + 1
      })

      this.killTimer()

      this.set_state(this.jsonIndex)
      this.save_server()
      if (this.jsonIndex == this.questions.length - 1) {
        this.put()

        let tick = (i, cb) => {
          setTimeout(function() {
            i++
            cb(i)
            if (i < 100) {
              tick(i, cb)
            }
          }, 10)
        }

        this.show1 = true
        tick(0, percent => {
          this.text1 = `${percent}%`
          if (percent === 100) {
            setTimeout(() => {
              this.show1 = false
              this.$router.push({
                name: 'assess'
              })
            }, 1000)
            return
          }
        })
      } else {
        this.$router.push({
          name: 'home'
        })
      }
    })

    this.survey.onPageVisibleChanged.add((sender, options) => {
      this.set_visible({
        jsonIndex: this.jsonIndex,
        title: options.page.title,
        type: 'onPageVisibleChanged',
        visible: options.visible
      })
    })

    this.get_state({
      jsonIndex: this.jsonIndex,
      pageIndex: this.pageIndex
    })

    timerId = window.setInterval(() => {
      this.save_server()
    }, polling)
  },
  beforeDestroy() {
    this.killTimer()
  }
}
</script>

<style lang="less" scoped>
.flex-column {
  background-color: #ffffff;
  .vux-spinner {
    stroke: #fff;
    fill: #fff;
  }
}
</style>
