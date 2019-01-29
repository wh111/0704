<!----------------------------------
****--@name     组织复试
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
---------------------------------->
<template>
  <div ref="porContent" class="modal">
    <el-form :model="formValidate" :inline="true" :rules="rules" ref="formValidate">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="12">
          <el-button type="info" @click="add">添加组织</el-button>
          <el-button type="danger" @click="remove">删除信息</el-button>
          <el-button type="warning" @click="derive">导出组织信息</el-button>

        </el-col>
        <!--搜索项-->
        <el-col :span="12" align="right">
          <el-form-item label="专业方向:" prop="major">
            <el-select v-model="formValidate.majorCode" clearable placeholder="请选择">
              <!--<el-option v-for="(item,index) in majorData" :key="index" :label="(item.value || '全部')+ (item.code ? '（'+ item.code +'）' : '')"-->
              <!--:value="item.value"></el-option>-->
              <major></major>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="年届:" prop="boundary">-->
          <!--<el-date-picker v-model="formValidate.boundary" type="year" placeholder="选择年份" :editable="false"-->
          <!--@change="selectBoundary"></el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-button @click="searchEvent" type="info">搜索</el-button>
            <el-button @click="backList">返回列表</el-button>
            <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
          </el-form-item>
        </el-col>
        <!--高级搜索项-->
        <!--<el-col v-if="searchMore" ref="searchMore" align="right">-->
        <!--<el-form-item label="年届:" prop="boundary">-->
        <!--<el-date-picker v-model="formValidate.boundary" type="year" placeholder="选择年份" :editable="false"-->
        <!--@change="selectBoundary"></el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-button type="info" @click="searchEvent">查询</el-button>-->
        <!--</el-col>-->
      </el-row>
    </el-form>

    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData"
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
            width="100">
          </el-table-column>
          <el-table-column
            label="操作"
            width="70" align="center">
            <template scope="scope">
              <!--<el-button type="success" size="small" @click="show(scope.row)">查看</el-button>-->
              <el-button type="info" size="small" @click="edit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
          <!--<el-table-column label="年届" prop="boundary" show-overflow-tooltip></el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="majorCode"
            label="专业代码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="major"
            label="专业方向">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="time"
            label="复试时间">
            <template scope="scope">
              {{ scope.row.time | formatDate('yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="address"
            label="复试地点">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="userNames"
            label="复试组人员"
          >
            <template scope="scope">
              {{scope.row.userNames.replace(',', '、')}}
            </template>
          </el-table-column>

        </el-table>
      </div>
      <!--分页-->
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
    <!--新建-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="addModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <edit v-if="addModal" @cancel="cancel" @add="subCallback" :noticeData="noticeData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--修改-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="editModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :noticeData="noticeData"
            :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--删除弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="deleteUrl" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>

      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal"
           class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>

      <ajaxDerive type="derive" @cancel="cancel" :url=" api.excelExport" :params="formValidate" messTitle="确定要导出组织信息吗？"
                  @derive="subCallback"></ajaxDerive>
      <!--<div>
        <div class="remove">确认导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="excelExportUrl">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click=" deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>-->
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import major                                    from '../../common/major.vue';
  import ajaxDerive                               from '../../../common/ajax-derive.vue';
  import api                                      from './api';
  import { ptOrganizationReexamineList as rules } from '../rules';
  //引入--修改--组件
  import edit                                     from './ptOrganizationReexamine_input.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['noticeData'],
    data () {
      return {
        api,
        rules,
        majorData: [],
        //查询表单
        excelExportUrl: '',
        deleteUrl: api.delete,
        formValidate: {
//          boundary: '',       //年级
//          major: '',//专业
          majorCode: '',//专业代码
          batch: this.noticeData.id // 批次
        },

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        searchMore: false,
        loading: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.list.path,
            method: api.list.method,
            params: {}
          }
        },
        deriveModal: false,
        /*--按钮button--*/
        addId: {id: 'addId', title: '新建'},
        editId: {id: 'editId', title: '修改'},
        removeId: {id: 'removeId', title: '删除'},
        viewId: {id: 'viewId', title: '查看'},
        deriveId: {id: 'deriveId', title: '导出'}

      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        };
//        this.getMajor();
        this.setTableData();
      },
      // 获取专业
      getMajor () {
        let opt = {
          ajaxSuccess: res => {
            if (res.data && res.data.child) {
              this.majorData = res.data.child;
            }
            this.majorData.unshift({code: '', value: ''});
          },
          ajaxError: () => this.errorMess('获取专业失败'),
          ajaxParams: {
            url: api.majorList
          }
        };
        this.ajax(opt);
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.porContent;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 30;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
      // 选择年届
      selectBoundary (val) {
        this.formValidate.boundary = val;
      },
      //确定导出
      affirmDerive () {
        this.cancel('derive');
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择数据!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        this.tableData = this.addIndex(responseData.data || []);
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions,
          this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //搜索监听回调
      searchEvent (isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData();
        }
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        let flag = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
        return flag;
      },

      /*--点击--添加--按钮--*/
      //导出
      derive () {
        this.openModel('derive');
      },
      add () {
        this.openModel('add');
      },
      /*--点击--修改--按钮--*/
      edit (data) {
        this.operailityData = data;
        this.openModel('edit');
      },
      /*--点击--删除--按钮--*/
      remove () {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (data) {
        this.operailityData = data;
        this.openModel('show');
      },
      // 返回列表
      backList () {
        this.$emit('show', 'notice');
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
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
      subCallback (target, title, updata) {
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
      openModel (options) {
        this[options + 'Modal'] = true;
      },

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight();
        });
      }

    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    components: {
      //当前组件引入的子组件
//      add,
      edit, major, ajaxDerive

    }
  };
</script>
