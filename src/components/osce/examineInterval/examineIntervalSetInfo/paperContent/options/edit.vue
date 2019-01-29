<template>
  <!-- 选项 -->
  <div>
    <randc :operaility-data="operailityData" @save="save" v-if="['RADIO','CHECKBOX'].indexOf(theType) > -1"></randc>
    <jedit :operaility-data="operailityData" @save="save" v-else></jedit>
  </div>
</template>

<script>
  import randc from './rAndc_edit'; // 单多选
  import jedit from './j_edit'; // 判断题
  export default {
    props: ['operailityData', 'theType'],
    methods: {
      // 保存
      save(val) {
        this.$emit('save', val)
      },
    },
    components: {
      randc,
      jedit,
    },
  }

</script>

<style>
  /* 选项 */

  .optionContentInput {
    width: 280px;
  }

</style>
