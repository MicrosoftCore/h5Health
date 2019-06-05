<template>
  <div class="flex-column">
    <x-header title="填写问卷"/>
    <div class="flex-column__stretch">
      <survey :survey="survey" v-if="questions.length"></survey>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import { mapState, mapActions, mapMutations } from 'vuex'
import { Model, StylesManager, Survey } from 'survey-vue'
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
    ...mapActions('answer', [
      'get_state',
      'set_state',
      'saveServer'
    ]),
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
      this.saveServer()
    })

    this.survey.onComplete.add(() => {
      this.set_visible({
        jsonIndex: this.jsonIndex + 1
      })
      //kill the timer
      this.killTimer()
      //save the data on survey complete. You may call another function to store the final results
      this.set_state(this.jsonIndex)
      this.saveServer()
      if (this.jsonIndex == this.questions.length - 1) {
        this.put()
      }
    })

    this.get_state({
      jsonIndex: this.jsonIndex,
      pageIndex: this.pageIndex
    })

    timerId = window.setInterval(() => {
      this.saveServer()
    }, polling)
  },
  beforeDestroy() {
    this.killTimer()
  }
}
</script>

<style lang="less" scoped>
@import '~survey-vue/survey.min.css';
.flex-column {
  background-color: #ffffff;
}
</style>
