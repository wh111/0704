<!----------------------------------
****--选择基地(firstStep)
****--@date     2017/7/23
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <el-radio-group v-model="radio" style="width: 100%;">
    <el-table
      stripe
      :data="tableData1"
      height="480"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label=""
        width="50">
        <template scope="scope">
          <el-radio class="radio" :label="scope.row">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="jdName"
        label="基地名">
      </el-table-column>
      <el-table-column
        prop="jdProclass"
        label="培训方向"
        width="180">
      </el-table-column>
    </el-table>
  </el-radio-group>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:['userType'],
    data() {
      return {
        radio:"",
        tableData1: [
          /*{
        "jdId":"1",
        "jdName":"基地名称",
        "jdProclass":"内科方向",
        "jdZrUsername":"",
        "jdZrUserid":"",
        "jdStatus":"",
        "createTime":"",
        "jdContent":"",
      }*/
        ],

        //初始化获取基地信息
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.getJdList.path,
            params:{
              jdName:'',
              jdState:'',
              jdProclass:'',
            }
          }
        },

        //获取学校数据
        getSchool :{
          ajaxSuccess:'updateListData',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:api.getSchoolList.path,
          },
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.listMessTitle);
      },
      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        this.tableData1= data;
      },

    },
    created(){
      this.init();
    },
    watch:{
      radio(val){
        this.$emit("setSecondVal",val);
      }
    },
    mounted(){},
    components: {}
  }
</script>
