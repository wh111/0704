<template>
  <!-- 添加考站选择类型 -->
  <div>
    <template v-if="this.url">
      <strong>科室 : </strong>
      <el-select v-model="dept.deptId" placeholder="请选择">
        <el-option v-for="(item,index) in optionData" :key="index" :label="item.name" :value="item.id">{{ item.name }}</el-option>
      </el-select>
    </template>

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
  import typeOption from './examineTypeOption';

  export default {
    props: ['url'],//byUserType
    data () {
      return {
        typeOption,
        radio: '', // 选择的考核类型
        dept: {
          deptId: '',
          deptName: ''
        },
        optionData: [],
        optionObj: {}
      };
    },
    methods: {
      selectType () {
        if (this.url && !this.dept.deptId) {
          this.showMess('请选择科室!');
          return;
        }
        if (!this.radio) {
          this.showMess('请选择考核类型!');
          return;
        }
        if (this.url) {
          this.dept.deptName = this.optionObj[this.dept.deptId];
        }
        this.$emit('select', this.radio, this.dept);
      },

      //获取科室成功
      getSuccess (res) {
        let data = res.data;
        if (!data) return;
        let optionObj = {};
        data.map(item => {
          optionObj[item.id] = item.name;
        });
        this.optionObj = optionObj;
        this.optionData = data;
      }
    },
    created () {
      if (this.url) {
        let userInfo = this.$store.getters.getUserInfo;
        let byUserType = { //获取科室
          ajaxSuccess: 'getSuccess',
          ajaxParams: {
            url: this.url.byUserType.path,
            params: {
              userId: userInfo.id
            }
          }
        };
        this.ajax(byUserType);
      }
    }
  };

</script>
