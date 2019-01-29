<template>
  <!-- 题干查看 -->
  <div class="eq-qusetionHtmlBox" v-html="val"></div>
</template>

<script>
  export default {
    props: ['val']
  }

</script>
