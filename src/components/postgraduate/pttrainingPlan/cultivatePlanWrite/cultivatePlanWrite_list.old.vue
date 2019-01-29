<!----------------------------------
****--@name     培养计划填写
****--@role     研究生
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" style="position: absolute;top: 10px;left: 10px;right:10px;bottom:10px;overflow: auto">
    <h2 align="center">{{ studentSchoolName }}</h2>
    <br>
    <el-form v-if="isWrite" v-for="item in 1" :key="item" :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="160px">
      <div>
        <el-row class="table-back-one">
          <el-col :span="24">
            <el-form-item label="一、培养目标:" prop="target">
              <el-input type="textarea" v-model="formValidate.target"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-two">
          <el-col :span="24">
            <el-form-item label="二、培养对象:" prop="pyobject">
              <el-input type="textarea" v-model="formValidate.pyobject"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-one">
          <el-col :span="24">
            <el-form-item label="三、学制:" prop="length">
              <el-input type="textarea" v-model="formValidate.length"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-two">
          <el-col :span="24">
            <el-form-item label="四、研究方向:" prop="directionList">
              <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
                <div class="el-table__body-wrapper">
                  <table style="width: 100%">
                    <tbody>
                    <tr v-for="(item,index) in formValidate.directionList">
                      <td class="valiTableStyle">
                        <el-form :model="item" ref="formValidate" :rules="rules" label-width="0">
                          <el-form-item prop="name">
                            <el-input v-model="item.name"></el-input>
                          </el-form-item>
                        </el-form>
                      </td>
                      <td width="100" style="text-align: center">
                        <el-button @click="directionAdd(index)" type="info" size="small" icon="plus"></el-button>
                        <el-button @click="directionRemove(index)" type="danger" size="small" icon="minus"></el-button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-one">
          <el-col :span="24">
            <el-form-item label="五、培养方式:" prop="mode">
              <el-input type="textarea" v-model="formValidate.mode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-back-one" style="padding: 0">
          <el-col :span="24">
            <el-form-item label="六、课程设置与考核要求 :" prop="cxbs">
              <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
                <div class="el-table__body-wrapper">
                  <table style="width: 100%">
                    <thead>
                    <tr>
                      <th class="cell" v-for="(item,index) in header" :width="item.width" style="text-align: center;">
                        {{item.label}}
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(data,index) in formValidate.curriculumLists[0]">
                      <td v-if="index==0" :rowspan="formValidate.curriculumLists[0].length" style="text-align: center;">公共基础课A类</td>
                      <td class="valiTableStyle" v-for="(item,i) in header" v-if="item.key">
                        <el-form :model="data" ref="formValidate" :rules="rules" label-width="0">
                          <el-form-item :prop="item.key">
                            <el-input v-model="data[item.key]"></el-input>
                          </el-form-item>
                        </el-form>
                      </td>
                      <td>
                        <el-button @click="curriculumAdd(0,index)" type="info" size="small" icon="plus"></el-button>
                        <el-button @click="curriculumRemove(0,index)" type="danger" size="small" icon="minus"></el-button>
                      </td>
                    </tr>

                    <tr v-for="(data,index) in formValidate.curriculumLists[1]">
                      <td v-if="index==0" :rowspan="formValidate.curriculumLists[1].length" style="text-align: center;">专业基础课B类</td>
                      <td class="valiTableStyle" v-for="(item,i) in header" v-if="item.key">
                        <el-form :model="data" ref="formValidate" :rules="rules" label-width="0">
                          <el-form-item :prop="item.key">
                            <el-input v-model="data[item.key]"></el-input>
                          </el-form-item>
                        </el-form>
                      </td>
                      <td>
                        <el-button @click="curriculumAdd(1,index)" type="info" size="small" icon="plus"></el-button>
                        <el-button @click="curriculumRemove(1,index)" type="danger" size="small" icon="minus"></el-button>
                      </td>
                    </tr>

                    <tr v-for="(data,index) in formValidate.curriculumLists[2]">
                      <td v-if="index==0" :rowspan="formValidate.curriculumLists[2].length" style="text-align: center;">专业实践课C类</td>
                      <td class="valiTableStyle" v-for="(item,i) in header" v-if="item.key">
                        <el-form :model="data" ref="formValidate" :rules="rules" label-width="0">
                          <el-form-item :prop="item.key">
                            <el-input v-model="data[item.key]"></el-input>
                          </el-form-item>
                        </el-form>
                      </td>
                      <td>
                        <el-button @click="curriculumAdd(2,index)" type="info" size="small" icon="plus"></el-button>
                        <el-button @click="curriculumRemove(2,index)" type="danger" size="small" icon="minus"></el-button>
                      </td>
                    </tr>

                    <tr v-for="(data,index) in formValidate.curriculumLists[3]">
                      <td v-if="index==0" :rowspan="formValidate.curriculumLists[3].length" style="text-align: center;">公共选修课程D类（8个专业方向）</td>
                      <td class="valiTableStyle" v-for="(item,i) in header" v-if="item.key">
                        <el-form :model="data" ref="formValidate" :rules="rules" label-width="0">
                          <el-form-item :prop="item.key">
                            <el-input v-model="data[item.key]"></el-input>
                          </el-form-item>
                        </el-form>
                      </td>
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
            <el-form-item label=" 申请学位要求:" prop="cxbs">
              一般不少于32学分，非专业本科及同等学力入学者为36学分（包括本科课程3-4门约6-8学分）。
              其中，
            </el-form-item>
            <el-form-item label=" 公共课程(A类课):" prop="cxbs">
              全校公共外语、政治理论等公共基础课程，7学分。
            </el-form-item>
            <el-form-item label=" 专业基础课程(B类课):" prop="cxbs">
              以知识基础构建为重点的专业基础课程，6学分。
            </el-form-item>
            <el-form-item label=" 专业选修课程(C类课):" prop="cxbs">
              以实践能力培养为重点的专业实践课程，10学分。
            </el-form-item>
            <el-form-item label="公共选修课(D类课):" prop="cxbs">
              各系（院）开设的公共选修课，10学分，其中跨二级或一级学科选修的硕士课程不少于3-4学分。其中，《护理管理》、《循证护理》和《护理研究》为必选。临床医学开设的C、D类课程（见临床医学硕士研究生培养方案课程设置）均为本专业的公共选修课程。
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="七、护理硕士专业学位研究生实践要求 " name="1">
                <el-form-item label="（一）目的 :" prop="yqobjective">
                  <el-input type="textarea" v-model="formValidate.yqobjective"></el-input>
                </el-form-item>
                <el-form-item label="（二）轮转时间和要求 :" prop="yqrequire">
                  <el-input type="textarea" v-model="formValidate.yqrequire"></el-input>
                </el-form-item>
                <el-form-item label="（三）临床实践考核 :" prop="yqassessment">
                  <el-input type="textarea" v-model="formValidate.yqassessment"></el-input>
                </el-form-item>
                <el-form-item label="（四）教学实践:" prop="yqpractice">
                  <el-input type="textarea" v-model="formValidate.yqpractice"></el-input>
                </el-form-item>
                <el-form-item label="（五）读书报告 :" prop="yqpresentation">
                  <el-input type="textarea" v-model="formValidate.yqpresentation"></el-input>
                </el-form-item>
                <el-form-item label="（六）学术活动 :" prop="yqactivity">
                  <el-input type="textarea" v-model="formValidate.yqactivity"></el-input>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>

        <el-row class="table-back-one">
          <el-col :span="24">
            <el-form-item label="八、学术论文:" prop="dissertation">
              <el-input type="textarea" v-model="formValidate.dissertation"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-two">
          <el-col :span="24">
            <el-collapse v-model="activeName1">
              <el-collapse-item title="九、学位论文" name="1">
                <el-form-item label="1. 开题报告 :" prop="paperTopic">
                  <el-input type="textarea" v-model="formValidate.paperTopic"></el-input>
                </el-form-item>
                <el-form-item label="2. 论文中期汇报:" prop="paperReport">
                  <el-input type="textarea" v-model="formValidate.paperReport"></el-input>
                </el-form-item>
                <el-form-item label="3. 学位论文撰写与答辩" prop="paperDefence">
                  <el-input type="textarea" v-model="formValidate.paperDefence"></el-input>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>

        <el-row class="table-back-one">
          <el-col :span="24">
            <el-form-item label="十、学位授予:" prop="degreeAwarding">
              <el-input type="textarea" v-model="formValidate.degreeAwarding"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-two">
          <el-col :span="24">
            <el-form-item label="十一、就业去向:" prop="whereabouts">
              <el-input type="textarea" v-model="formValidate.whereabouts"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="table-back-one-d">
          <el-col :span="24">
            <el-form-item label="十二、必读书目:" prop="cxbs">
              <el-table
                align="center"
                :data="formValidate.bookList"
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
                  label="书籍名称">
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
                  prop="author"
                  class-name="valiTableStyle"
                  label="作者">
                  <template scope="scope">
                    <el-form :model="scope.row" ref="formValidate" :rules="rules" label-width="0">
                      <el-form-item prop="author">
                        <el-input v-model="scope.row.author"></el-input>
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
                    <el-button @click="bookListAdd(scope.$index)" type="info" size="small" icon="plus"></el-button>
                    <el-button @click="bookListRemove(scope.$index)" type="danger" size="small" icon="minus"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <br>
      <el-row v-if="isWrite">
        <el-col :span="24" style="text-align: center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <load-btn @listenSubEvent="reportSubEvent" :btnData="reportBtn"></load-btn>
        </el-col>
      </el-row>
      <br>
    </el-form>
    <show v-if="step>=0" :unShow="!['0','2','4','6'].includes(step)" :operailityData="formValidate"></show>
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
        activeNames: '1',
        activeName1: '1',
        step: '0',
        studentSchoolName: '',
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        reportBtn: {title: '上报', callParEvent: 'listenSubEvent'},

        formValidate: {
          'pyobject': '',
          'length': '',
          'mode': '',
          'target': '',
          'requires': '',
          'yqobjective': '',
          'yqrequire': '',
          'yqassessment': '',
          'yqpractice': '',
          'yqpresentation': '',
          'yqactivity': '',
          'paperDefence': '',
          'paperReport': '',
          'paperTopic': '',
          'dissertation': '',
          'degreeAwarding': '',
          'whereabouts': '',
          'bookList': [],
          'curriculumList': [],
          //前端保存的课程设置与考核要求 :
          curriculumLists: [[], [], [], []],
          'directionList': []
        },
        header: [
          {
            width: 200,
            label: '课程类型'
          },
          {
            label: '课程名称',
            key: 'name'
          },
          {
            width: 200,
            label: '拟任授课老师',
            key: 'teacher'
          },
          {
            width: 200,
            label: '学分',
            key: 'credit'
          },
          {
            width: 200,
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
          }],

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
        this.studentSchoolName = (userInfo['schoolName'] && userInfo['schoolName'] || '') + '研究生培养计划';
        this.ajax(this.listMessTitle);
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
        if (data.graduationSublist == 0 || !data.graduationSublist) {
          this.tableData = [
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
            }];
        } else {
          this.tableData = data.graduationSublist;
        }

        //课程要求
        if (!data.directionList || data.directionList == 0) {
          data.directionList = [{name: ''}];
        }
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

        //书籍

        if (data.bookList == 0 || !data.bookList) {
          data.bookList = [
            {
              'name': '',
              'author': ''
            }];
        }
        this.formValidate = data;
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun, messTitle, status = '') {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit && (this.ergodic(this.formValidate.directionList)) && (this.ergodic(this.formValidate.curriculumLists[0])) &&
          (this.ergodic(this.formValidate.curriculumLists[1])) && (this.ergodic(this.formValidate.curriculumLists[2])) &&
          (this.ergodic(this.formValidate.curriculumLists[3])) && (this.ergodic(this.formValidate.bookList))) {
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

          delete formValidate.curriculumLists;
          formValidate.status = status;
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
