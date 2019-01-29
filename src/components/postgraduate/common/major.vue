<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/12
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-option
      v-for="item in optionData"
      :key="item.id"
      :label="item.major?(item.major+`(${item.majorCode})`):'全部'"
      :value="item[value || 'majorCode']">
    </el-option>
  </div>
</template>
<script>
  import api from './api'
  let Util = null;
  export default {
    props: ['url', "selectOptions", 'unAll', 'value'],
    data() {
      return {
        optionData: [],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.query.path,  //向后台请求数据的地址 （不分页）
          }
        }
      }
    },
    created() {
      Util = this.$util;
      this.init();
    },
    methods: {

      //初始化组件信息
      init() {
        if (this.selectOptions) {
          this.optionData = this.selectOptions
        } else {
          this.ajax(this.listMessTitle);
        }
      },

      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        this.$emit('successMajor', this.$util._.defaultsDeep([], data));
        if (!this.unAll) {
          data.unshift({
            major: '',
            majorCode: ''
          },)
        }
        this.optionData = data;

      },

    }
  }
</script>
