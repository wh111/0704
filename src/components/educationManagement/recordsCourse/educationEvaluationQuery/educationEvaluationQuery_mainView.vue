<!----------------------------------
****--@name     进修考核填写 主表查看
****--@role     进修生
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content">


    <!--表格数据-->
    <div ref="myTable">
      <el-table
        align="center"
        border
        :height="dynamicHt"
        :context="self"
        :data="tableData"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%">
        <el-table-column label="姓名" prop="userName" fixed show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template scope="scope"><el-button size="small" @click="show(scope.row)">查看</el-button></template>
        </el-table-column>
        <el-table-column label="劳动纪律" show-overflow-tooltip align="center">
          <el-table-column prop="lateArrivalTimes" label="迟到" align="center">
            <template scope="scope" >
              <el-input v-if="isWrite" v-model="scope.row.lateArrivalTimes"></el-input>
              <span v-else>{{scope.row.lateArrivalTimes}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="leaveEarlyTimes" label="早退" align="center">
            <template scope="scope" >
              <el-input v-if="isWrite" v-model="scope.row.leaveEarlyTimes"></el-input>
              <span v-else>{{scope.row.leaveEarlyTimes}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="askLeaveDays" label="请假" align="center">
            <template scope="scope">
              <el-input  v-if="isWrite" v-model="scope.row.askLeaveDays"></el-input>
              <span v-else>{{scope.row.askLeaveDays}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="minerDays" label="旷工" align="center">
            <template scope="scope" >
              <el-input v-if="isWrite" v-model="scope.row.minerDays"></el-input>
              <span v-else>{{scope.row.minerDays}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="otherBreachDiscipline" label="其他" align="center">
            <template scope="scope" >
              <el-input v-if="isWrite" v-model="scope.row.otherBreachDiscipline"></el-input>
              <span v-else>{{scope.row.otherBreachDiscipline}}</span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="医疗质量" show-overflow-tooltip align="center">
          <el-table-column prop="classRecords" label="丙级病历" align="center">
            <template scope="scope" >
              <el-input v-if="isWrite" v-model="scope.row.classRecords"></el-input>
              <span v-else>{{scope.row.classRecords}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="unqualifiedPrescription" label="不合格处方" align="center">
            <template scope="scope" >
              <el-input v-if="isWrite" v-model="scope.row.unqualifiedPrescription"></el-input>
              <span v-else>{{scope.row.unqualifiedPrescription}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="seriousMedicalErrors" label="严重医疗差错" align="center">
            <template scope="scope" >
              <el-input v-if="isWrite" v-model="scope.row.seriousMedicalErrors"></el-input>
              <span v-else>{{scope.row.seriousMedicalErrors}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="medicalAccident" label="医疗事故" align="center">
            <template scope="scope" >
              <el-input  v-if="isWrite" v-model="scope.row.medicalAccident"></el-input>
              <span v-else>{{scope.row.medicalAccident}}</span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="医德医风" show-overflow-tooltip align="center">

          <el-table-column label="收红包情况" align="center">

            <el-table-column prop="hasRedEnvelope" label="无" align="center">
              <template scope="scope" >
                <el-radio v-if="isWrite" v-model="scope.row.hasRedEnvelope" label="N" @click.native="clearInputVal(scope.row,'hasRedEnvelope','redEnvelopeCount','redEnvelopeAmount')"><span></span></el-radio>
                <!--<el-checkbox v-model="scope.row.hasRedEnvelope" true-label="N" false-label="Y" @click.native="clearInputVal(scope.row,'hasRedEnvelope','redEnvelopeCount','redEnvelopeAmount')"></el-checkbox>-->
                <!--<el-input v-model="scope.row.hasRedEnvelope"></el-input>-->
                <span v-else-if="scope.row.hasRedEnvelope=='N'">✔</span>
              </template>
            </el-table-column>

            <el-table-column label="有" align="center">

              <el-table-column prop="redEnvelopeCount" label="次数" align="center">
                <template scope="scope" >
                  <el-input v-if="isWrite" v-model="scope.row.redEnvelopeCount" @input="changeCheckBoxVal(scope.row,'hasRedEnvelope')"></el-input>
                  <span v-else>{{scope.row.redEnvelopeCount}}</span>
                </template>
              </el-table-column>

              <el-table-column prop="redEnvelopeAmount" label="金额" align="center">
                <template scope="scope" >
                  <el-input v-if="isWrite" v-model="scope.row.redEnvelopeAmount" @input="changeCheckBoxVal(scope.row,'hasRedEnvelope')"></el-input>
                  <span v-else>{{scope.row.redEnvelopeAmount}}</span>
                </template>
              </el-table-column>

            </el-table-column>

          </el-table-column>


          <el-table-column label="收受医药回扣情况" align="center">

            <el-table-column prop="hasRebate" label="无" align="center">
              <template scope="scope" >
                <el-radio v-if="isWrite" v-model="scope.row.hasRebate" label="N" @click.native="clearInputVal(scope.row,'hasRebate','rebateCount','rebateAmount')"><span></span></el-radio>
                <!--<el-checkbox v-model="scope.row.hasRebate" true-label="N" false-label="Y" @click.native="clearInputVal(scope.row,'hasRebate','rebateCount','rebateAmount')"></el-checkbox>-->
                <!--<el-input v-model="scope.row.hasRebate"></el-input>-->
                <span v-else-if="scope.row.hasRebate=='N'">✔</span>
              </template>
            </el-table-column>

            <el-table-column label="有" align="center">

              <el-table-column prop="rebateCount" label="次数" align="center">
                <template scope="scope" >
                  <el-input v-if="isWrite" v-model="scope.row.rebateCount" @input="changeCheckBoxVal(scope.row,'hasRebate')"></el-input>
                  <span v-else>{{scope.row.rebateCount}}</span>
                </template>
              </el-table-column>

              <el-table-column prop="rebateAmount" label="金额" align="center">
                <template scope="scope" >
                  <el-input v-if="isWrite" v-model="scope.row.rebateAmount" @input="changeCheckBoxVal(scope.row,'hasRebate')"></el-input>
                  <span v-else>{{scope.row.rebateAmount}}</span>
                </template>
              </el-table-column>

            </el-table-column>

          </el-table-column>

          <el-table-column prop="patientComplaints" label="病人投诉" align="center">
            <template scope="scope" >
              <el-input v-if="isWrite" v-model="scope.row.patientComplaints"></el-input>
              <span v-else>{{scope.row.patientComplaints}}</span>
            </template>
          </el-table-column>

          <el-table-column label="对待病人态度" align="center">

            <el-table-column prop="attitudeTowardPatient" label="好" align="center">
              <template scope="scope" >
                <el-radio v-if="isWrite" v-model="scope.row.attitudeTowardPatient" label="GOOD"><span></span></el-radio>
                <span v-else-if="scope.row.attitudeTowardPatient=='GOOD'">✔</span>
              </template>
            </el-table-column>

            <el-table-column prop="attitudeTowardPatient" label="中" align="center">
              <template scope="scope" >
                <el-radio v-if="isWrite" v-model="scope.row.attitudeTowardPatient" label="IN"><span></span></el-radio>
                <span v-else-if="scope.row.attitudeTowardPatient=='IN'">✔</span>
              </template>
            </el-table-column>

            <el-table-column prop="attitudeTowardPatient" label="差" align="center">
              <template scope="scope" >
                <el-radio v-if="isWrite" v-model="scope.row.attitudeTowardPatient" label="BAD"><span></span></el-radio>
                <span v-else-if="scope.row.attitudeTowardPatient=='BAD'">✔</span>
              </template>
            </el-table-column>
            <el-table-column  label="状态" align="center">
              <template scope="scope" >
                {{scope.row.state |educationEvaluationAudit}}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <br>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" :type="true"  :operaility-data="getData" :url="url"></show>
      <div slot="footer"></div>
    </Modal>


  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--查看--组件
  import show from "./educationEvaluationQuery_view.vue";

  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['operailityData','url'],
    data() {
      return {
        todoType: 'modify', // 操作按钮类型
        depIndex:'',
        queryTreeByManager:[],
        searchObj: {
          reviewTime: new Date(),
          depId: '',
          depName: '',
        },
        selectObj:{
          reviewTime: '',
          depId: '',
          depName: '',
        },
        isWrite:false,//能否填写
        reportModal:false,
        //删除
        multipleSelection: [],
        dynamicHt: 500,
        self: this,
        loading: false,
        tableData: [],
        getData:{},
        //* 按钮 *//
        button: {
          reportId: {
            id: 'reportId',
            title: '上报月度工作考核'
          },
        },
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: this.url.getManageReview.path+this.operailityData.mrId,
            params: {}
          }
        },
        //保存按钮基本信息
        saveBtn: {
          title: '保存',
          callParEvent: 'listenSaveEvent'
        },
        loadBtn: {
          title: '上报',
          callParEvent: 'listenSubEvent'
        },
        viewId:{id:'viewId',title:'查看'},
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.setTableData()
      },


      setTableData() {
        this.ajax(this.listMessTitle);
      },

      successGetList(res) {
        if(res.data && res.data.subList.length){
          this.isWrite = false;
            this.todoType = 'modify';
            this.tableData = res.data.subList;
          }

        },

      // 清除输入框的值
      clearInputVal(row,ckeck,...keys){
        if(row[ckeck] === 'Y'){
          keys.map(item=>row[item]='')
        }
      },

      // 设置选框的值
      changeCheckBoxVal(row,key){
        row[key] = 'Y'
      },

      show(item){
        item.monthlyReviewId = item.id;
        this.getData = item;
        this.showModal = true;
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    },
    created() {
      this.init();
    },
    components: {
      show
    }
  }
</script>
