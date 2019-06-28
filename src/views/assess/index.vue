<template>
  <div class="assess">
    <div class="assess-wrapper" v-if="showreport">
      <div class="flex-column__stretch">
        <button-tab>
          <button-tab-item selected @on-item-click="onItemClick">近期风险</button-tab-item>
          <button-tab-item @on-item-click="onItemClick">终身风险</button-tab-item>
        </button-tab>
        <div ref="wrapper" style="width: 100%; height: 250px;"></div>
        <x-button
          type="primary"
          mini
          :plain="cdcqtnaire.idsubmission ? true : false"
          @click.native="onFillIn"
        >
          <span>{{ cdcqtnaire.idsubmission ? '已申请' : '申请详细报告' }}</span>
        </x-button>
        <div class="assess-wrapper__card">
          <group title="评估结果">
            <cell-box>
              <div class="wrapper">
                <div class="left">
                  <span class="iconfont shandian"></span>
                </div>
                <div class="right">
                  <span v-if="selected === 0">
                    <span>您未来五年的发病风险是 {{ cdcqtnaire.fyrsRisk || 0 }}, 为一般人群的 {{ cdcqtnaire.fyrsMultiplerisk || 0 }} 倍</span>
                  </span>
                  <span v-if="selected === 1">
                    <span>您终身发病风险是 {{ cdcqtnaire.lifetimeRisk || 0 }}, 为一般人群的 {{ cdcqtnaire.lifetimeMultiplerisk || 0 }} 倍</span>
                  </span>
                </div>
              </div>
            </cell-box>
            <cell-box>
              <div class="wrapper">
                <div class="left">
                  <span class="iconfont tishi"></span>
                </div>
                <div class="right">
                  <span>如果您调整您的生活习惯, 风险值将会降低 {{ cdcqtnaire.reducerisk || 0 }}</span>
                </div>
              </div>
            </cell-box>
            <cell-box v-if="cdcqtnaire.score">
              <div class="wrapper">
                <div class="left">
                  <span class="iconfont jinggao"></span>
                </div>
                <div class="right">
                  <span>您的答题一致性评价为{{ cdcqtnaire.score }}, 如果您的分数低于80分, 系统计算的患癌风险值可能无法反映真实情况, 建议您重新答题</span>
                </div>
              </div>
            </cell-box>
            <cell-box :border-intent="false">
              <div class="flex-center button" @click="onDetail">查看风险</div>
            </cell-box>
          </group>
        </div>
      </div>
    </div>
    <div class="assess-empty flex-justify__center" v-else>
      <div class="wrapper">
        <span class="iconfont wupinggu"></span>
        <div class="label1">没有任何评估记录</div>
        <div class="label2">请填写问卷评估记录将自动生成</div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/common/service'
import { mapState } from 'vuex'
import { XButton, ButtonTab, ButtonTabItem, Group, CellBox } from 'vux'

export default {
  components: {
    XButton,
    ButtonTab,
    ButtonTabItem,
    Group,
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
    ...mapState('question', ['idqtnaire', 'showAssess']),
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
        lifetimeLowrisk
        // fyrsHighrisk,
        // lifetimeHighrisk
      } = this.cdcthreshold

      let { fyrsRisk, lifetimeRisk } = this.cdcqtnaire

      if (this.selected === 0) {
        return {
          value1: fyrsRisk,
          value2: fyrsLowrisk
        }
      } else {
        return {
          value1: lifetimeRisk,
          value2: lifetimeLowrisk
        }
      }
    },
    showreport() {
      let { idqtnaire = '' } = this.$route.query
      return this.showAssess || idqtnaire
    }
  },
  methods: {
    onSetOption() {
      let wrapper = this.$refs.wrapper
      if (!wrapper) return

      let instance = window.echarts.init(wrapper)

      instance.setOption({
        backgroundColor: '#fbfbfb',
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
            splitNumber: 80,
            hoverAnimation: true,
            axisTick: {
              show: false
            },
            splitLine: {
              length: 25,
              lineStyle: {
                width: 3,
                color: '#fbfbfb'
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
                    }}\n{a|综合患癌风险值}`,
                    rich: {
                      c: {
                        color: '#333',
                        fontSize: 20,
                        fontWeight: 'bold',
                        lineHeight: 20
                      },
                      b: {
                        color: '#333',
                        fontSize: 12
                      },
                      a: {
                        align: 'center',
                        color: '#999',
                        fontSize: 13,
                        lineHeight: 30
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
              color: this.riskColor
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
    onFillIn() {
      this.$router.push({
        name: 'fillin',
        query: {
          idsubmission: this.cdcqtnaire.idsubmission,
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
    if (!this.showreport) return

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
    } else if (fyrsRisk > fyrsLowrisk && fyrsRisk < fyrsHighrisk) {
      this.fyrsRiskColor = '#FFBE00'
      this.fyrsRiskTips = '中危'
    } else if (fyrsRisk > fyrsHighrisk) {
      this.fyrsRiskColor = '#F43530'
      this.fyrsRiskTips = '高危'
    } else {
      this.fyrsRiskColor = '#39BF68'
      this.fyrsRiskTips = '未知'
    }

    if (lifetimeRisk < lifetimeLowrisk) {
      this.lifetimeRiskColor = '#39BF68'
      this.lifetimeRiskTips = '低危'
    } else if (
      lifetimeRisk > lifetimeLowrisk &&
      lifetimeRisk < lifetimeHighrisk
    ) {
      this.lifetimeRiskColor = '#FFBE00'
      this.lifetimeRiskTips = '中危'
    } else if (lifetimeRisk > lifetimeHighrisk) {
      this.lifetimeRiskColor = '#F43530'
      this.lifetimeRiskTips = '高危'
    } else {
      this.lifetimeRiskColor = '#39BF68'
      this.lifetimeRiskTips = '未知'
    }

    this.$nextTick(() => {
      this.onSetOption()
    })
  }
}
</script>

<style lang="less" scoped>
.assess {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  background-color: #fbfbfb;
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
    .vux-button-group {
      padding: 20px 30px 0;
    }
    .assess-wrapper__card {
      margin: 20px 20px;
      padding: 1px 10px 1px 20px;
      border-radius: 3px;
      box-shadow: 0px -3px 15px #f0f0f0, -3px 0px 15px #f0f0f0,
        3px 0px 15px #f0f0f0, 0px 3px 15px #f0f0f0;
      background-color: #ffffff;
      /deep/.weui-cells__title {
        margin: 10px 0;
        font-size: 15px;
        font-weight: bold;
        color: #343434;
      }
      /deep/.weui-cells {
        &::after {
          border-bottom: none;
        }
        .weui-cell {
          font-size: 15px;
          color: #333333;
          &:not(:last-child)::before {
            left: 53px;
          }
          .wrapper {
            display: flex;
            align-items: center;
            .left {
              margin-right: 15px;
              font-size: 22px;
              .shandian {
                color: #0187f6;
              }
              .tishi {
                color: #28c06c;
              }
              .jinggao {
                color: #fb9400;
              }
            }
            .right {
              flex: 1;
              text-align: justify;
            }
          }
          .button {
            width: 100%;
            color: #38bf69;
          }
        }
      }
    }
  }
  .assess-empty {
    padding-top: 40%;
    .wrapper {
      text-align: center;
      .iconfont {
        font-size: 70px;
        color: #c4c8c9;
      }
      .label1,
      .label2 {
        font-size: 15px;
        color: #95a0a4;
      }
      .label1 {
        margin-top: 15px;
      }
    }
  }
}
</style>
