<template>

  <div>

    <el-row>
      <el-col :span="10" :offset="10" class="lose-margin2">
        {{ hospitalName }}职业暴露登记表
      </el-col>
    </el-row>

    <el-form ref="formValidate" class="demo-form-inline" label-width="90px">
      <el-row class="lose-margin2 feildFontweight">
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <el-row class="lose-margin2">
              <el-col :span="10" :offset="2">
                <p><span class="name">姓名：</span><span>{{data.userName}}</span></p>
              </el-col>
              <el-col :span="10">
                <p><span class="name">科室：</span><span>{{data.depName}}</span></p>
              </el-col>
            </el-row>
            <el-row class="lose-margin2">
              <el-col :span="10" :offset="2">
                <p><span class="name">发生时间：</span><span>{{data.occurrenceTime}}</span></p>
              </el-col>
            </el-row>

          </fieldset>
        </el-col>
      </el-row>
      <!--富文本-->
      <el-row class="lose-margin2">
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <legend>暴露详情</legend>
            <viewUEditor style="width: 100%" :name="'ud1'" v-if="isGetSuccess" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
                         :ueditor-val="ueditorVal"
                         :ueditor-config="ueditorConfig"></viewUEditor>
          </fieldset>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item  label="暴露级别:" class="feildFontweight">
            {{data.exposureLevel}}级
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item  label="结果:" class="feildFontweight">
            {{!!data.isInfected?'暴露后感染病毒':' 暴露后未感染病毒'}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item type="附件" label="附件:" class="feildFontweight">
            <upload-file :uploadFiles="data.fileList" :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="审核结果:" class="feildFontweight">
            <el-radio-group v-model="formValidate.status">
              <el-radio label="TG">通过</el-radio>
              <el-radio label="BTG">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="20" :offset="2" >
          <el-form-item label="审核意见:" class="feildFontweight">
            <el-input type="textarea" v-model="formValidate.opinion" :rows="6" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-row>
      <el-col :span="24" style="text-align: center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"> </load-btn>
          <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  import viewUEditor from '../../../common/showUeditor.vue';

  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        hospitalName: this.$store.state.envPath.hospitalName,
        //保存按钮基本信息
        loadBtn: {
          title: '确定',
          callParEvent: 'listenSubEvent'
        },
        countDate: 0,
        //form表单bind数据
        formValidate: {
          status: 'TG',
          opinion: ''
        },
        data: {
          "id": '', //职业暴露Id
          "userId": "", //用户Id
          "userName": "", //用户姓名
          "depId": "", //科室Id
          "depName": "", //科室名称
          "occurrenceTime": "", //发生时间
          "exposureLevel": "", //暴露级别
          "exposureDetails": "", //暴露详情
          "isInfected": "", //结果
          "status": "", //职业暴露状态
          "opinion": "", //审批意见
          "fileList": []///附件列表
        },

        isGetSuccess:false,
        //富文本编译器
        UE: {},
        ueditorVal: {
          ud1: "",
        },  //
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          initialFrameHeight: 220  //初始化编辑器高度,默认320
        },

        tableData1: [],
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        auditMessTitle: {
          type: 'audit',
          successTitle: '审核成功',
          errorTitle: '审核失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: '/occupationalExposure/modifyStatus/approval/' + this.operailityData.id,
            method: 'put',
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: '/occupationalExposure/get/' + this.operailityData.id,
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
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {

        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.auditMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.auditMessTitle, isLoadingFun)
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
        this.ueditorVal.ud1 = responseData.data.exposureDetails ;
        this.isGetSuccess = true;
        this.data = responseData.data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'audit');
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

      //转换暴露状态
      converterStatus(status) {
        switch (status) {
          case 'WSB':
            status = '未上报';
            break;
          case 'DSH':
            status = '审核中(待审)';
            break;
          case 'TG':
            status = '通过';
            break;
          case 'BTG':
            status = '不通过';
            break;
          case 'BH':
            status = '驳回修改';
            break;
          case 'reportwsb':
            status = '化验报告未上报';
            break;
          case 'reportdsh':
            status = '化验报告待审核';
            break;
          case 'reportbh':
            status = '化验报告驳回';
            break;
          case 'reporttg':
            status = '化验报告通过';
            break;
          case 'reimbursementwsb':
            status = '报销申请未上报';
            break;
          case 'reimbursementdsh':
            status = '报销申请待审核';
            break;
          case 'reimbursementbh':
            status = '报销申请被驳回';
            break;
          case 'reimbursementtg':
            status = '报销申请被驳回';
            break;
        }
        return status;
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
        editor.setDisabled()
      },

      setMyVal(name, v) {
        this.UE[name].setContent(v);
      }
    },

    components:{
      viewUEditor,
    }
  }

</script>
