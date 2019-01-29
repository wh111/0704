<!----------------------------------
****--选择科室(selectDep)
****--@date     2017/7/24
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-row>
      <el-col :span="2">
        <div class="cal-schoolTit" style="text-align: right;">科室：</div>
      </el-col>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="formValidate.name"></el-input>
      </el-col>
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
        prop="name"
        label="科室"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="director"
        label="科室主任"
        align="center"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="secretary"
        label="教学秘书"
        align="center"
        width="120"
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
  //当前组件引入全局的util
  let Util = null;
  export default{
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        //查询表单
        formValidate: {
          "name":"",
          "specialty":""
        },

        onlyOnce:true,

        tableData1:[],
        multipleSelection: [],

        //查询列表数据
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: "/hospital/dept/queryAll",
            params:{
              name:'',code:'',director:"",secretary:"",nurse:"",capacity:"",
            }
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        this.ajax(this.listMessTitle);
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        let option = Util._.defaultsDeep({},this.listMessTitle);
        option.ajaxParams.params = Object.assign(option.ajaxParams.params,this.formValidate);
        this.ajax(option);
      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        for(var i=0,item;i<data.length;i++){
          item = data[i]
          if(item.id==-1){
            data.splice(i,1);
          }
        }
        this.tableData1 = [];
        this.tableData1= data;
        let tempArr = [];
        if(this.operailityData.length>0){
          let splt = this.operailityData;
          for(var i=0;i<this.tableData1.length;i++){
            for(var k=0;k<splt.length;k++){
              if(this.tableData1[i]["id"]==splt[k]["depId"]){
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
        let data=[]  //[{id:1,name:"内科"},……}
        for(var i=0,item;i<this.multipleSelection.length;i++){
          item = this.multipleSelection[i];
          data.push({
            depId:item.id, depName:item.name,
          });
        }
        this.$emit("filterAddDepData",data);
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
        this.$emit('cancel','setDep');
      },

    },
    created(){
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
