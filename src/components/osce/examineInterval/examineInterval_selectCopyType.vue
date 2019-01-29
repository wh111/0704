<template>
  <!-- 复制考站选择类型 -->
  <div>
    <template v-for="item in typeOption">
      <el-radio class="radio" v-model="radio" v-if="item.value" :label="item.value">{{ item.label }}</el-radio>
    </template>
    <div align="center" style="margin-top:20px;">
      <el-button type="primary" @click="selectType">确定</el-button>
    </div>
  </div>
</template>

<script>
  // 类型
  export default {
    data () {
      return {
        typeOption: [{
          value: 'one',
          label: '单个场次'
        }, {
          value: 'more',
          label: '多个场次'
        }],
        radio: '' // 复制考核类型
      };
    },
    methods: {
      selectType () {
        if (!this.radio) {
          this.showMess('请选择场次复制类型!');
          return;
        }
        this.$emit('select', this.radio);
      }
    },
    created () {
    }
  };

</script>
