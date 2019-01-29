<!--档案管理修改-->
<!--基本情况-->

<template>

  <div>
    <bks-basic-input :operailityData="initData" ref="bksBasicInput"></bks-basic-input>
    <br />
    <div style="font-size: 1px;overflow: hidden;line-height: 1;border-top:1px solid #e3e8ee;margin: 12px 0;"></div>
    <el-row>
      <el-col :span="9" :offset="10">
        <el-button type="primary" v-if="userInfo.archivesAuditStatus!='NOT_AUDIT'" @click="saveDataToParent">保存</el-button>
        <load-btn v-if="userInfo.archivesAuditStatus!='NOT_AUDIT'" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <span v-if="userInfo.archivesAuditStatus=='NOT_AUDIT'" style="margin-right: 10px;color: #FF4949;">您的档案信息正在审核中……</span>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<style>
  .headerUrl {
    width: 165px;
    height: 175px;
    line-height: 175px;
  }

</style>
<script>
  let Util = null;
  import  bksBasicInput from '../archivesManagement_basic/other/input.vue';
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'initData', 'userInfo'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'上报审核',callParEvent:'listenSubEvent'},

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: '/archives/save/basic/',
            method: 'post',
            data: {}
          }
        },
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      //初始化
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        console.log(this.operailityData)
        console.log(this.initData)
        console.log(this.userInfo)
      },

      // 保存
      saveDataToParent() {
        let data = this.$refs.bksBasicInput.getInputData();
        if (data) {
//          this.$emit("setSaveData",data);

        }
        console.log('保存',data)
      },

      // 上报审核
      listenSubEvent() {
        let data = this.$refs.bksBasicInput.getInputData();
        if (data) {
//          this.$emit("subAuditArchives",data);
        }
        console.log('上报',data)
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'edit');
      },
    },
    components: {
      bksBasicInput
    }
  }

</script>
