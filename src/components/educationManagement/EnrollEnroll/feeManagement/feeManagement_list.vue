R<!----------------------------------
****--@name     交费管理
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <!--搜索form-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="申请人" prop="userName">
        <el-input v-model="formInline.userName" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="职称">
        <el-input v-model="formInline.title" placeholder=""></el-input>
        <!--<el-select v-model="formInline.title" placeholder="">-->
        <!--<el-option label="2015" value="2015"></el-option>-->
        <!--<el-option label="2016" value="2016"></el-option>-->
        <!--<el-option label="2017" value="2017"></el-option>-->
        <!--</el-select>-->
      </el-form-item>
      <el-form-item label="进修科目">
        <el-select v-model="formInline.managementId" clearable placeholder="请选择">
          <el-option v-for="(item,index) in studysubjectOption" :key="index" :label="item.courseName"
                     :value="item.managementId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.paymentStatus" clearable placeholder="">
          <el-option label="全部" value=""></el-option>
          <el-option label="未缴费" value="N"></el-option>
          <el-option label="已缴费" value="Y"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请时间" prop="specialtyName">
        <date-group :dateGroup="{text:'',startDate:formInline.createTimeBegin,endDate:formInline.createTimeEnd}">
          <el-date-picker name="start" v-model="formInline.createTimeBegin" :editable="false" type="date"
                          placeholder="选择日期" :picker-options="pickerOptions0"
                          @change="handleStartTime"></el-date-picker>
          <span>-</span>
          <el-date-picker name="end" v-model="formInline.createTimeEnd" :editable="false" type="date" placeholder="选择日期"
                          :picker-options="pickerOptions1"
                          @change="handleEndTime"></el-date-picker>
        </date-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="success" @click="derive">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <!--列表操作按钮-->

    <div style="margin-bottom: 20px;">
      <el-button type="info" @click="print('jx')">进修费打印</el-button>
      <el-button type="primary" @click="print('zs')">住宿费打印</el-button>
      <el-button type="success" @click="payConfirm">缴费确认</el-button>
      <el-button type="warning" @click="inStudyBack">进修回退</el-button>
    </div>

    <!--- 列表 --->
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
            width="55"
            :selectable="canTodo">
          </el-table-column>
          <el-table-column
            label="操作"
            width="260">
            <template scope="scope">
              <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
              <!--<el-button size="small" type="success" v-if="scope.row.paymentStatus == 'N'" @click="payment(scope.row)">-->
              <!--交款条-->
              <!--</el-button>-->
              <!--<el-button size="small" type="danger" v-else @click="showPay(scope.row)">交款条</el-button>-->
              <el-button size="small" type="danger" @click="showPay(scope.row)">交款条</el-button>
              <el-button size="small" type="primary" @click="printOne(scope.row)">打印</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="申请人"
            show-overflow-tooltip
            prop="userName">
          </el-table-column>

          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="title"
            label="职称"
          >
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="professionalQualification"
            label="执业资格"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="courseNames"
            label="进修科目"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="studyTime"
            label="进修时间"
          >
            <template scope="scope">
              {{ scope.row.studyTime | recruit }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="checkInTime"
            label="报到时间"
          >
          </el-table-column>
          <el-table-column
            prop="applyTime"
            show-overflow-tooltip
            label="申请时间"
          >
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="depNames"-->
          <!--show-overflow-tooltip-->
          <!--label="进修科室"-->
          <!--&gt;-->
          <!--</el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            prop="parymentMethods"
            label="缴费方式"
          >
            <template scope="scope">
              {{ scope.row.parymentMethods | typeText }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="paymentStatus"
            label="状态"
          >
            <template scope="scope">
              {{ scope.row.paymentStatus | recruit }}
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
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 模态框  打印收费条 -->
      <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="1000">
        <modal-header slot="header" :content="button.addId"></modal-header>
        <print v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"
               :printType="printType"></print>
        <div slot="footer"></div>
      </Modal>
      <!-- 模态框 查看（view） -->
      <Modal :mask-closable="false" v-model="showPayModal" height="200" class-name="vertical-center-modal"
             :loading="true"
             :width="800">
        <modal-header slot="header" :parent="self" :content="button.showPayId"></modal-header>
        <show-pay v-if="showPayModal" @cancel="cancel" :operaility-data="operailityData"></show-pay>
        <div slot="footer"></div>
      </Modal>
      <!-- 模态框 查看（view） -->
      <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :loading="true"
             :width="1000">
        <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
        <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>
      <!-- 模态框 交款条  ） -->
      <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="800">
        <modal-header slot="header" :content="button.editId"></modal-header>
        <payment v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></payment>
        <div slot="footer"></div>
      </Modal>
      <!--导出弹窗-->
      <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal"
             class-name="vertical-center-modal" :width="500">
        <modal-header slot="header" :content="button.deriveId"></modal-header>
        <div>
          <div class="remove">确认导出吗</div>
          <el-row>
            <el-col :span="10" :offset="14">
              <a :href="excelExportUrl">
                <el-button @click="affirmDerive" type="primary">确定</el-button>
              </a>
              <el-button class="but-col" @click="deriveModal=false">取消</el-button>
            </el-col>
          </el-row>
        </div>
        <div slot="footer"></div>
      </Modal>
    </div>
    <!--确认缴费弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="payConfirmModal"
           class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="button.payConfirmId"></modal-header>
      <div>
        <div class="modalTips">确认“{{ payCnfTips.userNames.join('、') }}”
          {{ payCnfTips.userNames.length > 3 ? '等' : '' }}
          {{ payCnfTips.userNames.length > 1 ? payCnfTips.userNames.length + '人' : '' }}
          已经缴费吗？
        </div>
        <el-row>
          <el-col :span="10" :offset="14">
            <el-button @click="payCnfSub" type="primary">确定</el-button>
            <el-button class="but-col" @click="cancel('payConfirm')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 进修回退 -->
    <Modal :mask-closable="false" v-model="inStudyBackModal" height="200" class-name="vertical-center-modal"
           :width="450">
      <modal-header slot="header" :content="button.inStudyBackId"></modal-header>
      <operate title="进修回退" type="inStudyBack" v-if="inStudyBackModal" :operateData="inStudyBackData" @cancel="cancel"
               @operate="subCallback"></operate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import show from '../OnlinePrequalification/OnlinePrequalification_view.vue';
  import payment from './feeManagement_payment.vue';
  import print from './feeManagement_print.vue';
  import showPay from './feeManagement_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        inStudyBackData: {
          url: api.inStudyBack.path,
          method: api.inStudyBack.method,
          data: {subjectsIds:''},
        },
        excelExportUrl: '',
        isPass: false,
        formInline: {
          createTimeEnd: '',
          createTimeBegin: '',
          managementId: '',
          title: '',
          paymentStatus: ''
        },
        printType: '',
        deriveModal: false,
        showPayModal: false,
        payConfirmModal: false,
        inStudyBackModal: false,
        //弹窗类型
        modal: {
          type: ''
        },
        button: {
          addId: {
            id: 'addId',
            title: '打印收费条'
          },
          showId: {
            id: 'showId',
            title: '查看'
          },
          showPayId: {
            id: 'showPayId',
            title: '查看交款条'
          },
          editId: {
            id: 'editId',
            title: '交款条'
          },
          deriveId: {
            id: 'deriveId',
            title: '导出'
          },
          payConfirmId: {
            id: 'payConfirmId',
            title: '缴费确认',
          },
          inStudyBackId: {
            id: 'inStudyBackId',
            title: '进修回退',
          },
        },
        operailityData: {},
        studysubjectOption: [],
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading: false,
        listTotal: 0,
        tableData: [],
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
        },
        queryListTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
        },
        payCnfTips: {
          subjectsId: [],
          userNames: []
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
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }
        this.setTableData();
        this.getStudysubject()
      },

      getStudysubject() {
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            if (!data) data = [];
            let tempData = [];
            data.map(item => {
              item.courseName = item.name;
              item.managementId = item.id;
              tempData.push(item);
              if (item.childList != 0) {
                item.childList.map(obj => {
                  obj.courseName = '　　' + obj.name;
                  obj.managementId = obj.id;
                  tempData.push(obj)
                })
              }
            })
            data = tempData
            this.studysubjectOption = data || [];
          },
          ajaxParams: {
//            url:"/studysubject/list",
            url: "/hospital/dept/getThreeFourDepthHosiptalDep",
          }
        };
        this.ajax(opt)
      },

      setTableData() {
        Object.assign(this.queryQptions.params, this.formInline);
        let params = this.queryQptions.params;
        params.createTimeBegin = this.conductDate(params.createTimeBegin, 'yyyy-MM-dd');
        params.createTimeEnd = this.conductDate(params.createTimeEnd, 'yyyy-MM-dd');
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params);

        this.ajax(this.listMessTitle);
      },
      successGetList(res) {
        let data = res.data;
        data = this.addIndex(data);
        this.tableData = data;
        this.listTotal = res.totalCount;
      },
      // 是否允许参与选择
      canTodo(row) {
//          return row.parymentMethods == 'CASH' && row.paymentStatus == 'N' // 现金方式并且未缴费
        return row.paymentStatus == 'N' // 未缴费
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
      //*----------- 表格 ------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //打印
      print(type) {
        if (this.isSelected()) {
          this.printType = type;
          this.operailityData = this.multipleSelection;
          this.openModel('add')
        }
      },
      // 单个打印
      printOne(row) {
        this.printType = 'one';
        this.operailityData = [row];
        this.openModel('add')
      },

      // 缴费确认
      payConfirm() {
        if (this.isSelected()) {
          this.payCnfTips.subjectsId.length = 0;
          this.payCnfTips.userNames.length = 0;
          this.multipleSelection.map(item => {
            this.payCnfTips.subjectsId.push(item.subjectsId);
            this.payCnfTips.userNames.push(item.userName);
          })
          this.openModel('payConfirm')
        }
      },

      // 缴费确认提交
      payCnfSub() {
        this.ajax({
          ajaxSuccess: () => {
            this.subCallback('payConfirm', '确认缴费成功');
          },
          ajaxParams: {
            url: api.payConfirm.path,
            method: api.payConfirm.method,
            data: {
              subjectsIds: this.payCnfTips.subjectsId.join(',')
            }
          }
        })
      },

      // 进修回退
      inStudyBack() {
        if (!this.isSelected()) return;
        let multipleSelection = this.multipleSelection;
        let ids = [];
        multipleSelection.map((item) => {
          ids.push(item.subjectsId);
        })
        this.inStudyBackData.data = {subjectsIds: ids.join(',')}
        this.openModel('inStudyBack');
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },
      // 查看
      payment(row) {
        this.operailityData = row;
        this.openModel('edit');
      },
      // 查看交款条
      showPay(row) {
        this.operailityData = row;
        this.openModel('showPay');
      },
      // 增加回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      //查询
      onSubmit() {
        this.setTableData()
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

      //导出
      derive() {
        this.getDeriveURL();
        this.openModel('derive');
      },

      // 获取导出URL
      getDeriveURL() {
        let urlPar = [];
        let data = Util._.defaultsDeep({}, this.formInline);
        data.createTimeBegin = this.conductDate(data.createTimeBegin, 'yyyy-MM-dd');
        data.createTimeEnd = this.conductDate(data.createTimeEnd, 'yyyy-MM-dd');
        for (let item in data) {
          urlPar.push(item + '=' + data[item])
        }
        this.excelExportUrl = '/api' + api.exportExcel.path + urlPar.join('&')
      },

      //确定导出
      affirmDerive() {
        this.cancel('derive');
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
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
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
      payment, print, show, showPay
    }
  }
</script>
<style>
  .modalTips {
    font-size: 16px;
    min-height: 100px;
    text-indent: 2em;
    line-height: 32px;
    margin-bottom: 10px;
  }
</style>
