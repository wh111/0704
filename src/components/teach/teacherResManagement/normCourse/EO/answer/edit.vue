<template>
  <!-- 正确答案 -->
  <div>
    <rd @save="save" :operaility-data="operailityData" :row-data="rowData" v-if="['RADIO','JUDGMENT'].indexOf(theType) > -1"></rd>
    <cb @save="save" :operaility-data="operailityData" :row-data="rowData" v-if="theType === 'CHECKBOX'"></cb>
    <an @save="save" :operaility-data="operailityData" :row-data="rowData" v-if="theType === 'ANSWER'"></an>
  </div>
</template>

<script>
  import rd from './edit_rd'; // 单选\判断题
  import cb from './edit_cb'; // 多选
  import an from './edit_an'; // 问答
  export default {
    props: ['operailityData', 'theType', 'rowData'],
    methods: {
      save(val) {
        this.$emit('save', val)
      }
    },
    components: {
      rd,
      cb,
      an,
    }
  }

</script>
