<template>
  <!-- 查看 -->
  <div>
    <print>
      <look :operailityData="operailityData" :viewByPodId="viewByPodId" :userType="userType"></look>
    </print>
  </div>
</template>

<script>
 import look from './givenTheApplication_look.vue';
 import print from '../../../common/print.vue';
  export default {
    props: ['operailityData', 'userType', 'viewByPodId'],
    components: {
      look,
      print,
    },
  }

</script>

<style lang="scss">
  /* 查看 */

  .givenTheApplicationView {
    h4 {
      margin: 20px 0;
    }
  }
</style>
