<template>
  <!-- 单选答案 -->
  <div>
    <el-row>
      <el-form>
        <el-radio-group v-model="val">
          <el-col v-for="(item,index) in rowData.optionsDtoList" :key="index">
            <el-form-item :label="item.options" label-width="20px">
              <el-radio :label="item.options">{{ item.content }}</el-radio>
            </el-form-item>
          </el-col>
        </el-radio-group>
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
        val: '',
      }
    },
    methods: {
      init() {
        if (this.operailityData) {
          this.val = this.operailityData.slice(0, 1);
        }
      },
      // 确定
      save() {
        if (!this.val.length) {
          this.errorMess('请选择一个选项作为答案')
          return
        }
        this.$emit('save', this.val)
      },
    },
    created() {
      this.init()
    }
  }

</script>
