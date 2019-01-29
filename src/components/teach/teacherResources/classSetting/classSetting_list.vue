<!--课时费-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form v-if="viewType!=='classManagement'" ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10">
          <el-button type="primary" @click="add">添加</el-button>
          <el-button type="danger" @click="remove">删除</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item label="课程类型:" prop="userType">
            <el-select placeholder="请选择课程类型" v-model="formValidate.type">
              <selectOption type="getByCode" :isCode="true" :unAll="true" id="value" codeType="TEACH_COURSE_TYPE"></selectOption>
            </el-select>
          </el-form-item>
          <el-button @click="handleSubmit('formValidate')" icon="search"></el-button>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore">
        <el-form-item label="职称:" prop="userType">
          <el-select placeholder="请选择职称" v-model="formValidate.teachLevel">
            <el-option v-for="(item,index) in teachLevelOptions" :key="index" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="info" @click="handleSubmit">查询</el-button>
      </div>
    </el-form>
    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div id="myTable" ref="myTable">
        <el-table align="center" :height="dynamicHt" border :data="tableData" tooltip-effect="dark"
                  highlight-current-row style="width: 100%;height: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" v-if="viewType!=='classManagement'">
          </el-table-column>
          <el-table-column align="center" label="序号" prop="index" width="75">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" v-if="viewType!=='classManagement'">
            <template scope="scope">
              <el-button size="small" @click="show(scope.$index)">查看</el-button>
              <el-button size="small" @click="edit(scope.$index)">修改</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="teachLevel" label="职称" width="120">
          </el-table-column>
          <el-table-column prop="type" label="课程类型" width="120">
          </el-table-column>
          <el-table-column label="优" align="center">
            <el-table-column prop="excellent" label="评分" align="center">
              <template scope="scope">
                {{scope.row.excellent}}-{{scope.row.excellentMax}}
              </template>
            </el-table-column>
            <el-table-column prop="excellentFee" label="课时费" align="center">
              <template scope="scope">
                {{scope.row.excellentFee | money}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="type" label="良" align="center">
            <el-table-column prop="good" label="评分" align="center">
              <template scope="scope">
                {{scope.row.good}}-{{scope.row.goodMax}}
              </template>
            </el-table-column>
            <el-table-column prop="goodFee" label="课时费" align="center">
              <template scope="scope">
                {{scope.row.goodFee | money}}
              </template>
            </el-table-column>

          </el-table-column>
          <el-table-column prop="avg" label="中" align="center">
            <el-table-column prop="avg" label="评分" align="center">
              <template scope="scope">
                {{scope.row.avg}}-{{scope.row.avgMax}}
              </template>
            </el-table-column>
            <el-table-column prop="avgFee" label="课时费" align="center">
              <template scope="scope">
                {{scope.row.avgFee | money}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="差" align="center">
            <el-table-column prop="bad" label="评分" align="center">
              <template scope="scope">
                {{scope.row.bad}}-{{scope.row.badMax}}
              </template>
            </el-table-column>
            <el-table-column prop="badFee" label="课时费" align="center">
              <template scope="scope">
                {{scope.row.badFee | money}}
              </template>
            </el-table-column>
          </el-table-column>

        </el-table>
      </div>
      <!--分页-->
    </div>
    <!--新建-->
    <Modal close-on-click-modal="false" width="1000" v-model="addModal" title="对话框标题" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!--修改-->
    <Modal close-on-click-modal="false" width="1000" v-model="editModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>

      <div slot="footer"></div>
    </Modal>
    <!--查看档案管理弹窗-->
    <Modal width="1000" v-model="showModal" title="查看档案管理弹窗" class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //引入--新建--组件
  import add from "./classSetting_add.vue";
  //引入--修改--组件
  import edit from "./classSetting_edit.vue";
  //引入--查看--组件
  import show from "./classSetting_view.vue";

  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['viewType'],//如果有值，则课时费管理调用
    data() {
      return {
        //查询表单
        deleteUrl: api.delete,
        formValidate: {
          type: '',
          teachLevel: '',
        },
        teachLevelOptions: [
          {
            value: '',
            label: "全部"
          }, {
            value: '正高',
            label: "正高"
          }, {
            value: '副高',
            label: "副高"
          }, {
            value: '初级',
            label: "初级"
          }],
        typeOptions: [
          {
            value: '',
            label: "全部"
          },
          {
            value: '技能',
            label: '技能'
          },
          {
            value: '理论',
            label: '理论'
          }],

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        tableData: [],
        loading: false,
        searchMore: false,
        listTotal: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          //          paramsData:'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.list.path,
            method: api.list.method,
            params: {
              type: "",
              teachLevel: ""
            }
          }
        },
        /*--按钮button--*/
        addId: {
          id: 'addId',
          title: '新建'
        },
        editId: {
          id: 'editId',
          title: '修改'
        },
        removeId: {
          id: 'removeId',
          title: '删除'
        },
        viewId: {
          id: 'viewId',
          title: '查看'
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
          //url:this.listUrl,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.setTableData();
      },


      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 0;
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
        this.tableData = [];
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.formValidate);
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
        this.openModel("add");
      },
      /*--点击--修改--按钮--*/
      edit(index) {
        this.operailityData = this.tableData[index];
        this.openModel("edit");
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
        this.operailityData = this.tableData[index];
        this.openModel("show");
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

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
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
      add,
      edit,
      show
    }
  }

</script>
