<!----------------------------------
****--@name     录取
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form :model="formValidate" :rules="rules" ref="formValidate" inline>
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="14">
          <el-form-item>
            <el-button type="success" :disabled="disabled.enroll" @click="enroll">录取</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" :disabled="disabled.enroll" @click="noEnroll">不录取</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="sendMsg">发送短信给录取人员</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="toChannel">从Excel导入录取人员</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="openModel('derive')">导出录取信息到Excel</el-button>
          </el-form-item>
        </el-col>
        <!--搜索项-->

        <el-col :span="10" align="right">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="formValidate.name" placeholder="输入姓名搜索">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="searchEvent">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>

        <!--高级搜索项-->
        <el-col align="right" v-if="searchMore" ref="searchMore">

          <el-form-item label="专业方向:">
            <el-select v-model="formValidate.majorCode" clearable placeholder="请选择">
              <!--<el-option v-for="(item,index) in majorData" :key="index"-->
              <!--:label="(item.value || '全部')+ (item.code ? '（'+ item.code +'）' : '')"-->
              <!--:value="item.value"></el-option>-->
              <major></major>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="年届:" prop="boundary">-->
          <!--<el-date-picker v-model="formValidate.boundary" type="year" placeholder="选择年份"-->
          <!--@change="selectBoundary"></el-date-picker>-->
          <!--</el-form-item>-->

          <el-form-item label="成绩:" prop="minScore" style="margin-right: 0;">
            <el-input v-model="formValidate.minScore" placeholder="最小成绩">
            </el-input>
          </el-form-item>
          <span style="line-height: 36px;">~</span>
          <el-form-item prop="maxScore">
            <el-input v-model="formValidate.maxScore" placeholder="最大成绩">
            </el-input>
          </el-form-item>

          <el-form-item label="录取状态:" prop="enterStrtus">
            <el-select filterable v-model="formValidate.enterStrtus" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="录取" value="ENROLL"></el-option>
              <el-option label="不录取" value="NOENROLL"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="info" @click="searchEvent">{{ 'query' | sysLan }}</el-button>
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>

    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div id="myTable" ref="myTable">
        <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                  highlight-current-row style="width: 100%;height: 100%" @selection-change="handleSelectionChange">
          <el-table-column  type="selection" :selectable='checkboxInit' width="55" >
          </el-table-column>
          <el-table-column align="center" label="序号" prop="index" width="100">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="studentId" label="学号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="姓名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sex" label="性别" align="center">
            <template scope="scope">
              {{scope.row.sex | typeText}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="phone" label="电话号码">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="major" label="专业方向">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="messageStrtus" label="短信通知">
            <template scope="scope">
              <el-button v-if="scope.row.messageStrtus=='NOTICE'" type="text">已通知</el-button>
              <span v-else>未通知</span>
            </template>
          </el-table-column>
          <!--<el-table-column-->
          <!--show-overflow-tooltip-->
          <!--prop="major"-->
          <!--label="短信回执">-->
          <!--</el-table-column>-->
          <el-table-column show-overflow-tooltip prop="quasiAdmissionStrtus" label="拟录取状态">
            <template scope="scope">
              {{scope.row.quasiAdmissionStrtus | typeText}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="score" label="成绩">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="enterStrtus" label="录取状态">
            <template scope="scope">
              {{(scope.row.enterStrtus || '待处理') | typeText}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                         :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>

    <Modal :mask-closable="false" width="1000" v-model="showModal" title="查看档案管理弹窗" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>
      <div slot="footer"></div>
    </Modal>

    <!--录取弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="enrollModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="enrollId"></modal-header>
      <operate v-if="enrollModal" type="enroll" :operateData="enrollData" @operate="subCallback" @cancel="cancel"
               :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--不录取弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="noEnrollModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="noEnrollId"></modal-header>
      <operate v-if="noEnrollModal" type="noEnroll" :operateData="noEnrollData" @operate="subCallback" @cancel="cancel"
               :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!---->
    <!--导入弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="toChannelModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="800">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <toChannel v-if="toChannelModal" :url="url.excelImportEnroll.path" @ranking="subCallback" @cancel="cancel"
                 :operaility-data="operailityData" :treeId="treeObj.id"></toChannel>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <derive v-if="deriveModal" :url="url.excelExportEnterPerson.path" type="derive" messTitle="导出录取信息到Excel"
              @cancel="cancel" :operaility-data="operailityData"></derive>
      <div slot="footer"></div>
    </Modal>
    <!--短信通知-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="sendMsgModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="1100">
      <modal-header slot="header" :content="sendMsgId"></modal-header>
      <send-sms v-if="sendMsgModal" :url="url" @cancel="cancel" @sendMsg="subCallback"></send-sms>
      <div slot="footer"></div>
    </Modal>
    <!-- 选择人员节点 -->
    <select-tree getTreeUrl="dept/tree-by-YJS" @selectTree="selectTreeCall" ref="selectTree"
                 title="选择人员节点"></select-tree>
  </div>
</template>
<script>
  import { ptplanAdmitList as rules } from '../rules';
  /*当前组件必要引入*/
  import major                        from '../../common/major.vue';
  import url                          from '../api';
  //导入
  import toChannel                    from './ptplanAdmit_toChannel.vue';
  // 短信通知
  import sendSms                      from './ptAdmit_sendSms.vue';
  import selectTree                   from '../../../common/selectTree.vue';

  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        rules,
        url,
        //查询表单
        formValidate: {
          enterStrtus: '', //录取状态
          name: '', //姓名
          boundary: '', //年级
          major: '', //专业
          minScore: '', //最小成绩
          maxScore: '', //最大成绩
          majorCode: ''
        },
        reportedId: {
          id: 'reportedId',
          title: ''
        },
        //录取
        enrollData: {
          url: url.personEnroll.path,
          data: {
            treeId: '',
            enterStrtus: 'ENROLL'
          }
        },
        disabled: {
          enroll: false,
          sendMsg: false
        },
        //不录取
        noEnrollData: {
          url: url.noEnroll.path,
          data: {
            enterStrtus: 'NOENROLL'
          }
        },

        type: '',
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        searchMore: false,
        sendMsgModal: false,
        loading: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.enrollList.path,
            params: {}
          }
        },

        reportedModal: false,
        enrollModal: false,
        noEnrollModal: false,
        giveUpModal: false,
        enteringModal: false,
        rankingModal: false,
        toChannelModal: false, //导入
        deriveModal: false, //导入
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
        enrollId: {
          id: 'enrollId',
          title: '录取'
        },
        noEnrollId: {
          id: 'noEnrollId',
          title: '不录取'
        },
        toChannelId: {
          id: 'toChannelId',
          title: '从Excel导入录取人员'
        },
        deriveId: {
          id: 'deriveId',
          title: '导出录取信息到Excel'
        },
        sendMsgId: {
          id: 'sendMsgId',
          title: '短信通知录取人员'
        },
        // 选择树的回调类型
        selectTreeType: '',
        treeObj: {id: '', name: ''},
        majorData: []
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        };

//        this.getMajor();
        this.setTableData();
      },
      // 选择年届
      selectBoundary (val) {
        this.formValidate.boundary = val;
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
            url: url.majorList
          }
        };
        this.ajax(opt);
      },
      //设置表格及分页的位置
      setTableDynHeight () {
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
      handleSelectionChange (val) {
        let disabled = {
          planAdmit: false,
          ranking: false,
          sendMsg: false
        };
        // if (val.length > 1) {
        //   disabled.ranking = true;
        // }
        // for (let i = 0; i < val.length; i++) {
        //   let item = val[i];
        //   if (item.enterStrtus) {
        //     disabled.enroll = true;
        //   }
        //   if (item.enterStrtus != 'ENROLL') {
        //     disabled.sendMsg = true;
        //   }
        // }
        this.disabled = disabled;
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
        if (this.formValidate.minScore && this.formValidate.maxScore) {
          if (this.formValidate.maxScore < this.formValidate.minScore) {
            this.errorMess('最大分数不能小于最小分数');
            return;
          }
        }
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.formValidate);
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
      //录取状态为不录取的  让选择框禁用
      checkboxInit(row){
        if (row.enterStrtus == "NOENROLL" || row.enterStrtus == "ENROLL")
          return 0;//不可勾选
        else
          return 1;//可勾选
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
            this.$Message.error('查询内容有误!');
          }
        });
        return flag;
      },

      /*--点击--添加--按钮--*/
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

      enroll () {
        if (!this.isSelected()) return;
        this.selectTreeType = 'enroll';
        this.operailityData = this.multipleSelection;
        this.$refs.selectTree.openModal();
      },

      selectTreeCall (treeId, treeName) {
        this.treeObj.id = treeId;
        this.treeObj.name = treeName;
        if (this.selectTreeType == 'enroll') {
          this.enrollData.data.treeId = treeId;
        }
        this.openModel(this.selectTreeType);
      },

      noEnroll () {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('noEnroll');
      },

      //导入
      toChannel () {
        this.selectTreeType = 'toChannel';
        this.$refs.selectTree.openModal();
      },

      // 短信通知
      sendMsg () {
//        if (this.isSelected()) {
//          this.operailityData = this.multipleSelection;
//          this.openModel('sendMsg')
//        }
        this.openModel('sendMsg');
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
      toChannel,
      sendSms,
      selectTree,
      major
    }
  };

</script>
