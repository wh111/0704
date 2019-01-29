<template>
  <!-- 出科申请 - 实习生 -->
  <div>
    <el-row class="givenTheApplicationView">
      <el-form>
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名：">{{ viewData.userName }}</el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="科室：">{{ viewData.depName }}</el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="老师评价：">{{ viewData.teacherEvaluation || '-' }}</el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-table :data="viewDayData">
            <el-table-column label="旷工" prop="minerDays">
              <template scope="scope">
                {{ scope.row.minerDays || 0 }} 天
              </template>
            </el-table-column>
            <el-table-column label="病假" prop="sickDays">
              <template scope="scope">
                {{ scope.row.sickDays || 0 }} 天
              </template>
            </el-table-column>
            <el-table-column label="事假" prop="personalDays">
              <template scope="scope">
                {{ scope.row.personalDays || 0 }} 天
              </template>
            </el-table-column>
            <el-table-column label="奖励" prop="rewardNum">
              <template scope="scope">
                {{ scope.row.rewardNum || 0 }} 次
              </template>
            </el-table-column>
            <el-table-column label="惩罚" prop="penaltyNum">
              <template scope="scope">
                {{ scope.row.penaltyNum || 0 }} 次
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <!--<el-col :span="20" :offset="2">-->
          <!--<el-form-item label="考勤：">-->
            <!--<span>旷工 {{ viewData.minerDays || 0 }} 天，</span>-->
            <!--<span>病假 {{ viewData.sickDays || 0 }} 天，</span>-->
            <!--<span>事假 {{ viewData.personalDays || 0 }} 天</span>-->
          <!--</el-form-item>-->
        <!--</el-col>-->

        <!--<el-col :span="20" :offset="2">-->
          <!--<el-form-item label="奖惩情况：">-->
            <!--<span>奖励 {{ viewData.rewardNum || 0 }} 次，</span>-->
            <!--<span>惩罚 {{ viewData.penaltyNum || 0 }} 次</span>-->
          <!--</el-form-item>-->
        <!--</el-col>-->

        <el-col :span="20" :offset="2">
          <h4>轮转要求统计：</h4>
          <el-table align="center" :context="self" :data="rotaryRequirStatic" tooltip-effect="dark">
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="要求数量" prop="yqnum" show-overflow-tooltip></el-table-column>
            <el-table-column label="已完成数量" prop="ywcnum" show-overflow-tooltip></el-table-column>
            <el-table-column label="完成比例" prop="wcbl" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-col>

        <!--<el-col :span="20" :offset="2">-->
          <!--<h4>轮转记录填写：</h4>-->
          <!--&lt;!&ndash; 实习生 &ndash;&gt;-->
          <!--&lt;!&ndash; <template v-if="studentType">-->
            <!--<el-table align="center" :context="self" :data="viewData.depRequired" tooltip-effect="dark">-->
              <!--<el-table-column label="名称" prop="requiredName"></el-table-column>-->
              <!--<el-table-column label="要求例数" prop="requiredNum" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column label="实填例数" prop="userNum" show-overflow-tooltip></el-table-column>-->
            <!--</el-table>-->
          <!--</template> &ndash;&gt;-->
          <!--&lt;!&ndash; 非实习生 &ndash;&gt;-->
          <!--&lt;!&ndash; <template v-else>-->
            <!--<el-table align="center" :context="self" :data="viewData.depRequirement" tooltip-effect="dark">-->
              <!--<el-table-column label="名称" prop="disTitle"></el-table-column>-->
              <!--<el-table-column label="要求例数" prop="disNum" show-overflow-tooltip></el-table-column>-->
              <!--<el-table-column label="实填例数" prop="disTs" show-overflow-tooltip></el-table-column>-->
            <!--</el-table>-->
          <!--</template> &ndash;&gt;-->
          <!--<el-table align="center" :context="self" :data="depRequirement" tooltip-effect="dark">-->
            <!--<el-table-column label="名称" prop="disTitle"></el-table-column>-->
            <!--<el-table-column label="要求例数" prop="disNum" show-overflow-tooltip></el-table-column>-->
            <!--<el-table-column label="实填例数" prop="disTs" show-overflow-tooltip></el-table-column>-->
          <!--</el-table>-->
        <!--</el-col>-->
        <el-col :span="20" :offset="2">
          <h4>出科成绩：</h4>
          <table class="el-table">
            <thead>
              <tr>
                <th>
                  <div class="cell">名称</div>
                </th>
                <th>
                  <div class="cell">成绩</div>
                </th>
                <th>
                  <div class="cell">是否补考</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="el-table__row">
                <td>
                  <div class="cell">理论考核</div>
                </td>
                <td>
                  <div class="cell">{{ viewData.theoryExamScore }}</div>
                </td>
                <td>
                  <div class="cell">{{ (viewData.theoryExamScore !=null ? viewData.theoryExamIsMakeup : '--') | isNeed }}</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>
                  <div class="cell">技能考核</div>
                </td>
                <td>
                  <div class="cell">{{ viewData.skillExamScore }}</div>
                </td>
                <td>
                  <div class="cell">{{ (viewData.skillExamScore !=null ? viewData.skillExamIsMakeup : '--') | isNeed }}</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>
                  <div class="cell">日常考核</div>
                </td>
                <td>
                  <div class="cell">{{ viewData.dailyExamScore }}</div>
                </td>
                <td>
                  <div class="cell">--</div>
                </td>
              </tr>
              <tr class="el-table__row">
                <td>
                  <div class="cell">综合成绩</div>
                </td>
                <td>
                  <div class="cell">{{ viewData.coligateScore }}</div>
                </td>
                <td>
                  <div class="cell">--</div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-col>
        <el-col :span="20" :offset="2">
          <h4>个人小结：</h4>
          <el-input type="textarea" :readonly="!isWrite"  :autosize="{ minRows: 4, maxRows: 6}" :maxlength="250" placeholder="请输入内容" v-model="summaryFileList.comment"></el-input>
        </el-col>
        <el-col :span="20" :offset="2" >
          <h4>小结附件：</h4>
          <upload-file @setUploadFiles="setUploadFiles"  :uploadFiles="uploadFiles"></upload-file>
        </el-col>
      </el-form>
      <div style="padding-top:16px;clear:both;" v-if="isWrite">
        <el-col :span="6" :offset="6" align="center">
          <el-button @click="save('BC')" type="success">保存</el-button>
        </el-col>
        <el-col :span="6" align="center">
          <el-button @click="save('SB')" type="info">上报</el-button>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  import uploadFile from '../../../../components/common/uploadFile';

  export default {
    props: ['operailityData', 'userType','work'],
    data() {
      return {
        self: this,
        isWrite:true, //能否填写
        depRequirement: [], //轮转记录
        viewDayData:[{ // 出勤、奖惩情况
          minerDays:'',
          sickDays:'',
          personalDays:'',
          rewardNum:'',
          penaltyNum:'',
        }],
        rotaryRequirStatic:[], // 轮转要求统计
        viewData: {
          depExaminationId: '',
          depId: "",
          podId: "",
          depName: "",
          userName: "",
          rotaryBeginTime: "",
          rotaryEndTime: "",
          minerDays: '',
          sickDays: '',
          personalDays: '',
          rewardNum: '',
          penaltyNum: '',
          theoryExamScore: '',
          theoryExamIsMakeup: '',
          skillExamScore: '',
          skillExamIsMakeup: '',
          dailyExamScore: '',
          coligateScore: '',
          userSummary: "",
          teacherEvaluation: "",
          depRequired: [],
          userSummaryCreateTime: '',
          summaryFileList: [],
          teacherComment: "",
          teacherCommentCreateTime: "",
          teacherCommentUserName: "",
          teacherCommentFileList: [],
          depComment: "",
          depCommentCreateTime: "",
          depCommentFileList: [],
          depQualified: "",
          teacherAutograph: "",
          isMakeupRotary: '',
          makeupTs: '',
          graduateAppraisalState: '',
        },
        summaryFileList: {
          fileIds: '',
          comment: '',
          czType: '',
        },
        uploadFiles: [],
        // 学生类型
        studentType: 'SXS', // 默认实习生

        queryOld:{
          flage:false,
          message:'数据获取失败，不能添加',
        }
      }
    },
    methods: {
      // 初始化
      init() {
        // 检测当前登录用户是否是实习生
        let thisUserRoleList = [];

        if (this.userType) {
          this.studentType = this.userType.toLocaleUpperCase()
        }else {
          let userInfo = this.$store.getters.getUserInfo;
          this.studentType = userInfo.studentTypes;
        }
        if (this.operailityData.depExaminationId) {
          this.getViewData()
          return;
        }else if(this.work){
          this.getWorkData()
        }else {
          this.getViewDataForPodId()
        }

        this.getOrtherData()

      },

      //获取其他辅助数据
      getOrtherData() {
        this.getRotaryRequirStatic()
        this.queryOldRotaryDept() //判断之前的出科鉴定是否已填写以及延期申请是否已填写。
      },

      //学员添加出科鉴定时 判断之前的出科鉴定是否已填写以及延期申请是否已填写。
      queryOldRotaryDept(){
        let opt = {
          ajaxSuccess:res=>{
//            if(res.data){
//              let temp = [];
//              this.$util._.map(res.data,(val,key)=>{
//                val.key = key;
//                val.name = name[key];
//                temp.push(val)
//              })
//              this.rotaryRequirStatic = temp;
//            }
            if(!res.data)return;
            this.queryOld  = res.data;
            if(!res.data.flage){
              this.errorMess(res.data.message);
            }
          },
          ajaxParams:{
            url: api.queryOldRotaryDept.path + (this.operailityData.podId || this.viewData.podId),
            method:api.queryOldRotaryDept.method
          }
        };
        this.ajax(opt)
      },

      // 转要求统计
      getRotaryRequirStatic(){
        let name = {
          sscz:'手术操作',
          jnys: '技能演示',
          bltl: '病例讨论',
          klxjz: '科内小讲座',
          jxcf: '教学查房',
          dbl: '大病历',
          jn: '技能',
          bz: '病种',
        };
        let opt = {
          ajaxSuccess:res=>{
            if(res.data){
              let temp = [];
              this.$util._.map(res.data,(val,key)=>{
                val.key = key;
                val.name = name[key];
                temp.push(val)
              })
              this.rotaryRequirStatic = temp;
            }
          },
          ajaxParams:{
            url: api.getRotaryRequirStatic.path + (this.operailityData.podId || this.viewData.podId),
            method: api.getRotaryRequirStatic.method,
            params: {state: 'PASS'},
          }
        };
        this.ajax(opt)
      },

      // 获取预览数据
      getViewData() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.depExaminationId,
            method: api.get.method
          }
        })
      },

      // 获取数据成功
      getDataSuccess(res) {
        this.viewData = res.data;
        // this.viewDate.depRequirement = []; // 非实习生查看的轮转记录填写
        this.summaryFileList.comment = res.data.userSummary;
        let fileIds = [];
        this.uploadFiles.length = 0;
        res.data.summaryFileList.map(item => {
          fileIds.push(item.id);
          this.uploadFiles.push({
            fileId: item.id,
            fileName: item.fileName,
            filePath: '/api/file/download/' + item.id
          })
        });
        this.summaryFileList.fileIds = fileIds.join(',');
        this.getViewDataForPodId();
        this.getOrtherData()//通过podid获取其他数据
      },

      // 工作台获取预览数据 （如果有出科信息则返回出科信息，如果没有则返回个人的轮转信息）
      getWorkData() {
        this.ajax({
          ajaxSuccess: 'getWorkDataSuccess',
          ajaxParams: {
            url: api.outDepAppraiseGet.path + this.operailityData.podId,
            method: api.outDepAppraiseGet.method
          }
        })
      },

      //获取工作台的数据成功
      getWorkDataSuccess(res){
        if(res.data.depExaminationId){ // 如果存在出科id则返回的是出科详情的数据，如果不存在则获取的是出科鉴定-根据轮转ID获取考勤信息以及轮转成绩、病种填写信息
          if(['TEC_NOT_REPORT','EDU_NOT_REPORT','EDU_REPORT'].includes(res.data.graduateAppraisalState)){
            this.isWrite = false
          }
          this.viewData = res.data;
          // this.viewDate.depRequirement = []; // 非实习生查看的轮转记录填写
          this.summaryFileList.comment = res.data.userSummary;
          let fileIds = [];
          this.uploadFiles.length = 0;
          res.data.summaryFileList.map(item => {
            fileIds.push(item.id);
            this.uploadFiles.push({
              fileId: item.id,
              fileName: item.fileName,
              filePath: '/api/file/download/' + item.id
            })
          });
          this.summaryFileList.fileIds = fileIds.join(',');
          this.getViewDataForPodId();
        }else {
          this.getDataForPodIdSuccess(res)
        }

      },


      // 通过轮转id获取预览数据
      getViewDataForPodId() {
        this.ajax({
          ajaxSuccess: 'getDataForPodIdSuccess',
          ajaxParams: {
            url: api.getUserRotaryInfo.path + (this.operailityData.podId || this.viewData.podId),
            method: api.getUserRotaryInfo.method
          }
        })
      },

      // 获取数据成功
      getDataForPodIdSuccess(res) {
        this.$util._.map(res.data, (val, key) => {
          val && (this.viewData[key] = val)
        })

        for(let key in this.viewDayData[0]){
          this.viewDayData[0][key] = this.viewData[key] || '';
        }

        if (this.studentType === 'SXS') {
          this.getDepRequirementBySXS()
        } else {
          this.operailityData.rdId = this.viewData.rdId;
          this.operailityData.depId = this.viewData.depId;
          this.getDepRequirement();
        }
      },

      // 获取实习生查看的轮转记录填写
      getDepRequirementBySXS() {
        this.ajax({
          ajaxSuccess: res => this.depRequirement = res.data || [],
          ajaxParams: {
            //url: api.getDepRequirementBySXS.path + '--' + this.operailityData.podId,
            //修改增加其它三个id
            url: api.getDepRequirementBySXS.path + (this.operailityData.rdId || this.viewData.rdId || '') + '-' + (this.operailityData.depId || this.viewData.depId || '') + '-' + (this.operailityData.podId || this.viewData.podId || ''),
            method: api.getDepRequirementBySXS.method
          }
        })
      },
      // 获取非实习生查看的轮转记录填写
      getDepRequirement() {
        this.ajax({
          ajaxSuccess: res => this.depRequirement = res.data || [],
          ajaxParams: {
            url: api.getDepRequirement.path + (this.operailityData.rdId || this.viewData.rdId || '') + '_' + (this.operailityData.depId || this.viewData.depId || '') + '_' + (this.operailityData.podId || this.viewData.podId || ''),
            method: api.getDepRequirement.method
          }
        })
      },

      // 上传附件
      setUploadFiles(ids) {
        this.summaryFileList.fileIds = ids;
      },

      // 保存
      save(type) {
        if (type !== 'BC' && !this.queryOld.flage) {
          this.errorMess(this.queryOld.message);
          return;
        }
        let msg = type === 'BC' ? '保存' : '上报';
        this.summaryFileList.czType = type;
        this.ajax({
          type: 'rotary',
          successTitle: msg + '成功!',
          errorTitle: msg + '失败!',
//          ajaxSuccess: () => this.$emit('rotary', 'rotary', msg + '成功'),
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.userAddComment.path + this.viewData.podId,
            method: api.userAddComment.method,
            data: this.summaryFileList,
          }
        })
      },
    },
    components: {
      uploadFile
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  /* 出科申请 */

  .givenTheApplicationView {
    h4 {
      margin: 20px 0;
    }
  }

</style>
