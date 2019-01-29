<template>
  <!-- 教学经历 -->
  <el-form ref="formValidate" :model="formValidate" :rules="rules" class="demo-form-inline" label-width="130px" >
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
            <el-form-item label="是否获得教学职称：" prop="hasTeachTitle">
              <el-radio-group v-model="formValidate.hasTeachTitle">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing">
            <el-form-item label="教学职称：" prop="teachTitle">
              <el-select v-model="formValidate.teachTitle" filterable placeholder="请选择">
                <selectOption type="getByCode" unAll="true" isCode="true" id="value"
                              codeType="JOB_TITLE"></selectOption>
              </el-select>
              <!--<el-input style="width: 100%;" v-model="formValidate.teachTitle"  placeholder="请输入内容"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing2">
            <el-form-item label="是否承担理论授课：" prop="hasTheoryTeach">
              <el-radio-group v-model="formValidate.hasTheoryTeach">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-two">
          <el-col :span="6" class="table-dividing">
            <el-form-item label="是否临床带教：" prop="hasClinic">
              <el-radio-group v-model="formValidate.hasClinic">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing">
            <el-form-item labelWidth="90px" label="已毕业人数：" style="display: inline-block;" prop="graduatedTraineeNumber">
              实习生<el-input style="width:70px;" v-model="formValidate.graduatedTraineeNumber"></el-input>人，
            </el-form-item>
            <el-form-item labelWidth="0px" style="display: inline-block;" prop="graduatedResidencyNumber">
              住院医<el-input style="width: 70px;" v-model="formValidate.graduatedResidencyNumber"></el-input> 人
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing2">
            <el-form-item labelWidth="80px" label="在培人数：" style="display: inline-block;" prop="trainingTraineeNumber">
              实习生<el-input style="width: 70px;" v-model="formValidate.trainingTraineeNumber"  ></el-input>人，
            </el-form-item>
            <el-form-item labelWidth="0px" style="display: inline-block;" prop="trainingResidencyNumber">
              住院医<el-input style="width: 70px;" v-model="formValidate.trainingResidencyNumber"  ></el-input> 人
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-one">
          <el-col :span="24" class="table-dividing2">
            <el-form-item label="授课内容：" prop="teachContent">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="formValidate.teachContent"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-one">
          <el-col :span="24" class="table-dividing2">
            <el-form-item label="担任导师：" prop="serveTutor">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="formValidate.serveTutor"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-one">
          <el-col :span="24" class="table-dividing2">
            <el-form-item label="主要研究方向：" prop="teachContent">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="formValidate.researchDirection"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-two">
          <el-col :span="6" class="table-dividing">
            <el-form-item label="是否获得导师资格：" prop="hasTeachQualified">
              <el-radio-group v-model="formValidate.hasTeachQualified">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing">
            <el-form-item label="是否院士：" prop="hasAcademician" >
              <el-radio-group v-model="formValidate.hasAcademician">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing3">
            <el-form-item label="是否国务院学科评议组成员：" prop="hasCouncilMember">
              <el-radio-group v-model="formValidate.hasCouncilMember">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row  class="table-back-two">
          <el-col :span="6" class="table-dividing">
            <el-form-item label="专业代码：" prop="specialtyCode">
              <el-input style="width: 100%;" v-model="formValidate.specialtyCode"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing">
            <el-form-item label="专业名称：" prop="specialtyName">
              <el-input style="width: 100%;" v-model="formValidate.specialtyName"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing2">
            <el-form-item label="培养单位：" prop="trainCompany" >
              <el-input style="width: 100%;" v-model="formValidate.trainCompany"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row  class="table-back-two-d">
          <el-col :span="6" class="table-dividing">
            <el-form-item label="导师类别：" prop="tutorType">
              <el-radio-group v-model="formValidate.tutorType">
                <el-radio label="SD">硕导</el-radio>
                <el-radio label="BD">博导</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing">
            <el-form-item label="聘任时间：" prop="hiredDate" >
              <el-form-item prop="dutyDate">
                <el-date-picker
                  v-model="formValidate.hiredDate"
                  type="date"
                  :editable="false"
                  placeholder="选择日期"
                  style="width: 100%;"
                >
                </el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing2">
            <el-form-item label="聘任学校：" prop="hiredSchool" >
              <el-input style="width: 100%;" v-model="formValidate.hiredSchool"  placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row >
        <el-row class="table-back-two-d">
          <el-col :span="6" class="table-dividing">
            <el-form-item label="是否是住陪导师：" prop="isLiveTutor">
              <el-radio-group v-model="formValidate.isLiveTutor">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing">
            <el-form-item label="担任师资培养师：" prop="servetrainingLecturer">
              <el-radio-group v-model="formValidate.servetrainingLecturer">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="table-dividing3">
            <el-form-item label="获得师资培训资格证书："
                          prop="teaQualificationCertificate">
              <el-radio-group
                v-model="formValidate.teaQualificationCertificate">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-two-d">
          <el-col class="table-dividing">
            <el-form-item label="可带教生源：" prop="teachableStudentTypes">
              <!--<el-radio-group v-model="formValidate.teachableStudentTypes">-->
              <!--<el-radio label="Y">是</el-radio>-->
              <!--<el-radio label="N">否</el-radio>-->
              <!--</el-radio-group>-->
              <el-select multiple
                         @change="activityDepUserTypeChange"
                         v-model="formValidate.teachableStudentTypes" clearable
                         placeholder="请选择">
                <el-option label="所有" value="SXS,JXS,ZYY,YJS"></el-option>
                <el-option label="实习生" value="SXS"></el-option>
                <el-option label="进修生" value="JXS"></el-option>
                <el-option label="住院医" value="ZYY"></el-option>
                <el-option label="研究生" value="YJS"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      </el-col>
    </el-row >
  </el-form>
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
  import {teach as rules} from './rules';
  export default {
    props:['operailityData'],
    data(){
      return{
        rules,
        //form表单bind数据
        formValidate:{
          "id":"",                         //数据Id
          "hasTeachTitle":"N",              //是否获得教学职称
          "teachTitle":"",                 //教学职称
          "hasTheoryTeach":"N",              // 是否承担理论授课
          "hasClinic":"N",                   // 是否临床带教
          "graduatedTraineeNumber":"0",      // 已经毕业人数（实习生）
          "graduatedResidencyNumber":"0",     // 已经毕业人数（住院医）
          "trainingTraineeNumber":"0",         //在陪人数（实习生）
          "trainingResidencyNumber":"0",       //在陪人数（住院医）
          "teachContent":"",                  //授课内容
          "hasTeachQualified":"N",             //是否获得导师资格
          "hasAcademician":"N",                // 是否院士
          "hasCouncilMember":"N",              // 是否国务院学科评议组成员
          "specialtyCode":"",                 //专业代码
          "specialtyName":"",                 //专业名称
          "trainCompany":"",                  //培养单位
          "tutorType":"SD",                     // 导师类别 硕导、博导
          "hiredDate":"",                     // 聘任时间
          "hiredSchool":"",                   // 聘任学校
          "archivesId":'',                    //档案ID,
          "serveTutor":'',             //担任导师
          'researchDirection': '',             //主要研究方向
          'isLiveTutor': 'N',                  //是否是住陪导师
          'servetrainingLecturer': 'N',         //担任师资培养讲师
          'teaQualificationCertificate': 'N',   //获得师资培训资格证书
          'teachableStudentTypes': '',//可带教生源

        },
      }
    },
    methods:{
      initData(){
        if(!this.operailityData){
          return
        }
        for(let key in this.operailityData){
          if(this.operailityData[key] != null && this.operailityData[key] != ''){ // 没有值就使用默认值
            this.formValidate[key] = this.operailityData[key]
          }
        }
      },
      // 返回输入的数据
      getInputData() {
        let isSubmit = this.submitForm("formValidate");
        let data = false;
        if (isSubmit) {
          data = this.getFormData(this.formValidate);
        }
        return data
//        return this.getFormData(this.formValidate);
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
      //改变参加人人员类型
      activityDepUserTypeChange (item) {
        if (item.includes('SXS,JXS,ZYY,YJS') &&
          !this.activityDepUserType.includes('SXS,JXS,ZYY,YJS')) {
          this.formValidate.activityDepUserType = ['SXS,JXS,ZYY,YJS']
        } else if (item.includes('SXS,JXS,ZYY,YJS') && item.length >= 2) {
          let index = item.indexOf('SXS,JXS,ZYY,YJS')
          this.formValidate.activityDepUserType.splice(index, 1)
        }
        this.activityDepUserType = this.formValidate.activityDepUserType
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        myData = this.formDate(myData,['hiredDate'],this.yearMonthData);
        return myData;
      },
    },
    watch:{
      operailityData(val){
        this.initData()
      }
    },
    created(){
      this.initData()
    }
  }

</script>
