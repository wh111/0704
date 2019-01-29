<!--档案管理修改-->
<!--专业技术职称晋升情况-->


<template>

  <div >
    <!--标题-->
    <el-row >
      <el-col :span="24" class="lose-margin2" style="text-align: center;">
        <span class="table-headline ">专业技术职称晋升情况</span>
      </el-col >
    </el-row >
    <!--内容-->
    <el-form   ref="tableData" label-width="100px" class="demo-ruleForm archivesEdit">
      <el-row>
        <el-col :span="24">
          <el-table
            align="center"
            :data="tableData"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%"
           >
            <el-table-column
              type="index"
              label="序号"
              width="70">
            </el-table-column>
            <el-table-column
              prop="technicalTitle"
              label="技术职称">
              <template scope="scope">
                <el-form-item prop="technicalTitle">
                  <el-input style="width: 100%;" v-model="scope.row.technicalTitle"  placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              prop="approvalDate"
              label="批准时间">
              <template scope="scope">
                <el-form-item prop="approvalDate">
                  <el-date-picker
                    v-model="scope.row.approvalDate"
                    type="date"
                    :editable="false"
                    placeholder="选择日期"
                    style="width: 100%;"
                  >
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="approvalOrgan"
              label="批准机关"
            >
              <template scope="scope">
                <el-form-item prop="approvalOrgan">
                  <el-input style="width: 100%;" v-model="scope.row.approvalOrgan"  placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
              <template scope="scope">
                <el-form-item prop="remark">
                  <el-input style="width: 100%;" v-model="scope.row.remark"  placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140px" align="left">
              <template scope="scope">
                <el-button size="small" type="danger" @click="delRow(scope.$index)" v-if="tableData.length > 1">删除</el-button>
                <el-button size="small" type="success" @click="addRow()" v-if="scope.$index == tableData.length - 1">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <!--<br />-->
    <!--<el-row >-->
      <!--<el-col :span="24" style="text-align: center;">-->
        <!--<load-btn @listenSubEvent="saveCurrData" :btnData="loadBtn"></load-btn>-->
      <!--</el-col>-->
    <!--</el-row >-->
    <!--<br />-->
    <!--<div style="font-size: 1px;overflow: hidden;line-height: 1;border-top:1px solid #e3e8ee;margin: 12px 0;"></div>-->
    <!--<el-row>-->
      <!--<el-col :span="9" :offset="10">-->
        <!--<el-button type="primary" v-if="userInfo.archivesAuditStatus!='NOT_AUDIT'" @click="saveDataToParent">保存</el-button>-->
        <!--<load-btn  v-if="userInfo.archivesAuditStatus!='NOT_AUDIT'" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>-->
        <!--<span v-if="userInfo.archivesAuditStatus=='NOT_AUDIT'" style="margin-right: 10px;color: #FF4949;">您的档案信息正在审核中……</span>-->
        <!--<el-button  @click="cancel">取消</el-button>-->
      <!--</el-col>-->
    <!--</el-row >-->
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
//    props: ['dataId','initData','userInfo'],
    props: ['dataId'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'上报审核',callParEvent:'listenSubEvent'},
        dataTemplate:{
          "technicalTitle":"",
          "approvalDate":"",
          "approvalOrgan":"",
          "remark":"",
          "archivesId":this.dataId
        },
        //表格数据
        tableData:[],

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'saveSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/save/promotion/'+this.dataId,
            method:'post',
            jsonString:'jsonString',
            data:{}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/archives/list/promotion/'+this.dataId
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
//        this.SuccessGetCurrData();
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      saveCurrData(isLoadingFun){
        let isSubmit = this.submitForm("tableData");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.tableData);
//          this.$emit("setSaveData",this.editMessTitle.ajaxParams.data);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },

      //保存成功后回调
      saveSuccess() {
        this.$emit("save",'professionalSkill');
      },


      saveDataToParent(){
        this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
      },


      listenSubEvent(){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.$emit("setSaveData",this.editMessTitle.ajaxParams.data);
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
        let data = responseData.data;//responseData.data;
        this.tableData = data;
        this.setTableDatTemplate();
      },


      //设置tableData默认值
      setTableDatTemplate(){
        let dataTemplate = Util._.defaultsDeep({},this.dataTemplate);
        this.tableData.push(dataTemplate);
        this.tableData[this.tableData.length-1].index=this.tableData.length-1;
      },


      /*
       * 点击添加按钮触发
       * */
      addRow(){
        this.setTableDatTemplate();
      },
      // 删除
      delRow(index) {
        this.tableData.length && this.tableData.splice(index, 1)
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
        let myData = Util._.defaultsDeep([],data);
        let tempArr = [];
        let valValue = ["technicalTitle","approvalDate","approvalOrgan","remark"];
        for(var i=0;i<myData.length;i++){
          if(!this.objValIsEmpty(myData[i],valValue)){
            tempArr.push(myData[i]);
          }
        }
        tempArr = this.formDate(tempArr,['approvalDate'],this.yearMonthData);
        return tempArr;
      },

    }
  }
</script>


