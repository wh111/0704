<template>
  <!-- 多选答案 -->
  <div>
    <el-row>
      <el-form>
        <el-checkbox-group v-model="val">
          <el-col v-for="(item,index) in rowData.optionsDtoList" :key="index">
            <el-form-item :label="item.options">
              <el-checkbox :label="item.options">{{ item.content }}</el-checkbox>
            </el-form-item>
          </el-col>
        </el-checkbox-group>
      </el-form>
    </el-row>

    <p align="center" class="modelSaveBtn">
      <el-button @click="save" type="info">确定</el-button>
    </p>
  </div>
</template>

<script>
  export default {
    props: ['operailityData', 'rowData'],
    data() {
      return {
        val: [],
      }
    },
    methods: {
      init() {
        if (this.operailityData) {
          this.val = this.operailityData.split('|');
        }
      },
      // 确定
      save() {
        if (!this.val.length) {
          this.errorMess('至少选择一个选项作为答案')
          return
        }
        this.$emit('save', this.val.join('|'))
      },
    },
    created() {
      this.init()
    }
  }

</script>
