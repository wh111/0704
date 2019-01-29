<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row>
      <el-form class="editForm" label-width="100px">
        <el-col align="center">
          <el-form-item labelWidth="0">考核名称：{{ formValidate.examName }}</el-form-item>
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
          <el-form-item label="考核时间：" style="width: 300px">
            {{ formValidate.examTime }}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <h3 style="margin-bottom: 10px;">评分表</h3>
    <el-table align="center" :max-height="450-(contentDataList.deductList.length ? 100 : 0)" show-summary
              :data="contentDataList.detailsList" tooltip-effect="dark" highlight-current-row :summary-method="getSummaries"
              style="width: 100%;height: 100%" class="add-scope">
      <el-table-column prop="classify" label="项目" width="150">
      </el-table-column>
      <el-table-column prop="content" label="评分标准及要求">
      </el-table-column>
      <el-table-column prop="score" label="标准分" align="center" width="80">
      </el-table-column>
      <el-table-column prop="mark" label="得分" align="center" width="100"></el-table-column>
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
              <span class="el-checkbox__input" :class="{'is-checked': scope.row.mark > 0}">
                <span class="el-checkbox__inner"></span>
              </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['bedsideId'],
    data() {
      return {
        formValidate: {
          bedsideId: "",
          podId: "", // 轮转id
          userId: "", // 考生id
          userName: "", // 考生名称
          depId: "", // 部门id
          depName: "", // 部门名称
          scoreTableId: "", // 评分表id
          examName: "", // 考核名称
          examTime: "", // 考核时间
          mark: "", // 总成绩
          teacherId: "", // 评分教师id
          teacherName: "", // 教师名称
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
        deductSumScore: 0 // 扣分项扣的总分
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getViewData()
      },

      // 获取数据
      getViewData() {
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
        this.ajax(opt)
      },

      // 初始化数据
      initFormVal(data) {
        for (let key in this.formValidate) {
          if (data[key]) {
            this.formValidate[key] = data[key]
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

      //最后一行总计
      getSummaries(param) {
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
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }

</script>
