<template>
  <div>
    <el-row class="lose-margin2">
      <el-col align="center">
        <h3>评优自荐</h3>
      </el-col>
    </el-row>
    <el-form ref="formValidate" class="demo-form-inline" label-width="110px">
      <!--富文本-->
      <el-row class="lose-margin2">
        <el-col>
          <viewUEditor style="width: 100%" :name="'ud1'" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
                       :ueditor-val="ueditorVal"
                       :ueditor-config="ueditorConfig"></viewUEditor>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="相关证明材料：" prop="name" class="feildFontweight">
            <upload-file @setUploadFiles="addFileEvent"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="saveBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  import viewUEditor from '../../../../common/showUeditor.vue';

  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        //富文本编译器
        UE: {},
        ueditorVal: {
          ud1: "",
        },  //
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          initialFrameHeight: 220  //初始化编辑器高度,默认320
        },


        //保存按钮基本信息
        saveBtn: {title: '保存', callParEvent: 'listenSubEvent'},

        //form表单bind数据
        formValidate: {
          appraisingId: this.operailityData.id, //评优项目id
          userId: '',       //自荐人id
          reason: '',       //自荐理由
          fileIds: '',       //附件id字符串
          examineStatus: 'WSB',  //审核状态
        },

        //列表返回的数据
        "data": {
          "id": "",
          "userId": "",
          "userName": "",
          "reason": "",
          "declare_date": "",
          "opinion": "",
          "examineStatus": "",
          "fileList": [
//            {
//              "fileId":"",
//              "fileName":"",
//              "fileType":""
//            }
          ]
        },

        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '保存成功',
          errorTitle: '保存失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: 'appraising/sellOneself/add',
            method: 'post',
            jsonString:true,
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'appraising/sellOneself/get/' + this.operailityData.sellOneselfId,
          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      let userInfo = this.$store.getters.getUserInfo;
      this.formValidate.userId = userInfo.id;
      Util = this.$util;
    },
    mounted() {
      //初始化

//        this.init();
    },
    methods: {
      /*  确定
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          this.formValidate.reason = this.ueditorVal.ud1;
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.addMessTitle.ajaxParams.data.examineStatus = 'WSB';
          isLoadingFun(true);
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


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
        this.formValidate = this.getFormValidate(this.formValidate, responseData.data);

      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'add');
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
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },

      //上传附件
      addFileEvent(ids) {
        this.formValidate.fileIds = ids;
      },


      /**
       *
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       *
       * @param val  {string}  编辑器的内容
       *
       */
      getUeditorVal(name, val) {
        this.ueditorVal[name] = val;
      },

      /**
       *
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       *
       * @param editor {}      编辑器的对象
       *
       */
      storeUE(name, editor) {
        this.UE[name] = editor;
      },

      setMyVal(name, v) {
        this.UE[name].setContent(v);
      }

    },
    components: {viewUEditor},
  }
</script>
