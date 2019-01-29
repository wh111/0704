<template>

  <div class="showWrapper">
    <el-form class="demo-form-inline">

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="姓名:" class="feildFontweight">
            张三
          </el-form-item>
        </el-col>
        </el-col >

      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <legend>轮转记录审核情况</legend>
            <div class="layui-field-box">
              <!--表格数据-->
                <el-table
                  align="center"
                  :height="dynamicHt"
                  :data="tableData1"
                  tooltip-effect="dark"
                  highlight-current-row
                  style="width: 100%;height: 100%"
                  >
                  <el-table-column
                    prop="name"
                    label="轮转记录">
                  </el-table-column>
                  <el-table-column
                    prop="identify"
                    label="审核通过"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="remark"
                    label="审核不通过"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="type"
                    label="未审核"
                  >
                  </el-table-column>
                </el-table>
            </div>
          </fieldset>

        </el-col>
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <legend>评价学生情况</legend>
            <div class="layui-field-box">
              <!--表格数据-->
              <el-table
                align="center"
                :data="tableData1"
                tooltip-effect="dark"
                highlight-current-row
                style="width: 100%;height: 100%"
                >
                <el-table-column
                  prop="name"
                  label="优秀">
                </el-table-column>
                <el-table-column
                  prop="identify"
                  label="良"
                >
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="中"
                >
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="差">
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="未评">
                </el-table-column>
              </el-table>
            </div>
          </fieldset>

        </el-col>
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <fieldset class="layui-elem-field">
            <legend>教学情况</legend>
            <div class="layui-field-box">
              <!--表格数据-->
              <el-table
                align="center"
                :data="tableData1"
                tooltip-effect="dark"
                highlight-current-row
                style="width: 100%;height: 100%"
                >
                <el-table-column
                  prop="name"
                  label="理论带教课时">
                </el-table-column>
                <el-table-column
                  prop="identify"
                  label="临床带教课时"
                >
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="培养学生人数"
                >
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="按期毕业">
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="延期毕业">
                </el-table-column>
              </el-table>
            </div>
          </fieldset>

        </el-col>
      </el-row >
    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        showData:{},
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/role/get/'
          }
        },
        dynamicHt:250,
        tableData1:[{'1':1}]
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let type = [];
        let data = responseData.data;
        this.showData = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
<style>
  .showWrapper{
    height: 100%;
    padding: 20px;
    border: 1px solid #eee;
  }
  .feildFontweight{
    font-weight: bold;
  }
</style>
