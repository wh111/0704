<template>
  <!-- 正确答案查看 -->
  <div>
    <template v-if="theType==='ANSWER'">
      <p v-for="(item,index) in val" :key="index">关键字：{{ item.tag }}，得分比：{{ item.weight }}</p>
    </template>
    <template v-else>
      {{ val.split('|').join('、') }}
    </template>
  </div>
</template>

<script>
  export default {
    props: ['val', 'theType']
  }

</script>
