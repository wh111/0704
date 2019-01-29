<template>
  <!-- 选项 -->
  <div>
    <p v-for="(item,index) in optionsList" :key="index">{{ options[index] + '.' + item.content }}</p>
  </div>
</template>

<script>
  export default {
    props: ['val'],
    data() {
      return {
        options: ["A", "B", "C", "D", "E", "F"],
        optionsList: [],
      }
    },
    created() {
      this.optionsList = this.$util._.sortBy(this.val, 'options')
    }
  }

</script>

<style>
  /* 选项 */

  .optionContentInput {
    width: 280px;
  }

</style>
