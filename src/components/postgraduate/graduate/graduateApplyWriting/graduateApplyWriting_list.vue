<!----------------------------------
****--@name     毕业申请填写
****--@role     研究生
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" style="position: absolute;top: 10px;left: 10px;right:10px;bottom:10px;overflow: auto">
    <el-row>
      <el-col :span="4" :offset="1">
        <span style="float: left;font-size: 28px;font-weight: 700;line-height: 1.7;">研究生毕业申请</span>
      </el-col>
      <el-col :span="18" :offset="1">
        <el-steps :active="active" finish-status="success">
          <el-step title="填写"></el-step>
          <el-step title="上报"></el-step>
          <el-step title="审核"></el-step>
        </el-steps>
      </el-col>
    </el-row>

    <el-form v-for="item in 1" :key="item" :model="formValidate" ref="formValidate" :rules="rules"
             class="demo-form-inline">
      <el-row>
        <el-col :span="11" :offset="1" style="border-left: 1px solid #ececec;border-top: 1px solid #ececec;">
          <el-form-item label="申请人:" style="padding:4px 0;margin: 0;">
            {{formValidate.name}}
          </el-form-item>
        </el-col>
        <el-col :span="11" style="border: 1px solid #ececec;border-bottom: none;">
          <el-form-item label="学号:" style="padding:4px 0;margin: 0;">
            {{formValidate.studentId}}
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1" style="border-left: 1px solid #ececec;border-top: 1px solid #ececec;">
          <el-form-item label="手机号:" style="padding:4px 0;margin: 0;">
            {{formValidate.phone}}
          </el-form-item>
        </el-col>
        <el-col :span="11" style="border: 1px solid #ececec;border-bottom: none;">
          <el-form-item label="" style="padding:4px 0;margin: 0;">
            &nbsp;
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1" style="border: 1px solid #ececec;border-right: none;">
          <el-form-item label="专业方向:" style="padding:4px 0;margin: 0;">
            {{formValidate.specialtyName}}
          </el-form-item>
        </el-col>
        <el-col :span="11" style="border: 1px solid #ececec;">
          <el-form-item label="专业代码:" style="padding:4px 0;margin: 0;">
            {{formValidate.specialtyCode}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br/>

    <el-row>
      <el-col :span="22" :offset="1">
        <h2>处理事项</h2>
      </el-col>
      <el-col :span="22" :offset="1" class="pcggawTodoList">
        <p>1. 轮转记录填写（<span :class="{'success': graduationData.isCompleteRotationRecord}">
          {{ graduationData.isCompleteRotationRecord ? '' : '不' }}完整</span>）
        </p>
        <p>2. 至少提交一份经典病例（<span :class="{'success': graduationData.isClassicalMedicalRecords}">
          {{ graduationData.isClassicalMedicalRecords ? '已' : '未' }}提交</span>）
        </p>
        <p>3. 对老师、科室进行评价（<span :class="{'success': graduationData.isEvaluate}">
          {{ graduationData.isEvaluate ? '已' : '未' }}评价</span>）
        </p>
        <p>4. 考核情况（<span :class="{'success': graduationData.isPassExam}">
          {{ graduationData.isPassExam ? '已' : '未' }}通过</span>）
        </p>
        <p>5. 离院手续（<span
          :class="{'success': formValidate.isProcedures == 'YES', 'default': formValidate.isProcedures === null,}">
          {{ isProceduresText(formValidate.isProcedures) }}</span>）
        </p>
      </el-col>
    </el-row>
    <br>

    <!--<template v-if="canWrite">-->
    <el-row>
      <el-col :span="22" :offset="1">
        <el-col v-if="isWrite" align="right" style="margin-bottom: 5px">
          <el-button @click="addRow" type="primary">增加</el-button>
        </el-col>
        <el-table
          v-for="item in 1"
          :key="item"
          align="center"
          max-height="400"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="article"
            class-name="valiTableStyle"
            label="发表文章">
            <template scope="scope">
              <el-form v-if="isWrite" :model="scope.row" ref="formValidate" :rules="rules" class="demo-form-inline"
                       label-width="0">
                <el-form-item prop="article">
                  <el-input v-model="scope.row.article"></el-input>
                </el-form-item>
              </el-form>
              <div v-else>{{scope.row.article}}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="periodical"
            class-name="valiTableStyle"
            label="期卷号">
            <template scope="scope">
              <el-form v-if="isWrite" :model="scope.row" ref="formValidate" :rules="rules" class="demo-form-inline"
                       label-width="0">
                <el-form-item prop="periodical">
                  <el-input v-model="scope.row.periodical"></el-input>
                </el-form-item>
              </el-form>
              <div v-else>{{scope.row.periodical}}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="publication"
            class-name="valiTableStyle"
            label="刊物名称">
            <template scope="scope">
              <el-form v-if="isWrite" :model="scope.row" ref="formValidate" :rules="rules" class="demo-form-inline"
                       label-width="0">
                <el-form-item prop="publication">
                  <el-input v-model="scope.row.publication"></el-input>
                </el-form-item>
              </el-form>
              <div v-else>{{scope.row.publication}}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="author"
            label="是否第一作者"
            class-name="valiTableStyle">
            <template scope="scope">
              <el-form v-if="isWrite" :model="scope.row" ref="formValidate" :rules="rules" class="demo-form-inline"
                       label-width="0">
                <el-form-item prop="author">
                  <el-radio-group v-model="scope.row.author">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <div v-else>{{scope.row.author}}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="signature"
            class-name="valiTableStyle"
            label="文章署名单位"
          >
            <template scope="scope">
              <el-form v-if="isWrite" :model="scope.row" ref="formValidate" :rules="rules" class="demo-form-inline"
                       label-width="0">
                <el-form-item prop="signature">
                  <el-input v-model="scope.row.signature"></el-input>
                </el-form-item>
              </el-form>
              <div v-else>{{scope.row.signature}}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="correspondent"
            class-name="valiTableStyle"
            label="通讯作者">
            <template scope="scope">
              <el-form v-if="isWrite" :model="scope.row" ref="formValidate" :rules="rules" class="demo-form-inline"
                       label-width="0">
                <el-form-item prop="correspondent">
                  <el-input v-model="scope.row.correspondent"></el-input>
                </el-form-item>
              </el-form>
              <div v-else>{{scope.row.included}}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="included"
            class-name="valiTableStyle"
            label="是否SCI收录">
            <template scope="scope">
              <el-form v-if="isWrite" :model="scope.row" ref="formValidate" :rules="rules" class="demo-form-inline"
                       label-width="0">
                <el-form-item prop="included">
                  <el-radio-group v-model="scope.row.included">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <div v-else>{{scope.row.included}}</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="influence"
            class-name="valiTableStyle"
            label="影响因子">
            <template scope="scope">
              <el-form v-if="isWrite" :model="scope.row" ref="formValidate" :rules="rules" class="demo-form-inline"
                       label-width="0">
                <el-form-item prop="influence">
                  <el-input v-model="scope.row.influence"></el-input>
                </el-form-item>
              </el-form>
              <div v-else>{{scope.row.influence}}</div>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="createTime"
            width="80"
            label="操作">
            <template scope="scope">
              <el-button :disabled="!isWrite" size="small" @click="remove(scope.$index)" type="danger"> 删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <br>

    <el-form v-for="item in 1" :key="item" :model="formValidate" :rules="rules" ref="formValidate"
             class="demo-form-inline">
      <el-row>
        <el-col :span="20" :offset="2" class="el-form--inline">
          <el-form-item label="离院时间:" prop="leaveDate" style="margin-left: 10px">
            <el-date-picker
              v-if="isWrite"
              :editable="false"
              v-model="formValidate.leaveDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <div v-else>{{formValidate.leaveDate}}</div>
          </el-form-item>
          <el-form-item label="毕业去向:" prop="whereabouts" style="margin-left: 10px">
            <el-select v-if="isWrite" filterable clearable v-model="formValidate.whereabouts" placeholder="请选择">
              <select-option type="getByCode" :unAll="true" codeType="YJS_BYQX" :isCode="true" id="code"></select-option>
            </el-select>
            <!--<el-input v-if="isWrite" v-model="formValidate.whereabouts" placeholder="请输入"></el-input>-->
            <div v-else> {{formValidate.whereabouts | dictionary(self,'YJS_BYQX')}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="2">
          <el-form-item label="三甲医院:" prop="isThree" label-width="90px">
            <el-radio-group v-if="isWrite" v-model="formValidate.isThree">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            <div v-else> {{formValidate.isThree?'是':'否'}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="附件:" prop="attachmentId" class="is-required" label-width="90px">
            <span style="color: #FF4949;font-size: 14px">请上传答辩时照片及学位论文复印件或相关证明</span>
            <div v-if="isWrite">
              <upload-file :uploadFiles="formValidate.fileList" @setUploadFiles="expenseFileEvent"></upload-file>
            </div>
            <div v-if="!isWrite">
              <upload-file :uploadFiles="formValidate.fileList" :show="true"></upload-file>
            </div>

          </el-form-item>
        </el-col>
      </el-row>
      <br>
      <el-row v-if="auditStep(formValidate.status)>0">
        <el-col :span="18" :offset="2">
          <el-form-item label="状态:">
            {{formValidate.status | typeText}}
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="auditStep(formValidate.status)>-1">
        <br>
        <!--审核-->
        <el-row>
          <el-col :span="22" :offset="1">
            <el-steps :active="activeAudit" finish-status="success" :center="true">
              <el-step title="导师审核"></el-step>
              <el-step title="教研室审核"></el-step>
              <el-step title="教育处审核"></el-step>
            </el-steps>
          </el-col>
        </el-row>
      </template>
      <!--<div  v-if="auditStep(formValidate.status)>-1">
        &lt;!&ndash;导师审核&ndash;&gt;
        <div v-if="active==0">
          <el-row v-if="auditStep(formValidate.status)>0">
            <el-col :span="8" :offset="2">
              <el-form-item label="审核人:" >
                {{formValidate.auditName}}
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item label="审核时间:" >
                {{formValidate.auditTime }}
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="2">
              <el-form-item label="审核意见:" >
                <el-input v-model="formValidate.auditOpinion"  type="textarea" autosize readonly resize="none"></el-input>
              </el-form-item>
            </el-col>
          </el-row >
          <el-row v-if="auditStep(formValidate.status)==0" >
            <el-col :span="24"  style="font-size:18px; text-align: center;line-height: 100px;">
              <strong>导师审核中</strong>
            </el-col>
          </el-row >
        </div>
        &lt;!&ndash;教研室审核&ndash;&gt;
        <div  v-if="active==1">
          <el-row v-if="auditStep(formValidate.status)>2">
            <el-col :span="8" :offset="2">
              <el-form-item label="审核人:" >
                {{formValidate.jysAuditName}}
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item label="审核时间:" >
                {{formValidate.jysAuditTime }}
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="2">
              <el-form-item label="审核意见:" >
                <el-input v-model="formValidate.jysAuditOpinion"  type="textarea" autosize readonly resize="none"></el-input>
              </el-form-item>
            </el-col>
          </el-row >
          <el-row v-if="auditStep(formValidate.status)==2">
            <el-col  :span="24"  style="font-size:18px; text-align: center;line-height: 100px;">
              <strong>教研室审核中</strong>
            </el-col>
          </el-row >
        </div>
        &lt;!&ndash;教育处审核&ndash;&gt;
        <div  v-if="active==2">
          <el-row v-if="auditStep(formValidate.status)>4">
            <el-col :span="8" :offset="2">
              <el-form-item label="审核人:" >
                {{formValidate.jycAuditName}}
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item label="审核时间:" >
                {{formValidate.jycAuditTime }}
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="2">
              <el-form-item label="审核意见:" >
                <el-input v-model="formValidate.jycAuditOpinion"  type="textarea" autosize readonly resize="none"></el-input>
              </el-form-item>
            </el-col>
          </el-row >
          <el-row v-if="auditStep(formValidate.status)==4">
            <el-col  :span="24"  style="font-size:18px; text-align: center;line-height: 100px;">
              <strong>教育处审核中</strong>
            </el-col>
          </el-row >
        </div>
      </div>-->
      <template v-if="auditStep(formValidate.status)>0">
        <el-row>
          <el-col :span="22" :offset="1">
            <el-table
              align="center"
              :data="formValidate.userReviewList"
              tooltip-effect="dark"
              highlight-current-row
              style="width: 100%;height: 100%">
              <el-table-column
                show-overflow-tooltip
                prop="createUserName"
                label="审核人">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="reviewMess"
                label="审核意见">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="createTime"
                label="审核时间">
                <template scope="scope">
                  {{scope.row.createTime |formatDate('yyyy-MM-dd')}}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <br>
      </template>
      <el-row v-if="isWrite">
        <el-col align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <load-btn v-if="auditStep(formValidate.status)>-2&&isWrite" @listenSubEvent="reportSubEvent"
                    :btnData="reportBtn"></load-btn>
        </el-col>
      </el-row>
      <br>
    </el-form>
    <!--</template>-->
    <!--<p v-else class="pcggawWriteTips">-->
    <!--请完成处理事项之后才能填写-->
    <!--</p>-->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api                             from '../api';
  import { graduateApplyAudit as rules } from '../rules';
  import todoTips                        from './graduateApplyWriting_tips';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        rules,
        active: 0,
        activeAudit: 0,
        self: this,
        type: 'DSH',
        // canWrite: false, // 是否可填写
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        reportBtn: {title: '上报', callParEvent: 'listenSubEvent'},
        graduationData: {
          'isCompleteRotationRecord': '', // 轮转记录是否完整
          'isClassicalMedicalRecords': '', // 是否填写至少一份经典病历
          'isEvaluate': '', // 是否对老师，科室评价
          'isPassExam': '' // 考核是否通过
        },
        formValidate: {
          fileIds: '',
          'id': '',
          'name': '',
          'studentId': '',
          'boundary': '',
          'phone': '',
          'specialtyCode': '',
          'specialtyName': '',
          'paper': '',
          isThree: 0,
          status: '',
          userReviewList: [],
          'leaveDate': '',
          fileList: [],
          isProcedures: null,
          'graduationSublist': [
            {
              'article': '',
              'periodical': '',
              'publication': '',
              'author': '',
              'signature': '',
              'correspondent': '',
              'included': '',
              'influence': '',
              'creationdate': ''
            }
          ]
        },

        tableData: [
          {
            'article': '',
            'periodical': '',
            'publication': '',
            'author': '是',
            'signature': '',
            'correspondent': '',
            'included': '是',
            'influence': '',
            'creationdate': ''
          }],

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: api.get.path
          }
        },
        isWrite: false,
        isAdd: false
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.getGraduationData();
      },

      // 是否可以填写
      tipMsgCall () {
        // 先不判断待办事项
        let tag = false;
        let msgs = [];
        let d = this.graduationData;
        const h = this.$createElement;
        tag = !!(d.isCompleteRotationRecord && d.isClassicalMedicalRecords && d.isEvaluate && d.isPassExam);
        // this.canWrite = this.auditStep(this.formValidate.status) > 0 || tag;
        // tag = this.auditStep(this.formValidate.status) > 0 || tag;
        console.log(tag);
        if (!tag) {
          !d.isCompleteRotationRecord && msgs.push('轮转记录不完整');
          !d.isClassicalMedicalRecords && msgs.push('需要至少填写一份经典病历');
          !d.isEvaluate && msgs.push('对老师，科室还未进行评价');
          !d.isPassExam && msgs.push('考核未通过');
          this.$notify.info({
            title: '待办事项',
            offset: 60,
            message: h(todoTips, {
              props: {
                msgs
              }
            })
          });
        }
      },

      isProceduresText (val) {
        let text = '待确认';
        if (val === 'NO') {
          text = '未办理';
        }
        if (val === 'YES') {
          text = '已办理';
        }
        return text;
      },
      // 获取当前登陆人毕业数据填写情况
      getGraduationData () {
        let opt = {
          ajaxSuccess: res => {
            this.graduationData = res.data;
            this.ajax(this.listMessTitle);
          },
          ajaxParams: {
            url: api.getGraduationData.path
          }
        };
        this.ajax(opt);
      },

      //初始的时候获取数据
      SuccessGetCurrData (res) {
        let data = res.data;
        if (!data) return;

        this.isWrite = false;

        if (!data.id) {
          this.isAdd = true;
          delete data.id;
          data.status = 'draft';
        } else {
          this.isAdd = false;
        }
        let step = this.auditStep(data.status);
        let graduationData = this.graduationData;

        //是否可以填写
        if (step < 0 || step == 1 || step == 3 || step == 5) {
          // 专业学位必须所有处理事项都完成了才可以填写
          this.isWrite = data.degree === 'LEARNING' ? graduationData.isClassicalMedicalRecords && graduationData.isCompleteRotationRecord &&
            graduationData.isEvaluate && graduationData.isPassExam : true;
        }

        if (step == -2) {
          this.active = 0;
        } else if (step < 0) {
          this.active = 1;
        } else if (step < 6) {
          this.active = 2;
        } else {
          this.active = 3;
        }
        this.initActive(data.status);
        if (data.graduationSublist == 0 || !data.graduationSublist) {
          this.tableData = [
            {
              'article': '',
              'periodical': '',
              'publication': '',
              'author': '是',
              'signature': '',
              'correspondent': '',
              'included': '是',
              'influence': '',
              'creationdate': ''
            }];
        } else {
          this.tableData = data.graduationSublist;
        }

        if (!data.isThree) {
          data.isThree = 0;
        }
        if (!data.fileList) {
          data.fileList = [];
        } else {
          for (let k = 0; k < data.fileList.length; k++) {
            let item = data.fileList[k];
            item.fileName = item.oldName;
          }
        }
        // 专业性的研究生需要处理研究事项
        data.degree === 'LEARNING' && this.tipMsgCall();
        this.formValidate = data;
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          let messTitle = {
            ajaxSuccess: 'addSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              jsonString: true,
              url: this.isAdd ? api.add.path : api.edit.path + this.formValidate.id,
              method: this.isAdd ? api.add.method : api.edit.method,
              data: {}
            }
          };
          let formValidate = this.formDate(Util._.defaultsDeep({}, this.formValidate), ['leaveDate'], 'yyyy-MM-dd');
          formValidate.graduationSublist = this.formDate(Util._.defaultsDeep([], this.tableData), ['creationdate'], 'yyyy-MM-dd');
          formValidate.status = 'DSB';
          formValidate.isThree = formValidate.isThree + '';
          messTitle.ajaxParams.data = formValidate;
          isLoadingFun(true);
          this.ajax(messTitle, isLoadingFun);
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = true;
        for (let i = 0; i < this.$refs[formName].length; i++) {
          this.$refs[formName][i].validate((valid) => {
            if (!valid) {
              flag = false;
            }
          });
        }
        if (flag && !this.formValidate.fileIds) {
          flag = false;
          this.errorMess('请上传答辩时照片及学位论文复印件或相关证明！');
        }
        return flag;
      },

      reportSubEvent (isLoadingFun) {
        if (!isLoadingFun) isLoadingFun = function () {
        };
        let messTitle = {
          ajaxSuccess: () => {
            this.successMess('上报成功');
            this.init();
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.report.path + this.formValidate.id,
            method: api.report.method,
            data: {
              status: 'DSH'
            }
          }
        };
        isLoadingFun(true);
        this.ajax(messTitle, isLoadingFun);

      },
      //添加成功
      addSuccess () {
        this.successMess('保存成功');
        this.init();
      },

      //添加行
      addRow () {
        this.tableData.push({
          'article': '',
          'periodical': '',
          'publication': '',
          'author': '是',
          'signature': '',
          'correspondent': '',
          'included': '是',
          'influence': '',
          'creationdate': ''
        });
      },

      //移除行
      remove (index) {
        if (this.tableData.length < 2) {
          this.errorMess('不能移除');
          return;
        }
        this.tableData.splice(index, 1);

      },

      //获取到的附件数据
      expenseFileEvent (ids) {
        this.formValidate.fileIds = ids;
      },

      //审核步骤
      auditStep (status) {
        let obj = {
          'draft': '-2',
          'DSB': '-1',
          'DSH': '0',
          'DSBH': '1',
          'DSTG': '2',
          'JYSBH': '3',
          'JYSTG': '4',
          'JYCBH': '5',
          'TG': '6'
        };
        return obj[status];

      },

      /**审核时候*/
      //初始化？Active
      initActive (status) {
        let auditStep = this.auditStep(status);
        if (auditStep < 1) {
          this.activeAudit = 0;
        } else if (auditStep < 4) {
          this.activeAudit = 1;
        } else if (auditStep < 6) {
          this.activeAudit = 2;
        } else {
          this.activeAudit = 3;
        }
      },
      changeActive (active) {
        return;
        let auditStep = this.auditStep(this.formValidate.status);
        if (auditStep < 1) {
          return;
        } else if (auditStep < 4 && active > 1) {
          return;
        }
        this.activeAudit = active;
      }

      /*----*/

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };
</script>
<style lang="scss">
  .pcggawTodoList {
    font-size: 14px;
    p {
      margin-top: 10px;
    }
    span {
      color: red;
      &.success, &.default {
        color: green;
      }
    }
  }

  .pcggawWriteTips {
    text-align: center;
    line-height: 200px;
  }
</style>
