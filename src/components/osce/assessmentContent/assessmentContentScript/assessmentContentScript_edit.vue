<template>
  <!-- 增加剧本 -->
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="94px">
      <el-row>

        <el-col :span="8" :offset="8" align="center">
          <el-form-item label="剧本名称：" prop="scriptName" required>
            <el-input v-model.trim="formValidate.scriptName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="上传剧本：">
            <upload-file @setUploadFiles="setUploadFiles" :uploadFiles="filelist" :url="urlParams.save.path"></upload-file>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="剧本简介：" prop="scriptContent">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :maxlength="500" placeholder="请输入内容" v-model="formValidate.scriptContent"></el-input>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="病情要点：" prop="illnessPoints">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :maxlength="500" placeholder="请输入内容" v-model="formValidate.illnessPoints"></el-input>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="表演要点：" prop="performPoints">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :maxlength="500" placeholder="请输入内容" v-model="formValidate.performPoints"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" :offset="6" align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <el-col :span="6" align="center">
          <el-button @click="cancel">取消</el-button>
        </el-col>

      </el-row>
    </el-form>

  </div>
</template>

<script>
  import uploadFile from '../../../common/uploadFile'; // 上传
  import {
    assessmentContentScript as rules
  } from '../../rules';
  export default {
    props: {
      urlParams: { // api对象
        type: Object,
        required: true
      },
      todoId: {
        type: Object,
        default: () => ({
          id: 0, // 当前编辑id
          treeId: 0,
          treeRoad: ''
        })
      }
    },
    data() {
      return {
        rules,
        formValidate: {
          // fileIds: '', // 附件Id
          scriptName: '',
          scriptContent: '',
          illnessPoints: '',
          performPoints: ''
        },
        staticPath: '', // 静态资源
        filelist: [], // 上传附件列表
        //保存按钮基本信息
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'scriptsEdit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxError: 'ajaxError',
          ajaxSuccess: 'editScriptSuccess',
          ajaxParams: {
            // jsonString: true,
            url: this.urlParams.modify.path + '/' + this.todoId.id,
            method: this.urlParams.modify.method
          }
        },
      }
    },
    methods: {
      /************************************* 提交处理 ********************************************/
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.$util.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /**
       * 剧本增加成功之后需要更新父级组件的剧本信息
       * */
      editScriptSuccess() {
        this.$emit('upDataScript', this.formValidate.scriptName); // 返回名称
      },
      /***************************************** 上传附件回调 ***********************************************/
      setUploadFiles(ids) {
        this.formValidate.fileIds = ids;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
      },
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: `${this.urlParams.get.path}/${this.todoId.id}`,
            method: this.urlParams.get.method
          }
        })
      },
      getDataSuccess(res) {
        this.formValidate = res.data; // 初始化编辑数据
        this.filelist = [];

        for (let i = 0, list = res.data.fileList, l = list.length; i < l; i++) {
          this.filelist.push({
            fileId: list[i].id,
            fileName: list[i].oldName,
            filePath: list[i].path + list[i].name
          })
        }
      },
      /*
       * 组件初始化入口
       * */
      init() {
        // 获取编辑数据
        this.getDataForServer();
      },
    },
    components: {
      uploadFile
    },
    created() {
      this.staticPath = this.$store.getters.getEnvPath.http;
      this.init()
    }
  }

</script>
