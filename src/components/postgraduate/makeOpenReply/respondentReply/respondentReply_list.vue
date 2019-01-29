<!----------------------------------
****--@name     答辩申请
****--@role     respondentReply
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div style="width: 100%;height: 100%;overflow: auto;">
    <el-row>
      <el-col :span="4" :offset="1">
        <div class="cal-schoolTit"><strong>研究生答辩申请</strong></div>
      </el-col>
      <el-col :span="18">
        <el-steps :center="true" :active="active" finish-status="success">
          <el-step title="填写"></el-step>
          <el-step title="上报"></el-step>
          <el-step title="审核"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-form :model="formValidate" v-for="item in 1" :key="item" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="120px">
      <div v-if="isWrite">
        <!--不需要申请人的基本信息-->
        <el-row>
          <el-col :span="12" style="border-left: 1px solid #ececec;border-top: 1px solid #ececec;">
            <el-form-item label="姓名:" style="padding:4px 0;margin: 0;">
              {{formValidate.openTopicReportInfoResult.applicantName}}
            </el-form-item>
          </el-col>
          <el-col :span="12" style="border: 1px solid #ececec;border-bottom: none;">
            <!--<el-form-item label="汉语拼音:" style="padding:4px 0;margin: 0;">-->
            <!--{{formValidate.openTopicReportInfoResult.pinyin}}-->
            <!--</el-form-item>-->
            <el-form-item label="性别:" style="padding:4px 0;margin: 0;">
              {{formValidate.openTopicReportInfoResult.sex | typeText}}
            </el-form-item>
          </el-col>
          <el-col :span="12" style="border-left: 1px solid #ececec;border-top: 1px solid #ececec;">
            <el-form-item label="出生年月:" style="padding:4px 0;margin: 0;">
              {{getBirthDate(formValidate.openTopicReportInfoResult.birthDate)}}
            </el-form-item>
          </el-col>
          <el-col :span="12" style="border: 1px solid #ececec;border-bottom: none;">
            <el-form-item label="入学年月:" style="padding:4px 0;margin: 0;">
              {{formValidate.openTopicReportInfoResult.enrolmentYear}}
            </el-form-item>
          </el-col>
          <el-col :span="12" style="border: 1px solid #ececec;border-right: none;">
            <el-form-item label="学科专业:" style="padding:4px 0;margin: 0;">
              {{formValidate.openTopicReportInfoResult.major}}
            </el-form-item>
          </el-col>
          <el-col :span="12" style="border: 1px solid #ececec;">
            <el-form-item label="研究方向:" style="padding:4px 0;margin: 0;">
              {{formValidate.openTopicReportInfoResult.researchDirection}}
            </el-form-item>
          </el-col>
          <el-col style="border: 1px solid #ececec;">
            <el-form-item label="课题名称:" style="padding:4px 0;margin: 0;">
              {{formValidate.openTopicReportInfoResult.topicName}}
            </el-form-item>
          </el-col>
          <el-col :span="12" style="border: 1px solid #ececec;border-right: none;">
            <el-form-item label="导师姓名:" style="padding:4px 0;margin: 0;">
              {{formValidate.openTopicReportInfoResult.tutorName}}
            </el-form-item>
          </el-col>
          <el-col :span="12" style="border: 1px solid #ececec;">
            <el-form-item label="职称:" style="padding:4px 0;margin: 0;">
              {{formValidate.openTopicReportInfoResult.positionalTitle}}
            </el-form-item>
          </el-col>
        </el-row>
        <br/>
        <!--要办理的事项-->
        <h2 align="center">办理事项</h2>
        <el-table
          class="margin-top-14px"
          align="center"
          :data="formValidate.matter"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%">
          <el-table-column
            show-overflow-tooltip
            prop="key"
            label="事项(未完成将不能保存)">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            label="状态"
            prop="name"
            width="200">
            <template scope="scope">
              <el-radio-group v-if="scope.row.value" v-model="formValidate[scope.row.value]">
                <el-radio v-for="(item,index) in scope.row.option" :key="index" :label="item.label">{{ item.text }}</el-radio>
              </el-radio-group>
              <span v-else :style="{color:scope.row.adopt?'#13CE66':'#FF4949'}">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <el-row class="table-back-one">
          <el-col :span="12">
            <el-form-item label="答辩专科:" prop="defenseSpecialist">
              {{formValidate.defenseSpecialist}}
              <!--<el-input  v-model="formValidate.defenseSpecialist" placeholder="请输入"></el-input>-->
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="答辩时间:" prop="defenseTime">
              <el-date-picker
                :editable="false"
                v-model="formValidate.defenseTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-two">
          <el-col :span="12">
            <el-form-item label="答辩地点:" prop="defensePlace">
              <!--{{formValidate.defensePlace}}-->
              <el-input v-model="formValidate.defensePlace" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否预答辩:" prop="isPreDefense">
              <el-radio-group v-model="formValidate.isPreDefense">
                <el-radio :label="'1'">是</el-radio>
                <el-radio :label="'2'">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-one" style="padding: 0">
          <el-col>
            <el-form-item label="拟答辩研究生:">
              {{formValidate.applicantName}}({{ formValidate.degreeType=='MASTER'?'硕士':'博士' }})
            </el-form-item>
          </el-col>
          <!--<el-col :span="4" style="text-align: center;">-->
          <!--&lt;!&ndash;<div style="font-size: 14px;color: #48576a;line-height: 96px">拟答辩研究生名单</div>&ndash;&gt;-->
          <!--<div style="font-size: 14px;color: #48576a;line-height: 48px">拟答辩研究生名单</div>-->
          <!--</el-col>-->

          <!--<el-col :span="20">-->
          <!--<el-row class="table-back-two" style="border-top: none;border-right:none;">-->
          <!--<el-col :span="24">-->
          <!--<el-form-item :label="(formValidate.degreeType=='DOCTOR'?'博士':'硕士')+':'">-->
          <!--{{formValidate.applicantName}}-->
          <!--&lt;!&ndash;<el-radio class="radio" v-model="formValidate.degreeType" label="DOCTOR">博士</el-radio>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-radio class="radio" v-model="formValidate.degreeType" label="MASTER">硕士</el-radio>&ndash;&gt;-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <!-- <el-row class="table-back-two" style="border-top: none;border-right:none;">
             <el-col :span="24">
               <el-form-item  label="博士:" >
                 <el-radio class="radio" v-model="formValidate.degreeType" label="DOCTOR">{{formValidate.applicantName}}</el-radio>
               </el-form-item>
             </el-col>
           </el-row>
           <el-row class="table-back-one" style="border-right:none;">
             <el-col :span="24" >
               <el-form-item  label="硕士:" >
                 <el-radio class="radio" v-model="formValidate.degreeType" label="MASTER">{{formValidate.applicantName}}</el-radio>
               </el-form-item>
             </el-col>
           </el-row>-->
          <!--</el-col>-->
        </el-row>

        <el-row class="table-back-two-d">
          <el-col :span="24">
            <el-form-item label="导师:" prop="tutorName">
              {{formValidate.tutorName}}
              <!--<el-input  v-model="formValidate.tutorName" placeholder="请输入"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <br>

        <h2 align="center">审核组成员（第一个为答辩秘书）</h2>
        <el-table
          align="center"
          class="margin-top-14px"
          :data="formValidate.memberList"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="75">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            class-name="valiTableStyle"
            prop="name"
            label="姓名">
            <template scope="scope">
              <el-form :model="scope.row" v-for="item in 1" :key="item" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="0">
                <el-form-item prop="name">
                  <template v-if="scope.$index===0">
                    <el-input v-model="scope.row.name" readonly placeholder="请选择答辩秘书">
                      <el-button slot="append" icon="view" @click="selectUser(scope.$index)"></el-button>
                    </el-input>
                  </template>
                  <el-input v-else v-model="scope.row.name" placeholder="请输入或者选择人员">
                    <el-button slot="append" icon="view" @click="selectUser(scope.$index)"></el-button>
                  </el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="positionalTitle"
            label="职称"
            class-name="valiTableStyle"
            align="center">
            <template scope="scope">
              <el-form :model="scope.row" v-for="item in 1" :key="item" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="0">
                <el-form-item prop="positionalTitle">
                  <el-input v-model="scope.row.positionalTitle" placeholder="请输入"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="company"
            label="单位"
            class-name="valiTableStyle"
            align="center">
            <template scope="scope">
              <el-form :model="scope.row" v-for="item in 1" :key="item" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="0">
                <el-form-item prop="company">
                  <el-input v-model="scope.row.company" placeholder="请输入"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="phoneNumber"
            label="手机号"
            class-name="valiTableStyle"
            align="center">
            <template scope="scope">
              <el-form :model="scope.row" v-for="item in 1" :key="item" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="0">
                <el-form-item prop="phoneNumber">
                  <el-input v-model="scope.row.phoneNumber" placeholder="请输入"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="right"
            label="操作"
            width="120">
            <template scope="scope">
              <el-button size="mini" type="info" icon="plus" @click="addMemeberList"></el-button>
              <el-button size="mini" type="danger" icon="close" :disabled="scope.$index===0" @click="removeMemeberList(scope.$index)"></el-button>
              <!--<template v-if="scope.$index === 0">-->
              <!--<el-button size="mini" type="warning" v-if="scope.row.role!='SECRETARY'" @click="setRole(scope.$index)">答辩秘书</el-button>-->
              <!--<el-button size="mini" disabled v-else>答辩秘书</el-button>-->
              <!--</template>-->
            </template>
          </el-table-column>
        </el-table>

        <template v-if="formValidate.arrangeRotaryList">
          <br>
          <h2 align="center">轮转安排</h2>
          <el-table align="center" :data="formValidate.arrangeRotaryList" tooltip-effect="dark" highlight-current-row
                    style="width: 100%;height: 100%">
            <el-table-column align="center" label="序号" type="index" width="100"></el-table-column>
            <el-table-column show-overflow-tooltip prop="depName" class-name="valiTableStyle" label="科室名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="teacherName" class-name="valiTableStyle" label="带教老师"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="startDate" class-name="valiTableStyle" label="开始日期">
              <template scope="scope">
                {{ (scope.row.startDate || scope.row.rotaryBeginTime || '') | formatDate('yyyy-MM-dd') }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="endDate" class-name="valiTableStyle" label="结束日期">
              <template scope="scope">
                {{ (scope.row.endDate || scope.row.rotaryEndTime || '') | formatDate('yyyy-MM-dd') }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <show :operailityData="formValidate" :auditStep="auditStep(formValidate.status)" v-else>
        <el-form-item label="答辩地点:" prop="defensePlace">
          {{formValidate.defensePlace}}
          <!--<el-input v-model="formValidate.defensePlace" style="width:250px" placeholder="请输入"></el-input>-->
        </el-form-item>
      </show>
    </el-form>
    <el-row class="but-space">
      <el-col align="center">
        <load-btn v-if="!isSave&&formValidate.status==''" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <load-btn v-if="isSave&&formValidate.status=='WSB'" @listenSubEvent="listenSubEventEdit" :btnData="loadBtn1"></load-btn>
        <load-btn v-if="formValidate.status=='WSB'||formValidate.status=='BH'" @listenSubEvent="listenSubEventSubmit" :btnData="loadBtn2"></load-btn>
      </el-col>
    </el-row>

    <!--选择人员-->
    <Modal width="890" v-model="selectUserModal" title="选择人员" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" :isOnlyOne="true" @cancel="closeUserModal" @setUsers="setUsers" :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import { respondentReply as rules } from '../rules.js';
  import show                         from '../common/makeOpenReply_view.vue';
  import api                          from '../api.js';

  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        loadBtn1: {title: '保存', callParEvent: 'listenSubEvent'},
        loadBtn2: {title: '上报', callParEvent: 'listenSubEvent'},
        isWrite: false,
        active: 0,

        formValidate: {
          'id': '',
          defenseSpecialist: '',//defenseSpecialist
          'applicantId': '',
          'name': '',
          'studentId': '',
          'boundary': '',
          'phone': '',
          'specialtyCode': '',
          'specialtyName': '',
          'researchDirection': '',
          'thesisTitle': '',
          'status': '',
          'defenseTime': '',  //答辩时间
          'defensePlace': '',
          'isPreDefense': 2,
          'resultStatus': '2',
          'attachmentId': '',
          'theoreticalAchievementQualified': 'NO', // 理论成绩是否合格
          'paperProvesSubmission': 'NO', // 学术论文发表证明是否提交
          'fileInfo': {
            'fileId': '',
            'fileName': '',
            'filePath': '',
            'fileType': ''
          },
          openTopicReportInfoResult: {},
          tutorName: '',//老师名字
          arrangeRotaryList: null,
          'memberList': [
            {
              'userId': '',
              'name': '',
              'positionalTitle': '',
              'company': '',
              'phoneNumber': '', // 手机号
              'role': '' // 角色(MEMBER 成员 SECRETARY 答辩秘书)"
            }

          ],
          matter: []//办理事项
        },

        tableData: [],

        //是否已保存
        isSave: false,

        //获取答辩申请(修改时调用)
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.defenseAppGet.path
          }
        },

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'addSuccess',
          ajaxError: 'addFail',
          ajaxParams: {
            url: api.defenseAppAdd.path,
            method: api.defenseAppAdd.method,
            jsonString: true,
            params: {
              researchDirection: '',
              thesisTitle: '',
              attachmentId: '',
              status: '',
              defenseTime: '',
              defensePlace: '',
              isPreDefense: ''
            }
          },
          submit: ''
        },

        //当前组件提交(eidt)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'editSuccess',
          ajaxError: 'editFail',
          ajaxParams: {
            url: api.defenseAppModify.path,
            method: api.defenseAppModify.method,
            jsonString: true
          }
        },

        //当前组件提交(eidt)数据时,ajax处理的 基础信息设置
        submitMessTitle: {
          type: 'submit',
          successTitle: '上报成功!',
          errorTitle: '上报失败!',
          ajaxSuccess: 'submitSuccess',
          ajaxError: 'submitFail',
          ajaxParams: {
            url: api.defenseAppReport.path,
            method: 'put',
            data: {
              status: 'DSDSH'
            }
          }
        },

        selectUserModal: false,
        selectUserId: {id: 'selectUserId', title: '选择答辩秘书'},
        initUser: null,
        selectUserIndex: 0 // 选择人员的下标
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.ajax(this.listMessTitle);
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;

        if (data) {
          if (!data.id) {
            this.isWrite = true;
          } else {
            this.isSave = true;
          }

          if (!data.status) {
            data.status = '';
            this.active = 0;
            data.isPreDefense = '1';
            this.isWrite = true;
          } else if (data.status == 'WSB') {
            this.isWrite = true;
            this.active = 1;
          } else if (['DSDSH', 'JYSDSH', 'JYCDSH'].includes(data.status)) {
            this.active = 2;
          } else {
            this.active = 3;
          }
          if (data.fileInfo) {
            data.fileList = [data.fileInfo];
            data.attachmentId = data.fileInfo.fileId;
          } else {
            data.fileList = [];
          }

          if (!data.degreeType) {
            data.degreeType = 'MASTER';
          }

          if (data.memberList == 0 || !data.memberList) {
            data.memberList = [
              {
                'userId': '',
                'name': '',
                'positionalTitle': '',
                'company': '',
                'phoneNumber': '', // 手机号
                'role': 'SECRETARY' // 角色(MEMBER 成员 SECRETARY 答辩秘书)"
              }
            ];
          }

          if (!data.openTopicReportInfoResult) {
            data.openTopicReportInfoResult = {};
          }
          data.theoreticalAchievementQualified = data.theoreticalAchievementQualified || 'NO';
          data.paperProvesSubmission = data.paperProvesSubmission || 'NO';
          data.matter = [
            {
              key: '培养计划',
              name: data.trainingPlan,
              adopt: data.trainingPlan === '已填写'
            },
//            {
//              key: '开题申请',
//              name: data.openTopicApplication
//            },
            {
              key: '开题报告',
              name: data.openTopicReport,
              adopt: data.openTopicReport === '已填写'
            }];

          data.matter.push(
            {
              key: '出科考核是否合格',
              name: data.depExaminationQualified === 'YES' ? '合格' : '不合格',
              // 学术学位不强制要求
              adopt: data.degree === 'MAJOR' ? true : (data.depExaminationQualified === 'YES')
            });
          data.matter.push({
            key: '中期考核是否合格',
            name: data.midTermAssessmentQualified === 'YES' ? '合格' : '不合格',
            adopt: data.midTermAssessmentQualified === 'YES'
          });
          data.matter.push({
            key: `科研日志是否达标（${data.scientificResearchLogNum}/${data.scientificResearchLogNeedNum}）`,
            name: data.isScientificResearchLog === 'YES' ? '合格' : '不合格',
            // 专业学位不强制要求
            adopt: data.degree === 'LEARNING' ? true : (data.isScientificResearchLog === 'YES')
          });
          data.matter.push({
            key: '理论成绩是否合格',
            value: 'theoreticalAchievementQualified',
            name: data.theoreticalAchievementQualified === 'YES' ? '合格' : '不合格',
            adopt: data.theoreticalAchievementQualified === 'YES',
            option: [
              {label: 'YES', text: '合格'},
              {label: 'NO', text: '不合格'}
            ]
          });
          data.matter.push({
            key: '学术论文发表证明是否提交',
            value: 'paperProvesSubmission',
            name: data.paperProvesSubmission === 'YES' ? '提交' : '未提交',
            adopt: data.paperProvesSubmission === 'YES',
            option: [
              {label: 'YES', text: '提交'},
              {label: 'NO', text: '未提交'}
            ]
          });
          this.formValidate = data;
        }
      },

      /**
       * 提交
       */
      listenSubEvent (isLoadingFun) {
//        if (this.formValidate.trainingPlan == '未填写' || !this.formValidate.trainingPlan) {
//          this.errorMess('培养计划未填写,不能提交');
//          return;
//        }
//        if (this.formValidate.openTopicApplication == '未填写' || !this.formValidate.openTopicApplication) {
//          this.errorMess('开题申请未填写,不能提交');
//          return;
//        }
//        if (this.formValidate.openTopicReport == '未填写' || !this.formValidate.openTopicReport) {
//          this.errorMess('开题报告未填写,不能提交');
//          return;
//        }
        if (!this.formValidate.submit) {
          this.errorMess('不在可答辩时间之内');
          return;
        }

        if (!this.checkMatter()) {
          return false;
        }
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit && this.checkMemberList()) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let formValidate = this.getFormData(this.formValidate);
          formValidate.status = 'WSB';
          this.addMessTitle.ajaxParams.data = formValidate;
          this.ajax(this.addMessTitle, isLoadingFun);
        }
      },

      /**
       * 修改
       */

      listenSubEventEdit (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit && this.checkMatter() && this.checkMemberList()) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let formValidate = this.getFormData(this.formValidate);
          formValidate.status = 'WSB';
          let editMessTitle = Util._.defaultsDeep({}, this.editMessTitle);
          editMessTitle.ajaxParams.url += this.formValidate.id;
          editMessTitle.ajaxParams.data = formValidate;
          this.ajax(editMessTitle, isLoadingFun);
        }
      },

      /**
       * 上报
       */
      listenSubEventSubmit (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
//          let formValidate = this.getFormData(this.formValidate);
          let submitMessTitle = Util._.defaultsDeep({}, this.submitMessTitle);
          submitMessTitle.ajaxParams.url += this.formValidate.id;
          this.ajax(submitMessTitle, isLoadingFun);
        }
      },

      // 检测待办事项
      checkMatter () {
        let allAdopt = this.formValidate.matter.every(item => item.value ?
          // 如果有value则检查formValidate的属性是否为YES
          this.formValidate[item.value] === 'YES' :
          !!item.adopt
        );
        if (!allAdopt) {
          this.errorMess('请检查办理事项中的所有事项是否都合格或者已填写！');
        }
        return allAdopt;
      },
      // 检测审核小组成员
      checkMemberList () {
        let secretaryIndex = -1;
        let hasSECRETARY = this.formValidate.memberList.some((item, index) => {
          secretaryIndex = index;
          return item.role === 'SECRETARY';
        });
        if (!hasSECRETARY) {
          this.errorMess('请设置答辩秘书！');
          return false;
        }
        if (!!~secretaryIndex && !this.formValidate.memberList[secretaryIndex].userId) {
          this.errorMess('答辩秘书必须选择人员！');
          return false;
        }
        return true;
      },

      //添加回调提示
      addSuccess () {
        this.successMess('添加成功!');
        this.init();
      },

      //修改回调提示
      editSuccess () {
        this.successMess('修改成功!');
        this.init();
      },

      //上报回调提示
      submitSuccess () {
        this.init();
        this.isWrite = false;
        this.successMess('上报成功!');
      },

      // 设置为答辩秘书
      setRole (index) {
        let memberList = Util._.defaultsDeep([], this.formValidate.memberList);
        memberList.map((item, i) => item.role = (index === i ? 'SECRETARY' : 'MEMBER'));
        this.formValidate.memberList = memberList;
      },

      // 选择人员
      selectUser (index) {
        let {userId, name} = this.formValidate.memberList[index];
        this.selectUserIndex = index;
        this.initUser = userId ? [
          {
            key: userId,
            label: name,
            description: '',
            specialty: '',
            disabled: false
          }
        ] : [];
        this.openModel('selectUser');
        console.log(index);
      },

      // 选择人员回调
      setUsers (userArr) {
        console.log(userArr);
        let {key, label} = userArr[0];
        this.formValidate.memberList[this.selectUserIndex].name = label;
        this.formValidate.memberList[this.selectUserIndex].userId = key;
        this.closeUserModal();
      },

      // 关闭选择人员
      closeUserModal () {
        this.cancel('selectUser');
      },

      /**
       * 附件上传后前台赋值
       */
      expenseFileEvent (ids) {
        this.formValidate.attachmentId = ids;
      },

      /**
       * 点击提交按钮 监听是否验证通过
       * @param  {String} formName   form表单v-model数据对象名称
       * @return {boolean} flag    form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = true;
        this.$refs[formName].map(item => {
          item.validate((valid) => {
            if (!valid) {
              flag = false;
            }
          });
        });

        return flag;
      },

      /**
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        this.formDate(myData, ['defenseTime'], 'yyyy-MM-dd');
        // 默认第1个是答辩秘书
        data.memberList.map((item, index) => (index === 0 ? 'SECRETARY' : 'MEMBER'));
        return myData;
      },

      //添加人员列表
      addMemeberList () {
        this.formValidate.memberList.push({
          'userId': '',
          'name': '',
          'positionalTitle': '',
          'company': '',
          'phoneNumber': '', // 手机号
          'role': 'MEMBER' // 角色(MEMBER 成员 SECRETARY 答辩秘书)"
        });
      },

      removeMemeberList (index) {
        if (this.formValidate.memberList.length < 2) {
          this.errorMess('不能移除');
          return;
        }
        this.formValidate.memberList.splice(index, 1);
      },

      //审核步骤
      auditStep (status) {
        let obj = {
          'WSB': '-1',
          'DSDSH': '0',
          'DSBH': '1',
          'JYSDSH': '2',
          'JYSBH': '3',
          'JYCDSH': '4',
          'JYCBH': '5',
          'TG': '6',
          'MODIFY_END': '-1',
          'AGAIN_END': '-1'
        };
        return obj[status];
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },

      getBirthDate (num) {
        return num ? this.yearMonth(num) : '';
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      show
    }
  };
</script>
