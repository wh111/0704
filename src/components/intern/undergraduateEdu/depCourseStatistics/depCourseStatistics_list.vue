<!----------------------------------
****--课程表管理(syllabusManagement_list)
****--@date     2017/6/17
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
        stripe
        :data="tableData1"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          label="序号"
          prop="index"
          width="70">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="80">
          <template scope="scope">
            <el-button
              size="small"
              @click="show(scope.$index,scope.row)">查看</el-button>

          </template>
        </el-table-column>
        <el-table-column
          prop="schoolName"
          label="学校"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="gradeNum"
          label="年级"
          align="center"
          width="80"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="classNum"
          label="班级"
          align="center"
          width="300" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="startWeekSetYear"
          label="开始年度"
          align="center"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="endWeekSetYear"
          label="结束年度"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="semester"
          label="学期"
          align="center"
          show-overflow-tooltip
          width="100">
          <template scope="scope">
            {{scope.row.semester=='ONE'?'一学期':'二学期'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="startEndWeekSetTime"
          label="起止时间"
          align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="weekSetState"
          label="状态"
          align="center"
          width="120">
          <template scope="scope">
            {{scope.row.weekSetState | courseStatistics}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="150">
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
      <!--查看弹窗-->
      <Modal
        :mask-closable="false"
        v-model="showModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="900"
      >
        <modal-header slot="header" :content="showId"></modal-header>
        <show v-if="showModal"  @cancel="cancel"   :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--修改--组件
  import show from "./depCourseStatistics_view.vue";
  //引入当前组件字典api
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    data() {
      return {
        showId:{
          id:'auditId',
          title:'查看'
        },
        //列表查询
        formValidate:{},
        dynamicHt: 100,
        self: this,
        tableData1: [
          /*{
            "weekSetId":"",
            "schoolName":"",
            "gradeNum":"",
            "classNum":"",
            "startWeekSetYear":"",
            "endWeekSetYear":"",
            "semester":"",
            "startEndWeekSetTime":"",
            "createTime":"",
            "whetherArrangedCourse":"",
            "weekState":""
          }*/
        ],
        loading:false,
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:api.courseStatistics.path,
            params:{
              schoolName:'',
              gradeNum:'',
              classNum:'',
              semester:'',
              weekSetYear:'',
              sortby:'',
              order:''
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
        this.tableData1= data;
        this.listTotal = responseData.totalCount || 0;
      },


      setTableData(params){
        this.setAjaxParams();
        this.ajax(this.listMessTitle);
      },


      //设置提交的参数
      setAjaxParams(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index){
        this.operailityData = this.tableData1[index];
        this.showModal = true;
      },


      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
      },


      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *    }
       * @param udata boolean 默认false  是否不需要刷新当前表格数据
       * */
      subCallback(target,title,updata){
        this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.setTableData();
        }
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
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
    components: {
      show
    }
  }
</script>

