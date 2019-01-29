<template>
  <!-- 教学质量评价表 - 填写 -->
  <div>

    <el-row>
      <el-form>
        <el-col>
          <el-form-item label="总体得分：">{{ formValidate.ztdf || '-' }}分</el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="总体印象：">
            <el-radio-group v-model="formValidate.ztyx">
              <el-radio v-for="(item,index) in tqvAllData" :key="index" :label="item.text" :disabled="formValidate.evaluateId === -1">{{ item.text }}</el-radio>
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
            <el-radio-group v-model="scope.row.point" @change="getAllScore">
              <el-radio :label="scope.row.great" :disabled="formValidate.evaluateId === -1">{{ scope.row.great }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column property="good" label="良">
          <template scope="scope">
            <el-radio-group v-model="scope.row.point" @change="getAllScore">
              <el-radio :label="scope.row.good" :disabled="formValidate.evaluateId === -1">{{ scope.row.good }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column property="avg" label="中">
          <template scope="scope">
            <el-radio-group v-model="scope.row.point" @change="getAllScore">
              <el-radio :label="scope.row.avg" :disabled="formValidate.evaluateId === -1">{{ scope.row.avg }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column property="bad" label="差">
          <template scope="scope">
            <el-radio-group v-model="scope.row.point" @change="getAllScore">
              <el-radio :label="scope.row.bad" :disabled="formValidate.evaluateId === -1">{{ scope.row.bad }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      <h3 class="marginTop20">课堂教学评价</h3>
      <el-input type="textarea" :autosize="{ minRows:4, maxRows: 6}" :readonly="formValidate.evaluateId === -1" placeholder="请输入内容" v-model="formValidate.fk">
      </el-input>
      <el-col align="center" class="marginTop20">
        <!-- 没有评价表则不能进行提交 -->
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn" v-show="formValidate.evaluateId !== -1"></load-btn>
      </el-col>
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
            jsonString: true,
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
        this.getOldData()
      },
      // 获取原来评价的数据
      getOldData() {
        let opt = {
          ajaxSuccess: res => this.initFormValidate(res.data),
          ajaxParams: {
            url: api.info.path,
            method: api.info.method,
            params: {
              courseId: this.$store.state.curriculum.look.course.id
            }
          }
        };
        this.ajax(opt)
      },
      // 表单数据初始化
      initFormValidate(data) {
        if (data.ztyx) {
          this.formValidate = data;
          this.formValidate.evaluateId = -1; // 标记使用
        } else {
          let tableData = this.evaluate[this.formValidate.types.toLocaleLowerCase() + 'Evaluate']; // 获取对应角色的评价表数据
          if (tableData.length) {
            this.formValidate.courseId = tableData[0].courseId;
            this.formValidate.evaluateId = tableData[0].evaluateId;
          } else {
            this.formValidate.evaluateId = -1; // 标记使用
          }
          tableData.map(item => {
            let temp = this.$util._.defaultsDeep({}, item);
            temp.point = '';
            temp.evaluateOptionsId = temp.id;
            this.formValidate.optionList.push(temp)
          })
        }
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        if (this.checkData()) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },
      // 检查数据是否合法
      checkData() {
        let data = this.formValidate;
        if (!data.ztyx) {
          this.errorMess('请选择总体印象');
          return false;
        }
        for(let i=0;i<data.optionList.length;i++){
          if (!data.optionList[i].point) {
            this.errorMess('请填写完整评分项目');
            return false;
          }
        }
//        for (let i in data.optionList) {
//          if (!data.optionList[i].point) {
//            this.errorMess('请填写完整评分项目')
//            return false
//          }
//        }
        return true
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },
      // 获取总体得分
      getAllScore() {
        let score = 0;
        this.formValidate.optionList.map(item => score += (+item.point));
        this.formValidate.ztdf = score;
      },
      // 保存成功
      saveSuccess(res) {
        this.successMess('提交成功');
        this.getOldData()
      },
    },
    created() {
      this.init()
    },
  }

</script>

<style>
  /* 教学质量评价表 - 填写 */

  .marginTop20 {
    margin-top: 20px;
  }

</style>
