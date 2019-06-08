<template>
  <div class="assess">
    <div class="assess-wrapper" v-if="showreport">
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
              <span>评估结果</span>
            </group-title>
            <cell-box v-if="selected === 0">
              <div class="wrapper">
                <div class="left">
                  <span class="iconfont shandian"></span>
                </div>
                <div class="right">
                  <span>您未来五年的发病风险是{{ cdcqtnaire.fyrsRisk || 0 }},为一般人群的{{ cdcqtnaire.fyrsMultiplerisk || 0 }}倍;</span>
                </div>
              </div>
            </cell-box>
            <cell-box v-if="selected === 1">
              <div class="wrapper">
                <div class="left">
                  <span class="iconfont shandian"></span>
                </div>
                <div class="right">
                  <span>您终身发病风险是{{ cdcqtnaire.lifetimeRisk || 0 }}, 为一般人群的{{ cdcqtnaire.lifetimeMultiplerisk || 0 }}倍;</span>
                </div>
              </div>
            </cell-box>
            <cell-box>
              <div class="wrapper">
                <div class="left">
                  <span class="iconfont tishi"></span>
                </div>
                <div class="right">
                  <span>如果您调整您的生活习惯, 风险值将会降低{{ cdcqtnaire.reducerisk || 0 }}。</span>
                </div>
              </div>
            </cell-box>
            <cell-box v-if="cdcqtnaire.score">
              <div class="wrapper">
                <div class="left">
                  <span class="iconfont jinggao"></span>
                </div>
                <div class="right">
                  <span>您的答题一致性评价为{{ cdcqtnaire.score }}, 如果您的分数低于80分, 系统计算的患癌风险值可能无法反映真实情况, 建议您重新答题。</span>
                </div>
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
import { mapState } from 'vuex'

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
    ...mapState('question', ['idqtnaire', 'viewreport']),
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
      return this.viewreport || idqtnaire
    }
  },
  methods: {
    onSetOption() {
      let instance = window.echarts.init(this.$refs.instance)

      instance.setOption({
        backgroundColor: '#fafafa',
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
                color: '#fafafa'
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
  background-color: #fafafa;
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
      padding: 1px 10px 1px 20px;
      border-radius: 3px;
      box-shadow: 0px -4px 20px #f0f0f0, -4px 0px 20px #f0f0f0,
        4px 0px 20px #f0f0f0, 0px 4px 20px #f0f0f0;
      background-color: #ffffff;
      /deep/.weui-cells__title {
        margin: 10px 0;
        font-size: 16px;
        color: #7a7a7a;
        color: #333333;
      }
      /deep/.weui-cells {
        &::after {
          border-bottom: none;
        }
        .weui-cell {
          line-height: 24px;
          text-align: justify;
          font-size: 15px;
          color: #7a7a7a;
          color: #333333;
          .wrapper {
            display: flex;
            .left {
              margin-right: 10px;
              font-size: 20px;
              .shandian {
                color: #0187f6;
              }
              .tishi {
                color: #fb9400;
              }
              .jinggao {
                color: #f43530;
              }
            }
            .right {
              flex: 1;
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
