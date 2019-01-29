<!----------------------------------
****--出科设置(givenSet_list)
****--@date     2017/9/2
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <div class="cal-schoolTit"><strong>及格分数设置：</strong></div>

    <div v-for="item in 1">
      <el-row :gutter="10">
        <el-col style="width:160px;">
          <div class="cal-schoolTit" style="text-align: right;">理论成绩：</div>
        </el-col>
        <el-col :span="4">
          <el-form :model="examPassMark" ref="f" label-width="0" :rules="rules">
            <el-form-item prop="configValue">
              <el-input style="width: 95%" v-model.trim="examPassMark.configValue" placeholder="必填项-只能填写数字"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <div class="cal-schoolTit" style="text-align: left;">及格</div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col style="width:160px;">
          <div class="cal-schoolTit" style="text-align: right;">技能成绩：</div>
        </el-col>
        <el-col :span="4">
          <el-form :model="skillPassMark" ref="f" label-width="0" :rules="rules">
            <el-form-item prop="configValue">
              <el-input style="width: 95%" v-model.trim="skillPassMark.configValue" placeholder="必填项-只能填写数字"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <div class="cal-schoolTit" style="text-align: left;">及格</div>
        </el-col>
      </el-row>
    </div>
    <!--<el-row :gutter="10">
      <el-col style="width:160px;">
        <div class="cal-schoolTit" style="text-align: right;">日常考核成绩：</div>
      </el-col>
      <el-col :span="4">
        <el-form-item prop="configValue" required>
          <el-input style="width: 95%" v-model.trim="formValidate.configValue" placeholder="必填项-只能填写数字"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <div class="cal-schoolTit" style="text-align: left;">及格</div>
      </el-col>
    </el-row>-->
    <br />
    <div class="cal-schoolTit"><strong>综合成绩占比设置：</strong></div>
    <el-row :gutter="10">
      <el-col style="width:160px;">
        <div class="cal-schoolTit" style="text-align: right;">理论：</div>
      </el-col>
      <el-col :span="8">
        <div class="cal-schoolTit">
          <el-input-number v-model="num1" :min="0" :max="100"></el-input-number>%
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col style="width:160px;">
        <div class="cal-schoolTit" style="text-align: right;">技能：</div>
      </el-col>
      <el-col :span="8">
        <div class="cal-schoolTit"><el-input-number v-model="num2" :min="0" :max="100"></el-input-number>%</div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col style="width:160px;">
        <div class="cal-schoolTit" style="text-align: right;">日常：</div>
      </el-col>
      <el-col :span="8">
        <div class="cal-schoolTit"><el-input-number v-model="num3" :min="0" :max="100"></el-input-number>%</div>
      </el-col>
    </el-row>

    <br />
    <el-row :gutter="10">
      <el-col style="width:120px;">
        <div class="cal-schoolTit" style="text-align: right;">&nbsp;</div>
      </el-col>
      <el-col :span="4">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js";

  import {
    givenSet as rules
  } from '../../rules'; // 表单验证
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:{
      userType:{  //人员类型
        type: String,
        default: "ZYY",
      }
    },
    data() {
      return {
        //bind表单数据
        rules,
        formValidate:{
          configValue:"",
        },

        //理论成绩
        examPassMark:{
          configValue:""
        },

        //技能成绩
        skillPassMark:{
          configValue:""
        },

        //综合比例
        markRatio:{
          configValue:""
        },

        num1: 1,
        num2: 1,
        num3: 1,

        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},


        //获取理论成绩
        getPassMarkTitle:{
          ajaxSuccess:'getPassMarkData',
          ajaxParams:{
            url: api.theoryExamPassMark.path+this.userType,
          }
        },

        //获取技能成绩
        getSkillPassMarkTitle:{
          ajaxSuccess:'getSkillPassMarkData',
          ajaxParams:{
            url: api.skillExamPassMark.path+this.userType,
          }
        },

        //获取出科综合成绩比例 {1,2,3}
        getMarkRatioTitle:{
          ajaxSuccess:'getMarkRatioData',
          ajaxParams:{
            url: api.rotaryGivenDdepMarkRatio.path+this.userType,
          }
        },

        //修改出科设置
        saveHargingStandard:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'saveSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.modifyConfigId.path,
            method: api.modifyConfigId.method,
          },
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.getPassMarkTitle);
        this.ajax(this.getSkillPassMarkTitle);
        this.ajax(this.getMarkRatioTitle);
      },

      //服务端回调-理论成绩
      getPassMarkData(responseData){
        let data = responseData.data;
        this.examPassMark = data;
      },

      //服务端回调-技能成绩
      getSkillPassMarkData(responseData){
        let data = responseData.data;
        this.skillPassMark = data;
      },

      //服务端回调-理论成绩
      getMarkRatioData(responseData){
        let data = responseData.data;
        let splitMark = data.configValue.split(",");
        this.markRatio = data;
        this.num1 = splitMark[0];
        this.num2 = splitMark[1];
        this.num3 = splitMark[2];
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        if(!this.sumRatio()){
          this.showMess("成绩比例之和必须为100!");
          return;
        }
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {

          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);

          //理论成绩
          let setPassMark = Util._.defaultsDeep({},this.saveHargingStandard)
          setPassMark.ajaxParams.url += this.examPassMark.configId;
          setPassMark.ajaxParams.data = this.getFormData(this.examPassMark);
          this.ajax(setPassMark, isLoadingFun);

          //技能成绩
          let setSkillPassMark = Util._.defaultsDeep({},this.saveHargingStandard)
          setSkillPassMark.ajaxParams.url += this.skillPassMark.configId;
          setSkillPassMark.ajaxParams.data = this.getFormData(this.skillPassMark);
          this.ajax(setSkillPassMark, isLoadingFun);

          //获取出科综合成绩比例
          let setMarkRatio = Util._.defaultsDeep({},this.saveHargingStandard)
          setMarkRatio.ajaxParams.url += this.markRatio.configId;
          this.markRatio.configValue = this.num1+","+this.num2+","+this.num3;
          setMarkRatio.ajaxParams.data = this.getFormData(this.markRatio);
          this.ajax(setMarkRatio, isLoadingFun);

        }
      },

      //计算比例之和是否等于100
      sumRatio(){
        return this.num1+this.num2+this.num3 == 100;
      },

      //保存成功
      saveSuccess(){
        this.successMess("保存成功!");
      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = true;
        Util._.forEach(this.$refs.f, (item,k)=> {
          if(typeof this.$refs.f[k]!="undefined"){
            this.$refs.f[k].validate((valid) => {
              if (!valid) {
                flag= false;
              }
            });
          }
        })
        return flag;
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },
    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
