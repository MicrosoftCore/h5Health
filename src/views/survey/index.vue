<template>
  <div class="flex-column">
    <x-header/>
    <div class="flex-column__stretch">
      <survey :survey="survey" v-if="survey"></survey>
    </div>
  </div>
</template>

<script>
import { XHeader } from '@/components/vux'
import { mapState, mapActions, mapMutations } from 'vuex'
import { Model, StylesManager, Survey } from 'survey-vue'
// import * as SurveyVue from 'survey-vue'
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
    idquestionjson() {
      return this.$route.params.idquestionjson
    },
    question() {
      return this.questions[this.idquestionjson - 1]
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
      'setModel',
      'loadState',
      'saveState',
      'saveServer',
      'updateServer'
    ]),
    ...mapMutations('answer', ['setModel']),
    killTimer() {
      console.log('>>>>>>', 'kill the timer')
      clearInterval(timerId)
    }
  },
  mounted() {
    this.survey = new Model(
      Object.assign(this.questionjson, {
        clearInvisibleValues: 'none',
        showProgressBar: 'top'
      })
    )

    this.setModel(this.survey)

    this.survey.onValueChanged.add((sender, options) => {
      this.saveState()
    })

    this.survey.onCurrentPageChanged.add((survey, options) => {
      this.saveState()
      this.saveServer()
    })

    this.survey.onComplete.add((sender, options) => {
      //kill the timer
      this.killTimer()
      //save the data on survey complete. You may call another function to store the final results
      this.saveState()
      this.saveServer()
      this.updateServer()
    })

    this.loadState()

    timerId = window.setInterval(_ => {
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
