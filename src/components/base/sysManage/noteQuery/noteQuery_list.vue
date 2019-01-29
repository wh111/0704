<!--
* @TODO
* @pageName note-query_list
* @description 短信回执查询
* @Author zyc 332533011@qq.com
* @Created by zyc on 2018-06-12 11:46
-->
<template>
  <div id="content" ref="content" class="modal">

    <el-form  ref="formValidate" :model="formValidate" :rules="rules" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item  prop="mobile">
            <el-input placeholder="请输入内容" v-model="formValidate.mobile">
              <div slot="prepend">电话</div>
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore" style="text-align: right"></div>
    </el-form>
    <div
      id="myTable"
      ref="myTable"

    >
      <el-table
        align="center"
        :height="dynamicHt"
        :context="self"
        :data="tableData1"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <!--<el-table-column
          type="selection"
          width="55">
        </el-table-column>-->
        <el-table-column
          type="index"
          label="序号"
          width="70">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="content"
          label="回复内容"
          align="center"
          width="200"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="times"
          label="	回复时间"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
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
  import {sourceUnitList as rules} from '../rules'

  //当前组件引入全局的util
  let Util = null
  export default {
    name: 'note-query_list',
    data () {
      return {
        rules,
        searchMore:false,
        formValidate: {
          "mobile":""
        },
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [{
          "id":"",
          "name":"",
          "contacts":"",
          "phone":"",
          "remark":""
        },],
        loading:false,
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'/sms/listPage-feedback',
            params:{
              mobile:"",
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
        this.setTableData();
      },


      //设置表格及分页的位置
      setTableDynHeight(){
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        data = this.addIndex(data);
        data = this.formDate(data, ['times'], 'yyyy-MM-dd HH:mm:ss')
        this.tableData1= data;
        this.listTotal = responseData.totalCount || 0;
      },


      setTableData(params){
        this.setAjaxParams();
        this.ajax(this.listMessTitle);
      },

      //搜索监听回调
      searchEvent(isLoading){
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if(isSubmit){
          this.setTableData()
        }
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        let flag =false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag =true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag
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

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

    },
    created () {
      this.init()
    },
    mounted(){
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
      //当前组件引入的子组件
    },
  }
</script>

<style scoped>

</style>
