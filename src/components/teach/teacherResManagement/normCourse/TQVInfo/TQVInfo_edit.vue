<template>
  <!-- 教学质量评价表 - 创建 -->
  <div class="nTQVTable">
    <div>
      <h2 class="ntqvtTitle">总体评价</h2>
      <span>(所有课程完成后总体评价)</span>
    </div>
    <el-row>
      <el-form label-width="100px" class="tqviItem" :model="evaluate" ref="evaluate" :rules="evaluateRules">
        <fieldset>
          <legend style="font-size:16px">&nbsp;&nbsp;权重&nbsp;&nbsp;</legend>
          <el-col :span="8">
            <el-form-item label="学生评价：" prop="studentWeight">
              <el-input v-model="evaluate.studentWeight" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="同行评价：" prop="peersWeight">
              <el-input v-model="evaluate.peersWeight" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上级评价：" prop="superiorsWeight">
              <el-input v-model="evaluate.superiorsWeight" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
        </fieldset>
      </el-form>
      <el-form class="tqviItem">
        <fieldset>
          <legend style="font-size:16px">&nbsp;&nbsp;学生评价
            <el-button v-if="!isReadOnly" size="mini" type="info" icon="plus" @click="addEvaluate('student')"></el-button>&nbsp;&nbsp;
          </legend>
          <!-- <el-col>
            <el-form-item>
              <h3 class="ntqvtTitle">评价表:</h3>
              <el-button v-if="!isReadOnly" size="small" type="primary">选择评价表</el-button>
            </el-form-item>
          </el-col> -->
          <el-table ref="singleTable" :data="evaluate.studentEvaluate">
            <el-table-column type="index" label="序号" width="68"></el-table-column>
            <el-table-column v-if="!isReadOnly" label="操作" align="center" width="70">
              <template scope="scope">
                <el-button size="small" type="danger" @click="removeEvaluate('student',scope.$index)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column property="title" label="考核项目">
              <template scope="scope">
                <el-input v-model="scope.row.title" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="remark" label="考核内容">
              <template scope="scope">
                <el-input v-model="scope.row.remark" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="great" label="优">
              <template scope="scope">
                <el-input v-model="scope.row.great" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="good" label="良">
              <template scope="scope">
                <el-input v-model="scope.row.good" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="avg" label="中">
              <template scope="scope">
                <el-input v-model="scope.row.avg" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="bad" label="差">
              <template scope="scope">
                <el-input v-model="scope.row.bad" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </el-form>
      <el-form class="tqviItem">
        <fieldset>
          <legend style="font-size:16px">&nbsp;&nbsp;同行评价
            <el-button v-if="!isReadOnly" size="mini" type="info" icon="plus" @click="addEvaluate('peers')"></el-button>&nbsp;&nbsp;
          </legend>
          <!-- <el-col>
            <el-form-item>
              <h3 class="ntqvtTitle">评价表:</h3>
              <el-button v-if="!isReadOnly" size="small" type="primary">选择评价表</el-button>
            </el-form-item>
          </el-col> -->
          <el-table ref="singleTable" :data="evaluate.peersEvaluate">
            <el-table-column type="index" label="序号" width="68"></el-table-column>
            <el-table-column v-if="!isReadOnly" label="操作" align="center" width="70">
              <template scope="scope">
                <el-button size="small" type="danger" @click="removeEvaluate('peers',scope.$index)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column property="title" label="考核项目">
              <template scope="scope">
                <el-input v-model="scope.row.title" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="remark" label="考核内容">
              <template scope="scope">
                <el-input v-model="scope.row.remark" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="great" label="优">
              <template scope="scope">
                <el-input v-model="scope.row.great" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="good" label="良">
              <template scope="scope">
                <el-input v-model="scope.row.good" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="avg" label="中">
              <template scope="scope">
                <el-input v-model="scope.row.avg" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="bad" label="差">
              <template scope="scope">
                <el-input v-model="scope.row.bad" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </el-form>
      <el-form class="tqviItem">
        <fieldset>
          <legend style="font-size:16px">&nbsp;&nbsp;上级评价
            <el-button v-if="!isReadOnly" size="mini" type="info" icon="plus" @click="addEvaluate('superiors')"></el-button>&nbsp;&nbsp;
          </legend>
          <!-- <el-col>
            <el-form-item>
              <h3 class="ntqvtTitle">评价表:</h3>
              <el-button size="small" type="primary" v-if="!isReadOnly">选择评价表</el-button>
            </el-form-item>
          </el-col> -->
          <el-table ref="singleTable" :data="evaluate.superiorsEvaluate">
            <el-table-column type="index" label="序号" width="68"></el-table-column>
            <el-table-column label="操作" align="center" width="70" v-if="!isReadOnly">
              <template scope="scope">
                <el-button size="small" type="danger" @click="removeEvaluate('superiors',scope.$index)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column property="title" label="考核项目">
              <template scope="scope">
                <el-input v-model="scope.row.title" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="remark" label="考核内容">
              <template scope="scope">
                <el-input v-model="scope.row.remark" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="great" label="优">
              <template scope="scope">
                <el-input v-model="scope.row.great" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="good" label="良">
              <template scope="scope">
                <el-input v-model="scope.row.good" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="avg" label="中">
              <template scope="scope">
                <el-input v-model="scope.row.avg" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
            <el-table-column property="bad" label="差">
              <template scope="scope">
                <el-input v-model="scope.row.bad" :readonly="isReadOnly"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import {
    evaluateRules,
  } from '../rules';
  export default {
    props: ['readOnly'],
    data() {
      return {
        evaluateRules,
        isReadOnly: false, // 只读
        evaluate: {},
      }
    },
    methods: {
      // 初始化
      init() {
        this.isReadOnly = this.readOnly !== undefined;
        this.evaluate = this.$store.state.curriculum.data.evaluate;
      },
      /******************************************** 按钮事件 ***************************************/
      // 添加评价项
      addEvaluate(type) {
        this.$store.commit('curriculum/data/addEvaluate', type)
      },
      // 删除评价项
      removeEvaluate(type, delIndex) {
        this.$store.commit('curriculum/data/removeEvaluate', {
          type,
          delIndex
        })
      },
      /******************************************** 数据提交 ***************************************/
      // 保存
      saveToStore() {
        // if (!this.checkData()) {
        //   return false;
        // }
        this.$store.commit('curriculum/data/updateEvaluate', this.evaluate);
        return true
      },
      // 检测数据完整性
      checkData() {
        let flag = true;
        if (this.$refs.item) {
          for (let i = 0; i < this.$refs.item.length; i++) {
            this.$refs.item[i].validate((valid) => {
              if (!valid) {
                flag = false;
              }
            });
          }
        }
        return flag;
      },
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  /* 教学质量评价表 */

  .nTQVTable {
    // padding-left: 16px;
    .tqviItem {
      margin: 10px 0;
    }
    .ntqvtTitle {
      display: inline-block;
    }
    .el-form-item {
      margin: 4px 0;
    }
  }

</style>
