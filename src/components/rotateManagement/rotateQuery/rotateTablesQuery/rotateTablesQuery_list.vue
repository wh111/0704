<!----------------------------------
****--@name     轮转表查询
****--@role     ${*}
****--@date     2018/6/27
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">

    <el-form ref="formValidate" inline label-width="80px">
      <el-row style="margin-bottom:0">
        <el-col :span="8">
          <el-button type="primary" v-if="showView=='人员'" @click="exportUser">按人员导出</el-button>
          <el-button type="primary" v-if="showView=='科室'" @click="exportDep">按科室导出</el-button>
          <em style="font-size: 14px;font-weight: 700;">切换视图:</em>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
               <Icon type="person" v-if="showView=='人员'" size="18"></Icon>
              <!--<Icon type="ios-paper-outline" v-if="showView=='列表'" size="18"></Icon>-->
              <Icon type="ios-people" v-if="showView=='科室'" size="18"></Icon>
              {{showView}}视图<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item command="列表">
                <Icon type="ios-paper-outline" size="18"></Icon>
                列表
              </el-dropdown-item>-->
              <el-dropdown-item command="人员">
                <Icon type="person" size="18"></Icon>
                人员
              </el-dropdown-item>
              <el-dropdown-item command="科室">
                <Icon type="ios-people" size="18"></Icon>
                科室
              </el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </el-col>

        <!--搜索项-->
        <el-col :span="16" align="right">
          <el-form-item label="生源类型:">
            <el-select v-model="formValidate.userType" style="width: 100px" placeholder="请选择状态">
              <el-option label="实习生" value="SXS"></el-option>
              <el-option label="住院医" value="ZYY"></el-option>
              <el-option label="进修生" value="JXS"></el-option>
              <el-option label="研究生" value="YJS"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室级别:">
            <el-select v-model="formValidate.deptLevel" style="width: 120px" placeholder="请选择状态">
              <el-option label="三级科室" value="3"></el-option>
              <el-option label="四级科室" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建年份:">
            <el-date-picker
              style="width: 100px"
              v-model="formValidate.year"
              align="right"
              type="year"
              :editable="false"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <input class="hidden">
            <el-input style="width: 220px" placeholder="请输入内容" v-model="formValidate.userName">
              <div slot="prepend">姓名</div>
              <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
            </el-input>
          </el-form-item>

          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore" align="right">
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
          <el-form-item label="学院名称:" prop="schoolName">
            <el-input v-model="formValidate.schoolName"></el-input>
          </el-form-item>
          <el-button type="info" @click="handleSubmit('formValidate')">查询</el-button>
        </el-row>
      </div>
    </el-form>
    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <!--列表数据-->
        <autoArrangeByUserList v-if="showView=='人员'" :url="api" :params="changeTabViewParams"
                               :dynamicWt="dynamicHt"></autoArrangeByUserList>
        <autoArrangeByDepList v-if="showView=='科室'" :url="api" :params="changeTabViewParams"
                              :dynamicWt="dynamicHt"></autoArrangeByDepList>
      </div>
    </div>

    <!--人员导出到excel弹窗-->
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
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--科室导出到excel弹窗-->
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
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import autoArrangeByUserList from '../../../intern/internRotate/autoArrange/autoArrangeByUser_list.vue';
  import autoArrangeByDepList from '../../../intern/internRotate/autoArrange/autoArrangeByDep_list.vue';
  import api from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        api,
        showView: '人员',
        //查询
        formValidate: {
          userName: '',
          rtState: '',
          year: new Date(),
          sortby: '',
          schoolName: '',
          order: '',
          deptLevel: '3',
          userType: 'SXS'
        },
        //导出
        exportDepModal: false,
        exportUserModal: false,
        exportDepUrl: '',
        exportUserUrl: '',

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        dynamicWt: 0,
        self: this,
        searchMore: false,
        //默认展示列表----数据存储
        tableData1: [],

        //按部门展示列表----数据存储
        tableData2: [],

        //按人员展示列表----数据存储
        tableData3: [],

        //视图切换表格的参数
        changeTabViewParams: {},

        loading: false,
        listTotal: 0,
        //* 按钮 *//
        button: {
          deriveDepToExcelId: {
            id: 'deriveExcelId',
            title: '导出到excel'
          },
          deriveUserToExcelId: {
            id: 'deriveWordId',
            title: '导出'
          },
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          //url:this.listUrl,
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        }
        this.setTableData();
      },

      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 10;
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
        let formValidate = this.$util._.defaultsDeep({}, this.formValidate);
        formValidate = this.formDate(formValidate, ['year'], 'yyyy');
        this.changeTabViewParams = Object.assign({}, formValidate);
      },

      //切换列表展示视图
      handleCommand (command) {
//        this.setObjValEmpty(this.formValidate);
        this.showView = command;
//        if (this.showView == "列表") {
        this.setTableData();
//        }
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        this.setTableData()
      },

      //查询
      search () {
        this.setTableData();
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

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

      //按人员导出
      exportUser () {
        let myParams = this.formDate(Util._.defaultsDeep({}, this.formValidate), ['year'], 'yyyy');
        let params = Util.serializeParams(myParams, 'string');
        this.exportUserUrl = '/api' + api.userRotaryInfoExportExcel.path + '?' + params;
        this.openModel('exportUser');
      },

      //按科室导出
      exportDep () {
        let myParams = this.formDate(Util._.defaultsDeep({}, this.formValidate), ['year'], 'yyyy');
        let params = Util.serializeParams(myParams, 'string');
        this.exportDepUrl = '/api' + api.userRotaryDeptInfoExportExcel.path + '?' + params;
        this.openModel('exportDep');
      },
    },
    created () {
      Util = this.$util;
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
      })
    },
    components: {
      autoArrangeByUserList,
      autoArrangeByDepList
    }
  }
</script>
