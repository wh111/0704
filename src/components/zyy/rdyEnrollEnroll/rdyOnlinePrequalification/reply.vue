<!--
****--@file     reply
****--@date     2018/1/25 14:57
****--@author   wh
****--@describe   批量处理
-->
<template>
  <div class="reply-root">
    <el-button type="primary" @click="re('Y')" style="margin-right: 100px">通过</el-button>
    <el-button type="danger" @click="re('N')">未通过</el-button>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  let Util = null;
  import api from './api';

  export default {
    props: ['multipleSelectionResponse', 'whereFrom'],
    data() {
      return {};
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;

      },
      re(res) {

        this.ajax({
          ajaxSuccess: this.replySuccess,
          ajaxParams: {
            url: api['preTrialModifyState'].path + this.multipleSelectionResponse,
            method: api['preTrialModifyState'].method,
            data: {
              // ids: this.multipleSelectionResponse.slice(0, this.multipleSelectionResponse.length - 1),
              type: res,
              mess: ''
            }
          }
        });
      },
      replySuccess() {

        this.$emit('subCallback');
      }

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  };

</script>
<style lang="scss">
  .reply-root {
    margin: 0 auto;
    text-align: center;
  }
</style>
