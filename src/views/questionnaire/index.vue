<template>
  <div class="full-height">
    <view-box>
      <div class="questionnaire">
        <div class="questionnaire-header">
          <div class="title">基本问题</div>
          <div class="description">感谢您能抽出几分钟时间参加本次答题, 现在我们就马上开始吧！</div>
        </div>
        <div class="questionnaire-wrapper">
          <div class="questionnaire-wrapper__item">
            <div class="description">
              <span class="question">1. 您喜欢的国家</span>
              <span class="type">(多选)</span>
              <span class="require">*</span>
            </div>
            <Checker type="checkbox"/>
          </div>
          <div class="questionnaire-wrapper__item">
            <div class="description">
              <span class="question">1. 您的性别</span>
              <span class="type">(单选)</span>
              <span class="require">*</span>
            </div>
            <Checker/>
          </div>
          <div class="questionnaire-wrapper__item">
            <div class="description">
              <span class="question">1. 您的性别</span>
              <span class="type">(单选)</span>
              <span class="require">*</span>
            </div>
            <Checker/>
          </div>
        </div>
      </div>

      <tabbar>
        <tabbar-item class="vux-1px-r">
          <span slot="label">
            <span class="iconfont shangyiye"></span>
            <span>上一页</span>
          </span>
        </tabbar-item>
        <tabbar-item>
          <span slot="label">
            <span>下一页</span>
            <span class="iconfont xiayiye"></span>
          </span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, ViewBox } from 'vux'
import { Checker } from '@/components/vux'
export default {
  components: {
    Checker,
    Tabbar,
    TabbarItem,
    ViewBox
  }
}
</script>

<style lang="less" scoped>
/deep/.weui-tabbar__label {
  color: #999999 !important;
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.questionnaire {
  padding: 20px;
  .questionnaire-header {
    .title {
      font-size: 18px;
    }
    .description {
      margin: 15px 0;
    }
  }
  .questionnaire-wrapper {
    .questionnaire-wrapper__item {
      margin-bottom: 10px;
      padding: 20px;
      border-radius: 3px;
      box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
      background-color: #ffffff;
      .description {
        margin-bottom: 10px;
        .type {
          margin: 0 5px;
          color: #999999;
        }
        .require {
          color: red;
        }
      }
    }
  }
}
</style>
