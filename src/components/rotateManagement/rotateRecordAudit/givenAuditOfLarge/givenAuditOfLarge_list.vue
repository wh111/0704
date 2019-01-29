<!--
****--出大科审核(dd)
****--@date     2017/7/3
****--@author   gx
-->
<template>
  <div ref="givenTheApplicationOfLarge">
    <!--<el-row>-->
      <!--<el-col>-->
        <!--<el-form :inline="true">-->
          <!--<el-form-item label="排序字段：">-->
            <!--<el-select v-model="otherParams.sortby" placeholder="请选择">-->
              <!--<el-option v-for="item in sortbyOption" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="排序方式：">-->
            <!--<el-select v-model="otherParams.order" placeholder="请选择">-->
              <!--<el-option v-for="item in orderOption" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-button type="info" @click="search">查看</el-button>-->
        <!--</el-form>-->
      <!--</el-col>-->
    <!--</el-row>-->
    <!-- 数据表格 -->
    <div id="tableData" ref="tableData" class="givenTheAppTable">
      <el-table align="center" :context="self" :height="dynamicHt" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="序号" prop="index" width="100"></el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template scope="scope">
            <el-button :disabled="!scope.row.examinationId" size="small" type="warning" @click="show(scope.row)">查看</el-button>
            <el-button :disabled="scope.row.state !== 'EDU_NOT_REPORT'" size="small" type="success" @click="rotary(scope.row)">审核</el-button>
            <!-- <el-button :disabled="!scope.row.examinationId" size="small" type="success" @click="rotary(scope.row)" v-if="scope.row.depQualified === 'QUALIFIED'">审核</el-button> -->
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="科室" prop="greatName" show-overflow-tooltip></el-table-column>
        <el-table-column label="入科时间" prop="rotaryBeginTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="出科时间" prop="rotaryEndTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.rotaryEndTime || '---' }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="理论考核成绩" prop="theoryScore" show-overflow-tooltip></el-table-column>
        <el-table-column label="技能考核成绩" prop="skillScore" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="出科是否合格" prop="depQualified" show-overflow-tooltip>
          <template scope="scope">
            {{ (scope.row.depQualified || '-') | typeText }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 出科 -->
    <Modal :mask-closable="false" v-model="rotaryModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.rotaryId"></modal-header>
      <rotary v-if="rotaryModal" @cancel="cancel" @rotary="subCallback" :operaility-data="operailityData"></rotary>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import orderOption from '../../rotateRecordWrite/givenTheApplicationOfLarge/orderOption'; // 排序方式
  import sortbyOption from '../../rotateRecordWrite/givenTheApplicationOfLarge/sortbyOption'; // 排序字段
  import rotary from './givenAuditOfLarge_rotary'; // 出科
  import show from '../../rotateRecordWrite/givenTheApplicationOfLarge/givenTheApplicationOfLarge_view'; // 查看
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        orderOption,
        sortbyOption,
        tableData: [],
        self: this,
        totalCount: 0,
        dynamicHt: 100,
        loading: false,
        operailityData: [],
        otherParams: {
          sortby: '', // rotaryBeginTime|开始时间 endBeginTime|结束时间 theoryScore|理论成绩 skillScore|技能成绩
          order: 'DESC',
        },
        rotaryModal: false,
        theoryModal: false,
        skillModal: false,
        depQualifiedModal: false,
        contentHeader: {
          rotaryId: {
            id: 'rotaryId',
            title: '出科申请'
          },
          showId: {
            id: 'showId',
            title: '查看'
          },
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.managePagelist.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.setTableData();
      },
      /*************************************** 数据获取 **********************************/
      // 获取科室
      getDepartmentOption() {
        this.ajax({
          ajaxSuccess: res =>{

            if (res.data && res.data.length){
              this.departmentOption= this.getQTBObj(res.data);
            }
          } ,

          ajaxParams: {
            url: api.getDepartmentTree.path + this.userInfo.roleList[0].identify + '-' + this.userInfo.id,
            method: api.getDepartmentTree.method,
          }
        })
      },

      // 处理科室数据结构（三级以下）
      getQTBObj(arr,res,depth=-1){
        depth++;
        let t = res || [];
        if(arr && arr.length) {
          arr.map(item => {
            item.label='　'.repeat(depth)+item.depName;
            t.push(item);
            if (item.childList){
              return t.concat(this.getQTBObj(item.childList,t,depth))
            }
          })
        }
        return t
      },
      /*************************************** 表格相关 **********************************/
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
        Object.assign(this.queryQptions.params, this.otherParams);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = this.addIndex(res.data || []);
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contentHeight = this.$refs.givenTheApplicationOfLarge.parentNode.offsetHeight;
        let tableData = this.$refs.tableData;
        let paginationHt = 50;
        this.dynamicHt = contentHeight - tableData.offsetTop - paginationHt;
      },
      /*************************************** 按钮事件 **********************************/
      // 出科
      rotary(row) {
        this.operailityData = row;
        this.openModel('rotary');
      },
      // 搜索
      search() {
        this.setTableData()
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },
      /*************************************** 模态框 **********************************/
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
      // 操作回调
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
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
    },
    watch: {},
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
      rotary,
      show,
    }
  }

</script>

<style lang="scss">
  .givenTheAppTable {
    .el-tag {
      cursor: pointer;
    }
  }

</style>
