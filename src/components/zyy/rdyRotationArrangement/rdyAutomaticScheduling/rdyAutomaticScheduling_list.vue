<!----------------------------------
****--自动排班(rdyAutomaticScheduling_list)
****--@date     2017/7/21
****--@author   zyc<332533011@qq.com
---------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        <div class="add-remove">
          <el-button type="primary" @click="add">自动安排</el-button>
          <el-button type="primary" @click="exportDep">按科室导出</el-button>
          <el-button type="primary" @click="exportUser">按人员导出</el-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <em style="font-size: 14px;font-weight: 700;">切换视图:</em>
          <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <Icon type="ios-paper-outline" v-if="showView=='列表'" size="18"></Icon>
            <Icon type="ios-people" v-if="showView=='科室'" size="18"></Icon>
            <Icon type="person" v-if="showView=='人员'" size="18"></Icon>
            {{showView}}视图<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="列表">
                <Icon type="ios-paper-outline" size="18"></Icon>
                列表
              </el-dropdown-item>
              <el-dropdown-item command="科室">
                <Icon type="ios-people" size="18"></Icon>
                科室
              </el-dropdown-item>
              <el-dropdown-item command="人员">
                <Icon type="person" size="18"></Icon>
                人员
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin"
                   label-width="60px">
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
    <br/>
    <div v-if="isShowMoreSearch">
      <el-form :inline="true" label-width="74px">
        <el-row>
          <el-form-item label="状态:">
            <el-select v-model="formValidate.rtState" placeholder="请选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="未安排轮转" value="0"></el-option>
              <el-option label="轮转中" value="99"></el-option>
              <el-option label="轮转结束" value="9999"></el-option>
              <el-option label="已安排未开始轮转" value="9"></el-option>
              <el-option label="轮转暂停" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="排序:">-->
          <!--<el-select v-model="formValidate.sortby" placeholder="请选择状态">-->
          <!--<el-option label="全部" value=""></el-option>-->
          <!--<el-option label="创建时间" value="createTime"></el-option>-->
          <!--<el-option label="状态" value="rtState"></el-option>-->
          <!--<el-option label="学院名称" value="schoolName"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="参培年份:">
            <el-date-picker
              v-model="formValidate.year"
              align="right"
              type="year"
              :editable="false"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <!--<el-form-item label="人员属性:">-->
          <!--<el-select v-model="formValidate.rotaryZyyType" placeholder="请选择状态">-->
          <!--<el-option label="全部" value=""></el-option>-->
          <!--<el-option label="社会人" value="社会人"></el-option>-->
          <!--<el-option label="单位人" value="单位人"></el-option>-->
          <!--<el-option label="研究生" value="研究生"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="培训方向:" v-if="showView=='列表'">
            <el-select filterable v-model="formValidate.rtProclass" clearable placeholder="请选择">
              <!--<select-option :type="'byNowUser'" ></select-option>-->
              <select-option type="getByCode" codeType="ROTARY_PROCLASS" isCode="true" :id="'value'"></select-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="handleSubmit('formValidate')">查询</el-button>
        </el-row>
      </el-form>
    </div>
    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          v-if="showView=='列表'"
          stripe
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData1"
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
            width="75">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160">
            <template scope="scope">
              <el-button size="small" @click="show(scope.$index)">查看轮转表</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="姓名"
            show-overflow-tooltip>
          </el-table-column>
          <!--<el-table-column
            prop="schoolName"
            label="学校"
            width="160"
            show-overflow-tooltip>
          </el-table-column>-->
          <el-table-column
            prop="rtProclass"
            label="培训方向"
            width="160"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="rotaryBeginTime"
            label="开始轮转时间"
            width="160"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="rotaryEndTime"
            label="结束轮转时间"
            width="160"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="rotaryState"
            label="状态"
            align="center"
            width="120"
          >
            <template scope="scope">
              {{scope.row.rotaryState | rotaryState}}
            </template>
          </el-table-column>

        </el-table>
        <autoArrangeByDepList v-if="showView=='科室'" :userType="userType"
                              :operailityData="formValidate" :params="changeTabViewParams"></autoArrangeByDepList>
        <autoArrangeByUserList v-if="showView=='人员'" :userType="userType"
                               :operailityData="formValidate" :params="changeTabViewParams"></autoArrangeByUserList>
      </div>
      <!--分页-->
      <div v-if="showView=='列表'" style="margin: 10px;">
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
    <!--新建-->
    <Modal
      close-on-click-modal="false"
      width="1100"
      v-model="addModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :userType="userType"
           :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
      width="800"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :userType="userType" @show="subCallback"
            :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--导出到excel弹窗-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="exportDepModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="button.deriveDepToExcelId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="exportDepUrl">
              <el-button @click="exportDepModal=false" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="exportDepModal=false">取消</el-button>
          </el-col>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--导出到excel弹窗-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="exportUserModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="button.deriveUserToExcelId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="exportUserUrl">
              <el-button @click="exportUserModal=false" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="exportUserModal=false">取消</el-button>
          </el-col>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import add from './autoArrange_add.vue';
  import show from './autoArrange_view.vue';

  import autoArrangeByDepList from './autoArrangeByDep_list.vue';
  import autoArrangeByUserList from './autoArrangeByUser_list.vue';

  import api from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      userType: {
        type: String,
        default: 'ZYY',
      }
    },
    data () {
      return {
        showView: '列表',
        //查询
        formValidate: {
          userName: '',
          year: '',
          rtState: '',
          rtProclass: '',
          rotaryZyyType: '',
        },
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        dynamicWt: 0,
        self: this,

        //默认展示列表----数据存储
        tableData1: [
          /*{
            "userId":111,
            "userName":"张三",
            "schoolName":"学校名称",
            "mobile":"手机号",
            "major":"呼吸内科",
            "idNumber":"身份证号",
            "totalCost":"总费用",
            "rtState":0,
            "rtStartTime":"2017-05-06",
            "isPrint":0
          }*/
        ],

        //按部门展示列表----数据存储
        tableData2: [],

        //按人员展示列表----数据存储
        tableData3: [],

        //视图切换表格的参数
        changeTabViewParams: {},

        loading: false,
        listTotal: 0,

        //导出
        exportDepModal: false,
        exportUserModal: false,
        exportDepUrl: api.userRotaryDepExportExcel.path + this.userType + '?userName=&rtState=',
        exportUserUrl: api.userRotaryExportExcel.path + this.userType + '?userName=&rtState=',

        /*--按钮button--*/
        addId: {id: 'addId', title: '新建'},
        viewId: {id: 'viewId', title: '查看'},
        //* 按钮 *//
        button: {
          deriveDepToExcelId: {
            id: 'deriveExcelId',
            title: '导出到excel'
          },
          deriveUserToExcelId: {
            id: 'deriveWordId',
            title: '导出到word'
          },
        },

        //当前组件默认请求(list)数据时,ajax处理的 默认列表展示
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.rotaryListInit.path + this.userType,
            params: {
              userName: '',
              schoolName: '',
              year: '',
              rtState: '',
              order: '',
              sortby: '',
            }
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        //获取初始化年份
        let year = new Date();
        console.log(year.getFullYear());
        this.formValidate.year = year.getFullYear() + '';
        //ajax请求参数设置

        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          //url:this.listUrl,
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }
        this.setTableData();
      },
      //切换列表展示视图
      handleCommand (command) {
//        this.setObjValEmpty(this.formValidate);
        this.showView = command;
        if (this.showView == '列表') {
          this.setTableData();
        }
      },
      /*
           * checkbox 选择后触发事件
           * @param val Array 存在所有的选择每一个行数据
           */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
        this.dynamicWt = content.parentNode.offsetWidth;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        this.tableData1 = [];
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = responseData.totalCount || 0;
      },

      setTableData () {
        let formValidate = Util._.defaultsDeep({}, this.formValidate);
        formValidate = this.formDate(formValidate, ['year'], 'yyyy');
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, formValidate);
        this.ajax(this.listMessTitle);
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        let formValidate = Util._.defaultsDeep({}, this.formValidate);
        formValidate = this.formDate(formValidate, ['year'], 'yyyy');
        if (this.showView == '列表') {
          let option = Util._.defaultsDeep({}, this.listMessTitle)
          option.ajaxParams.params = Object.assign(option.ajaxParams.params, this.queryQptions.params, formValidate);
          this.ajax(option);
        } else {
          let showView = this.showView;
          this.showView = null;
          this.showView = showView;
          let dynamicHt = this.changeTabViewParams['dynamicHt'];
          this.changeTabViewParams = {};
          this.changeTabViewParams['dynamicHt'] = dynamicHt;
          this.changeTabViewParams = Object.assign(this.changeTabViewParams, formValidate);
        }
      },

      //按科室导出
      exportDep () {
        let myParams = Object.assign({
          userName: '',
          year: '',
          rtState: '',
          schoolName: '',
        }, this.formValidate);
        myParams = this.formDate(myParams, ['year'], 'yyyy');
        let params = Util.serializeParams(myParams, 'string');
        this.exportDepUrl = '/api' + api.userRotaryDepExportExcel.path + this.userType + '?' + params;
        this.openModel('exportDep')
      },

      //按人员导出
      exportUser () {
        let userIds = this.multipleSelection.map(item => item.userId).join(',');
        let myParams = Object.assign({
          userName: '',
          year: '',
          rtState: '',
          schoolName: '',
          userIds,
        }, this.formValidate);
        myParams = this.formDate(myParams, ['year'], 'yyyy');
        let params = Util.serializeParams(myParams, 'string');
        this.exportUserUrl = '/api' + api.userRotaryExportExcel.path + this.userType + '?' + params;
        this.openModel('exportUser')
      },

      /*--点击--添加--按钮--*/
      add () {
        this.openModel('add');
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (index) {
        this.operailityData = this.tableData1[index];
        this.openModel('show');
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

    },
    created () {
      Util = this.$util;
      this.init();
    },
    watch: {
      dynamicHt (val) {
        this.changeTabViewParams['dynamicHt'] = val;
        this.changeTabViewParams['dynamicWt'] = this.dynamicWt;
      }
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {
      add, show, autoArrangeByDepList, autoArrangeByUserList,
    }
  }
</script>
