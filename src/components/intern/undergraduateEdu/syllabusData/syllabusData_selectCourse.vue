<!----------------------------------
****--设置课程(syllabusData_selectCourse)
****--@date     2017/6/18
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <div
      id="myTable"
      ref="myTable"

    >
      <el-table
        ref="multipleTable"
        align="center"
        :data="tableData1"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="courseContent"
          label="课程名">
        </el-table-column>
        <el-table-column
          prop="courseDate"
          label="上课时间"
          align="center"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="teachNames"
          label="上课老师"
          align="center"
          width="120">
        </el-table-column>
      </el-table>
    </div>
    <br />
    <el-row>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
      <el-col :span="4" class="textCenter"><el-button type="primary" @click="submitForm('ruleForm')">提交</el-button></el-col>
      <el-col :span="4" class="textCenter"><el-button @click="cancel">取消</el-button></el-col>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
    </el-row>
  </div>
</template>
<script>
    /*当前组件必要引入*/
    import api from "../api.js";
    //当前组件引入全局的util
    let Util = null;
    export default{
        props:["setCourseData"],
        data() {
            return {

              //设置选中的课程
              currSltedCourse:"",

              multipleSelection: [],
              //表格数据
              tableData1:[],

              //默认请求列表数据
              listMessTitle:{
                ajaxSuccess:'updateListData',
                ajaxParams:{
                  url: api.teacherCourse.path,
                  params:{
                    sortby:'',
                    order:'',
                    courseContent:'',
                    courseType:'',
                    courseDateBegin:'',
                    courseDateEnd:'',
                  }
                }
              },
            }
        },
        methods: {
            //初始化请求列表数据
            init(){
                this.ajax(this.listMessTitle);
            },

          /*
           * checkbox 选择后触发事件
           * @param val Array 存在所有的选择每一个行数据
           */
          handleSelectionChange(val) {
            this.multipleSelection = val;
          },


          /*
           * 列表数据只能选择一个
           * @param isOnly true  是否只选择一个
           */
          isSelected(isOnly){
            let len = this.multipleSelection.length;
            let flag = true;
            if(len==0){
              this.showMess("请选择数据!");
              flag = false;
            }
            if(len>1 && isOnly){
              this.showMess("只能修改一条数据!")
              flag = false;
            }
            return flag;
          },


          //通过get请求列表数据
          updateListData(responseData){
            let data = responseData.data;
            this.tableData1=[];
            data = data;
            this.tableData1= data;
            let tempArr = [];
            if(this.setCourseData!=""){
              let splt = this.setCourseData.split(",");
              for(var i=0;i<this.tableData1.length;i++){
                 for(var k=0;k<splt.length;k++){
                     if(this.tableData1[i]["courseArrangeId"]==splt[k]){
                       tempArr.push(i);
                       break;
                     }
                 }
              }
              this.multipleSelection = [];
              for(var i=0;i<tempArr.length;i++){
                this.multipleSelection.push(this.tableData1[tempArr[i]]);
              }
            }
          },

          //提交数据到父组件
          submitForm(){
            if(!this.isSelected()) return;
            let courseArrangeIds = [];
            let courseTimeRecordIds = [];
            let courseContent = [];
            for(var i=0,item;i<this.multipleSelection.length;i++){
              item = this.multipleSelection[i];
              courseArrangeIds.push(item["courseArrangeId"]);
              courseTimeRecordIds.push(item["courseTimeRecordId"]);
              courseContent.push(item["courseContent"]);
            }
            let data = {
              courseArrangeIds:courseArrangeIds.join(","),
              courseTimeRecordIds:courseTimeRecordIds.join(","),
              courseContent:courseContent.join(","),
            }
            this.$emit("setCourseMess",data);
            this.cancel();
          },

          //关闭当前弹窗
          cancel(){
             this.$emit("cancel","add")
          }

        },
        created(){
            Util = this.$util;
            this.init();
        },
        mounted(){

          //页面dom稳定后调用
          this.$nextTick(function () {
            let tempArr = this.multipleSelection;
            for(var i=0;i<tempArr.length;i++){
              this.$refs.multipleTable.toggleRowSelection(tempArr[i],true);
            }
          })

        },
        components: {}
    }
</script>
