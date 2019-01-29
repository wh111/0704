<!--档案管理修改-->
<!--教学经历-->

<template>
  <div >
    <el-form ref="formValidate" :model="formValidate"  class="demo-form-inline" label-width="130px" >
      <!--标题-->
      <el-row >
        <el-col :span="24" class="lose-margin2" style="text-align: center">
          <span class="table-headline ">教学经历</span>
        </el-col >
      </el-row >
      <!--内容-->
      <el-row class="teach-content">
        <el-col :span="24">

          <el-row class="table-back-one">
            <el-col :span="6" class="table-dividing">
              <el-form-item label="是否获得教学职称：" >
                <el-radio-group v-model="formValidate.hasTeachTitle">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="table-dividing">
              <el-form-item label="教学职称：" >
                <el-input style="width: 100%;" v-model="formValidate.teachTitle"  placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="table-dividing2">
              <el-form-item label="是否承担理论授课：" >
                <el-radio-group v-model="formValidate.hasTheoryTeach">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row >

          <el-row class="table-back-two">
            <el-col :span="6" class="table-dividing">
              <el-form-item label="是否临床带教：" >
                <el-radio-group v-model="formValidate.hasClinic">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="table-dividing">
              <el-form-item label="已毕业人数："  >
                实习生<el-input style="width:55px;" v-model="formValidate.graduatedTraineeNumber"  ></el-input>人
               ，住院医<el-input style="width: 55px;" v-model="formValidate.graduatedResidencyNumber"  ></el-input> 人
              </el-form-item>
            </el-col>
            <el-col :span="9" class="table-dividing2">
              <el-form-item label="在培人数：">
                实习生<el-input style="width: 55px;" v-model="formValidate.trainingTraineeNumber"  ></el-input>人
                ，住院医<el-input style="width: 55px;" v-model="formValidate.trainingResidencyNumber"  ></el-input> 人
              </el-form-item>
            </el-col>
          </el-row >

          <el-row class="table-back-one">
            <el-col :span="24" class="table-dividing2">
              <el-form-item label="授课内容：" >
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="formValidate.teachContent"  placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row >

          <el-row class="table-back-two">
            <el-col :span="6" class="table-dividing">
              <el-form-item label="是否获得导师资格：" >
                <el-radio-group v-model="formValidate.hasTeachQualified">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="table-dividing">
              <el-form-item label="是否院士：" prop="duties" >
                <el-radio-group v-model="formValidate.hasAcademician">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="table-dividing3">
              <el-form-item label="是否国务院学科评议组成员：" prop="duties">
                <el-radio-group v-model="formValidate.hasCouncilMember">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row >

          <el-row  class="table-back-two">
            <el-col :span="6" class="table-dividing">
              <el-form-item label="专业代码：" >
                <el-input style="width: 100%;" v-model="formValidate.specialtyCode"  placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="table-dividing">
              <el-form-item label="专业名称：" prop="duties" >
                <el-input style="width: 100%;" v-model="formValidate.specialtyName"  placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="table-dividing2">
              <el-form-item label="培养单位：" prop="duties" >
                <el-input style="width: 100%;" v-model="formValidate.trainCompany"  placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row >

          <el-row  class="table-back-two-d">
            <el-col :span="6" class="table-dividing">
              <el-form-item label="导师类别：" >
                <el-radio-group v-model="formValidate.tutorType">
                  <el-radio label="SD">硕导</el-radio>
                  <el-radio label="BD">博导</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="table-dividing">
              <el-form-item label="聘任时间：" prop="duties" >
                  <el-form-item prop="dutyDate">
                    <el-date-picker
                      v-model="formValidate.hiredDate"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%;"
                    >
                    </el-date-picker>
                  </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="table-dividing2">
              <el-form-item label="聘任学校：" prop="duties" >
                <el-input style="width: 100%;" v-model="formValidate.hiredSchool"  placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row >


            </el-col>
          </el-row >
        </el-col>
      </el-row>
    </el-form>

    <br />
    <el-row >
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="saveCurrData" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row >
  </div>
</template>
<style>
  .teach-content .table-back-one,
  .teach-content .table-back-one,
  .teach-content .table-back-two,
  .teach-content .table-back-two-d{
    padding: 0;
  }
  .teach-content .table-dividing,
  .teach-content .table-dividing2,
  .teach-content .table-dividing3{
    min-height: 55px;
    padding: 5px 5px;
  }
  .teach-content .table-dividing .el-form-item__label,
  .teach-content .table-dividing .el-form-item__content,
  .teach-content .table-dividing2 .el-form-item__label,
  .teach-content .table-dividing2 .el-form-item__content,
  .teach-content .table-dividing3 .el-form-item__content{
    padding: 0;
    line-height: 55px;
  }
  .teach-content .table-dividing3 .el-form-item__label{
    line-height: 16px;
  }

</style>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['dataId'],
    data (){
      return{

        //保存按钮基本信息
        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate:{
          "id":"",                         //数据Id
          "hasTeachTitle":"",              //是否获得教学职称
          "teachTitle":"",                 //教学职称
          "hasTheoryTeach":"",              // 是否承担理论授课
          "hasClinic":"",                   // 是否临床带教
          "graduatedTraineeNumber":"0",      // 已经毕业人数（实习生）
          "graduatedResidencyNumber":"0",     // 已经毕业人数（住院医）
          "trainingTraineeNumber":"0",         //在陪人数（实习生）
          "trainingResidencyNumber":"0",       //在陪人数（住院医）
          "teachContent":"",                  //授课内容
          "hasTeachQualified":"",             //是否获得导师资格
          "hasAcademician":"",                // 是否院士
          "hasCouncilMember":"",              // 是否国务院学科评议组成员
          "specialtyCode":"",                 //专业代码
          "specialtyName":"",                 //专业名称
          "trainCompany":"",                  //培养单位
          "tutorType":"",                     // 导师类别 硕导、博导
          "hiredDate":"",                     // 聘任时间
          "hiredSchool":"",                   // 聘任学校
          "archivesId":this.dataId                     //档案ID
        },
//当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'add',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/modify/teach/'+this.dataId,
            method:'post',
            data:{}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/archives/get/teach/'+this.dataId
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      //初始化
      this.init();
    },
    mounted(){

    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.initMessTitle);
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      saveCurrData(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle, isLoadingFun)
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
        let data = responseData.data;
        let isObject = this.valDataType(data, "Object");
        if(isObject){
          this.formValidate = data;
        }
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        myData = this.formDate(myData,['hiredDate'],this.yearMonthData);
        return myData;
      },

    }
  }
</script>


