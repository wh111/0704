<!--引入百度地图-->

<!--系统设置-->
<!--考勤位置-->
<template>
  <div id="content" ref="content" class="modal">
    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        <!--表格数据操作按钮-->
        <div class="ivu-row">
          <div class="ivu-col ivu-col-span-24">
            <el-button class="but-col" @click="add" type="primary">新 建</el-button>
            <el-button @click="remove" type="danger">删除</el-button>
          </div>
        </div>
      </div>
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin"
                   label-width="60px">
            <div class="listUpArea-searchLeft">
              <input class="hidden">
              <el-input placeholder="请输入内容" v-model="formValidate.placeName">
                <div slot="prepend">地点</div>
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
    <br/>
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
          style="width: 100%"
          @selection-change="handleSelectionChange">

          <el-table-column
            label="序号"
            type="index"
            width="75">
          </el-table-column>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column label="操作" width="200" align="center">
            <template scope="scope">
              <el-button
                size="small"
                type="info"
                @click="show(scope.$index,scope.row)">查看
              </el-button>
              <el-button
                :disabled="scope.row.status==1"
                size="small"
                type="primary"
                @click="edit(scope.$index, scope.row)">修改
              </el-button>
              <el-button v-if="scope.row.status==1" size="small" class="but-col"
                         @click="forbidden(scope.$index, scope.row)">启 用
              </el-button>
              <el-button v-if="scope.row.status==0" size="small" class="but-col"
                         @click="startUsing(scope.$index, scope.row)" type="danger">禁 用
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="placeName"
            label="打卡地点名称"

          >
          </el-table-column>
          <el-table-column
            prop="scope"
            label="可打卡范围"
            width="120">
            <template scope="scope">
              {{scope.row.scope | unit('m')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="setType"
            label="可打卡人员"
          >
            <template scope="scope">
              <span v-if="scope.row.setType=='ALL'">全部人员</span>
              <span v-else style="margin-left:3px;" v-for="(item,index) in scope.row.roleList" :key="index">{{item.roleCName}}
                <span v-if="scope.row.roleList.length>(index+1)">,</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="startDate"
            label="开始时间"
            width="120">
            <template scope="scope">
              <span v-if="scope.row.effectiveType=='ALL'">所有时间可用</span>
              <span v-else>{{scope.row.startDate}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="结束时间"
            width="120"
          >
            <template scope="scope">
              <span v-if="scope.row.effectiveType=='ALL'">所有时间可用</span>
              <span v-else>{{scope.row.endDate}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="120"
          >
            <template scope="scope">
              {{scope.row.status==0?'启用':'禁用'}}
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
    </div>
    <!--修改弹窗-->
    <div class="checkLocation">
      <Modal
        :mask-closable="false"
        v-model="editModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="960">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="editId"></modal-header>
        <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
        <div slot="footer"></div>
      </Modal>
    </div>
    <!--增加弹窗-->
    <div class="checkLocation">
      <Modal
        :mask-closable="false"
        v-model="addModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="960">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="addId"></modal-header>
        <add v-if="addModal" @cancel="cancel" @add="subCallback"></add>
        <div slot="footer"></div>
      </Modal>
    </div>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="960"
    >
      <modal-header slot="header" :parent="self" :content="showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--启用弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="enableModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="forbiddenId"></modal-header>
      <operate v-if="enableModal" :type="'enable'" :operate-data="enableData" @operate="subCallback" @cancel="cancel"
               :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--禁用弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="disEnableModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="startUsingId"></modal-header>
      <operate v-if="disEnableModal" :type="'disEnable'" :operate-data="useingData" @operate="subCallback"
               @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--审查--组件
  import edit from "./checkLocation_edit.vue";

  //引入--查看--组件
  import show from "./checkLocation_view.vue";
  //引入--添加--组件
  import add from "./checkLocation_add.vue";
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        //查询表单
        deleteUrl: '/attendance/clockSet/remove/',
        //form表单bind数据
        formValidate: {
          longitude: '',
          latitude: '',
          placeName: '',
          scope: '',
          setType: "",
          roleIds: "",
          effectiveType: "",
          startDate: "",
          endDate: "",
          status: "",
        },
        /*--按钮button--*/
        addId: {
          id: 'add',
          title: '添加'
        },
        removeId: {
          id: 'remove',
          title: '删除'
        },
        editId: {
          id: 'edit',
          title: '修改'
        },
        showId: {
          id: 'auditId',
          title: '查看'
        },
        forbiddenId: {
          id: 'forbidden',
          title: '禁用'
        },
        startUsingId: {
          id: 'startUsing',
          title: '启用'
        },


        //启用
        enableModal: false,
        enableData: {
          url: '/attendance/clockSet/modifyStatus',
          method: "put",
          data: {
            status: '0'
          }
        },

        //禁用
        disEnableModal: false,
        useingData: {
          url: '/attendance/clockSet/modifyStatus',
          method: "put",
          data: {
            status: '1'
          }
        },


        shortNoteModal: false,
        toChannelModal: false,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [],
        loading: false,
        listTotal: 0,
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '/attendance/clockSet/list',
            params: {
              placeName: "",
              roleId: "",
              status: ""
            }
          }
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
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight() {
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
      isSelected(isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择数据!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        this.tableData1 = [];
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, this.formValidate);
        this.ajax(this.listMessTitle);
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        this.setTableData();
      },
      /*--点击--添加--按钮--*/
      add() {
        this.openModel('add');
      },
      /*--点击--删除--按钮--*/
      remove() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index) {
        this.operailityData = this.tableData1[index];
        this.showModal = true;
      },
      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(index) {
        if (typeof index == 'undefined') {
          if (!this.isSelected(true)) return;
          this.operailityData = this.multipleSelection[0];
          this.openModel('edit')
        } else {
          this.operailityData = this.tableData1[index];
          this.openModel('edit')
        }
      },
      /*
       * 点击--禁用--按钮
       * @param index string|number  当前行索引
       * */
      forbidden(index) {
        this.operailityData = this.tableData1[index];
        this.openModel("enable");
      },
      /*
       * 点击--启用 --按钮
       * @param index string|number  当前行索引
       * */
      startUsing(index) {
        this.operailityData = this.tableData1[index];
        this.openModel("disEnable");
      },


      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
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
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.formValidate = this.setObjValEmpty(this.formValidate);
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
      //tree
      treeClick(obj, node, self) {
        //出现切换按钮
        this.flag = true;
        this.clickId = obj.id
        this.targetKeys2 = [9]
        store = node.store;
        this.tableData1 = obj.children;

      },
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
      //当前组件引入的子组件
      edit, add, show
    }

  }
</script>

