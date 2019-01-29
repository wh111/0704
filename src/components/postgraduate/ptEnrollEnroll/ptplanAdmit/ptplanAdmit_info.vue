<!----------------------------------
****--@name     拟录取
****--@role     教研室秘书
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<!--档案审核-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form :model="formValidate" :rules="rules" ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="13">
          <el-form-item>
            <el-button type="success" :disabled="disabled.planAdmit" @click="planAdmit">拟录取</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" :disabled="disabled.planAdmit" @click="noAdmit">不拟录取</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="toChannel">从Excel导入成绩</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="deriveExcel">导出拟录取信息到Excel</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="backList">返回列表</el-button>
          </el-form-item>
        </el-col>
        <!--搜索项-->

        <el-col :span="11" align="right">
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
          <el-form-item label="成绩:" prop="minScore" style="margin-right: 0;">
            <el-input v-model="formValidate.minScore" placeholder="最小成绩">
            </el-input>
          </el-form-item>
          <span style="line-height: 36px;">~</span>
          <el-form-item prop="maxScore">
            <el-input v-model="formValidate.maxScore" placeholder="最大成绩">
            </el-input>
          </el-form-item>

          <!--<el-form-item label="年届:" prop="boundary">-->
          <!--<el-date-picker v-model="formValidate.boundary" type="year" placeholder="选择年份" :editable="false"-->
          <!--@change="selectBoundary"></el-date-picker>-->
          <!--</el-form-item>-->

          <el-form-item label="状态:" prop="enterquasiAdmissionStrtusStrtus">
            <el-select filterable v-model="formValidate.quasiAdmissionStrtus" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="拟录取" value="QUASIADMISSION"></el-option>
              <el-option label="不录取" value="NONADMISSION"></el-option>
              <el-option label="放弃" value="GIVEUP"></el-option>
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
      <p>（成绩和综合排名两列可直接点击输入，输入框失去焦点则自动保存输入的数据）</p>
      <!--表格数据-->
      <div id="myTable" ref="myTable">
        <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                  highlight-current-row style="width: 100%;height: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column align="center" label="序号" prop="index" width="100">
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="studentId" label="学号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="姓名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sex" label="性别" align="center">
            <template scope="scope">
              {{ scope.row.sex | typeText }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="phone" label="电话号码">
          </el-table-column>
          <!--<el-table-column label="年届" prop="boundary" show-overflow-tooltip></el-table-column>-->
          <el-table-column show-overflow-tooltip prop="majorCode" label="专业代码">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="major" label="专业方向">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="degree" label="学位类型">
            <template scope="scope">
              {{ scope.row.degree | degree }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="score" label="成绩">
            <template scope="scope">
              <el-input v-if="scope.row.scoreEdit" v-model="scope.row.score" v-focus
                        @blur="setRow(scope.row,'score')"></el-input>
              <span v-else @click="editRow(scope.row,'score')">{{ scope.row.score || '——' }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ranking" label="综合排名">
            <template scope="scope">
              <el-input v-if="scope.row.rankingEdit" v-model="scope.row.ranking" v-focus
                        @blur="setRow(scope.row,'ranking')"></el-input>
              <span v-else @click="editRow(scope.row,'ranking')">{{ scope.row.ranking || '——' }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="quasiAdmissionStrtus" label="状态">
            <template scope="scope">
              {{ (scope.row.quasiAdmissionStrtus || '待处理') | typeText}}
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
    <Modal close-on-click-modal="false" height="200" v-model="planAdmitModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="planAdmitId"></modal-header>
      <operate v-if="planAdmitModal" type="planAdmit" :operateData="planAdmitData" @operate="subCallback"
               @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--不录取弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="noAdmitModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="noAdmitId"></modal-header>
      <operate v-if="noAdmitModal" type="noAdmit" :operateData="noAdmitData" @operate="subCallback" @cancel="cancel"
               :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--导入弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="toChannelModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="800">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <toChannel v-if="toChannelModal" :url="url.excelImportScore.path" @ranking="subCallback" @cancel="cancel"
                 :operaility-data="operailityData"></toChannel>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--导出弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <derive v-if="deriveModal" :url="deriveURL" type="derive" messTitle="导出录取信息到Excel"
              @cancel="cancel" :operaility-data="operailityData"></derive>
      <div slot="footer"></div>
    </Modal>
    <!---->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import major                        from '../../common/major.vue';
  import { ptplanAdmitList as rules } from '../rules';
  import url                          from '../api';
  //导入
  import toChannel                    from './ptplanAdmit_toChannel.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['noticeData'],
    data () {
      return {
        rules,
        url,
        deriveURL: '',
        majorData: [],
        degreeOption: [{value: '', label: '全部'}, {value: 'MAJOR', label: '学术学位'}, {value: 'LEARNING', label: '专业学位'}], // 学位
        //查询表单
        formValidate: {
          batch: this.noticeData.id, // 批次
          quasiAdmissionStrtus: '', //拟录取状态
          name: '', //姓名
          boundary: '', //年级
          major: '', //专业
          minScore: '', //最小成绩
          maxScore: '', //最大成绩
          majorCode: '' //
        },
        reportedId: {
          id: 'reportedId',
          title: ''
        },
        //录取
        planAdmitData: {
          url: url.quasiadmission.path,
          data: {
            quasiAdmissionStrtus: 'QUASIADMISSION'
          }
        },
        disabled: {
          planAdmit: false,
          ranking: false
        },
        //不录取
        noAdmitData: {
          url: url.nonadmission.path,
          data: {
            quasiAdmissionStrtus: 'NONADMISSION'
          }
        },

        //放弃
        giveUpData: {
          url: url.giveup.path,
          data: {
            quasiAdmissionStrtus: 'GIVEUP'
          }
        },
        type: '',
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
          paramsData: 'listUrl',
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: url.quasiadmissionList.path,
            params: {}
          }
        },

        reportedModal: false,
        planAdmitModal: false,
        noAdmitModal: false,
        giveUpModal: false,
        enteringModal: false,
        rankingModal: false,
        toChannelModal: false, //导入
        deriveModal: false, //导入
        /*--按钮button--*/
        viewId: {
          id: 'viewId',
          title: '查看'
        },
        planAdmitId: {
          id: 'planAdmitId',
          title: '拟录取'
        },
        noAdmitId: {
          id: 'noAdmitId',
          title: '不拟录取'
        },
        toChannelId: {
          id: 'toChannelId',
          title: '导入成绩'
        },
        deriveId: {
          id: 'deriveId',
          title: '导出录取信息到Excel'
        }
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
      // 选择年届
      selectBoundary (val) {
        this.formValidate.boundary = val;
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
          ranking: false
        };
        if (val.length > 1) {
          disabled.ranking = true;
        }
        for (let i = 0; i < val.length; i++) {
          let item = val[i];
          if (item.quasiAdmissionStrtus) {
            disabled.planAdmit = true;
          }
        }
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
        let data = this.addIndex(responseData.data || []);
        data.map(item => {
          item.rankingEdit = false;
          item.scoreEdit = false;
        });
        this.tableData = data;
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData () {
        if (this.formValidate.minScore && this.formValidate.maxScore) {
          if (this.formValidate.maxScore < this.formValidate.minScore) {
            this.errorMess('最大分数不能小于最小分数');
            return;
          }
        }
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
            this.$Message.error('查询内容有误!');
          }
        });
        return flag;
      },

      // 保存值到服务器
      setRow (row, type) {
        let cfg = {
          score: {
            url: 'enroll/person/resultInput/' + row.id,
            reg: /^\d+$/
          },
          ranking: {
            url: 'enroll/person/ranking/' + row.id,
            reg: /^\d+$/
          }
        };
        if (row[type]) {
          if (cfg[type].reg && !cfg[type].reg.test(row[type])) {
            this.errorMess('输入数据不合法，请重新输入');
            return;
          }
        }
        row[type + 'Edit'] = false;
        let data = {id: row.id};
        data[type] = row[type] || '';
        let opt = {
          ajaxSuccess: () => this.successMess('保存成功'),
          ajaxError: () => this.errorMess('保存失败'),
          ajaxParams: {
            url: cfg[type].url,
            method: 'put',
            data
          }
        };
        this.ajax(opt);
      },

      // 某前行某个字段可编辑可编辑
      editRow (row, type) {
        row[type + 'Edit'] = true;
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

      planAdmit () {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.planAdmitModal = true;
      },

      noAdmit () {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.noAdmitModal = true;

      },
      giveUp () {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.giveUpModal = true;
      },

      //成绩录入
      entering () {
        if (!this.isSelected(true)) return;
        this.operailityData = this.multipleSelection[0];
        this.enteringModal = true;
      },
      //综合排名
      ranking () {
        if (!this.isSelected(true)) return;
        this.operailityData = this.multipleSelection[0];
        this.rankingModal = true;
      },

      // 返回列表
      backList () {
        this.$emit('show', 'notice');
      },

      // 导出
      deriveExcel () {
        let params = [];
        Object.keys(this.formValidate).map(key => params.push(`${key}=${this.formValidate[key] || ''}`));
        this.deriveURL = url.exportQuasiadmission.path + '?' + params.join('&');
        this.openModel('derive');
      },

      //导入
      toChannel () {
        this.openModel('toChannel');
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
      toChannel, major
    }
  };

</script>
