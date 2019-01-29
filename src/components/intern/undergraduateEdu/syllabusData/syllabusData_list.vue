<!----------------------------------
****--课程资料(syllabusData_list)
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
        :data="tableData1"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="70">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="160">
          <template scope="scope">
            <el-button v-if="typeof scope.row.courseDataId=='number'" size="small" @click="show(scope.$index, scope.row)">查看</el-button>
            <el-button v-if="typeof scope.row.courseDataId=='number'" size="small" @click="edit(scope.$index, scope.row)">修改</el-button>
            <!--<el-button size="small" @click="show(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" @click="edit(scope.$index, scope.row)">修改</el-button>-->
            <el-button v-if="typeof scope.row.courseDataId!='number'" size="small" @click="upload(scope.$index, scope.row)">上传</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="courseContent"
          label="课程名">
        </el-table-column>
        <el-table-column
          prop="courseType"
          label="类型"
          align="center"
          width="80"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="courseTime"
          label="时间"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="timeInfo"
          label="时间段"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="courseDataState"
          label="状态"
          align="center"
          width="100"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.courseDataState=='SUBMIT'?'已提交':''}}
            {{scope.row.courseDataState=='NO_SUBMIT'?'未提交':''}}
          </template>
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
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="true"
      :width="660"
    >
      <modal-header slot="header" :parent="self" :content="showId"></modal-header>
      <show v-if="showModal"  @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>

    <!--修改上传弹窗-->
    <Modal
      :mask-closable="false"
      v-model="uploadEditModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="660">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="editId"></modal-header>
      <edit-upload v-if="uploadEditModal"  @cancel="cancel" @uploadEdit="subCallback" :operaility-data="operailityData"></edit-upload>
      <div slot="footer"></div>
    </Modal>

    <!--上传弹窗-->
    <Modal
      :mask-closable="false"
      v-model="uploadModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="660">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="uploadId"></modal-header>
      <upload v-if="uploadModal"  @cancel="cancel" @upload="subCallback" :operaility-data="operailityData"></upload>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  import show from "./syllabusData_view.vue";
  import upload from "./syllabusData_upload.vue";
  import editUpload from "./syllabusData_uploadEdit.vue";

  //引入当前组件字典api
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    data() {
      return {
        editId:{
          id:'edit',
          title:'修改'
        },
        editOperailityData:"",
        //列表查询
        formValidate:{},

        /*--按钮button--*/
        showId:{
          id:'auditId',
          title:'查看'
        },
        editId:{
          id:'edit',
          title:'修改'
        },
        editId:{id:'editId',title:'修改'},
        uploadId:{
          id:'upload',
          title:'上传'
        },
        uploadModal: false, //上传模态窗体
        uploadEditModal:false,  //上传修改模态窗体

        dynamicHt: 100,
        self: this,
        tableData1: [
          /*{
            "courseDataId":"",
            "courseContent":"111",
            "courseType":"见习",
            "courseTime":"2017-02-08",
            "courseDataCreateTime":"2017-02-08",
            "courseDataState":"NO_SUBMIT"
          }*/
        ],
        loading:false,
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:api.teacherCourseFileList.path,
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
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(index){
        if(typeof index == 'undefined'){
          if(!this.isSelected(true)) return;
          this.operailityData = this.multipleSelection[0];
          this.openModel('uploadEdit')
        }else {
          this.operailityData = this.tableData1[index];
          this.openModel('uploadEdit')
        }
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index){
        this.operailityData = this.tableData1[index];
        this.openModel("show");
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      upload(index){
        this.operailityData = this.tableData1[index];
        this.openModel("upload");
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
      show,upload,editUpload
    }
  }
</script>
