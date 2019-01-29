<template>
  <div>
    <el-row>
      <el-form :model="formValidate" ref="formValidate" :rules="rules" :inline="true">
        <!-- 指标名称 -->
        <el-col align="center">
          <el-form-item label="评分指标名称：" prop="scoreTableName">
            <el-input v-model.trim="formValidate.scoreTableName"></el-input>
          </el-form-item>
          <el-form-item label="评分指标类型：" prop="scoreType">
            <el-select v-model="formValidate.scoreType" placeholder="请选择活动区域" @change="selectChange">
              <el-option label="星级" value="STAR"></el-option>
              <el-option label="分级" value="GRADE"></el-option>
              <el-option label="分值" value="SCORE"></el-option>
              <el-option label="多选项" value="M_OPTIONS"></el-option>
            </el-select>
            <!--<el-input v-model.trim="formValidate.scoreType"></el-input>-->
          </el-form-item>
          <!--<el-form-item v-if="formValidate.scoreType == 'GRADE'" label="评分指标等级描述：" prop="scoreTableName">-->
          <!--<el-input v-model="classifyDescribe" placeholder="请使用，分割每一项"></el-input>-->
          <!--</el-form-item>-->
        </el-col>
        <el-table align="center" border :context="self" :data="formValidate.detailsList" tooltip-effect="dark"
                  show-summary :summary-method="getSummaries"
                  class="asmContable" style="width: 100%">
          <el-table-column label="项目" width="200px" prop="classify" show-overflow-tooltip>
            <template scope="scope">
              <el-input v-model="scope.row.classify" placeholder="请填写项目名"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="评分标准及要求" width="200px" prop="content" show-overflow-tooltip>
            <template scope="scope">
              <el-input type="textarea" :autosize="{maxRows:5}" :maxlength="500" v-model="scope.row.content"
                        placeholder="最多只能输入500字"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="描述" width="234px" prop="remark" show-overflow-tooltip>
            <template scope="scope">
              <el-input type="textarea" :autosize="{maxRows:5}" :maxlength="500" v-model="scope.row.remark"
                        placeholder="最多只能输入500字"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="标准分" width="90px" prop="score" show-overflow-tooltip>
            <template scope="scope">
              <el-input v-model.number="scope.row.score" :maxlength="4"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="formValidate.scoreType == 'GRADE'" label="评分指标等级描述" width="180px"
                           prop="classifyDescribe" show-overflow-tooltip>
            <template scope="scope">
              <el-input v-model="scope.row.classifyDescribe" placeholder="请用，分割每一项"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="formValidate.scoreType == 'GRADE'" label="对应分值" width="180px" prop="classifyScore"
                           show-overflow-tooltip>
            <template scope="scope">
              <el-input v-model="scope.row.classifyScore" placeholder="请用，分割每一项"></el-input>
            </template>
          </el-table-column>

          <template v-if="formValidate.scoreType == 'M_OPTIONS'">
            <el-table-column label="评分项" width="180px" prop="classifyScore"
                             show-overflow-tooltip>
              <template scope="scope">
                <div class="detailsOptionsList" v-for="(item,index) in scope.row.detailsOptionsList" :key="index">
                  <td class="cell">
                    <el-input type="textarea" :autosize="{maxRows:5}" :maxlength="500" v-model="item.content" placeholder="请填写内容"></el-input>
                  </td>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="评分项标准分" width="180px" prop="classifyScore"
                             show-overflow-tooltip>
              <template scope="scope">
                <div class="detailsOptionsList" v-for="(item,index) in scope.row.detailsOptionsList" :key="index">
                  <td class="cell">
                    <el-input v-model="item.score" placeholder="分数（可为负数）" :maxlength="4"></el-input>
                  </td>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="评分项操作" min-width="120" align="center">
              <template scope="scope">
                <div class="detailsOptionsList" v-for="(_,index) in scope.row.detailsOptionsList" :key="index">
                  <td class="cell">
                    <el-button size="small" type="danger" @click="delOption(scope.$index,index)"
                               :disabled="scope.row.detailsOptionsList.length === 1" icon="minus">
                    </el-button>
                    <el-button size="small" type="success" @click="addOption(scope.$index)"
                               :disabled="index !== scope.row.detailsOptionsList.length - 1" icon="plus">
                    </el-button>
                  </td>
                </div>
              </template>
            </el-table-column>
          </template>

          <el-table-column v-if="formValidate.scoreType !== 'M_OPTIONS'" label="扣分项" width="100px" prop="isPoints" show-overflow-tooltip>
            <template scope="scope">
              <el-select v-model="scope.row.isPoints" placeholder="">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="146px" align="left">
            <template scope="scope">
              <el-button size="small" type="danger" @click="del(scope.$index)"
                         v-if="formValidate.detailsList.length > 1">删除
              </el-button>
              <el-button size="small" type="success" @click="add(scope.row.detailOrder)"
                         v-if="scope.$index == formValidate.detailsList.length - 1">添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col align="center" style="margin-top:20px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<style lang="scss">
  @import "../../../../assets/ambuf/css/assessmentContent/assessmentContentScore";
</style>

<script>
  //当前组件引入全局的util
  let Util = null;
  import { assessmentContentScore as rules } from '../../rules'; // 表单验证
  import api from './api';

  export default {
    props: {
      todoId: {
        type: Object,
        default: () => ({
          id: '',
          treeId: 0,
          treeRoad: '0'
        })
      },
      editType: {
        type: String,
        default: 'add' // add增加、edit修改、copy复制
      }
    },
    data () {
      return {
        rules,
        self: this,
        classifyDescribe: '',
        formValidate: {
          scoreTableName: '',
          totalScore: '',
          scoreType: 'STAR',
          detailsList: [{
            classify: '',
            content: '',
            score: '',
            detailOrder: 1,
            remark: '',
            isPoints: 0,
            classifyScore: '',
            classifyDescribe: '',
            detailsOptionsList: [
              {
                'content': '', // 内容
                'score': '', // 分值可以为负值
                'optionsOrder': 1 // 选项顺序
              }
            ]
          }]
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: this.editType,
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api[this.editType].path + (this.editType == 'edit' ? this.todoId.id : ''),
            method: api[this.editType].method
          }
        }
      };
    },
    methods: {
      init () {
        let msg = {add: '添加', edit: '修改', copy: '复制'};
        this.addMessTitle.successTitle = msg[this.editType] + '成功！';
        this.addMessTitle.errorTitle = msg[this.editType] + '失败！';
        if (this.editType != 'add') {
          this.getDataForServer();
        }
      },
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer () {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + this.todoId.id,
            method: api.get.method
          }
        });
      },
      getDataSuccess (res) {
        let data = res.data;
        if (this.editType == 'copy') {
          data.id = '';
          data.scoreTableName = '';
        }
        data.detailsList.map(item => {
          if (!item.detailsOptionsList) {
            item.detailsOptionsList = [
              {
                'content': '', // 内容
                'score': '', // 分值可以为负值
                'optionsOrder': 1 // 选项顺序
              }
            ];
          }
        });
        this.formValidate = data; // 初始化编辑数据
      },
      addOption (index) {
        let detailsOptionsList = this.formValidate.detailsList[index].detailsOptionsList;
        let thisIndex = detailsOptionsList[detailsOptionsList.length - 1].optionsOrder;
        this.formValidate.detailsList[index].detailsOptionsList.push({
          'content': '', // 内容
          'score': '', // 分值可以为负值
          'optionsOrder': ++thisIndex // 选项顺序
        });
      },
      delOption (index, oIndex) {
        this.formValidate.detailsList[index].detailsOptionsList.splice(oIndex, 1);
      },
      // 添加
      add (index) {
        if (this.formValidate.scoreType == 'GRADE') {
          this.formValidate.detailsList.push({
            classify: '',
            content: '',
            score: '',
            detailOrder: ++index,
            remark: '',
            isPoints: 0,
            classifyDescribe: '',
            classifyScore: '',
            detailsOptionsList: [
              {
                'content': '', // 内容
                'score': '', // 分值可以为负值
                'optionsOrder': 1 // 选项顺序
              }
            ]
          });
        } else {
          this.formValidate.detailsList.push({
            classify: '',
            content: '',
            score: '',
            detailOrder: ++index,
            remark: '',
            isPoints: 0,
            detailsOptionsList: [
              {
                'content': '', // 内容
                'score': '', // 分值可以为负值
                'optionsOrder': 1 // 选项顺序
              }
            ]
          });
        }

      },
      // 删除
      del (index) {
        this.formValidate.detailsList.length && this.formValidate.detailsList.splice(index, 1);
      },
      // 统计分数
      getSummaries (param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        let indexNum = 3;
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总分';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && index === indexNum) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
        });
        for (let a = 0; a < param.data.length; a++) {
          if (this.formValidate.scoreType !== 'M_OPTIONS' && param.data[a].isPoints == '1') {
            sums[indexNum] = sums[indexNum] - param.data[a].score;
          }
        }
        this.formValidate.totalScore = sums[indexNum];
        return sums;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit && this.checkData()) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = Util.getFormData(this.formValidate, this.todoId);
          this.ajax(this.addMessTitle, isLoadingFun);
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      //评分指标类型
      selectChange (val) {
      },
      // 检测评分表数据是否有效
      checkData () {
        let data = this.formValidate.detailsList;
        if (!data.length) {
          this.errorMess('至少要有一个评分项！');
          return false;
        }
        if (!data[0].classify) {
          this.errorMess('首行项目名称必须填写！');
          return false;
        }
        for (let i = 0, l = data.length; i < l; i++) {
          if (!data[i].content) {
            this.errorMess(`第${i + 1}行评分标准必须填写！`);
            return false;
          }
          if (!(data[i].score > 0)) {
            this.errorMess(`第${i + 1}行标准分必须大于1！`);
            return false;
          }
          if (this.formValidate.scoreType == 'GRADE') {
            if (!data[i].classifyDescribe) {
              this.errorMess(`第${i + 1}行评分指标等级描述必须填写！`);
              return false;
            }
            if (!data[i].classifyScore) {
              this.errorMess(`第${i + 1}行对应分值必须填写！`);
              return false;
            }
          }
          if (this.formValidate.scoreType == 'M_OPTIONS') {
            let hasEmptyContent = data[i].detailsOptionsList.some(item => item.content === '');
            let hasErrorNumber = !hasEmptyContent && data[i].detailsOptionsList.some(item => !item.score || isNaN(item.score));
            if (hasEmptyContent || hasErrorNumber) {
              this.errorMess(`第${i + 1}行的评分项${hasEmptyContent ? '' : '标准分'}必须填写${hasErrorNumber ? '有效数字' : ''}！`);
              return false;
            }
          }
        }
        return true;
      }
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      this.init();
    }
  };

</script>
