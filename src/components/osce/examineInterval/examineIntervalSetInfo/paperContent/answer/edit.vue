<template>
  <!-- 正确答案 -->
  <div class="paperAnswerEdit">
    <rd @save="save" :operaility-data="operailityData" :row-data="rowData" v-if="['RADIO','JUDGMENT'].indexOf(theType) > -1"></rd>
    <cb @save="save" :operaility-data="operailityData" :row-data="rowData" v-if="theType === 'CHECKBOX'"></cb>
    <an @save="save" :operaility-data="operailityData" :row-data="rowData" v-if="theType === 'ANSWER'"></an>
  </div>
</template>
<style lang="scss">
  .paperAnswerEdit {
    .selectAnswerItem {
      position: relative;
      padding-bottom: 20px;
    }
    .el-checkbox__input, .el-radio__input {
      position: absolute;
      left: 0;
      top: 1px;
    }
    .el-checkbox__label, .el-radio__label {
      padding-left: 30px;
      position: relative;
    }
    .selectAnswerBox {
      line-height: 20px;
      position: absolute;
      left: 30px;
      top: 0;
    }
    .selectAnswerContent {
      padding-left: 40px;
    }
    .selectAnswerContentBox {
      padding-left: 18px;
      white-space: normal;
      width: 100%;
    }
  }
</style>
<script>
  import rd from './edit_rd'; // 单选\判断题
  import cb from './edit_cb'; // 多选
  import an from './edit_an'; // 问答
  export default {
    props: ['operailityData', 'theType', 'rowData'],
    methods: {
      save (val) {
        this.$emit('save', val)
      }
    },
    components: {
      rd,
      cb,
      an
    }
  }

</script>

