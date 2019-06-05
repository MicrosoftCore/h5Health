<template>
  <div class="flex-column">
    <x-header :title="survey.currentPage.title"/>
    <div class="flex-column__stretch">
      <survey :survey="survey" v-if="questions.length"></survey>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'
import { Model, StylesManager, Survey } from 'survey'
StylesManager.applyTheme('darkblue')

let timerId = 0
let polling = 60000

export default {
  components: {
    Survey,
    XHeader
  },
  data() {
    return {
      survey: new Model()
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
    }
  },
  methods: {
    ...mapActions('answer', ['get_state', 'set_state', 'save_server']),
    ...mapActions('question', ['get', 'put']),
    ...mapMutations('answer', ['set_model']),
    ...mapMutations('question', ['set_visible']),
    killTimer() {
      console.log('>>>>>>', 'kill the timer')
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

    this.survey.onValueChanged.add(() => {
      this.set_state(this.jsonIndex)
    })

    this.survey.onCurrentPageChanged.add(survey => {
      this.set_visible({
        jsonIndex: this.jsonIndex,
        title: survey.currentPage.title
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
@import 'https://cdn.bootcss.com/survey-vue/1.0.87/survey.min.css';
.flex-column {
  background-color: #ffffff;
}
</style>
