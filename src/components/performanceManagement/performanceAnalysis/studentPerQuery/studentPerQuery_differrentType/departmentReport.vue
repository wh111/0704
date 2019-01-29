<!----------------------------------
****--@name     日常管理(入科报道及时程度)
****--@role     ${*}
****--@date     2017/12/7
****--@author   gx
----------------------------------->

<template>
  <div>
    <el-table
      align="center"
      :data="tableData"
      tooltip-effect="dark"
      highlight-current-row
      border
      style="width: 100%;height: 100%">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="75">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="intoTime"
        label="入科时间">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="givenTime"
        label="出科时间">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="registrationTime"
        label="报到时间">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="isTimely"
        label="是否及时">
        <template scope="scope">
          <span :style="{color:(scope.row.isTimely==1)?'#34FF3E':'#fa5180'}">{{(scope.row.isTimely==1)?'通过':'未通过'}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['operailityData'],
    data() {
      return {
        tableData:[
          {
            name:'呼吸内科',
            intoTime:'2017-8-7',
            givenTime:'2017-8-7',
            registrationTime:'2017-8-27',
            isTimely:1,
          },
          {
            name:'心血管内科',
            intoTime:'2017-8-28',
            givenTime:'2017-9-1',
            registrationTime:'2017-9-1',
            isTimely:1,
          },
          {
            name:'消化内科',
            intoTime:'2017-9-2',
            givenTime:'2017-9-22',
            registrationTime:'2017-9-22',
            isTimely:0,
          },
        ],
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    computer:{

    },
    components: {}
  }
</script>
