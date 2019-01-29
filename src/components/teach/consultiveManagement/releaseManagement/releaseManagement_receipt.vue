<template>

  <div class="showWrapper leaveManagement-show">
      <el-row >
        <el-col>
            <fieldset class="layui-elem-field">
              总人数{{data.totalNum||0}} &nbsp;  &nbsp; 已查看人数{{data.readNum||0}}  &nbsp;   &nbsp;  未查看人数{{(data.totalNum-data.readNum)||0}}
            </fieldset>
        </el-col >
      </el-row >
    <br>
    <el-row >
      <el-col>
        <el-table
          align="center"
          :height="400"
          :data="data.userList"
          tooltip-effect="dark"
          style="width: 100%"
       >
          <el-table-column
            label="序号"
            type="index"
            width="70">
          </el-table-column>

          <el-table-column
            prop="userName"
            label="姓名"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话"
            width="200"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="状态"
            show-overflow-tooltip>
            <template scope="scope">
            {{scope.row.isRead==1?'已读':'未读'}}
            </template>
          </el-table-column>

        </el-table>
      </el-col >
    </el-row >
      <div style="margin: 10px;">
      <div style="float: right;">
          <el-pagination
                  @size-change="changePageSize"
                  @current-change="changePage"
                  :current-page="myPages.currentPage"
                  :page-sizes="myPages.pageSizes"
                  :page-size="myPages.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalCount">
          </el-pagination>
      </div>
      </div>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {

      //todo 还差回执情况数据
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    data (){
      return{
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        "data":{
          "totalNum":"",
          "readNum":"",
          "userList":[
          ]
        },
          totalCount: 0,
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.receiptList,
            params:{
              noticeId:this.operailityData.id,
            }
          }
        },


      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        this.data = responseData.data;
        this.totalCount=Number(responseData.data.totalNum) ;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },
        setTableData(isLoading) {


            this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions);

            this.ajax(this.listMessTitle, isLoading)
        },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
          Util = this.$util;
          //ajax请求参数设置
          this.myPages = Util.pageInitPrams;

          this.queryQptions = {
              curPage: 1, pageSize: Util.pageInitPrams.pageSize
          }
          this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions);

          this.ajax(this.listMessTitle);
      },

    }
  }
</script>
