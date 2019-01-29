<template>
  <div>
    <el-form class="demo-form-inline" label-width="100px">
      <fieldset class="layui-elem-field ">
        <el-row>
          <el-col :span="11" :offset="1" style="border-left: 1px solid #ececec;border-top: 1px solid #ececec;">
            <el-form-item label="申请人:" style="padding:4px 0;margin: 0;">
              {{operailityData.name}}
            </el-form-item>
          </el-col>
          <el-col :span="11" style="border: 1px solid #ececec;border-bottom: none;">
            <el-form-item label="学号:" style="padding:4px 0;margin: 0;">
              {{operailityData.studentId}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--<el-col :span="11" :offset="1" style="border-left: 1px solid #ececec;border-top: 1px solid #ececec;">-->
          <!--<el-form-item label="年级:" style="padding:4px 0;margin: 0;">-->
          <!--{{operailityData.boundary}}-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="22" :offset="1" style="border: 1px solid #ececec;border-bottom: none;">
            <el-form-item label="手机号:" style="padding:4px 0;margin: 0;">
              {{operailityData.phone}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="1" style="border: 1px solid #ececec;border-right: none;">
            <el-form-item label="专业方向:" style="padding:4px 0;margin: 0;">
              {{operailityData.specialtyName}}
            </el-form-item>
          </el-col>
          <el-col :span="11" style="border: 1px solid #ececec;">
            <el-form-item label="专业代码:" style="padding:4px 0;margin: 0;">
              {{operailityData.specialtyCode | dictionary(self,'YJS_BYQX') }}
            </el-form-item>
          </el-col>
        </el-row>
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
              :class="{'success': operailityData.isProcedures == 'YES', 'default': operailityData.isProcedures === null,}">
          {{ isProceduresText(operailityData.isProcedures) }}</span>）
            </p>
          </el-col>
        </el-row>
        <br>

        <el-row>
          <el-col :span="22" :offset="1">
            <el-table
              align="center"
              max-height="400"
              :data="operailityData.graduationSublist"
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
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="periodical"
                class-name="valiTableStyle"
                label="期卷号">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="publication"
                class-name="valiTableStyle"
                label="刊物名称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="author"
                label="是否第一作者"
                class-name="valiTableStyle">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="signature"
                class-name="valiTableStyle"
                label="文章署名单位"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="correspondent"
                class-name="valiTableStyle"
                label="通讯作者">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="included"
                class-name="valiTableStyle"
                label="是否SCI收录">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="influence"
                class-name="valiTableStyle"
                label="影响因子">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <br>
          <el-col :span="8" :offset="2">
            <el-form-item label="离院时间:">
              {{operailityData.leaveDate}}
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="毕业去向:" prop="whereabouts">
              {{operailityData.whereabouts | dictionary(self,'YJS_BYQX')}}
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="是否三甲医院:">
              {{operailityData.isThree?'是':'否'}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="2">
            <el-form-item label="附件:" prop="notice">
              <upload-file :show="true" :uploadFiles="operailityData.fileList"></upload-file>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="状态:">
              {{operailityData.status | typeText}}
            </el-form-item>
          </el-col>
        </el-row>

        <!--审核列表-->

      </fieldset>
    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import api      from '../api';
  import todoTips from '../graduateApplyWriting/graduateApplyWriting_tips';

  let Util = null;
  export default {
    props: ['operailityData', 'view', 'listOperailityData'],
    data () {
      return {
        self: this,
        graduationData: {
          'isCompleteRotationRecord': '', // 轮转记录是否完整
          'isClassicalMedicalRecords': '', // 是否填写至少一份经典病历
          'isEvaluate': '', // 是否对老师，科室评价
          'isPassExam': '' // 考核是否通过
        }
      };
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      this.init();
    },
    mounted () {

    },
    methods: {
      //初始化
      init () {
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
        // tag = this.auditStep(this.operailityData.status) > 0 || tag;
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
            this.tipMsgCall();
          },
          ajaxParams: {
            url: api.getGraduationData.path,
            params: {userId: this.listOperailityData && this.listOperailityData.userId}
          }
        };
        this.ajax(opt);
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
      }
    }

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
