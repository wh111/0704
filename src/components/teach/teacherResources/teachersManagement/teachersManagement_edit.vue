<template>

  <div>
    <teach-inputds v-if="type=='DS'" :operailityData="formData" ref="teach"></teach-inputds>
    <teach-input v-else :operailityData="formData" ref="teach"></teach-input>
    <br/>
    <el-row>
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="saveCurrData" :btnData="loadBtn"></load-btn>
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
  import api from './api';
  //导师
  import teachInputds from "../../../common/archivesManagement/archivesManagement_teach/inputDS.vue";
  //带教老师
  import teachInput from "../../../common/archivesManagement/archivesManagement_teach/input.vue";

  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'deptId','type'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        formData: null,
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modify.path + this.operailityData.id,
            method: api.modify.method,
            data: {}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method,
          }
        }
      }
    },
    created() {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.initMessTitle);
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      saveCurrData(isLoadingFun) {
        let data = this.$refs.teach.getInputData();
        if (data) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = data;
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },

      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
        this.formData = responseData.data;
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
      teachInput,
      teachInputds
    }
  }
</script>
