<template>
  <!-- 选项(单多选) -->
  <div>
    <el-row>
      <el-col v-for="(item,index) in optionsList" :key="index">
        <el-form label-width="30px">
          <el-form-item :label="options[index] + '.'">
            <el-input v-model="item.content" class="optionContentInput"></el-input>
            <el-button type="danger" @click="del(index)" :disabled="optionsList.length < 2">删除</el-button>
            <el-button type="success" @click="adds" v-if="(index === optionsList.length-1) && optionsList.length < 6">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <p align="center" class="modelSaveBtn">
      <el-button @click="save" type="info">确定</el-button>
    </p>
  </div>
</template>

<script>
  export default {
    props: ['operailityData', 'type'],
    data() {
      return {
        options: ["A", "B", "C", "D", "E", "F"],
        optionsList: [],
      }
    },
    methods: {
      // 保存
      save() {
        this.optionsList.map((item, index) => item.options = this.options[index]);
        this.$emit('save', this.optionsList)
      },
      // 删除
      del(index) {
        this.optionsList.splice(index, 1)
      },
      // 添加
      adds() {
        this.optionsList.push({
          options: "",
          content: "",
        })
      }
    },
    created() {
      if (this.operailityData && this.operailityData.length) {
        this.optionsList = this.$util._.sortBy(this.operailityData, 'options')
      } else {
        this.adds()
      }
    }
  }

</script>

<style>
  .optionContentInput {
    width: 280px;
  }

</style>
