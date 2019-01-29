<template>
  <div>

    <el-row>
      <el-col :span="24"  style="font-size: 20px;margin: 10px;text-align: center;">
        <strong>{{ hospitalName }}职业暴露登记表</strong>
      </el-col>
    </el-row>

    <el-form :model="formValidate" :rules="rules" ref="formValidate" class="demo-form-inline" label-width="90px">
      <el-row class="lose-margin2">
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <el-row>
              <el-col :span="9" :offset="2">
                <el-form-item label="姓名:" style="width: 283px;">
                  {{this.operailityData.applicantName}}
                  <!--<el-input v-model="formValidate.userName" placeholder="请输入"></el-input>-->
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="科室:" prop="depId" style="width: 283px;">
                  <el-select filterable v-model="formValidate.depId" placeholder="请选择">
                    <el-option  v-for="item in optionData" :key="item.id" :label="item.label" :value="item.depId"></el-option>
                    <!--<select-option ></select-option>-->
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
           <viewUEditor style="width: 100%"  :name="'ud1'" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
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
            <upload-file @setUploadFiles="addFileEvent"></upload-file>
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
          userId: this.operailityData.applicantId, //人员ID
          userName: this.operailityData.applicantName, //人员名称
          depId: '', //科室ID
          depName: '', //科室名称
          occurrenceTime: '', //发生时间（格式yyyy-MM-dd）
          exposureLevel: '1', //暴露级别
          exposureDetails: '', //暴露详情
          isInfected: '0', //结果
          status: 'WSB', //审批状态
          fileIds: '', //附件Id字符串
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: 'occupationalExposure/add',
            jsonString:true,
            method: 'post'
          }
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'',  //向后台请求数据的地址
          }
        },

        optionData:[], //科室数据
        optionObj:{}, //科室数据对象集合
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
      let userInfo = this.$store.getters.getUserInfo;
      let userType = userInfo.studentTypes;
      this.listMessTitle.ajaxParams.url = '/traineeRotary/arrangeRotary/userRotaryDeptlistTreeData/' + userType + '-' + userInfo.id;
      this.ajax(this.listMessTitle);
    },
    mounted() {
      //暂时没有初始化,预留初始化入口
      //this.init();
    },
    methods: {
      updateListData(res) {
        let data = res.data;
        if (!data) return;
        data  = this.getQTBObj(res.data);
        for(let i=0;i<data.length;i++){
          let item = data[i];
          if(item.arrangeDepState=='P'){
            data.splice(i,1);
            i--;
          }else {
            if(item.podState==99){
              this.formValidate.podId = item.podId; //给depid绑定podId 因为poied唯一
            }
          }
        }
        this.optionData =data;
      },

      // 处理科室数据结构（三级以下）
      getQTBObj(arr,res,depth=-1){
        depth++;
        let t = res || [];
        if(arr && arr.length) {
          arr.map(item => {
            item.label='　'.repeat(depth)+item.depName+'('+(item.beginTime||'')+')';
            t.push(item);
            if (item.childList){
              return t.concat(this.getQTBObj(item.childList,t,depth))
            }
          })
        }
        return t
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.formValidate.exposureDetails = this.ueditorVal.ud1;
          let that = this;
          this.optionData.map(item =>{
            if(item.depId == that.formValidate.depId){
              that.formValidate.depName = item.depName;
            }
          });//通过depId找depName
          this.addMessTitle.ajaxParams.data = this.formDate(this.getFormData(this.formValidate), ['occurrenceTime'], this.yearMonthData);
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


      // //通过get请求列表数据
      // updateListData(responseData){
      //   let data = responseData.data;
      //   let optionObj ={};
      //   data.map(item=>{
      //     optionObj[item.id] = item;
      //   })
      //   this.optionData = data;
      //   this.optionObj = optionObj;
      // },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
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

      //添加上传附件
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
    components:{
      viewUEditor
    }
  }

</script>
