<!----------------------------------
****--@name     培养计划填写
****--@role     研究生
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" style="position: absolute;top: 10px;left: 10px;right:10px;bottom:10px;overflow: auto">
    <el-form v-if="isWrite" :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="180px">
      <h2 align="center">{{ studentSchoolName }}</h2>
      <br>
      <el-row>
        <el-col class="table-back-one">
          <el-form-item label="一、课程设置与考核要求:" prop="cxbs">
            <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
              <div class="el-table__body-wrapper">
                <table style="width: 100%">
                  <thead>
                  <tr>
                    <th class="cell" v-for="(item,index) in header" :index="index" :width="item.width" style="text-align: center;">
                      {{item.label}}
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(data,index) in formValidate.curriculumLists[0]">
                    <td v-if="index==0" :rowspan="formValidate.curriculumLists[0].length" style="text-align: center;">公共基础课A类</td>
                    <template v-for="(item,i) in header">
                      <template v-if="item.key">
                        <td class="valiTableStyle" :key="i" v-if="index==0&&item.key=='sumCredit'" :rowspan="formValidate.curriculumLists[0].length">
                          <span class="cell"><b>{{ getSumCredit(0) }}</b></span>
                        </td>
                        <td class="valiTableStyle" :key="i" v-if="item.key!=='sumCredit'">
                          <el-form :model="data" ref="formValidate" :rules="rules" label-width="0">
                            <el-form-item :prop="item.key">
                              <el-input v-model="data[item.key]"></el-input>
                            </el-form-item>
                          </el-form>
                        </td>
                      </template>
                    </template>
                    <td>
                      <el-button @click="curriculumAdd(0,index)" type="info" size="small" icon="plus"></el-button>
                      <el-button @click="curriculumRemove(0,index)" type="danger" size="small" icon="minus"></el-button>
                    </td>
                  </tr>

                  <tr v-for="(data,index) in formValidate.curriculumLists[1]">
                    <td v-if="index==0" :rowspan="formValidate.curriculumLists[1].length" style="text-align: center;">专业基础课B类</td>
                    <template v-for="(item,i) in header">
                      <template v-if="item.key">
                        <td class="valiTableStyle" :key="i" v-if="index==0&&item.key=='sumCredit'" :rowspan="formValidate.curriculumLists[1].length">
                          <span class="cell"><b>{{ getSumCredit(1) }}</b></span>
                        </td>
                        <td class="valiTableStyle" v-if="item.key!=='sumCredit'" :key="i">
                          <el-form :model="data" ref="formValidate" :rules="rules" label-width="0">
                            <el-form-item :prop="item.key">
                              <el-input v-model="data[item.key]"></el-input>
                            </el-form-item>
                          </el-form>
                        </td>
                      </template>
                    </template>
                    <td>
                      <el-button @click="curriculumAdd(1,index)" type="info" size="small" icon="plus"></el-button>
                      <el-button @click="curriculumRemove(1,index)" type="danger" size="small" icon="minus"></el-button>
                    </td>
                  </tr>

                  <tr v-for="(data,index) in formValidate.curriculumLists[2]">
                    <td v-if="index==0" :rowspan="formValidate.curriculumLists[2].length" style="text-align: center;">专业实践课C类</td>
                    <template v-for="(item,i) in header">
                      <template v-if="item.key">
                        <td class="valiTableStyle" :key="i" v-if="index==0&&item.key=='sumCredit'" :rowspan="formValidate.curriculumLists[2].length">
                          <span class="cell"><b>{{ getSumCredit(2) }}</b></span>
                        </td>
                        <td class="valiTableStyle" v-if="item.key!=='sumCredit'" :key="i">
                          <el-form :model="data" ref="formValidate" :rules="rules" label-width="0">
                            <el-form-item :prop="item.key">
                              <el-input v-model="data[item.key]"></el-input>
                            </el-form-item>
                          </el-form>
                        </td>
                      </template>
                    </template>
                    <td>
                      <el-button @click="curriculumAdd(2,index)" type="info" size="small" icon="plus"></el-button>
                      <el-button @click="curriculumRemove(2,index)" type="danger" size="small" icon="minus"></el-button>
                    </td>
                  </tr>

                  <tr v-for="(data,index) in formValidate.curriculumLists[3]">
                    <td v-if="index==0" :rowspan="formValidate.curriculumLists[3].length" style="text-align: center;">公共选修课程D类（8个专业方向）</td>
                    <template v-for="(item,i) in header">
                      <template v-if="item.key">
                        <td class="valiTableStyle" :key="i" v-if="index==0&&item.key=='sumCredit'" :rowspan="formValidate.curriculumLists[3].length">
                          <span class="cell"><b>{{ getSumCredit(3) }}</b></span>
                        </td>
                        <td class="valiTableStyle" v-if="item.key!=='sumCredit'" :key="i">
                          <el-form :model="data" ref="formValidate" :rules="rules" label-width="0">
                            <el-form-item :prop="item.key">
                              <el-input v-model="data[item.key]"></el-input>
                            </el-form-item>
                          </el-form>
                        </td>
                      </template>
                    </template>
                    <td>
                      <el-button @click="curriculumAdd(3,index)" type="info" size="small" icon="plus"></el-button>
                      <el-button @click="curriculumRemove(3,index)" type="danger" size="small" icon="minus"></el-button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-form-item>
          <el-form-item label=" 申请学位要求:">
            一般不少于32学分，非专业本科及同等学力入学者为36学分（包括本科课程3-4门约6-8学分）。
            其中，
          </el-form-item>
          <el-form-item label=" 公共课程(A类课):">
            全校公共外语、政治理论等公共基础课程，7学分。
          </el-form-item>
          <el-form-item label=" 专业基础课程(B类课):">
            以知识基础构建为重点的专业基础课程，6学分。
          </el-form-item>
          <el-form-item label=" 专业选修课程(C类课):">
            以实践能力培养为重点的专业实践课程，10学分。
          </el-form-item>
          <el-form-item label="公共选修课(D类课):">
            各系（院）开设的公共选修课，10学分，其中跨二级或一级学科选修的硕士课程不少于3-4学分。其中，《护理管理》、《循证护理》和《护理研究》为必选。临床医学开设的C、D类课程（见临床医学硕士研究生培养方案课程设置）均为本专业的公共选修课程。
          </el-form-item>
        </el-col>

        <el-col class="table-back-two">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="二、教学实践安排" name="1">
              <date-group class="el-form--inline" style="padding-left: 80px;"
                          :dateGroup="{text:'',startDate:formValidate.teachingStartDate,endDate:formValidate.teachingEndDate}">
                <el-form-item label="起止日期:" label-width="80px" prop="teachingStartDate">
                  <el-date-picker style="margin-left: -80px;" name="start" v-model="formValidate.teachingStartDate" :editable="false" type="date"
                                  placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <span></span>
                <el-form-item label="-" label-width="10px" prop="teachingEndDate">
                  <el-date-picker name="end" v-model="formValidate.teachingEndDate" :editable="false" type="date"
                                  placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </date-group>
              <br>
              <el-form-item label="内容:" prop="teachingContent">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.teachingContent"></el-input>
              </el-form-item>
              <br>
              <el-form-item label="方式:" prop="teachingMode">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.teachingMode"></el-input>
              </el-form-item>
              <br>
              <el-form-item label="业务要求:" prop="teachingBusinessRequirements">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.teachingBusinessRequirements"></el-input>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-col>

        <el-col class="table-back-one">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="三、临床实践安排" name="2">
              <date-group class="el-form--inline" style="padding-left: 80px;"
                          :dateGroup="{text:'',startDate:formValidate.clinicalStartDate,endDate:formValidate.clinicalEndDate}">
                <el-form-item label="起止日期:" label-width="80px" prop="clinicalStartDate">
                  <el-date-picker style="margin-left: -80px;" name="start" v-model="formValidate.clinicalStartDate" :editable="false" type="date"
                                  placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <span></span>
                <el-form-item label="-" label-width="10px" prop="clinicalEndDate">
                  <el-date-picker name="end" v-model="formValidate.clinicalEndDate" :editable="false" type="date"
                                  placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </date-group>
              <br>
              <el-form-item label="内容:" prop="clinicalContent">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.clinicalContent"></el-input>
              </el-form-item>
              <br>
              <el-form-item label="方式:" prop="clinicalMode">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.clinicalMode"></el-input>
              </el-form-item>
              <br>
              <el-form-item label="业务要求:" prop="clinicalBusinessRequirements">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.clinicalBusinessRequirements"></el-input>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-col>

        <el-col class="table-back-two">
          <el-form-item label="四、科研工作安排:" prop="scientificResearch">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.scientificResearch"></el-input>
          </el-form-item>
        </el-col>

        <el-col class="table-back-one">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="五、轮转安排" name="4" v-if="showArrangeRotary">
              <el-table align="center" :data="arrangeRotaryList" tooltip-effect="dark" highlight-current-row
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
            </el-collapse-item>
          </el-collapse>
        </el-col>

        <el-col class="table-back-two">
          <el-form-item :label="(showArrangeRotary ? '六' : '五')+'、读书报告:'" prop="presentation">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.presentation"></el-input>
          </el-form-item>
        </el-col>

        <el-col class="table-back-one">
          <el-form-item :label="(showArrangeRotary ? '七' : '六')+'、学术活动'" prop="activity">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.activity"></el-input>
          </el-form-item>
        </el-col>

        <el-col class="table-back-two">
          <el-collapse v-model="activeNames">
            <el-collapse-item :title="(showArrangeRotary ? '八' : '七')+'、指导小组成员'" name="7">
              <el-table
                align="center"
                :data="formValidate.groupList"
                tooltip-effect="dark"
                highlight-current-row
                style="width: 100%;height: 100%">
                <el-table-column
                  align="center"
                  label="序号"
                  type="index"
                  width="100">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  prop="name"
                  class-name="valiTableStyle"
                  label="姓名">
                  <template scope="scope">
                    <el-form :model="scope.row" ref="formValidate" :rules="rules" label-width="0">
                      <el-form-item prop="name">
                        <el-input v-model="scope.row.name"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  prop="duties"
                  class-name="valiTableStyle"
                  label="职务">
                  <template scope="scope">
                    <el-form :model="scope.row" ref="formValidate" :rules="rules" label-width="0">
                      <el-form-item prop="duties">
                        <el-input v-model="scope.row.duties"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  prop="dutiesTitle"
                  class-name="valiTableStyle"
                  label="职称">
                  <template scope="scope">
                    <el-form :model="scope.row" ref="formValidate" :rules="rules" label-width="0">
                      <el-form-item prop="dutiesTitle">
                        <el-input v-model="scope.row.dutiesTitle"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  prop="divisionOfLabor"
                  class-name="valiTableStyle"
                  label="分工">
                  <template scope="scope">
                    <el-form :model="scope.row" ref="formValidate" :rules="rules" label-width="0">
                      <el-form-item prop="divisionOfLabor">
                        <el-input v-model="scope.row.divisionOfLabor"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  prop="name"
                  label="操作"
                  width="150">
                  <template scope="scope">
                    <el-button @click="groupListAdd(scope.$index)" type="info" size="small" icon="plus"></el-button>
                    <el-button @click="groupListRemove(scope.$index)" type="danger" size="small" icon="minus"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-col>

        <el-col class="table-back-one-d">
          <el-form-item :label="(showArrangeRotary ? '九' : '八')+'、备注:'" prop="remarks">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.remarks"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <br>
      <el-row v-if="isWrite">
        <el-col style="text-align: center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <load-btn @listenSubEvent="reportSubEvent" :btnData="reportBtn"></load-btn>
        </el-col>
      </el-row>
      <br>
    </el-form>
    <show v-if="step>=0" :showArrangeRotary="showArrangeRotary" :unShow="!['0','2','4','6'].includes(step)" :operailityData="formValidate"></show>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api                             from '../api';
  import show                            from '../components/makeOpenReply_view.vue';
  import { graduateApplyAudit as rules } from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        rules,
        active: 0,
        activeAudit: 0,
        type: 'DSH',
        activeNames: '',
        activeName1: '1',
        step: '0',
        userInfo: null,
        studentSchoolName: '',
        teacherAndMajor: null, // 当前学生的专业和导师
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        reportBtn: {title: '上报', callParEvent: 'listenSubEvent'},

        formValidate: {
          'id': '', // "培养计划id",
          'userId': '', // "用户id",
          'name': '', // "1",
          'teacher': '', // "张三",
          'major': '', // "内科",
          'school': '', // "北京医学院",
          'teachingStartDate': '', // "教学实践安排>开始日期",
          'teachingEndDate': '', // "教学实践安排>结束日期",
          'teachingContent': '', // "教学实践安排>教学内容",
          'teachingMode': '', // "教学实践安排>教学方式",
          'teachingBusinessRequirements': '', // "教学实践安排>业务要求",
          'clinicalStartDate': '', // "临床实践安排>开始日期",
          'clinicalEndDate': '', // "临床实践安排>结束日期",
          'clinicalContent': '', // "临床实践安排>教学内容",
          'clinicalMode': '', // "临床实践安排>教学方式",
          'clinicalBusinessRequirements': '', // "临床实践安排>业务要求",
          'scientificResearch': '', // "科研工作安排",
          'presentation': '', // "读书报告",
          'activity': '', // "学术活动",
          'remarks': '', // "备注",
          'status': '', // "'AUDIT'（待审核）'JYCADOPT'(教育处通过),'JYCTPASS'（教育处未通过）,'KSZRADOPT'（科室主任通过）,'KSZRTPASS'（科室主任未通过）,'DSADOPT'（导师通过）,'DSTPASS'（导师未通过）",
          'curriculumList': [],
          //前端保存的课程设置与考核要求 :
          curriculumLists: [[], [], [], []],
          'groupList': [
            {
              'id': '', // "组id",
              'plan_id': '', // "课程id",
              'name': '1', // "姓名",
              'duties': '', // "职务",
              'dutiesTitle': '', // "职称",
              'divisionOfLabor': '' // "分工"
            }
          ]
        },
        showArrangeRotary: false, // 只有专业学位的学生自动将轮转信息
        arrangeRotaryList: [], // 轮转数据
        header: [
          {
            width: 200,
            label: '课程类型'
          },
          {
            width: 200,
            label: '课程名称',
            key: 'name'
          },
          {
            width: 200,
            label: '拟任授课老师',
            key: 'teacher'
          },
          {
            width: 100,
            label: '学分',
            key: 'credit'
          },
          {
            width: 100,
            label: '总学分',
            key: 'sumCredit'
          },
          {
            width: 100,
            label: '学时',
            key: 'hour'
          },
          {
            width: 100,
            label: '操作'
          }
        ],

        tableData: [
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
        ],

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: api.getMyplan.path
          }
        },
        isWrite: false
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        let userInfo = this.$store.getters['getUserInfo'];
        Util = this.$util;
        this.userInfo = userInfo;
        this.studentSchoolName = (userInfo['schoolName'] && userInfo['schoolName'] || '') + '研究生培养计划';
        this.getTeacherAndMajor();
      },

      // 获取课程的总学分
      getSumCredit (index) {
        let sum = 0;
        this.formValidate.curriculumLists[index].map(item => sum += (!isNaN(item.credit) ? +item.credit : 0));
        return sum;
      },

      // 获取当前学生的导师和专业
      getTeacherAndMajor () {
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            if (data instanceof Object) {
              this.teacherAndMajor = data;
              this.showArrangeRotary = data.degree === 'LEARNING';
              this.ajax(this.listMessTitle);
            } else {
              this.errorMess('获取导师和专业信息失败，请重试！');
            }
          },
          ajaxParams: {
            url: api.getTeacherAndMajor.path,
            method: api.getTeacherAndMajor.method,
            params: {
              userId: this.userInfo.id
            }
          }
        };
        this.ajax(opt);
      },

      // 获取轮转信息
      getArrangeRotary () {
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            if (res.totalCount && data instanceof Array) {
              data.map(item => {
                item.startDate = item.rotaryBeginTime || item.startDate;
                item.endTime = item.rotaryEndTime || item.endTime;
              });
              console.log(data);
              this.arrangeRotaryList = data;
            }
          },
          ajaxParams: {
            url: api.myRotaryInfo.path,
            method: api.myRotaryInfo.method,
            params: {
              userId: this.userInfo.id,
              userType: 'YJS',
              curPage: '1',
              pageSize: '100'
            }
          }
        };
        this.ajax(opt);
      },

      //初始的时候获取数据
      SuccessGetCurrData (res) {
        console.log(res)
        let data = res.data;
        if (!data) return;

        this.isWrite = false;

        if (!data.id) {
          let {id: userId, name, schoolName: school} = this.userInfo;
          let {teacherName: teacher, major} = this.teacherAndMajor;
          this.isAdd = true;
          delete data.id;
          data.userId = userId;
          data.name = name;
          data.school = school;
          data.teacher = teacher;
          data.major = major;
          data.status = 'draft';
          // 获取轮转信息
          this.showArrangeRotary && this.getArrangeRotary();
        } else {
          this.isAdd = false;
          (data.arrangeRotaryList || []).map(item => {
            item.startDate = item.rotaryBeginTime || item.startDate;
            item.endTime = item.rotaryEndTime || item.endTime;
          });
          this.arrangeRotaryList = data.arrangeRotaryList;
          delete data.arrangeRotaryList;
        }
        if (!data.status) {
          data.status = 'draft';
        }
        let step = this.step = this.auditStep(data.status);
        //是否可以填写
        console.log(step);
        if (step < 0 || ['1', '3', '5'].includes(step)) {
          this.isWrite = true;
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
//        if (data.graduationSublist == 0 || !data.graduationSublist) {
//          this.tableData = [
//            {
//              'article': '',
//              'periodical': '',
//              'publication': '',
//              'author': '',
//              'signature': '',
//              'correspondent': '',
//              'included': '',
//              'influence': '',
//              'creationdate': ''
//            }];
//        } else {
//          this.tableData = data.graduationSublist;
//        }

        //课程要求
//        if (!data.directionList || data.directionList == 0) {
//          data.directionList = [{name: ''}];
//        }
        //公共基础课A类
        let A = [{'type': 'A', 'name': '', 'teacher': '', 'credit': '', 'hour': ''}];
        //专业基础课B类
        let B = [{'type': 'B', 'name': '', 'teacher': '', 'credit': '', 'hour': ''}];
        //专业实践课C类
        let C = [{'type': 'C', 'name': '', 'teacher': '', 'credit': '', 'hour': ''}];
        //公共选修课程D类(8个专业方向)
        let D = [{'type': 'D', 'name': '', 'teacher': '', 'credit': '', 'hour': ''}];
        if (!data.curriculumList || data.curriculumList == 0) {
          data.curriculumList = [];
          data.curriculumLists = [A, B, C, D];
        } else {
          let obj = {
            A: [],
            B: [],
            C: [],
            D: []
          };
          for (let i = 0; i < data.curriculumList.length; i++) {
            let item = data.curriculumList[i];
            obj[item.type].push(item);
          }
          if (obj.A != 0) {
            A = obj.A;
          }
          if (obj.B != 0) {
            B = obj.B;
          }
          if (obj.C != 0) {
            C = obj.C;
          }
          if (obj.D != 0) {
            D = obj.D;
          }
          data.curriculumLists = [A, B, C, D];
        }
        // 指导小组成员
        if (!data.groupList) {
          data.groupList = [this.getGroupItemObj()];
        }
        //书籍
//        if (data.bookList == 0 || !data.bookList) {
//          data.bookList = [
//            {
//              'name': '',
//              'author': ''
//            }];
//        }
        this.formValidate = data;
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun, messTitle, status = '') {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit && (this.ergodic(this.formValidate.curriculumLists[0])) &&
          (this.ergodic(this.formValidate.curriculumLists[1])) && (this.ergodic(this.formValidate.curriculumLists[2])) &&
          (this.ergodic(this.formValidate.curriculumLists[3]))) {
          if (!isLoadingFun) isLoadingFun = function () {};
          if (!messTitle) {
            messTitle = {
              ajaxSuccess: 'addSuccess',
              ajaxError: 'ajaxError',
              ajaxParams: {
                jsonString: true,
                url: this.isAdd ? api.addPlan.path : api.modifyPlan.path,
                method: this.isAdd ? api.addPlan.method : api.modifyPlan.method,
                data: {}
              }
            };
          }

          let formValidate = Util._.defaultsDeep({}, this.formValidate);

          formValidate.curriculumList = [];
          for (let i = 0; i < formValidate.curriculumLists.length; i++) {
            for (let k = 0; k < formValidate.curriculumLists[i].length; k++) {
              formValidate.curriculumList.push(formValidate.curriculumLists[i][k]);
            }
          }

          ['teachingStartDate', 'teachingEndDate', 'clinicalStartDate', 'clinicalEndDate'].map(
            key => formValidate[key] = this.conductDate(formValidate[key], 'yyyy-MM-dd'));

          delete formValidate.curriculumLists;
          formValidate.status = status;
//          console.log(formValidate);
//          return '';
          messTitle.ajaxParams.data = formValidate;
          isLoadingFun(true);
          this.ajax(messTitle, isLoadingFun);
        }
      },
      //遍历对象
      ergodic (arr) {
        let flag = true;
        for (let i = 0; i < arr.length; i++) {
          Object.keys(arr[i]).forEach((key) => {
            if (arr[i][key] == '') {
              this.errorMess('请将信息填写完整');
              flag = false;
              return flag;
            }
          });
        }
        return flag;
      },
      // 获取指导小组成员初始化数据
      getGroupItemObj () {
        return {
//          'id': '', // "组id",
//          'plan_id': '', // "课程id",
          'name': '', // "姓名",
          'duties': '', // "职务",
          'dutiesTitle': '', // "职称",
          'divisionOfLabor': '' // "分工"
        };
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
        return flag;
      },

      reportSubEvent (isLoadingFun) {
        if (!isLoadingFun) isLoadingFun = function () {};
        let messTitle = {
          ajaxSuccess: () => {
            this.successMess('上报成功');
            this.init();
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modifyStatus.path,
            method: api.modifyStatus.method,
            jsonString: true,
            data: {
              status: 'AUDIT'
            }
          }
        };

        this.listenSubEvent(isLoadingFun, messTitle, 'AUDIT');
//        this.ajax(messTitle,isLoadingFun);

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
          'author': '',
          'signature': '',
          'correspondent': '',
          'included': '',
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

      // 添加小组成员
      groupListAdd () {
        this.formValidate.groupList.push(this.getGroupItemObj());
      },

      // 删除小组成员
      groupListRemove (index) {
        this.formValidate.groupList.splice(index, 1);
      },

      //获取到的附件数据
      expenseFileEvent (ids) {
        this.formValidate.fileIds = ids;
      },

      //审核步骤
      auditStep (status) {
        let obj = {
          'draft': '-2',
          'WSB': '-1',
          'AUDIT': '0',
          'DSTPASS': '1',
          'DSADOPT': '2',
          'KSZRTPASS': '3',
          'KSZRADOPT': '4',
          'JYCTPASS': '5',
          'JYCADOPT': '6',
          'MODIFY_END': '-1',
          'AGAIN_END': '-1'
        };
        return obj[status];
      },

      //添加研究方向
      directionAdd () {
        this.formValidate.directionList.push({
          'name': ''
        });
      },

      //添加研究方向
      directionRemove (index) {
        if (this.formValidate.directionList.length < 2) {
          this.errorMess('不能移除');
          return;
        }
        this.formValidate.directionList.splice(index, 1);
      },

      /**
       * 课程设置与考核要求  添加
       * params {Number} index 在curriculumLists数组的索引
       * params {Number} count  在curriculumLists[index]数组的索引
       * @return {null}
       * */
      curriculumAdd (index, count) {
        let tempObj = {
          0: 'A',
          1: 'B',
          2: 'C',
          3: 'D'
        };
        this.formValidate.curriculumLists[index].push({
          'type': tempObj[index], 'name': '', 'teacher': '', 'credit': '', 'hour': ''
        });

      },

      /**
       * 课程设置与考核要求  移除
       * params {Number} count  在curriculumLists[index]数组的索引
       * params {Number} index 在curriculumLists数组的索引
       * */
      curriculumRemove (index, count) {
        console.log(this.formValidate.curriculumLists[index]);
        if (this.formValidate.curriculumLists[index].length < 2) {
          this.errorMess('不能移除');
          return;
        }
        this.formValidate.curriculumLists[index].splice(count, 1);
      },

      /**
       * 书籍添加
       * params {Number} index 当前数据在数组中的索引
       * @return {null}
       * */
      bookListAdd (index) {
        this.formValidate.bookList.push({
          'name': '',
          'author': ''
        });
      },

      /**
       * 书籍移除
       * params {Number} index 当前数据在数组中的索引
       * */
      bookListRemove (index) {
        if (this.formValidate.bookList[index].length < 2) {
          this.errorMess('不能移除');
          return;
        }
        this.formValidate.bookList.splice(index, 1);
      },

      /**审核时候
       * 初始化审核步骤
       * @param {string} status 审核状态
       * */
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
    components: {
      show
    }
  };
</script>
