<template>
  <el-form label-width="180px">
    <h2 align="center">{{ studentSchoolName }}</h2>
    <br>
    <el-row>
      <el-col class="table-back-one">
        <el-form-item label="一、课程设置与考核要求 :" prop="cxbs">
          <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
            <div class="el-table__body-wrapper">
              <table style="width: 100%">
                <thead>
                <tr>
                  <th class="cell" v-for="(item,index) in header" :key="index" style="text-align: center;">
                    {{item.label}}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(data,index) in operailityData.curriculumLists[0]">
                  <td v-if="index==0" :rowspan="operailityData.curriculumLists[0].length" style="text-align: center;">公共基础课A类</td>
                  <template v-for="(item,i) in header">
                    <template v-if="item.key">
                      <td align="center" :key="i" v-if="index==0&&item.key=='sumCredit'" :rowspan="operailityData.curriculumLists[0].length">
                        <b>{{ getSumCredit(0) }}</b>
                      </td>
                      <td align="center" v-if="item.key!=='sumCredit'" :key="i">
                        {{data[item.key]}}
                      </td>
                    </template>
                  </template>
                </tr>

                <tr v-for="(data,index) in operailityData.curriculumLists[1]">
                  <td v-if="index==0" :rowspan="operailityData.curriculumLists[1].length" style="text-align: center;">专业基础课B类</td>
                  <template v-for="(item,i) in header">
                    <template v-if="item.key">
                      <td align="center" :key="i" v-if="index==0&&item.key=='sumCredit'" :rowspan="operailityData.curriculumLists[1].length">
                        <b>{{ getSumCredit(1) }}</b>
                      </td>
                      <td align="center" v-if="item.key!=='sumCredit'" :key="i">
                        {{data[item.key]}}
                      </td>
                    </template>
                  </template>
                </tr>

                <tr v-for="(data,index) in operailityData.curriculumLists[2]">
                  <td v-if="index==0" :rowspan="operailityData.curriculumLists[2].length" style="text-align: center;">专业实践课C类</td>
                  <template v-for="(item,i) in header">
                    <template v-if="item.key">
                      <td align="center" :key="i" v-if="index==0&&item.key=='sumCredit'" :rowspan="operailityData.curriculumLists[2].length">
                        <b>{{ getSumCredit(2) }}</b>
                      </td>
                      <td align="center" v-if="item.key!=='sumCredit'" :key="i">
                        {{data[item.key]}}
                      </td>
                    </template>
                  </template>
                </tr>

                <tr v-for="(data,index) in operailityData.curriculumLists[3]">
                  <td v-if="index==0" :rowspan="operailityData.curriculumLists[3].length" style="text-align: center;">公共选修课程D类（8个专业方向）</td>
                  <template v-for="(item,i) in header">
                    <template v-if="item.key">
                      <td align="center" :key="i" v-if="index==0&&item.key=='sumCredit'" :rowspan="operailityData.curriculumLists[3].length">
                        <b>{{ getSumCredit(3) }}</b>
                      </td>
                      <td align="center" v-if="item.key!=='sumCredit'" :key="i">
                        {{data[item.key]}}
                      </td>
                    </template>
                  </template>
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
            <el-form-item label="起止日期:" prop="clinicalEndDate">
              {{ operailityData.teachingStartDate | formatDate('yyyy-MM-dd') }} 至 {{ operailityData.teachingEndDate | formatDate('yyyy-MM-dd') }}
            </el-form-item>
            <br>
            <el-form-item label="内容:" prop="teachingContent">
              <el-input type="textarea" readonly :autosize="{ minRows: 4, maxRows: 8}" v-model="operailityData.teachingContent"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="方式:" prop="teachingMode">
              <el-input type="textarea" readonly :autosize="{ minRows: 4, maxRows: 8}" v-model="operailityData.teachingMode"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="业务要求:" prop="teachingBusinessRequirements">
              <el-input type="textarea" readonly :autosize="{ minRows: 4, maxRows: 8}" v-model="operailityData.teachingBusinessRequirements"></el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-col>

      <el-col class="table-back-one">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="三、临床实践安排" name="2">
            <el-form-item label="起止日期:" prop="clinicalEndDate">
              {{ operailityData.clinicalStartDate | formatDate('yyyy-MM-dd') }} 至 {{ operailityData.clinicalEndDate | formatDate('yyyy-MM-dd') }}
            </el-form-item>
            <br>
            <el-form-item label="内容:" prop="clinicalContent">
              <el-input type="textarea" readonly :autosize="{ minRows: 4, maxRows: 8}" v-model="operailityData.clinicalContent"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="方式:" prop="clinicalMode">
              <el-input type="textarea" readonly :autosize="{ minRows: 4, maxRows: 8}" v-model="operailityData.clinicalMode"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="业务要求:" prop="clinicalBusinessRequirements">
              <el-input type="textarea" readonly :autosize="{ minRows: 4, maxRows: 8}" v-model="operailityData.clinicalBusinessRequirements"></el-input>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-col>

      <el-col class="table-back-two">
        <el-form-item label="四、科研工作安排:" prop="scientificResearch">
          <el-input type="textarea" readonly :autosize="{ minRows: 4, maxRows: 8}" v-model="operailityData.scientificResearch"></el-input>
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
              <el-table-column show-overflow-tooltip align="center" prop="depName" class-name="valiTableStyle" label="开始日期">
                <template scope="scope">
                  {{ (scope.row.startDate || scope.row.rotaryBeginTime || '') | formatDate('yyyy-MM-dd') }}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop="depName" class-name="valiTableStyle" label="结束日期">
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
          <el-input type="textarea" readonly :autosize="{ minRows: 4, maxRows: 8}" v-model="operailityData.presentation"></el-input>
        </el-form-item>
      </el-col>

      <el-col class="table-back-one">
        <el-form-item :label="(showArrangeRotary ? '七' : '六')+'、学术活动'" prop="activity">
          <el-input type="textarea" readonly :autosize="{ minRows: 4, maxRows: 8}" v-model="operailityData.activity"></el-input>
        </el-form-item>
      </el-col>

      <el-col class="table-back-two">
        <el-collapse v-model="activeNames">
          <el-collapse-item :title="(showArrangeRotary ? '八' : '七')+'、指导小组成员'" name="7">
            <el-table
              align="center"
              :data="operailityData.groupList"
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
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                align="center"
                prop="duties"
                class-name="valiTableStyle"
                label="职务">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                align="center"
                prop="dutiesTitle"
                class-name="valiTableStyle"
                label="职称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                align="center"
                prop="divisionOfLabor"
                class-name="valiTableStyle"
                label="分工">
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-col>

      <el-col class="table-back-one-d">
        <el-form-item :label="(showArrangeRotary ? '九' : '八')+'、备注:'" prop="remarks">
          <el-input type="textarea" readonly :autosize="{ minRows: 4, maxRows: 8}" v-model="operailityData.remarks"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>
<script>
  //当前组件引入全局的util
  import api from '../api';

  let Util = null;
  export default {
    props: ['operailityData', 'view'],
    data () {
      return {
        studentSchoolName: '',
        showArrangeRotary: false,
        arrangeRotaryList: [], // 轮转数据
        tableData: [],
        activeNames: '1',
        activeName1: '1',
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
          }
        ]
      };
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      let showArrangeRotary = this.operailityData.degree === 'LEARNING';
      console.log(showArrangeRotary);
      this.showArrangeRotary = showArrangeRotary;
      this.studentSchoolName = (this.operailityData.school && this.operailityData.school || '') + '研究生培养计划';
      showArrangeRotary && this.getArrangeRotary();
    },
    mounted () {
      //初始化
    },
    methods: {
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
              this.arrangeRotaryList = data;
            }
          },
          ajaxParams: {
            url: api.myRotaryInfo.path,
            method: api.myRotaryInfo.method,
            params: {
              userId: this.operailityData.userId,
              userType: 'YJS',
              curPage: '1',
              pageSize: '100'
            }
          }
        };
        this.ajax(opt);
      },
      // 获取课程的总学分
      getSumCredit (index) {
        let sum = 0;
        this.operailityData.curriculumLists[index].map(item => sum += (!isNaN(item.credit) ? +item.credit : 0));
        return sum;
      }
    },
    watch: {
      operailityData (val) {
        let showArrangeRotary = val.degree === 'LEARNING';
        this.showArrangeRotary = showArrangeRotary;
        this.studentSchoolName = (val.school && val.school || '') + '研究生培养计划';
        showArrangeRotary && this.getArrangeRotary();
      }
    }

  };
</script>

