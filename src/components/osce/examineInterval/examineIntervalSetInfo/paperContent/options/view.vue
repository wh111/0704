<template>
  <!-- 选项 -->
  <div>
    <div v-for="(item,index) in optionsList" :key="index" class="optionViewItem">
      <span class="optionViewOption">{{ options[index] }}.</span>
      <div class="optionViewContent eq-qusetionHtmlBox" v-html="item.content"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['val'],
    data () {
      return {
        options: ['A', 'B', 'C', 'D', 'E', 'F'],
        optionsList: []
      }
    },
    methods: {
      init () {
        this.optionsList = this.$util._.sortBy(this.val, 'options')
      }
    },
    watch: {
      val () {
        this.init()
      }
    },
    created () {
      this.init()
    }
  }

</script>

<style lang="scss">
  /* 选项 */
  .optionContentInput {
    width: 280px;
  }

  .optionViewItem {
    position: relative;
    span {
      max-width: 100%;
      white-space: normal;
    }
  }

  .optionViewOption {
    position: absolute;
    left: 10px;
    top: 2px;
  }

  .optionViewContent {
    padding-left: 30px;
  }

</style>
