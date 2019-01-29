<!--档案管理修改-->
<!--培训考试，考核情况-->

<template>

  <div >
    <!--标题-->
    <el-row >
      <el-col :span="24" class="lose-margin2" style="text-align: center">
        <span class="table-headline ">培训考试，考核情况</span>
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
              label="时间">
              <template scope="scope">
                <el-form-item prop="date">
                  <el-date-picker
                    v-model="scope.row.date"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%;"
                  >
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="培训考试、考核内容">
              <template scope="scope">
                <el-form-item prop="content">
                  <el-input style="width: 100%;" v-model="scope.row.content"  placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="examType"
              label="方式"
            >
              <template scope="scope">
                <el-form-item prop="examType">
                  <el-input style="width: 100%;" v-model="scope.row.examType"  placeholder="请输入内容"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="result"
              label="结果">
              <template scope="scope">
                <el-form-item prop="result">
                  <el-input style="width: 100%;" v-model="scope.row.result"  placeholder="请输入内容"></el-input>
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
    <br />
    <el-row >
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="saveCurrData" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row >
  </div>
</template>
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
        //表格数据
        dataTemplate:{
          "date":"",
          "content":"",
          "examType":"",
          "result":"",
          "remark":"",
          "archivesId":this.dataId
        },
        tableData:[],
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'add',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/save/exam/'+this.dataId,
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
            url:'/archives/list/exam/'+this.dataId
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
          this.editMessTitle.ajaxParams.data = this.getFormData(this.tableData);
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
        let valValue = ["date","content","examType","result","remark"]
        for(var i=0;i<myData.length;i++){
          if(!this.objValIsEmpty(myData[i],valValue)){
            tempArr.push(myData[i]);
          }
        }
        tempArr = this.formDate(tempArr,['date'],this.yearMonthData);
        return tempArr;
      },

    }
  }
</script>



