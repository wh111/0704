<!--
****--@file     debug
****--@date     2017/12/22 15:29
****--@author   YC
****--@describe 调试及查看摄像头
-->
<template>
  <div>
    <template v-if="configData.id">
      <!-- 海康威视 -->
      <hikvision v-if="configData.brand==='HIKVISION'" :configData="configData"
                 :showConsole="configData.isConsole == 'YES'" :count="count" :isDebug="isDebug"
                 :onlyPlayer="onlyPlayer"></hikvision>
      <!-- 科达视讯 -->
      <mcu v-if="configData.brand==='MCU'" :configData="configData" :showConsole="configData.isConsole == 'YES'"
           :count="count" :isDebug="isDebug" :onlyPlayer="onlyPlayer"></mcu>
    </template>
    <p v-else class="debugNoVideoTips">暂无监控数据</p>
  </div>
</template>
<style lang="scss">
  .debugNoVideoTips {
    line-height: 320px;
    text-align: center;
    border: 1px dashed #ccc;
  }
</style>
<script>
  /*当前组件必要引入*/
  import hikvision from './hikvision';
  import mcu from './mcu';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      videoId: { // 选择的id
        type: [Number, String],
        default: 0,
      },
      configData: { // 摄像头配置信息
        type: Object,
        default: () => ({
          id: '',
          brand: '',
          isConsole: '',
          nvrIp: "",
          port: "",
          loginName: "",
          password: "",
          brand: "",
          ip: "",
        })
      },
      isDebug: { // 获取视频流是否是调试模式
        type: Boolean,
        default: false
      },
      onlyPlayer: { // 是否只显示播放器
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        count: this.videoId, // 计数器（调试模式下统计登录使用）
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

      }
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      hikvision, mcu
    }
  }

</script>
