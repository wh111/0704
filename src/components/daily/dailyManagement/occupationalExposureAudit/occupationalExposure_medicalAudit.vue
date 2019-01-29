<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" label-width="120px">

      <el-row>
        <el-col :span="20" :offset="2">
          <el-row class="lose-margin2">
            <el-col :span="10" :offset="2">
              <el-form-item label="姓名:" class="feildFontweight">
                {{showData.userName}}
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="科室:" class="feildFontweight">
                {{showData.depName}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item type="附件" label="第一次体检报告:" class="feildFontweight">
            <upload-file :uploadFiles="getFiles['HY']" :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item type="附件" label="第二次体检报告:" class="feildFontweight">
            <upload-file :uploadFiles="getFiles['FC']" :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="lose-margin2">
        <el-col :span="20" :offset="2">
          <el-form-item label="审核结果" label-width="70px">
            <el-radio-group v-model="formValidate.status">
              <el-radio label="TG">通过</el-radio>
              <el-radio label="BH">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="lose-margin2">
        <el-col :span="20" :offset="2">
          <el-form-item label="审核意见" prop="desc" label-width="70px">
            <el-input type="textarea" v-model="formValidate.opinion" :rows="6" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-row>
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
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
        //保存按钮基本信息
        loadBtn: {title: '通过', callParEvent: 'listenSubEvent'},
        countDate: 0,
        //form表单bind数据
        formValidate: {
          status: 'TG',
          opinion: '',
        },
        //查看数据
        showData: {},
        //获取的数据
        data: {occupationalExposureReport: []},
        tableData1: [],
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        medicalMessTitle: {
          type: 'medicalAudit',
          successTitle: '审核成功',
          errorTitle: '审核失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: 'occupationalExposure/report/modifyStatus/approval/' + this.operailityData.id,
            method: 'put',
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'occupationalExposure/report/get/' + this.operailityData.id,
          }
        },

        //化检报告
        getFiles: {
          'HY': [], //化验报告
          'FC': [], //复查报告
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
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.medicalMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.medicalMessTitle, isLoadingFun)
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
        this.data = responseData.data;
        let obj = {
          'HY': [],
          'FC': [],
        };
        let data = responseData.data.occupationalExposureReport || [];
        data.map(item => {   //item.reportType  'HY' or 'FC'
          item.fileList = item.fileList || [];
          obj[item.reportType] = obj[item.reportType].concat(item.fileList);
        });
        this.getFiles = obj;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'medicalAudit');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      getShowData() {
        let opt = {
          ajaxSuccess: res => this.showData = res.data,
          ajaxParams: {
            url: '/occupationalExposure/get/' + this.operailityData.id
          }
        }
        this.ajax(opt)
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.getShowData();
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
