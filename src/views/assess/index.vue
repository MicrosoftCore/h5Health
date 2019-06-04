<template>
  <div class="assess">
    <div class="assess-wrapper" v-if="id && typeof id === 'number'">
      <tab>
        <tab-item selected @on-item-click="onItemClick">近期</tab-item>
        <tab-item @on-item-click="onItemClick">终身</tab-item>
      </tab>
      <div class="flex-column__stretch">
        <div ref="instance" style="width: 100%; height: 250px;"></div>
        <x-button type="primary" mini @click.native="onDetail">查看风险</x-button>
        <div class="assess-wrapper__card">
          <group>
            <group-title slot="title">
              <span class="iconfont tabbar-pinggu"></span>
              <span>评估结果</span>
            </group-title>
            <cell-box>
              <ul>
                <li
                  v-if="selected === 0"
                >您未来五年的发病风险是{{ cdcqtnaire.fyrsRisk || 0 }},为一般人群的{{ cdcqtnaire.fyrsMultiplerisk || 0 }}倍;</li>
                <li
                  v-if="selected === 1"
                >您终身发病风险是{{ cdcqtnaire.lifetimeRisk || 0 }}, 为一般人群的{{ cdcqtnaire.lifetimeMultiplerisk || 0 }}倍;</li>
                <li>如果您调整您的生活习惯, 风险值将会降低{{ cdcqtnaire.reducerisk || 0 }}。</li>
              </ul>
            </cell-box>
            <cell-box v-if="cdcqtnaire.score">
              <div class="tips">
                <div class="left">*</div>
                <div
                  class="right"
                >您的答题一致性评价为{{ cdcqtnaire.score }}, 如果您的分数低于80分, 系统计算的患癌风险值可能无法反映真实情况, 建议您重新答题。</div>
              </div>
            </cell-box>
          </group>
        </div>
      </div>
    </div>
    <div class="assess-empty flex-column__stretch flex-center" v-else>
      <div class="wrapper">
        <span class="iconfont baogao"></span>
        <div class="label1">没有任何评估记录</div>
        <div class="label2">请填写问卷评估记录将自动生成</div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/common/service'
import { XButton, Tab, TabItem, Group, GroupTitle, CellBox } from 'vux'
import { mapGetters } from 'vuex'

export default {
  components: {
    XButton,
    Tab,
    TabItem,
    Group,
    GroupTitle,
    CellBox
  },
  data() {
    return {
      selected: 0,
      cdcthreshold: {},
      cdcqtnaire: {},
      fyrsRiskColor: '',
      fyrsRiskTips: '',
      lifetimeRiskColor: '',
      lifetimeRiskTips: ''
    }
  },
  computed: {
    ...mapGetters('question', ['idqtnaire']),
    id() {
      let { idqtnaire = '' } = this.$route.query
      return idqtnaire || this.idqtnaire
    },
    riskColor() {
      return this.selected === 0 ? this.fyrsRiskColor : this.lifetimeRiskColor
    },
    riskTips() {
      return this.selected === 0 ? this.fyrsRiskTips : this.lifetimeRiskTips
    },
    riskType() {
      return this.selected === 0 ? '(5-10年)' : '终身'
    },
    riskValue() {
      let {
        fyrsLowrisk,
        fyrsHighrisk,
        lifetimeLowrisk,
        lifetimeHighrisk
      } = this.cdcthreshold

      let { fyrsRisk, lifetimeRisk } = this.cdcqtnaire

      if (this.selected === 0) {
        return {
          value1: fyrsRisk,
          value2: (fyrsLowrisk + fyrsHighrisk) / 2
        }
      } else {
        return {
          value1: lifetimeRisk,
          value2: (lifetimeLowrisk + lifetimeHighrisk) / 2
        }
      }
    }
  },
  methods: {
    onSetOption() {
      let instance = echarts.init(this.$refs.instance)

      instance.setOption({
        backgroundColor: '#fff',
        xAxis: {
          show: false
        },
        yAxis: {
          show: false
        },
        series: [
          {
            type: 'gauge',
            radius: '70%',
            startAngle: 0,
            endAngle: 359.9,
            splitNumber: 100,
            hoverAnimation: true,
            axisTick: {
              show: false
            },
            splitLine: {
              length: 25,
              lineStyle: {
                width: 3,
                color: '#fff'
              }
            },
            axisLabel: {
              show: false
            },
            pointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                opacity: 0
              }
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 0
              }
            ]
          },
          {
            type: 'pie',
            radius: ['60%', '70%'],
            silent: true,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            z: 0,
            zlevel: 0,
            data: [
              {
                value: this.riskValue.value1,
                label: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    color: this.riskColor
                  }
                }
              },
              {
                value: this.riskValue.value2,
                label: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#DDDDDD'
                  }
                }
              }
            ]
          },
          {
            type: 'pie',
            radius: ['52%', '53%'],
            silent: true,
            z: 0,
            zlevel: 0,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            data: [
              {
                value: 0,
                label: {
                  normal: {
                    show: true,
                    formatter: `{c|${this.riskTips}} {b|${
                      this.riskType
                    }} \n {a|综合患癌风险值}`,
                    rich: {
                      c: {
                        color: '#333',
                        fontSize: 20,
                        fontWeight: 'bold',
                        lineHeight: 20
                      },
                      b: {
                        color: '#333',
                        fontSize: 13
                      },
                      a: {
                        align: 'center',
                        color: '#999',
                        fontSize: 12,
                        lineHeight: 20
                      }
                    },
                    position: 'center'
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#DDDDDD'
                  }
                }
              }
            ]
          },
          {
            type: 'scatter',
            symbolSize: 20,
            itemStyle: {
              color: '#39BF68'
            },
            data: [
              {
                value: [0.7, 1],
                symbolSize: 4
              },
              {
                value: [3.3, 8],
                symbolSize: 3
              },
              {
                value: [2.3, 5.6],
                symbolSize: 4
              },
              {
                value: [0.5, 7],
                symbolSize: 8
              },
              {
                value: [2.8, 0],
                symbolSize: 8
              }
            ]
          }
        ]
      })
    },
    onDetail() {
      this.$router.push({
        name: 'risk',
        params: {
          idqtnaire: this.id
        }
      })
    },
    onItemClick(e) {
      this.selected = e
      this.onSetOption()
    }
  },
  async mounted() {
    let cdcthreshold = await service['cdcthreshold.queryinfo']({
      params: {
        idqtnaire: this.id
      }
    })

    let cdcqtnaire = await service['cdcqtnaire.queryinfo']({
      params: {
        idqtnaire: this.id
      }
    })

    let {
      fyrsLowrisk,
      fyrsHighrisk,
      lifetimeLowrisk,
      lifetimeHighrisk
    } = cdcthreshold

    let { fyrsRisk, lifetimeRisk } = cdcqtnaire

    this.cdcthreshold = cdcthreshold
    this.cdcqtnaire = cdcqtnaire

    if (fyrsRisk < fyrsLowrisk) {
      this.fyrsRiskColor = '#39BF68'
      this.fyrsRiskTips = '低危'
    }

    if (fyrsRisk > fyrsLowrisk && fyrsRisk < fyrsHighrisk) {
      this.fyrsRiskColor = '#FFBE00'
      this.fyrsRiskTips = '中危'
    }

    if (fyrsRisk > fyrsHighrisk) {
      this.fyrsRiskColor = '#F43530'
      this.fyrsRiskTips = '高危'
    }

    if (lifetimeRisk < lifetimeLowrisk) {
      this.lifetimeRiskColor = '#39BF68'
      this.lifetimeRiskTips = '低危'
    }

    if (lifetimeRisk > lifetimeLowrisk && lifetimeRisk < lifetimeHighrisk) {
      this.lifetimeRiskColor = '#FFBE00'
      this.lifetimeRiskTips = '中危'
    }

    if (lifetimeRisk > lifetimeHighrisk) {
      this.lifetimeRiskColor = '#F43530'
      this.lifetimeRiskTips = '高危'
    }

    this.onSetOption()
  }
}
</script>

<style lang="less" scoped>
.assess {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  background-color: #ffffff;
  .assess-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    .weui-btn {
      width: 130px;
      height: 35px;
      display: block;
      margin-bottom: 40px;
      border-radius: 50px;
      font-size: 15px;
    }
    .assess-wrapper__card {
      margin: 20px 20px;
      padding: 1px 0;
      border-radius: 3px;
      box-shadow: 0px -2px 10px #f5f5f5, -2px 0px 10px #f5f5f5,
        2px 0px 10px #f5f5f5, 0px 2px 10px #f5f5f5;
      background-color: #ffffff;
      /deep/.weui-cells__title {
        margin: 10px 0;
        font-size: 15px;
        color: #7a7a7a;
      }
      /deep/.weui-cells {
        &::after {
          border-bottom: none;
        }
        .weui-cell {
          letter-spacing: 1px;
          text-align: justify;
          font-size: 14px;
          color: #7a7a7a;
          .tips {
            display: flex;
            .left {
              width: 15px;
              padding-left: 5px;
            }
            .right {
              flex: 1;
              line-height: 24px;
            }
          }
          ul {
            margin: 0;
            padding-left: 20px;
            li {
              line-height: 24px;
            }
          }
        }
      }
    }
  }
  .assess-empty {
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
}
</style>
