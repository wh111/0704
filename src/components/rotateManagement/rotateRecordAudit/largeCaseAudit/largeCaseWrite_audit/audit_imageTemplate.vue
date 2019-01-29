<!----------------------------------
****--影像模板
****--@date     2017/7/4
****--@author   gx
----------------------------------->
<template>
    <div>
      <el-form  :model="formValidate"  ref="formValidate" :rules="entityAudit"  class="demo-form-inline" label-width="130px" >
        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="编号:" prop="czyNo" >
              {{formValidate.czyNo}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="科室:" prop="depName" >
              {{operailityData.depName}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="病人姓名:" prop="cname" >
              {{formValidate.cname}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="病人性别:" prop="csex" >
              {{formValidate.csex}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="年龄:" prop="cage" >
              {{formValidate.cage}}
            </el-form-item>
          </el-col>
        </el-row>


        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="样本的描述:" prop="cbyVar" >
              <el-input type="textarea" readonly v-model="formValidate.cbyVar"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="分析报告:" prop="ctgjcZkqk" >
              <el-input type="textarea" readonly v-model="formValidate.ctgjcZkqk"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="创建时间:" prop="csex" >
              {{date}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="创建人:" prop="createUserNmae" >
              {{formValidate.createUserNmae}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-one-d">
          <el-col :span="10" >
            <el-form-item label="相关证明材料:" prop="createUserNmae" label-width="130px" >
              <upload-file :uploadFiles="formValidate.fileList" :show="true"></upload-file>
            </el-form-item>

          </el-col>
        </el-row>

        <!--审核信息-->
        <!--审核历史列表-->
        <el-table
          v-if="formValidate.review && formValidate.review[0]"
          align="center"
          :height="200"
          :data="formValidate.review"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="100">
          </el-table-column>
          <el-table-column
            align="center"
            prop="createUserName"
            label="审核人"
            width="200">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="审核时间"
            width="300">
          </el-table-column>
          <el-table-column
            prop="reviewMess"
            label="审核意见"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="spState"
            label="审核状态"
          >
            <template scope="scope">
              {{ scope.row.spState | typeText}}
            </template>
          </el-table-column>
        </el-table>

        <!--审核项-->

        <el-row >
          <el-col :span="8" >
            <el-form-item label="审核结果:" prop="disState" >
              <el-radio-group v-model="formValidate.spState">
                <el-radio class="radio"  label="PASS">通过</el-radio>
                <el-radio class="radio"  label="REJECT">未通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col >
          <el-col :span="8" >
            <el-form-item label="粘贴比例:" prop="phone" >
              {{formValidate.createTime}}
            </el-form-item>
          </el-col >
        </el-row >

        <el-row >
          <el-col :span="16" >
            <el-form-item label="审核意见:" prop="reviewMess" >
              <el-input type="textarea"  v-model="formValidate.reviewMess"></el-input>
            </el-form-item>
            </el-form-item>
          </el-col >

        </el-row >
        </br>

        <el-row>
          <el-col :span="20" :offset="1">
            <!--<load-btn @postilSubEvent="postilSubEvent" :btnData="saveBtn"></load-btn>-->
            <load-btn @saveSubEvent="saveSubEvent" :btnData="loadBtn"></load-btn>
            <el-button  @click="cancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import {entityAudit} from '../../rules'

    //当前组件引入全局的util
    let Util = null;
    export default{
      props:['operailityData','url','podId'],
        data() {
            return {
               entityAudit ,
              saveBtn: {title: '批注', callParEvent: 'postilSubEvent'},
              loadBtn: {title: '保存', callParEvent: 'saveSubEvent'},
              name:'',
              date:'',
              formValidate:{
               /* "cdepId":,
                "cdepName":,
                "cpodId":this.podId,
                "czyNo":"编号",
                "cname":"姓名",
                "csex":"男",
                "cage":"12",
                "cbyVar":"样本的描述",
                "ctgjcZkqk":"分析报告",
                "fId":"",*/
              },
              listMessTitle:{
                ajaxSuccess:'SuccessGetCurrData',
                ajaxParams:{
                  url:this.url.caseRecordImageDataGet+this.operailityData.cid,
                }
              },
            }
        },
        methods: {
            //初始化请求列表数据
            init(){
              this.ajax(this.listMessTitle);
            },
          SuccessGetCurrData(res){
            let data = res.data;
            if(!data) return;
            data.spState = 'PASS';
            data.reviewMess = '';
            this.formValidate = data;

          },
          //上传文件
          expenseFileEvent(ids){

            this.formValidate.fId = ids;
          },

          /*
           * 点击提交按钮 监听是否提交数据
           * @param isLoadingFun boolean  form表单验证是否通过
           * */
          listenSubEvent(isLoadingFun){
            let isSubmit = this.submitForm("formValidate");
            if(isSubmit){
              if(!isLoadingFun) isLoadingFun=function(){};
              isLoadingFun(true);
              this.addMessTitle.ajaxParams.data=this.getFormData(this.formValidate);
              this.ajax(this.addMessTitle,isLoadingFun)
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

          //批注
          postilSubEvent(isLoadingFun){
            let addMessTitle={
              type:'audit',
              successTitle:'批注成功!',
              errorTitle:'批注失败!',
              ajaxSuccess:'ajaxSuccess',
              ajaxError:'ajaxError',
              ajaxParams:{
                jsonString:true,
                url:this.url.caseRecordManageBigCasesModifyComment,
                method:'put',
                data:{},
              }
            };
            this.addMessTitle = addMessTitle;
            this.listenSubEvent(isLoadingFun)
          },
          //保存 审核
          saveSubEvent(isLoadingFun){
            let addMessTitle={
              type:'audit',
              successTitle:'保存成功!',
              errorTitle:'保存失败!',
              ajaxSuccess:'ajaxSuccess',
              ajaxError:'ajaxError',
              ajaxParams:{
                url:this.url.caseRecordManageBigCasesReview+this.operailityData.cid,
                method:'put',
                data:{},
              }
            };
            this.addMessTitle = addMessTitle;
            this.listenSubEvent(isLoadingFun)
          },


          //取消
          cancel(){
            this.$emit('cancel','audit');
          },

          /*
           * 获取表单数据
           * @return string  格式:id=0&name=aa
           * */
          getFormData(data){
            let myData = this.$util._.defaultsDeep({},data);
            return myData;
          },

        },
        created(){

            this.init();
          //获取当前登录人
          let userInfo = this.$store.getters.getUserInfo;
          this.formValidate.createUserNmae= userInfo.name;
          //获取当前时间
          let  date = new Date();
         this.date =  this.yearMonthData(date)

        },
        mounted(){
        },
        components: {}
    }
</script>
