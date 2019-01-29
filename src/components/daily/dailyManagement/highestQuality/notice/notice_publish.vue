<template>

  <div>
    <el-form ref="formValidate" class="demo-form-inline" label-width="90px">
      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="标题:" prop="title" class="feildFontweight">
            <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="内容" prop="content">
            <el-input v-model="formValidate.content" type="textarea" :rows="5" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item type="附件" label="相关证明材料:" class="feildFontweight">
            <upload-file @setUploadFiles="publishFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="获选人:" prop="name" class="feildFontweight">
            <p class="user-name">
              <span v-for="(item,index) in operailityData"> &nbsp; {{item.userName}}</span>
            </p>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <el-row>
      <el-col align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  let Util = null;
  import api from './api';

  export default {
    props: ['operailityData'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn: {
          title: '确定',
          callParEvent: 'listenSubEvent'
        },
        countDate: 0,
        //form表单bind数据
        formValidate: {
          title: '', //标题
          content: '', //内容
          fileIds: '', //附件id字符串
          sellOneselfIds: [] //自荐id字符串
        },
        columnModal: false,
        columnId: {
          title: '提交',
          callParEvent: 'searchEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        publishMessTitle: {
          type: 'publish',
          successTitle: '发布成功!',
          errorTitle: '发布失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method
          }
        },
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //暂时没有初始化,预留初始化入口
      //this.init();
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.publishMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.publishMessTitle.ajaxParams.data.sellOneselfIds = this.sellOneselfIdIds(this.operailityData)
          this.ajax(this.publishMessTitle, isLoadingFun)
        }
      },


      sellOneselfIdIds(data) {
        let sellOneselfIdIds = [];
        for (var i = 0; i < data.length; i++) {
          sellOneselfIdIds.push(data[i].id);
        }
        return sellOneselfIdIds.join(',');
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
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * 注:当前为添加页面暂时未用到,属于预留
       * */
      oneDataSuccess(res) {
        /*let responseData = res.data;
         if(this.$util._.isObject(responseData["status"])&&responseData["status"]["code"]==0) {
         let type = [];
         let data = responseData.data;
         type.push(data.type+"");
         this.formValidate = data;
         this.formValidate.type = type;
         }*/
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'publish');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //this.ajax(this.listMessTitle)
      },

      columnCallback() {

      },
      subCancel() {
        this.columnModal = false;
      },
      //获取文件来拼接 文件id字符串
      publishFileEvent(ids) {
        this.formValidate.fileIds = ids;
      },
    },
  }

</script>

