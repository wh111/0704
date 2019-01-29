<template>
  <!-- 教学计划 -->
  <el-row>
    <el-form class="editForm" ref="item" v-for="(item,index) in planDtoList" :model="item" :rules="rules" label-width="100px" :key="index">
      <fieldset class="nPlanItem">
        <legend style="font-size:16px">&nbsp;&nbsp;第{{ indexText(index) }}节&nbsp;&nbsp;</legend>
        <el-col :span="10">
          <el-form-item label="课时：" prop="duration">
            <el-input v-model="item.duration" class="planHoursInput"></el-input>
            <span>小时</span>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="10" align="right">
          <el-button v-if="!isReadOnly" type="danger" :disabled="planDtoList.length < 2" @click="remove(index)">删除</el-button>
        </el-col>
        <el-col>
          <el-form-item label="教学内容：" prop="content">
            <el-input v-model="item.content" :readonly="isReadOnly"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="详细介绍：" prop="remark">
            <el-input v-model="item.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :readonly="isReadOnly"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="所需道具：" prop="realia">
            <el-input v-model="item.realia" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :readonly="isReadOnly"></el-input>
          </el-form-item>
        </el-col>
      </fieldset>
    </el-form>
    <el-form v-if="!isReadOnly">
      <el-col align="center">
        <el-form-item label-width="0">
          <el-button type="info" @click="add">添加一节</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
  import {
    plan as rules
  } from '../rules';
  export default {
    props: ['readOnly'],
    data() {
      return {
        rules, // 验证输入规则
        isReadOnly: false, // 只读
        planDtoList: [],
      }
    },
    methods: {
      // 初始化
      init() {
        this.isReadOnly = this.readOnly !== undefined;
        this.planDtoList = this.$store.state.curriculum.data.planDtoList;
      },
      /******************************************** 按钮事件 ***************************************/
      // 添加
      add() {
        this.$store.commit('curriculum/data/addPlanDto')
      },
      // 删除
      remove(index) {
        this.$store.commit('curriculum/data/removePlanDto', index)
      },
      /******************************************** 数据提交 ***************************************/
      // 保存
      saveToStore() {
        if (!this.checkData()) {
          return false;
        }
        this.$store.commit('curriculum/data/updatePlanDto', this.planDtoList);
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

      // 索引数字转换
      indexText(index) {
        index += 1;
        let text = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        let str = [];
        let bit = index % 10; // 个位
        let ten = (index - bit) / 10; // 十位
        ten > 1 && (str[0] = text[ten - 1]);
        index > 9 && (str[1] = text[9]);
        str[2] = (text[bit - 1]) || '';
        return str.join('')
      },
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  /* 教学计划 */

  @import"../../../../../assets/ambuf/css/manage_v1.0/editForm";
  .nPlanItem {
    margin-bottom: 20px;
  }

  .planHoursInput {
    width: 160px;
  }

</style>
