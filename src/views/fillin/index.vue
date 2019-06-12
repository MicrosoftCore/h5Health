<template>
  <div class="flex-column">
    <x-header :title="$route.meta.title"/>
    <div class="fillIn flex-column__stretch">
      <card :header="{title: '温馨提示' }">
        <p slot="content" class="card-padding">如果您多次申请, 填写个人信息, 将以最后一次提交的个人信息为准</p>
      </card>
      <group title="个人信息" label-width="5em" label-margin-right="2em" label-align="left">
        <cell title="微信名" :value="userinfo.nickname"></cell>
        <cell title="性别" :value="sexMap[userinfo.sex]"></cell>
      </group>
      <group title="身份证信息" label-width="6em" label-margin-right="2em" label-align="left">
        <x-input
          ref="idCode"
          title="身份证号"
          placeholder="请输入身份证号"
          required
          v-model="form.idCode"
          :max="18"
          :type="form.idCode.length === 18 ? 'password' : 'text'"
          :is-type="onValidateId"
        ></x-input>
        <x-input
          ref="idCodeSix"
          title="确认身份证号"
          placeholder="重新输入身份证号"
          required
          v-model="form.idCodeSix"
          :max="18"
          :type="form.idCodeSix.length === 18 ? 'password' : 'text'"
          :is-type="onValidateConfirm"
        ></x-input>
      </group>
      <group title="填写快递地址" label-width="6em" label-margin-right="2em" label-align="left">
        <x-input ref="name" title="单位全称" placeholder="请输入单位全称" required v-model="form.name"></x-input>
        <x-input
          ref="tel1"
          title="手机号"
          placeholder="请输入手机号"
          type="tel"
          is-type="china-mobile"
          required
          v-model="form.tel1"
        ></x-input>
        <x-address
          ref="region"
          title="地址选择"
          placeholder="请选择地址"
          v-model="form.region"
          required
          :list="list"
          value-text-align="left"
          label-align="justify"
        ></x-address>
        <x-textarea
          ref="address"
          title="快递地址"
          placeholder="请填写详细地址"
          required
          :rows="3"
          v-model="form.address"
        ></x-textarea>
      </group>
      <div class="fillIn-operation">
        <div class="flex-align__center">
          <check-icon :value.sync="approve" type="plain">阅读并同意</check-icon>
          <span class="notice" @click="showPopup = true">《知情通知书》</span>
        </div>
        <x-button action-type="submit" type="primary" @click.native="onSubmit">提交</x-button>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="showPopup" position="bottom" height="80%" is-transparent>
        <div class="notice-wrapper">
          <div class="notice-wrapper__content" v-html="htmlString"></div>
          <x-button type="primary" plain @click.native="showPopup = false">关闭</x-button>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import service from '@/common/service'
import IdNumberValidator from '@/plugins/id.number.validator'
import md5 from 'js-md5'
import { mapState } from 'vuex'
import {
  Card,
  Cell,
  CheckIcon,
  ChinaAddressData,
  Group,
  Popup,
  TransferDom,
  XAddress,
  XButton,
  XHeader,
  XInput,
  XTextarea
} from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    Card,
    Cell,
    CheckIcon,
    Group,
    Popup,
    XAddress,
    XButton,
    XHeader,
    XInput,
    XTextarea
  },
  data() {
    return {
      approve: false,
      showPopup: false,
      htmlString: '',
      list: ChinaAddressData,
      sexMap: {
        0: '未知',
        1: '男',
        2: '女'
      },
      form: {
        idCode: '',
        idCodeSix: '',
        name: '',
        tel1: '',
        region: [],
        address: ''
      }
    }
  },
  computed: {
    ...mapState('account', ['userinfo']),
    idsubmission() {
      return this.$route.query.idsubmission
    },
    idqtnaire() {
      return this.$route.query.idqtnaire
    },
    postData() {
      return {
        ...this.form,
        idCode: md5(this.form['idCode'].toLocaleUpperCase()),
        idCodeSix: md5(this.form['idCodeSix'].toLocaleUpperCase()),
        region: JSON.stringify(this.form['region'])
      }
    }
  },
  methods: {
    onValidateId(value) {
      return {
        valid: IdNumberValidator(value).isTrue,
        msg: '请输入正确的身份证号码'
      }
    },
    onValidateConfirm(value) {
      return {
        valid: value === this.form.idCode,
        msg: '两次输入的身份证号码不一致'
      }
    },
    async onSubmit() {
      let that = this
      let validate = true
      for (var x in this.$refs) {
        if (this.$refs[x].validate) {
          this.$refs[x].validate()
          if (!this.$refs[x].valid) {
            this.$refs[x].focus()
            this.$refs[x].blur()
            validate = false
          }
        }
      }

      if (!validate) return
      if (!this.approve) {
        this.$vux.toast.show({
          text: '请阅读并同意《知情通知书》',
          type: 'text',
          width: '70%'
        })
        return
      }

      let onToast = msg => {
        this.$vux.toast.show({
          text: msg,
          type: 'text',
          isShowMask: true,
          onHide() {
            that.$router.push({
              name: 'assess'
            })
          }
        })
      }

      if (this.idsubmission) {
        const { msg } = await service['cdcsubmission.update']({
          idsubmission: this.idsubmission,
          ...this.postData
        })
        onToast(msg)
      } else {
        const { msg } = await service['cdcsubmission.add']({
          idqtnaire: this.idqtnaire,
          ...this.postData
        })
        onToast(msg)
      }
    }
  },
  async created() {
    const { msg } = await service['cdcqtnaireversion.queryLetter']()
    this.htmlString = JSON.parse(msg).informedConsent

    if (this.idsubmission) {
      const result = await service['cdcsubmission.queryinfo']({
        params: {
          idsubmission: this.idsubmission
        }
      })

      delete result.idCode
      delete result.idCodeSix
      result.region = JSON.parse(result['region'])
      this.form = {
        ...this.form,
        ...result
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fillIn {
  background-color: #f8f8f8;
  .card-padding {
    line-height: 20px;
    padding: 15px;
    font-family: '微软雅黑';
    font-size: 14px;
    color: #999999;
  }
  .fillIn-operation {
    padding: 20px 15px;
    .flex-align__center {
      font-size: 14px;
      .notice {
        color: #586c94;
      }
    }
    .weui-btn {
      margin: 20px 0 50px;
    }
  }
  /deep/.weui-cells {
    font-size: 16px;
  }
}
.vux-popup-dialog {
  padding-bottom: 20px;
  .notice-wrapper {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 5px;
    overflow-y: scroll;
    background-color: #fff;
    .notice-wrapper__content {
      overflow: hidden;
    }
  }
}
</style>
