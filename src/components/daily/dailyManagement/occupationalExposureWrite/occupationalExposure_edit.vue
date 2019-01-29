<template>
  <div>

    <el-row>
      <el-col :span="10" :offset="10">
        {{ hospitalName }}职业暴露登记表
      </el-col>
    </el-row>


    <el-form :model="formValidate" :rules="rules" ref="formValidate" class="demo-form-inline" label-width="90px">
      <el-row class="lose-margin2">
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <el-row>
              <el-col :span="9" :offset="2">
                <el-form-item label="姓名" prop="name" style="width: 283px;">
                  {{formValidate.userName}}
                  <!--<el-input v-model="formValidate.userName" placeholder="请输入"></el-input>-->
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="科室" prop="depId" style="width: 283px;">
                  <el-select filterable v-model="formValidate.depId" placeholder="请选择">
                    <el-option
                      v-for="item in optionData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="2">
                <el-form-item label="发生时间" prop="occurrenceTime">
                  <el-date-picker v-model="formValidate.occurrenceTime" :clearable="false" type="date" :editable="false" placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>

              </el-col>
            </el-row>

          </fieldset>
        </el-col>
      </el-row>

      <el-row class="lose-margin2" >
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <legend>暴露详情</legend>
          <viewUEditor style="width: 100%" :name="'ud1'" v-if="isGetSuccess" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
                       :ueditor-val="ueditorVal"
                       :ueditor-config="ueditorConfig"></viewUEditor>
          </fieldset>
        </el-col>
      </el-row>

      <el-row class="lose-margin2">
        <el-col :span="20" :offset="2">
          <el-form-item label="暴露级别:" prop="name">
            <el-radio-group v-model="formValidate.exposureLevel">
              <el-radio label="1">1级</el-radio>
              <el-radio label="2">2级</el-radio>
              <el-radio label="3">3级</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="lose-margin2">
        <el-col :span="20" :offset="2">
          <el-form-item label="结果:" prop="name">
            <el-radio-group v-model="formValidate.isInfected">
              <el-radio label="0">暴露后未感染病毒</el-radio>
              <el-radio label="1">暴露后感染病毒</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item type="附件" label="相关证明材料:" class="feildFontweight">
            <upload-file :uploadFiles="formValidate.fileList" @setUploadFiles="editFileEvent"></upload-file>
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
  import {occupationalExposure as rules} from '../rules'

  import viewUEditor from '../../../common/showUeditor.vue';

  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      let userInfo = this.$store.getters.getUserInfo;
      return {
        rules,
        hospitalName: this.$store.state.envPath.hospitalName,
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        countDate: 0,
        //form表单bind数据
        formValidate: {
          id: '', //职业暴露Id
          userId: '', //人员ID
          userName: '', //人员名称
          depId: '', //科室ID
          depName: '', //科室名称
          occurrenceTime: '', //发生时间（格式yyyy-MM-dd）
          exposureLevel: '', //暴露级别
          exposureDetails: '', //暴露详情
          isInfected: '', //结果
          status: '', //审批状态
          fileIds: '', //附件Id字符串
          fileList: '',
        },
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功',
          errorTitle: '修改失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            jsonString:true,
            url: 'occupationalExposure/modify/' + this.operailityData.id,
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
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        depMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'/hospital/dept/query/byUserType/',  //向后台请求数据的地址
            params:{
              userId:userInfo.id,
            },
          }
        },
        optionData:[], //科室数据
        optionObj:{}, //科室数据对象集合
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
          this.formValidate.exposureDetails = this.ueditorVal.ud1;
          this.formValidate.depName = this.optionObj[this.formValidate.depId].name || this.formValidate.depName ;  //通过depId找depName
          this.editMessTitle.ajaxParams.data = this.formDate(this.getFormData(this.formValidate), ['occurrenceTime'], this.yearMonthData);
          this.ajax(this.editMessTitle, isLoadingFun)
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
        responseData.data.exposureLevel = responseData.data.exposureLevel+'';
        responseData.data.isInfected = responseData.data.isInfected+'';
        this.formValidate = this.getFormValidate(this.formValidate, responseData.data);

      },

      //通过get请求列表数据  科室数据
      updateListData(responseData){
        let data = responseData.data;
        let optionObj ={};
        data.map(item=>{
          optionObj[item.id] = item;
        })
        this.optionData = data;
        this.optionObj = optionObj;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'edit');
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
        this.ajax(this.depMessTitle);
        this.getFormValidate(null, this.formValidate)
      },



      //修改附件id
      editFileEvent(ids) {
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
    components:{
      viewUEditor,
    }
  }

</script>
