<template>
  <!-- 题干 -->
  <div>
    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" v-model="subject"></el-input>
    <p align="center" class="modelSaveBtn">
      <el-button @click="save" type="info">确定</el-button>
    </p>
  </div>
</template>

<script>
  export default {
    props: ['operailityData'],
    data() {
      return {
        subject: ''
      }
    },
    methods: {
      save() {
        this.$emit('save', this.subject)
      }
    },
    created() {
      this.subject = this.operailityData
    }
  }

</script>

<style>
  /* 题干 */

</style>
