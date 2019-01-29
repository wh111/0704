<template>
  <!-- 打印交费单 -->
  <div>
    <print @print="printDone">
      <slot></slot>
    </print>
  </div>
</template>

<script>
  import print from '../../../common/print';
  export default {
    methods: {
      // 打印完成
      printDone() {
        this.$emit('print')
      },
    },
    components: {
      print,
    },
  }

</script>
