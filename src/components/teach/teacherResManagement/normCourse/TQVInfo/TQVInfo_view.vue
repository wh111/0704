<template>
  <!-- 教学质量评价表 - 查看 -->
  <div>
    <el-tabs v-model="formValidate.types" @tab-click="initFormValidate">
      <el-tab-pane label="学生" name="STUDENT"></el-tab-pane>
      <el-tab-pane label="同行" name="PEERS"></el-tab-pane>
      <el-tab-pane label="上级" name="SUPERIORS"></el-tab-pane>
    </el-tabs>
    <el-row>
      <el-form>
        <el-col>
          <el-form-item label="总体得分：">{{ formValidate.ztdf || '-' }}分</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="总体印象：">
            <el-radio-group v-model="formValidate.ztyx">
              <el-radio v-for="(item,index) in tqvAllData" :key="index" :label="item.text">{{ item.text }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
      <h3>评分项目</h3>
      <el-table ref="singleTable" :data="formValidate.optionList" style="width: 100%">
        <el-table-column type="index" label="编号" width="70">
        </el-table-column>
        <el-table-column property="title" label="项目" oshow-overflow-tooltip>
        </el-table-column>
        <el-table-column property="remark" label="内容" width="120">
        </el-table-column>
        <el-table-column property="great" label="优">
          <template scope="scope">
            <el-radio-group v-model="formValidate.optionList[scope.$index].point" @change="getAllScore">
              <el-radio :label="scope.row.great">{{ scope.row.great }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column property="good" label="良">
          <template scope="scope">
            <el-radio-group v-model="formValidate.optionList[scope.$index].point" @change="getAllScore">
              <el-radio :label="scope.row.good">{{ scope.row.good }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column property="avg" label="中">
          <template scope="scope">
            <el-radio-group v-model="formValidate.optionList[scope.$index].point" @change="getAllScore">
              <el-radio :label="scope.row.avg">{{ scope.row.avg }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column property="bad" label="差">
          <template scope="scope">
            <el-radio-group v-model="formValidate.optionList[scope.$index].point" @change="getAllScore">
              <el-radio :label="scope.row.bad">{{ scope.row.bad }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      <h3 class="marginTop20">课堂教学评价</h3>
      <el-input type="textarea" :autosize="{ minRows:4, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.fk">
      </el-input>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  export default {
    data() {
      return {
        evaluate: {},
        tqvAllData: [{
          label: '5',
          text: '优秀'
        }, {
          label: '4',
          text: '良好'
        }, {
          label: '3',
          text: '中等'
        }, {
          label: '2',
          text: '差劲'
        }],
        formValidate: { // 提交数据
          ztyx: '', // 总体印象
          ztdf: '', // 总体得分 
          fk: '', // 反馈内容
          types: 'STUDENT', // STUDENT学生、PEERS同行、SUPERIORS上级
          courseId: '', // 授课ＩＤ
          evaluateId: '', // 评价表ID
          optionList: [ // 评价项
            // {
            //   evaluateOptionsId: '', // 评价项ID
            //   point: '', // 得分
            // }
          ]
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          ajaxSuccess: 'saveSuccess',
          ajaxParams: {
            url: api.submit.path,
            method: api.submit.method
          }
        },
      }
    },
    methods: {
      // 初始化
      init() {
        this.evaluate = this.$store.state.curriculum.look.evaluate;
        this.initFormValidate()
      },
      // 表单数据初始化
      initFormValidate() {
        let tableData = this.evaluate[this.formValidate.types.toLocaleLowerCase() + 'Evaluate']; // 获取对应角色的评价表数据
        this.formValidate.optionList.length = 0;
        if (!tableData.length) {
          return
        }
        tableData.map(item => {
          let temp = this.$util._.defaultsDeep({}, item);
          temp.point = '';
          temp.evaluateOptionsId = temp.id;
          this.formValidate.optionList.push(temp)
        })
      },
      // 获取总体得分
      getAllScore() {
        let score = 0;
        this.formValidate.optionList.map(item => score += (+item.point));
        this.formValidate.ztdf = score;
      },
    },
    created() {
      this.init()
    },
  }

</script>

<style>
  /* 教学质量评价表 - 查看 */

  .marginTop20 {
    margin-top: 20px;
  }

</style>
