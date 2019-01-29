<!----------------------------------
****--按组轮转排班预览 (rotaryTableView)
****--@date     2017/7/11
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <div class="listUpAreaBox">
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate"  :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px" >
            <div class="listUpArea-searchLeft">
              <input class="hidden">
              <el-input placeholder="请输入内容" v-model="formValidate.userName">
                <div slot="prepend">姓名</div>
                <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
              </el-input>
            </div>
            <div class="listUpArea-moreSearch">
              <el-button @click="showMoreSearch" type="text">高级查询</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox">

    </div>
    <br />
    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
      <el-table
        stripe
        ref="multipleTable"
        align="center"
        height="430"
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
            <span>{{scope.row.index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          width="160"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="schoolName"
          label="学校"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="specialty"
          label="专业"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="phoneNum"
          label="手机号"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          width="240">
        </el-table-column>
      </el-table>
      </div>
      <!--分页-->
      <!--<div style="margin: 10px;">
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
      </div>-->
    </div>
  </div>
</template>
<script>
    /*当前组件必要引入*/
    import api from "../../api.js"
    //当前组件引入全局的util
    let Util = null;
    export default{
        props:["schoolId","initUser"],
        data() {
            return {
              //查询表单
              formValidate: {
                userName: '',
              },

              multipleSelection: this.initUser,
              dynamicHt: 100,
              self: this,
              loading:false,
              listTotal:0,
              tableData1:[
//                {
//                  "userId":1,
//                  "userName":"欧阳夏丹",
//                  "schoolName":"北京医科大学",
//                  "specialty":"呼吸内科",
//                  "phoneNum":"13261889505",
//                  "email":"yongchao0310@163.com"
//                }
              ],
              dataObj:{},


              //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
              listMessTitle:{
                ajaxSuccess:'updateListData',
                ajaxParams:{
                  url: api.getSchoolUserInfo.path+"/"+this.schoolId,
                  params:{
                    userName:"",
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
            this.tableData1=data;
            for(var i=0,item;i<data.length;i++){
              item = data[i];
              item["index"] = i;
              this.dataObj[item["userId"]] = item;
            }
            this.$nextTick(function () {
              let tempArr = this.multipleSelection;
              for (var i = 0,idx; i < tempArr.length; i++) {
                idx = this.dataObj[tempArr[i]["userId"]]["index"];
                this.$refs.multipleTable.toggleRowSelection(this.tableData1[idx], true);
              }
            })
            //this.listTotal = responseData.totalCount || 0;
          },


          //设置表格数据
          setTableData(){
            this.formValidate.name="";
            this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params);
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

        },
        watch:{
          multipleSelection(val){
            if(val.length>0){
                this.$emit("setSltedPeople",val);
            }
          }
        },
        created(){
            this.init();
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
        components: {}
    }
</script>
