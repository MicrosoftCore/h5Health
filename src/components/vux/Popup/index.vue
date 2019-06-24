<template>
  <div v-transfer-dom>
    <popup v-model="showPopup.show" position="top" :show-mask="false">
      <div class="position-vertical-demo">{{ showPopup.text }}</div>
    </popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Popup, TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup
  },
  computed: {
    ...mapState('action', ['showPopup'])
  }
}
</script>

<style lang="less" scoped>
.position-vertical-demo {
  padding: 15px;
  background-color: #ffbe00;
  text-align: center;
  color: #000;
}
</style>
