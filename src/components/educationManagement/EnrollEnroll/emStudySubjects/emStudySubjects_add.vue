<!----------------------------------
****--科目管理-新建(emStudySubjects_add)
****--@date     2017/9/18
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="100px" >

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="进修科目名" prop="courseName" >
            <el-input v-model="formValidate.courseName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="主办单位" prop="organizer" >
            <el-input v-model="formValidate.organizer" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9" >
          <el-form-item label="招收人数" prop="enrolmentNumbers" >
            <el-input v-model="formValidate.enrolmentNumbers" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="学习期限" prop="learningPeriod" >
            <el-input v-model="formValidate.learningPeriod" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9" >
          <el-form-item label="开学时间" prop="schoolTime" >
            <el-date-picker
              v-model="formValidate.schoolTime"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime"
            >
            </el-date-picker>
            <!--<el-input v-model="formValidate.schoolTime" placeholder="请输入"></el-input>-->
          </el-form-item>
        </el-col>
      </el-row >

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="招生条件" prop="conditionsEnrolment" >
            <el-input type="textarea" v-model="formValidate.conditionsEnrolment" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="进修安排" prop="furtherArrangement">
            <el-input type="textarea" v-model="formValidate.furtherArrangement" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row>
        <el-col :span="19" :offset="1">
          <div class="el-form">
            <el-form-item label=" " prop="depNames">
              <fieldset>
                <legend style="font-size:16px">
                  添加科室
                  <el-button  type="primary" size="mini" @click="addDep" icon="plus"></el-button>&nbsp;&nbsp;
                </legend>

                <span v-for="(item,index) in formValidate.depNames" class="userName"><em class="nameText">{{item.depName}}</em><el-button type="danger" @click="removeDep(index)" size="mini" icon="close"></el-button></span>

              </fieldset>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="备注" prop="note" >
            <el-input type="textarea" v-model="formValidate.note" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>
    <el-row class="but-space">
      <el-col :span="9" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
    <!--添加科室-->
    <Modal
      :mask-closable="false"
      v-model="setDepModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="700">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="addDepId"></modal-header>
      <add-dep v-if="setDepModal"  @cancel="cancelSetDep" @filterAddDepData="filterAddDepData" :operaility-data="operailityData"></add-dep>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
/*当前组件必要引入*/
import api from "./api.js";
import {subject as rules} from "../../rules.js";
import addDep from "./selectDep.vue";
//当前组件引入全局的util
let Util = null;
export default{
  data() {
    return {
      rules,
      //保存按钮基本信息
      loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

      //添加科室
      addDepId:{
        id:'add',
        title:'添加科室'},
      setDepModal:false,

      //form表单bind数据
      formValidate: {
        courseName:"",
        organizer:"",
        enrolmentNumbers:"",
        learningPeriod:"",
        schoolTime:"",
        conditionsEnrolment:"",
        furtherArrangement:"",
        depIds:"",
        depNames:[],
        note:"",
      },

      //当前组件提交(add)数据时,ajax处理的 基础信息设置
      addMessTitle:{
        type:'add',
        successTitle:'添加成功!',
        errorTitle:'添加失败!',
        ajaxSuccess:'ajaxSuccess',
        ajaxError:'ajaxError',
        ajaxParams:{
          url: api.subAdd.path,
          method: api.subAdd.method,
          jsonString:true
        }
      },
    }
  },
  methods: {
    /*
     * 组件初始化入口
     * */
    init(){
      //默认请求加载数据
      //this.ajax(this.addMessTitle);
    },



    /**
     * 添加组列表---filter添加的数据
     */
    filterAddDepData(data){
      this.formValidate.depNames = data;
    },


    //添加科室
    addDep(){
      this.operailityData = this.formValidate.depNames;
      this.openModel('setDep');
    },


    /**
     * 删除已添加的科室
     * @param index {Number}  当前要删除的科室对应的数组索引
     * */
    removeDep(index){
      this.formValidate.depNames.splice(index,1);
    },


    /*
     * 点击提交按钮 监听是否提交数据
     * @param isLoadingFun boolean  form表单验证是否通过
     * */
    listenSubEvent(isLoadingFun){
      let isSubmit = this.submitForm("formValidate");
      if(isSubmit) {
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true)
        this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        //console.log(this.addMessTitle.ajaxParams.data);
        //return;
        this.ajax(this.addMessTitle, isLoadingFun)
      }
    },


    /*
     * 点击提交按钮 监听是否验证通过
     * @param formName string  form表单v-model数据对象名称
     * @return flag boolean   form表单验证是否通过
     * */
    submitForm(formName){
      let flag = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          flag= true;
        }
      });
      return flag;
    },


    /*
     * 默认组件第一次请求数据
     * @param res JSON  数据请求成功后返回的数据
     * */
    SuccessGetCurrData(responseData){
      let type = [];
      let data = responseData.data;
      type.push(data.type+"");
      this.formValidate = data;
      this.formValidate.type = type;
    },


    /*
     * 当前组件发送事件给父组件
     * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
     * */
    cancel(){
      this.$emit('cancel','add');
    },

    handleStartTime(val){
      this.formValidate.schoolTime = val;
    },
    /*
     * 打开指定的模态窗体
     * @param options string 当前指定的模态:"add"、"edit"
     * */
    cancelSetDep(options){
      this[options+'Modal'] = false;
    },


    /*
     * 打开指定的模态窗体
     * @param options string 当前指定的模态:"add"、"edit"
     * */
    openModel(options){
      this[options+'Modal'] = true;
    },


    /*
     * 获取表单数据
     * @return string  格式:id=0&name=aa
     * */
    getFormData(data){
      let myData = Util._.defaultsDeep({},data);
      let depIdsArr = [],depNamesArr=[];
      for(var i=0,item;i<myData["depNames"].length;i++){
        item = myData["depNames"][i];
        depIdsArr.push(item["depId"]);
        depNamesArr.push(item["depName"]);
      }
      myData["depIds"] = depIdsArr.join(",");
      myData["depNames"] = depNamesArr.join(",");
      return myData;
    },

  },
  created(){
    Util = this.$util;
    this.init();
  },
  mounted(){
  },
  components: {
    addDep
  }
}
</script>
