<!----------------------------------
****--@name     选择大楼
****--@role     ${*}
****--@date     2017/12/15
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules.roomMess" class="demo-form-inline"
             label-width="90px">
      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="大楼名称:" prop="buildId">
            <el-select
              v-model="formValidate.buildId"
              placeholder="选择或输入匹配搜索">
              <select-option ref="selectOption" :unAll="true" :type="'allBuild'"></select-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button @click="confirm">确定</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['rules'],
    data() {
      return {
        formValidate: {
          buildId: '',
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

      },
      //搜索监听回调
      confirm() {
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          let buildData = this.getSelectData();
          this.$emit('selectBuild', buildData);
        }
      },

      //获取选中的大楼
      getSelectData() {
        let optionData = this.$refs.selectOption.getOptionData();
        let data = {}
        optionData.map(item => {
          if (item.id == this.formValidate.buildId) {
            data = item
          }
        })
        return data;
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        let flag = false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          }
        })
        return flag
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }
</script>
