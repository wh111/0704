<!----------------------------------
****--轮转表
****--@date     2017/7/3
****--@author   gx
----------------------------------->
<template>
  <div id="content"  ref="content"  class="modal">

    <!--<div class="listUpAreaBox">
      <div class="listUpArea-menus">
        &lt;!&ndash;表格数据操作按钮&ndash;&gt;
      </div>
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          &lt;!&ndash;右侧查询&ndash;&gt;
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
    <br />-->
    <!--表格数据操作按钮-->
    <div>
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
            label="序号"
            type="index"
            width="75">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="depName"
            label="科室"
            width="120">
            <template scope="scope">
              <el-button v-if="scope.row.podClass!='SXS'" @click="show(scope.$index,scope.row)" type="text">{{scope.row.depName}}</el-button>
              <span v-else>{{scope.row.depName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="rotaryBeginTime"
            label="入科时间"
          >
          </el-table-column>
          <el-table-column
            prop="rotaryEndTime"
            label="出科时间"
            width="120">
          </el-table-column>
          <el-table-column
            prop="ts"
            label="轮转周期"
            width="120"
          >
            <template scope="scope">
              {{scope.row.ts}}{{scope.row.podClass=='SXS'?'周':'月'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="teacherName"
            label="带教老师"
            width="120"
          >
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
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"

      class-name="vertical-center-modal"
      :loading="true"
      :width="800"
    >
      <modal-header slot="header" :parent="self" :content="showId"></modal-header>
      <show v-if="showModal"  @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script >
  /*当前组件必要引入*/
  //引入--微调--组件

  import api from "../api.js";
  //引入--查看--组件
  import show from "./myRotateTables_view.vue";
  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        //查询表单
        //form表单bind数据
        formValidate: {
          "userId":"",
          "userName":"",
          "rotaryBeginTime":"",
          "rotaryEndTime":"",
          "depId":"",
          "depName":"",
          "ts":"",
          "podClass":"",
          "teacherName":"",
        },
        showId:{
          id:'auditId',
          title:'查看'
        },
        operailityData:'',
        dynamicHt: 100,
        self: this,
        tableData1: [{}],
        loading:false,
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.myRotaryInfo.path,
            params:{
              userId:"",
              userType:"",
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
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index){
        this.operailityData = this.tableData1[index];
        this.showModal = true;
      },

      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data || [];
        data = this.addIndex(data);
        this.tableData1=data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
        this.ajax(this.listMessTitle);
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        this.setTableData();
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
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
    components:{
      //当前组件引入的子组件
      show
    }

  }
</script>

