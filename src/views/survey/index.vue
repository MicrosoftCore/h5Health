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
    <popup/>
  </div>
</template>

<script>
import { Spinner, Toast, XHeader } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'
import { Model, StylesManager, Survey } from 'survey'
import { Popup } from '@/components/vux'
StylesManager.applyTheme('darkblue')

let timerId = 0
let polling = 60000

export default {
  components: {
    Popup,
    Spinner,
    Survey,
    Toast,
    XHeader
  },
  data() {
    return {
      show1: false,
      text1: '',
      survey: new Model(),
      toastOptions: {
        time: 3000,
        type: 'text',
        width: '13em',
        position: 'middle',
        isShowMask: true
      }
    }
  },
  computed: {
    ...mapState('answer', ['progress', 'validate']),
    ...mapState('question', ['questions', 'showAssess']),
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
    isLastJson() {
      return this.jsonIndex == this.questions.length - 1
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
    ...mapMutations('action', ['set_popup']),
    ...mapMutations('answer', ['set_model', 'set_progress', 'set_validate']),
    ...mapMutations('question', ['set_visible']),
    killTimer() {
      clearInterval(timerId)
    }
  },
  async created() {
    if (!this.questions.length) await this.get()

    this.survey = new Model(
      Object.assign(this.questionjson, {
        checkErrorsMode: 'onValueChanged',
        clearInvisibleValues: 'none',
        sendResultOnPageNext: true,
        showProgressBar: 'top'
      })
    )

    this.set_model(this.survey)

    this.survey.onValueChanged.add((sender, options) => {
      let name = options.question.page.name
      let jsonIndex = this.jsonIndex

      this.set_state(jsonIndex)
      this.set_progress({
        jsonIndex,
        name
      })

      sender.fireValidatedErrorsOnCurrentPage()
    })

    this.survey.onCurrentPageChanged.add(sender => {
      this.set_visible({
        jsonIndex: this.jsonIndex,
        title: sender.currentPage.title
      })
    })

    this.survey.onValidatedErrorsOnCurrentPage.add((sender, options) => {
      let jsonIndex = this.jsonIndex

      this.set_validate({
        jsonIndex,
        options
      })
    })

    this.survey.onPageVisibleChanged.add((sender, options) => {
      let jsonIndex = this.jsonIndex
      let visible = options.visible
      let title = options.page.title
      let name = options.page.name
      this.set_visible({
        jsonIndex,
        title,
        type: 'onPageVisibleChanged',
        visible
      })
      this.set_progress({
        jsonIndex,
        name,
        visible
      })
    })

    this.survey.onPartialSend.add(() => {
      this.save_server()
    })

    this.survey.onCompleting.add((sender, options) => {
      if (this.isLastJson) {
        let allowComplete = true
        let progress = this.progress

        for (let i in progress) {
          let part = progress[i]
          for (let j in part) {
            let partProgress = part[j]
            if (partProgress !== 100) allowComplete = false
          }
        }

        if (!allowComplete) {
          this.set_popup({
            show: true,
            text: '您有未答完的题 , 请答完后再提交'
          })
        } else {
          let validate = Object.values(this.validate).some(
            item => item.errors.length > 0
          )
          if (validate) {
            allowComplete = false
            this.set_popup({
              show: true,
              text: '答题有误 , 请检查答案后提交'
            })
          }
        }

        options.allowComplete = allowComplete
      }
    })

    this.survey.onComplete.add(() => {
      this.set_visible({
        jsonIndex: this.jsonIndex + 1
      })

      this.killTimer()
      this.set_state(this.jsonIndex)

      if (this.isLastJson) {
        this.put(this.$router)

        let tick = (i, cb) => {
          setTimeout(() => {
            i++
            cb(i)
            if (i < 100) {
              tick(i, cb)
            }
          }, 20)
        }

        this.show1 = true
        tick(0, percent => {
          this.text1 = `${percent}%`
        })
      } else {
        this.save_server()
        this.$router.push({
          name: 'home'
        })
        if (!this.showAssess) {
          this.set_popup({
            show: true,
            text: '请继续填写'
          })
        }
      }
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
  /deep/.sv_q_footer {
    .sv_matrix_dynamic_button {
      margin-left: 7px;
      padding: 3.6px 24px;
    }
  }
}
</style>
