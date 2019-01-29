<!----------------------------------
****--签到记录(signInRecord_list)
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
        align="center"
        :height="dynamicHt"
        :context="self"
        :data="tableData1"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          prop="index"
          width="70">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="courseContent"
          label="课程名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="授课老师"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="courseDate"
          label="授课时间"
          width="160">
        </el-table-column>
        <el-table-column
          prop="signDate"
          label="签到时间"
          align="center"
          width="160">
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
    import api from "../api"
    //当前组件引入全局的util
    let Util = null;
    export default{
        data() {
            return {

              dynamicHt: 100,
              self: this,
              loading:false,
              listTotal:0,
              //表格数据
              tableData1:[
                /*{
                  "courseArrangeId":23,
                  "userName":111,
                  "courseContent":"课程1",
                  "teacherName":"见习",
                  "courseDate":"2017-02-08",
                  "signDate":"张三",
                }*/
              ],


              //默认请求列表数据
              listMessTitle:{
                ajaxSuccess:'updateListData',
                ajaxParams:{
                  url: api.userSignRecord.path,
                  params:{
                    sortby:'',
                    order:'',
                    courseContent:'',
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
              //设置提交的参数
              this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params);
              this.ajax(this.listMessTitle);
            },


          //通过get请求列表数据
          updateListData(responseData){
            let data = responseData.data;
            this.tableData1=[];
            data = this.addIndex(data);
            this.tableData1= data;
            this.listTotal = responseData.totalCount || 0;
          },


          //设置表格及分页的位置
          setTableDynHeight(){
            let content = this.$refs.content;
            let parHt = content.parentNode.offsetHeight;
            let myTable = this.$refs.myTable;
            let paginationHt = 50;
            this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
          },

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
