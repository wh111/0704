<!-- 实习生 - 报名招录 - 人员管理 - 增加 -->
<template>
  <div class="editForm">
    <sxs-basic-input ref="sxsBasicInput" :operailityData="formData"></sxs-basic-input>

    <br>

    <el-row>
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  import api from './api';
  import  sxsBasicInput from '../../../common/archivesManagement/archivesManagement_basic/s_sxs/input.vue'; // 实习生基本信息输入

  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
//        保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //form表单bind数据
        formData: {},
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.edit.path,
            method: api.edit.method,
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
        //默认请求加载数据
        if (typeof this.operailityData != "undefined") {
          this.formData = Object.assign(this.formData, this.operailityData);
        }
        console.log(this.operailityData)
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let data = this.$refs.sxsBasicInput.getInputData();
        if (data) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.data = data;
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'add');
      },
    },
    components:{
      sxsBasicInput,
    },
  }

</script>


<style lang="scss">
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
