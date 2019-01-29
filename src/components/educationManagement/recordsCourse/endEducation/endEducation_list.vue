<!----------------------------------
****--@name     结束进修
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content">
    <el-row>
      <el-form :inline="true">
        <el-col :span="3">
          <el-form-item>
            <el-button type="danger" @click="end">结束进修</el-button>
          </el-form-item>
          <!--<el-form-item>-->
            <!--<el-button type="info">打印结业证书</el-button>-->
          <!--</el-form-item>-->
        </el-col>
        <el-col :span="21" align="right">
          <el-form-item label="申请人：">
            <el-input v-model="searchObj.userName"></el-input>
          </el-form-item>
          <el-form-item label="进修科目：">
            <el-input v-model="searchObj.courseNames"></el-input>
          </el-form-item>
          <el-form-item label="职称：">
            <el-input v-model="searchObj.title"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="search">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 数据表格 -->
    <div ref="table">
      <el-table align="center" :context="self" :height="dynamicHt" :data="tableData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canTodo"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)" :disabled="!scope.row.reportId">查看</el-button>
            <el-button size="small" type="warning" @click="edit(scope.row)" :disabled="(!scope.row.reportId) || (scope.row.rtState == 0) || (scope.row.sub_state == 'PASS')">鉴定填写</el-button>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="userName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="职称" prop="title" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="手机号" prop="phone" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="进修科目" prop="courseNames" align="center" show-overflow-tooltip></el-table-column>
        <!--<el-table-column label="科室" prop="courseDepName" align="center" show-overflow-tooltip></el-table-column>-->
        <el-table-column label="状态" prop="rtState" align="center" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.rtState | isEnd }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200"  class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200"  class-name="vertical-center-modal" :loading="true"
           :width="1000">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" ></show>
      <div slot="footer"></div>
    </Modal>
    <!--结束进修-->
    <Modal :mask-closable="false" v-model="endModal"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="button.endId"></modal-header>
      <div>
        <div class="remove">确认结束进修吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <el-button @click="endCall" type="primary">确定</el-button>
            <el-button class="but-col" @click="cancel('end')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import statusOption from './statusOption';
  import edit from './endEducation_edit.vue';
  import show from './endEducation_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        statusOption,
        reportedUrl: api.add.path,
        searchObj: {
          userName: '', // 申请人
          courseNames: '', // 进修科目
          title: '', // 职称
        },
        //* 表格 *//
        self: this,
        totalCount: 0,
        loading: false,
        dynamicHt: 100, // 表格高度
        multipleSelection: '', // 选项
        operailityData: '',
        tableData: [], // 表格数据
        endModal:false,
        //* 按钮 *//
        button: {
          showId: {
            id: 'showId',
            title: '查看进修结束报告'
          },
          editId: {
            id: 'editId',
            title: '进修结束报告鉴定填写'
          },
          endId:{
            id: 'endId',
            title: '结束进修'
          },
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.setTableData()
      },
      //*----------- 表格 ------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content.parentNode.offsetHeight;
        let myTable = this.$refs.table.offsetTop;
        let paginationHt = 50;
        this.dynamicHt = content - myTable - paginationHt;
      },
      // 是否允许参与选择
      canTodo(row){
        return row.rtState != 1
      },
      /*----------- 模态框 -------------*/
      // 编辑
      edit(row) {
        this.operailityData = row;
        this.openModel('edit');
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 结束进修
      end() {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('end')
        }
      },
      // 结束进修回调
      endCall(){
        let subjectsIds = [];
        this.operailityData.map(item=>subjectsIds.push(item.subjectsId));
        let opt = {
          ajaxSuccess:()=> this.subCallback('end','结束进修成功'),
          ajaxError:()=>this.errorMess('结束进修失败'),
          ajaxParams:{
            url: api.add.path,
            method:api.add.method,
            data:{
              subjectsIds:subjectsIds.join(',')
            }
          }
        };
        this.ajax(opt)
      },
      // 回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },


      /*
       * 列表数据选择
       */
      isSelected() {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len < 1) {
          this.showMess("请选择数据!");
          flag = false;
        }
        return flag;
      },
      // 搜索
      search() {
        this.setTableData();
      }

    },
    created() {
      this.init();
    },
    mounted() {
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
      edit,
      show,
    }
  }
</script>
