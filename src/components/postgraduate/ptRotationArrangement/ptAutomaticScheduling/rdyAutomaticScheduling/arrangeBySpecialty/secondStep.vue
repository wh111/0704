<!----------------------------------
****--选择人员(secondStep)
****--@date     2017/7/23
****--@author   zyc<332533011@qq.com
---------------------------------->
<template>
<div>
  <div class="listUpAreaBox">
    <div class="listUpArea-menus">
      <div class="add-remove">
      </div>
    </div>
    <div class="listUpArea-search">
      <div class="listUpArea-searchWrapper">
        <!--右侧查询-->
        <el-form ref="formValidate"  :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="90px" >
          <div class="listUpArea-searchLeft">
            <input class="hidden">
            <el-input @keyup.enter.native="handleSubmit('formValidate')" placeholder="请输入内容" v-model="formValidate.userName">
              <div slot="prepend">姓名</div>
              <el-button @click="handleSubmit('formValidate')" slot="append" icon="search"></el-button>
            </el-input>
          </div>
          <div class="listUpArea-moreSearch">
            <el-button @click="showMoreSearch" type="text">高级查询</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
  <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox"> </div>
  <br />
  <el-table
    stripe
    ref="multipleTable"
    align="center"
    height="410"
    :context="self"
    :data="tableData1"
    tooltip-effect="dark"
    highlight-current-row
    style="width: 100%;height: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      align="center"
      label="序号"
      prop="index"
      width="75">
      <template scope="scope">
        <span>{{scope.row.index}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="userName"
      label="姓名"
      width="160"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="rtProclass"
      label="培训方向"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="highestEdu"
      label="学历"
      align="center"
      width="200">
    </el-table-column>
    <el-table-column
      prop="rotaryAdmrank"
      label="培训年限"
      align="center"
      width="150">
      <template scope="scope">
        {{scope.row.rotaryAdmrank}}年
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top: 10px;">
    <div style="float: right;">
      <el-pagination
        @size-change="changePageSize"
        @current-change="changePage"
        :current-page="myPages.currentPage"
        :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal">
      </el-pagination>
    </div>
  </div>
</div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["initUser","jdProclass","userType",'schoolId'],
    data() {
      return {
        formValidate:{
          userName:""
        },
        dataObj:{},
        multipleSelection: this.initUser,
        dynamicHt: 100,
        self: this,
        loading:false,
        listTotal:0,
        tableData1: [
            /*{
          "userId":"4565",
          "userName":"张三",
          "rtProclass":"内科",
          "highestEdu":"本科",
          "rotaryAdmrank":"1",
          "rotaryZyyType":""
        }*/
        ],

        //初始化获取人员信息
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.getUsersList.path+this.userType,
            params:{
              rotaryAdmrank:'',
              rotaryZyyType:'',
              userName:'',
              sortby:'',
              order:'',
              rtProclass:this.jdProclass,
              schoolId:this.schoolId,

            }
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          //url:this.listUrl,
          params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize}
        }
        this.setTableData(this.listMessTitle);
      },

      setTableData(){
        this.setAjaxParams();
        this.ajax(this.listMessTitle);
      },


      //设置提交的参数
      setAjaxParams(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        this.setTableData();
      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        data = this.addIndex(data);
        this.tableData1=data;
        for(var i=0,item;i<data.length;i++){
          item = data[i];
          item["idx"] = i;
          this.dataObj[item["userId"]] = item;
        }
        this.$nextTick(function () {
          let tempArr = this.multipleSelection;
          for (var i = 0,idx; i < tempArr.length; i++) {
            idx = this.dataObj[tempArr[i]["userId"]]["idx"];
            this.$refs.multipleTable.toggleRowSelection(this.tableData1[idx], true);
          }
        })
        this.listTotal = responseData.totalCount || 0;
      },


      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

    },
    watch:{
      multipleSelection(val){
        //if(val.length>0){
          this.$emit("setSecondVal",val);
        //}
      }
    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
