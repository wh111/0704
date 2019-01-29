<!--档案管理修改-->
<!--工作经历-->
<template>

  <div >
    <!--标题-->
    <el-row >
      <el-col :span="24" class="lose-margin2" style="text-align: center">
        <span class="table-headline ">工作经历</span>
      </el-col >
    </el-row >
    <!--内容-->
    <el-form   ref="formValidate" label-width="100px" class="demo-ruleForm archivesEdit">
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
              prop="date"
              label="起止时间"
              width="300">
              <template scope="scope">
                <date-group :index="scope.$index" :dateGroup="{'type':'month','startDate':scope.row.startDate,'endDate':scope.row.endDate,'text':'~'}" @setDateGroupVal="setDateGroupVal"></date-group>
              </template>
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="单位名称">
              <template scope="scope">
                <el-form-item prop="companyName">
                  <el-input style="width: 100%;" v-model="scope.row.companyName"  placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="specialty"
              label="从事专业"
            >
              <template scope="scope">
                <el-form-item prop="specialty">
                  <el-input style="width: 100%;" v-model="scope.row.specialty"  placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="specialty"
              label="技术职务"
            >
              <template scope="scope">
                <el-form-item prop="duty">
                  <el-input style="width: 100%;" v-model="scope.row.duty"  placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="dutyDate"
              label="技术职务受聘时间">
              <template scope="scope">
                <el-form-item prop="dutyDate">
                  <el-date-picker
                    v-model="scope.row.dutyDate"
                    type="date"
                    :editable="false"
                    placeholder="选择日期"
                    style="width: 100%;"
                    >
                  </el-date-picker>
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
      <!--<el-col :span="24" style="text-align: center">-->
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
          "startDate":"",
          "endDate":"",
          "companyName":"",
          "specialty":"",
          "duty":"",
          "dutyDate":""
        },
        //表格数据
        tableData:[],
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'保存成功!',
          errorTitle:'保存失败!',
          ajaxSuccess:'saveSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/save/work/'+this.dataId,
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
            url:'/archives/list/work/'+this.dataId
          }
        },
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
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.tableData);
//          this.$emit("setSaveData",this.editMessTitle.ajaxParams.data);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
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

      //保存成功后回调
      saveSuccess() {
        this.$emit("save",'workExperience');
      },

      /*
       * 日期组改变值后赋值
       * @param index number   当前数据数组的索引
       * @param key   string   当前数据需要设置的对象的key 例如:startDate
       * @param val   string   当前选中的日期已格式化好的值
       * */
      setDateGroupVal(index,key,val){
        this.tableData[index][key]=val;
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
//        let data = this.initData;//responseData.data;
        let data = responseData.data;//responseData.data;
        data = this.formDate(data,['startDate','endDate'],this.yearMonth);
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
        let valValue = ["startDate","endDate","companyName","specialty","dutyDate","duty"]
        for(var i=0;i<myData.length;i++){
          if(!this.objValIsEmpty(myData[i],valValue)){
            tempArr.push(myData[i]);
          }
        }
        tempArr = this.formDate(tempArr,['dutyDate'],this.yearMonthData);
        tempArr = this.formDate(tempArr,['startDate','endDate'],this.yearMonth);
        return tempArr;
      },

    }
  }
</script>


