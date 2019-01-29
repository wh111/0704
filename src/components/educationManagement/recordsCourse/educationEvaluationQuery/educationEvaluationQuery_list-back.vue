<!----------------------------------
****--@name     进修考核填写
****--@role     进修生
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div ref="content">
    <el-row>
      <el-col :span="6">
        <div style="margin-bottom: 20px;">
          <!--<load-btn :disabled="!isWrite" @listenSaveEvent="listenSaveEvent" :btnData="saveBtn"></load-btn>-->
          <el-button :disabled="!isWrite" type="primary" @click="listenSaveEvent">保存</el-button>
          <el-button :disabled="!isWrite" type="danger" @click="report">上报</el-button>
        </div>
      </el-col>
      <el-col :span="18" align="right">
        <!--搜索form-->
        <el-form :inline="true" :model="searchObj">
          <el-form-item label="考核时间:" prop="admissionDate">
            <el-date-picker
              v-model="searchObj.reviewTime"
              type="month"
              :editable="false"
              placeholder="选择日期" @change="handleChangeTime">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="科室">
            <el-select v-model="depIndex" placeholder="请选择" @change="changeQTBM">
              <template v-for="(item,index) in queryTreeByManager">
                <el-option :key="item.id" :label="item.name" :value="index">{{ '　'.repeat(item.i) + item.name }}</el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

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

          <el-table-column prop="minerDays" label="旷课" align="center">
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
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <!-- 上报 -->
    <Modal close-on-click-modal="false" height="200" v-model="reportModal" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="button.reportId"></modal-header>
      <div>
        <p class="remove">确定要上报么？</p>
        <div align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <!--<el-button type="info" @click="reportCall">确定</el-button>-->
          <el-button @click="cancel('report')">取消</el-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        todoType: 'add', // 操作按钮类型
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
        isWrite:true,//能否填写
        reportModal:false,
        //删除
        operailityData: {},
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading: false,
        tableData: [],
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
            url: api.pageList.path,
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
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.getQueryTreeByManager()
      },

      // 获取科室
      getQueryTreeByManager(){
        let opt = {
          ajaxSuccess:res=>{
            if (res.data && res.data.length){
              let queryTreeByManager = this.getQTBObj(res.data);
              this.queryTreeByManager =queryTreeByManager
              this.depIndex = 0;
              setTimeout(()=>this.setTableData(),100)
            }
          },
          ajaxError:()=>this.errorMess('获取科室失败，请重试'),
          ajaxParams:{
            url:api.getQueryTreeByManager.path,
            method:api.getQueryTreeByManager.method,
          }
        };
        this.ajax(opt)
      },

      // 处理科室数据结构（三级以下）
      getQTBObj(arr,res){
        let t = res || [];
        if(arr && arr.length) {
          arr.map(item => {
            t.push({name: item.name, id: item.id,i:item.depth-3});
            if (item.childList){
              return t.concat(this.getQTBObj(item.childList,t))
            }
          })
        }
        return t
      },

      // 选择科室
      changeQTBM(index){
        this.searchObj.depId = this.queryTreeByManager[index].id;
        this.searchObj.depName = this.queryTreeByManager[index].name;
      },

      setTableData() {
        if(!this.queryTreeByManager || this.queryTreeByManager==0)return;
        let data = Util._.defaultsDeep({}, this.searchObj);
        data.reviewTime = this.conductDate(data.reviewTime, 'yyyy-MM');
        this.tableData=[];
        this.selectObj.reviewTime = data.reviewTime;
        this.selectObj.depId = data.depId;
        this.selectObj.depName = data.depName;
        this.listMessTitle.ajaxParams.params = data;
        this.ajax(this.listMessTitle);
      },

      successGetList(res) {
        if(res.data && res.data.length){
          this.isWrite = true;
          if(['PASS','SUBMIT'].includes(res.data[0].state)){
            this.isWrite = false;
          }
          if(res.data[0].id){
            this.todoType = 'modify';
            this.getTableData(res.data || [])
          }else{
            this.todoType = 'add';
            this.tableAddData(res.data);
          }
        }
      },

      tableAddData(arr){
        arr.map(item=>{
          item.depId = this.selectObj.depId;
          item.depName = this.selectObj.depName;
          item.reviewTime = this.selectObj.reviewTime;
          // 默认值
          item.hasRedEnvelope = 'N';
          item.hasRebate = 'N';
          item.attitudeTowardPatient = 'GOOD';
        })
        this.getTableData(arr || [])
      },

      getTableData(arr){
        let val = ['id','userName','userId','reviewTime','depId','depName','lateArrivalTimes','leaveEarlyTimes',
          'askLeaveDays','minerDays','otherBreachDiscipline','classRecords','unqualifiedPrescription',
          'seriousMedicalErrors','medicalAccident','hasRedEnvelope','redEnvelopeCount','redEnvelopeAmount',
          'hasRebate','rebateCount','rebateAmount','patientComplaints','attitudeTowardPatient'
        ];
        this.tableData = [];
        (arr||[]).map(item=>{
          let temp = {};
          val.map(key=>{
            temp[key] = item[key] || '';
          })
          this.tableData.push(temp)
        })
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

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 16;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      //查询
      search() {
        this.setTableData()
      },

      /*
       * 保存
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSaveEvent() {
        if(!this.tableData ||this.tableData==0){
          this.showMess('无可保存数据');
          return;
        }
        let opt = {
          ajaxSuccess: ()=>this.subCallback('report','保存成功!'),
          ajaxError: ()=>this.errorMess('保存失败!'),
          ajaxParams: {
            url: api[this.todoType].path,
            method: api[this.todoType].method,
            jsonString: true,
          }
        };
        let isSubmit = this.checkData();
        if (isSubmit) {
          opt.ajaxParams.data = Util._.defaultsDeep([], this.tableData);
          this.ajax(opt)
        }
      },

      /*
       * 上报
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent() {
        let opt = {
          ajaxSuccess: ()=>this.subCallback('report','上报成功!'),
          ajaxError: ()=>this.errorMess('上报失败!'),
          ajaxParams: {
            url: api[this.todoType+'Submit'].path,
            method: api[this.todoType+'Submit'].method,
            jsonString: true,
          }
        };
        let isSubmit = this.checkData();
        if (isSubmit) {
          opt.ajaxParams.data = Util._.defaultsDeep([], this.tableData);
          this.ajax(opt)
        }
      },

      // 上报
      report(row) {
        if(!this.tableData ||this.tableData==0){
          this.showMess('无可上报数据');
          return;
        }

        this.operailityData = row;
        this.openModel('report')
      },

      // 检测数据有效性
      checkData(){
        let numberReg = { // 整数
          reg: /^\d{1,4}$/,
          msg: '整数（最多四位数）'
        };

        let moneyReg = { // 金额
          reg: /^\d+(\.\d{0,2})?$/,
          msg: '整数或者小数（最多两位小数）'
        };

        let opt = {
          "lateArrivalTimes": {name: "迟到次数", type: numberReg.msg, reg: numberReg.reg,},
          "askLeaveDays": {name: "请假天数", type: numberReg.msg, reg: numberReg.reg,},
          "minerDays": {name: "旷工天数", type: numberReg.msg, reg: numberReg.reg,},
          "otherBreachDiscipline": {name: "其他违反纪律情况", type: numberReg.msg, reg: numberReg.reg,},

          "classRecords": {name: "丙级病历"},
          "unqualifiedPrescription": {name: "不合格处方"},
//          "seriousMedicalErrors": {name: "严重医疗差错"},
//          "medicalAccident": {name: "严重医疗差错"},

          "redEnvelopeCount":{name: "收受红包次数", type: numberReg.msg, reg: numberReg.reg, where:{key:'hasRedEnvelope',val:"Y"}},
          "redEnvelopeAmount":{name: "收受红包金额", type: moneyReg.msg, reg: moneyReg.reg, where:{key:'hasRedEnvelope',val:"Y"}},

          "rebateCount":{name: "收受医药回扣次数", type: numberReg.msg, reg: numberReg.reg, where:{key:'hasRebate',val:"Y"}},
          "rebateAmount":{name: "收受医药回扣金额", type: moneyReg.msg, reg: moneyReg.reg, where:{key:'hasRebate',val:"Y"}},
        };

        for (let i=0,item;i<this.tableData.length;i++){
          item = this.tableData[i];
          for (let key in opt) {
            // 纯正则检测
            if (opt[key].reg && !opt[key].where && !opt[key].reg.test(item[key])) {
              this.errorMess(item.userName + '的' + opt[key].name + '必须为' + opt[key].type);
              return false
            }
            // 条件正则检测
            if (opt[key].where && (item[opt[key].where.key] == opt[key].where.val) && !opt[key].reg.test(item[key])) {
              this.errorMess(item.userName + '的' + opt[key].name + '只能为' + opt[key].type);
              return false
            }
            // 普通检测
            if (!opt[key].where && !item[key]) {
              this.errorMess(item.userName + '的' + opt[key].name + '必须填写');
              return false
            }
          }
        }

        return true
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
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
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      //查询时间转换
      handleChangeTime(value) {
        this.searchObj.reviewTime = value;
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
    }
  }
</script>
