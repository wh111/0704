<!----------------------------------
****--添加分组(groupSet_addFourAdd)
****--@date     2017/7/8
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-row>
      <el-col :span="3">
        <div class="cal-schoolTit" style="text-align: right;">小组名：</div>
      </el-col>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="formValidate.groupName"></el-input>
      </el-col>
      <!--<el-col :span="3">
        <div class="cal-schoolTit" style="text-align: right;">专科：</div>
      </el-col>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="formValidate.specialty"></el-input>
      </el-col>-->
      <el-col :span="2" :push="1">
        <el-button type="primary" @click="handleSubmit('formValidate')" icon="search"></el-button>
      </el-col>
    </el-row>
    <br />
    <el-table
      v-if="tableData1.length>0"
      ref="multipleTable"
      align="center"
      :data="tableData1"
      :height="500"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="70">
      </el-table-column>
      <el-table-column
        prop="shcoolName"
        label="学校"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="小组名称"
        align="center"
        width="200"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <br />
    <el-row>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
      <el-col :span="4" class="textCenter"><el-button type="primary" @click="submitForm('ruleForm')">提交</el-button></el-col>
      <el-col :span="4" class="textCenter"><el-button  @click="cancel">取消</el-button></el-col>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--操作url的api
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    //props接收父组件传递过来的数据
    props: ['operailityData','sltedGroup'],
    data() {
      return {
        //查询表单
        formValidate: {
          "groupName":"",
        },

        onlyOnce:true,

        tableData1:[],

        //服务器端请求数据格式化完后存储,待保存用
        saveData:{},
        multipleSelection: [],

        //查询列表数据
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.getGroupDetails.path,
            params:this.operailityData
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        this.listMessTitle.ajaxParams.params.outlineId = this.operailityData.depOutlineId;
        this.ajax(this.listMessTitle);

      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){

      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        /*[{
          "groupId":1,
          "groupName":"小组名称",
          "groupIndex":1,
          "groupNoOrderName":"小组顺序",
          "outlineId":1,
          "groupUserIds":"1,23,4,56",
          "groupUserNames":"张三,李四,王五,赵六"
        }]*/
        this.tableData1=[];
        this.saveData={};
        for(var i=0,item;i<data.length;i++){
          item = data[i]
          this.tableData1.push({
            id:item["groupId"],
            shcoolName:this.operailityData["schoolName"],
            groupName:item["groupName"]
          })
          if(item["groupUserNames"].indexOf(",")>-1){
            let namesArr = [],idsArr=[];
            for(var k=0,subItemName,subItemId;k<item["groupUserNames"].split(",").length;k++){
              subItemName = item["groupUserNames"].split(",")[k];
              subItemId = item["groupUserIds"].split(",")[k];
              namesArr.push(subItemName[k]);
              idsArr.push(subItemId[k]);
            }
            item["groupUserNames"] = namesArr;
            item["groupUserIds"] = idsArr;
          }else{
            item["groupUserNames"] = [item["groupUserNames"]];
            item["groupUserIds"] = [item["groupUserIds"]];
          }
          item["groupIndexId"] = this.operailityData["groupIndexId"];
          item["schoolName"] = this.operailityData["schoolName"];
          item["schoolId"] = this.operailityData["schoolId"];
          this.saveData[item["groupId"]] = item;
        }
      },


      //提交数据到父组件
      submitForm(){
        if(!this.isSelected()) return;
        let data=[]  //[{id:1,name:"内科"},……}

        for(var i=0,item;i<this.multipleSelection.length;i++){
          item = this.multipleSelection[i];
          data.push(this.saveData[item["id"]]);
        }
        this.$emit("filterAddGroupData",data);
        this.cancel();
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


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','setGroup');
      },

    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
      //页面dom稳定后调用

    },
    watch:{
      multipleSelection(val){
        if(!this.onlyOnce) return;
        this.$nextTick(function () {
          if(val.length > 0){
            let tempArr = this.multipleSelection;
            for (var i = 0; i < tempArr.length; i++) {
              this.$refs.multipleTable.toggleRowSelection(tempArr[i], true);
            }
          }
        })
      }
    },
    components: {}
  }
</script>
