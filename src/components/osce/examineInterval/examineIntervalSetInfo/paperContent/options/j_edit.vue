<template>
  <!-- 选项（判断题） -->
  <div>
    <el-row>
      <el-col v-for="(item,index) in optionsList" :key="index">
        <el-form label-width="30px">
          <el-form-item :label="options[index] + '.'">
            <el-input v-model="item.content"></el-input>
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
        options: ["A", "B"],
        optionsList: [],
      }
    },
    methods: {
      // 保存
      save() {
        this.optionsList.map((item, index) => item.options = this.options[index]);
        this.$emit('save', this.optionsList)
      },
    },
    created() {
      if (this.operailityData && this.operailityData.length) {
        if (this.operailityData.length > 2) {
          this.operailityData.length = 2;
        }
        // this.optionsList = this.operailityData;
        this.optionsList = this.$util._.sortBy(this.operailityData, 'options')
      } else {
        this.optionsList = [{
          "options": "A",
          "content": "正确",
        }, {
          "options": "B",
          "content": "错误",
        }]
      }
    }
  }

</script>
