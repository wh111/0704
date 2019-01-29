<template>

  <div class="showWrapper leaveManagement-show">
    <el-form ref="formValidate" class="demo-form-inline" label-width="110px">
      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="标题：" prop="name" class="feildFontweight">
            {{showData.title}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="对象：" class="feildFontweight">
            {{showData.roleName}}
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="评分表：" class="feildFontweight">
            {{showData.scoreTableName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="自荐时间：" class="feildFontweight">
            {{showData.startDate}} ~ {{showData.endDate}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="说明：" prop="desc" class="feildFontweight">
            <el-input type="textarea" v-model="showData.explains" :rows="5" readonly resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="相关证明材料：" class="feildFontweight">
            <upload-file :uploadFiles="fileList" :show="true"></upload-file>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        fileList: [],
        "showData": {
          "id": "",
          "title": "",
          "roleId": "",
          "roleName": "",
          "scoreTableId": "",
          "scoreTableName": "",
          "startDate": "",
          "endDate": "",
          "explains": "",
          "fileList": [
            {
              "fileId": "",
              "fileName": "",
              "fileType": ""
            }
          ]
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'appraising/project/get/' + this.operailityData.id,
          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
        this.showData = responseData.data;
        this.fileList = responseData.data.fileList;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'show');
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
<style>
  .showWrapper {
    height: 100%;
    padding: 20px;
    border: 1px solid #eee;
  }

  .feildFontweight {
    font-weight: bold;
  }
</style>
