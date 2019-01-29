<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row>
      <el-form class="editForm" :model="formValidate" ref="formValidate" :rules="bedsideExamineInfo"
               label-width="100px">
        <el-col align="center">
          <el-form-item style="width: 400px" label="考核名称：" prop="examName">
            <el-input v-model="formValidate.examName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考生：">
            {{ formValidate.userName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门：">
            {{ formValidate.depName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教师：">
            {{ formValidate.teacherName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总成绩：">
            {{ formValidate.mark }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考核时间：" prop="examTime" style="width: 300px">
            <!--{{ formValidate.examTime || '-' }}-->
            <el-date-picker :editable="false" v-model="formValidate.examTime" type="datetime" placeholder="选择日期"
                            @change="changeExamTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <h3 style="margin-bottom: 10px;">评分表</h3>
    <el-table align="center" :max-height="450-(contentDataList.deductList.length ? 100 : 0)" show-summary
              :data="contentDataList.detailsList" tooltip-effect="dark" highlight-current-row
              :summary-method="getSummaries" style="width: 100%;height: 100%" class="add-scope">
      <el-table-column prop="classify" label="项目" width="150">
      </el-table-column>
      <el-table-column prop="content" label="评分标准及要求">
      </el-table-column>
      <el-table-column prop="score" label="标准分" align="right" width="80">
      </el-table-column>
      <el-table-column prop="mark" label="得分" align="center" width="180">
        <template scope="scope">
          <el-form :model="scope.row" :rules="bedsideExamineScore" :ref="'formValidate'+[scope.$index+'scope']"
                   label-width="80px">
            <el-form-item prop="mark" error="cuo" label-width="0px">
              <el-input @blur="markChange(scope.row)" type="number" min="0" :max="scope.row.score"
                        v-model.number="scope.row.mark"></el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <!--扣分项-->
    <el-table v-if="contentDataList.deductList.length" align="center" max-height="200"
              :data="contentDataList.deductList" tooltip-effect="dark" highlight-current-row
              style="width: 100%;height: 100%" class="add-scope">
      <el-table-column prop="classify" label="项目" width="150">
      </el-table-column>
      <el-table-column prop="content" label="扣分标准及要求">
      </el-table-column>
      <el-table-column prop="score" label="标准分" align="right" width="80">
      </el-table-column>
      <el-table-column prop="mark" label="扣分" align="center" width="100">
        <template scope="scope">
          <el-form :model="scope.row">
            <el-form-item prop="mark" label-width="0px">
              <el-checkbox v-model="scope.row.mark" :true-label="1" :false-label="0" @change="changeDeduct(scope.row)"></el-checkbox>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 16px;">
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
  import { bedsideExamineInfo, bedsideExamineScore } from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    /**
     * operailityData 在人员列表新增时使用（全部信息）
     * bedsideId 修改时使用（主键id）
     * rowData 在历史考核记录列表新增时使用（当前人员的数据）
     */
    props: ['operailityData', 'bedsideId', 'rowData'],
    data () {
      return {
        bedsideExamineInfo,
        bedsideExamineScore,
        formValidate: {
          bedsideId: '',
          podId: '', // 轮转id
          userId: '', // 考生id
          userName: '', // 考生名称
          depId: '', // 部门id
          depName: '', // 部门名称
          scoreTableId: '', // 评分表id
          examName: '', // 考核名称
          examTime: '', // 考核时间
          mark: '', // 总成绩
          teacherId: '', // 评分教师id
          teacherName: '' // 教师名称
//          bedsideMarkDetails: [
//            {
//              "detailsId":"1",
//              "mark":"5.0"
//            }
//          ]
        },
        // 考核内容
        contentDataList: {
          detailsList: [],
          deductList: []
        },
        editType: 'add',
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        deductSumScore: 0 // 扣分项扣的总分
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        if (this.bedsideId) {
          this.editType = 'edit';
          this.getViewData();
        }

        if (this.operailityData) {
          let userInfo = this.$store.getters['getUserInfo'];
          this.initFormVal(this.operailityData);
          this.getScoreTableData();
          this.formValidate.examName = this.operailityData.depName + this.operailityData.scoreTableName;
          this.formValidate.teacherId = userInfo.id;
          this.formValidate.teacherName = userInfo.name;
        }
      },

      // 获取数据
      getViewData () {
        let opt = {
          ajaxSuccess: res => this.initFormVal(res.data),
          ajaxError: () => this.errorMess('获取数据失败，请重试...'),
          ajaxParams: {
            url: api.get.path + this.bedsideId,
            method: api.get.method,
            params: {
              bedsideId: this.bedsideId
            }
          }
        };
        this.ajax(opt);
      },

      // 初始化数据
      initFormVal (data) {
        for (let key in this.formValidate) {
          if (data[key]) {
            this.formValidate[key] = data[key];
          }
        }
        if (data.bedsideMarkDetails) {
          this.contentDataList = this.conductListData(data);
        }
      },

      //处理获取到列表数据，为添加评分服务
      conductListData (data) {
        let listData = {};
        //处理列表外层数据
        let deductListArr = []; // 扣分项
        let detailsListArr = []; // 评分项
        let detailsList = data.bedsideMarkDetails;
        let length = detailsList.length;
        for (let i = 0; i < length; i++) {
          let temp = detailsList[i];
          temp.mark = Number(temp.mark) || 0;
          if (temp.isPoints && temp.mark) { // 累加扣分项
            this.deductSumScore += temp.score;
          }
          Array.push.call(null, temp.isPoints ? deductListArr : detailsListArr, temp);
        }
        listData.detailsList = detailsListArr;
        listData.deductList = deductListArr;
        console.log(detailsListArr);
        return listData;
      },

      // 切换扣分项
      changeDeduct (obj) {
        if (obj.mark) {
          this.deductSumScore += obj.score;
        } else {
          this.deductSumScore -= obj.score;
        }
        console.log(this.deductSumScore);
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        let tipsStr = this.editType === 'add' ? '新建' : '修改';
        if (isSubmit && this.checkScore()) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let data = this.getFormData(this.formValidate);
          data.bedsideMarkDetails = this.getSaveData().detailsList;
          let opt = {
            type: this.editType,
            successTitle: tipsStr + '成功',
            errorTitle: tipsStr + '失败',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              jsonString: true,
              url: api[this.editType].path + (this.editType === 'add' ? '' : this.bedsideId),
              method: api[this.editType].method,
              data
            }
          };
          this.ajax(opt, isLoadingFun);
        }
      },

      getSaveData () {
        let res = this.$util._.defaultsDeep({}, this.contentDataList);
        res.detailsList = res.detailsList.concat(res.deductList);
        delete res.deductList;
        return res;
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        let isBlack = false;
        for (let key in this.$refs) {
          this.$refs[key].validate((valid) => {
            if (valid) {
              flag = true;
            } else {
              isBlack = true;
            }
          });
          if (isBlack) {
            return false;
          }
        }
        return flag;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },

      // 取消
      cancel () {
        this.$emit('cancel', this.editType);
      },

      // 设置考核时间
      changeExamTime (val) {
        this.formValidate.examTime = val;
      },

      // 检测评分表
      checkScore () {
        let data = this.contentDataList.detailsList;
        let hasMark = data.some(item => item.mark === ''); // 其中一个是否评分
        let allHasMark = data.every(item => /^\d+(|\.\d{1,3})$/.test(item.mark)); // 是否全部评分
        if (hasMark || !allHasMark) {
          this.errorMess('分数必须填写并且为整数或者1至3位小数！');
          return false;
        }
        return true;
      },

      // 获取评分项
      getScoreTableData () {
        let opt = {
          ajaxSuccess: res => {
            let scoreData = [];
            if (res.data.detailsList) {
              res.data.detailsList.map(item => {
                item.mark = '';
                item.detailsId = item.id;
                scoreData.push(item);
              });
            }
//            this.formValidate.bedsideMarkDetails = scoreData;
            this.contentDataList = this.conductListData({bedsideMarkDetails: scoreData});
          },
          ajaxError: () => this.errorMess('获取评分表失败'),
          ajaxParams: {
            url: api.getScore.path + this.operailityData.scoreTableId,
            method: api.getScore.method
          }
        };
        this.ajax(opt);
      },

      //最后一行总计
      getSummaries (param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        let poor = 0;
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总分';
            return;
          }
          if (index === 1) {
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = '';
          }
        });
        poor = sums[sums.length - 1] - this.deductSumScore; // 总得分减去扣分项的分
        sums[sums.length - 1] = poor > 0 ? poor : 0; // 小于0就等于0
        this.formValidate.mark = sums[sums.length - 1];
        return sums;
      },

      //
      markChange (row) {
        //mark 得分验证
        row.mark = Number(row.mark);
        if (row.mark > row.score) {
          row.mark = row.score;
        } else if (row.mark < 0 || !row.mark) {
          row.mark = 0;
        }
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
