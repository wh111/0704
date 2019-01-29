<!--科室要求 - 查看-->
<template>
  <div>
    <!--研究生和住院医的科室要求-->
    <el-table  ref="multipleTable" align="center"  :height="500" tooltip-effect="dark" style="width: 100%"
      :data="tableData">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="70">
      </el-table-column>
      <el-table-column
        align="center"
        prop="deName"
        label="考核指标"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="deDetype"
        label="分类"
        width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="deShowtype"
        show-overflow-tooltip
        label="类型"
        align="center"
        width="150">
        <template scope="scope">
          {{scope.row.deShowtype=='TEXT'?'文本':'表格'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="deMasterDegree"
        show-overflow-tooltip
        label="掌握程度"
        class-name="valiTableStyle"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="deCountBasic"
        label="3年要求"
        class-name="valiTableStyle"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="deCountBasicSecond"
        label="2年要求"
        class-name="valiTableStyle"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="deCountBasicFirst"
        label="1年要求"
        class-name="valiTableStyle"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>

</template>
<script>
  /*当前组件必要引入*/
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ["operailityData",'url'],
    data() {
      return {
        //数据查询
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.getRulesDepRequirementByPodId + this.operailityData.podId
          }
        },
        disType:[],
        deMasterDegreeData:[],
        //表单数据bind
        tableData: [],
        //类型
        getDisType:{
          ajaxSuccess:'getDisTypeSuccess',
          ajaxParams:{
            url:this.url.disType,
            params:{}
          }
        },

        //获取掌握程度
        getDeMasterDegree:{
          ajaxSuccess:'getDeMasterDegreeSuccess',
          ajaxParams:{
            url:'/dictionary/getByCode/ROTARY_MASTER_DEGREE',
            params:{}
          }
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.ajax(this.listMessTitle);
        //因为name 和 value 一样都是中文 所以表格直接显示值就行
//        this.ajax(this.getDisType);
//        this.ajax(this.getDeMasterDegree);
      },
      getDisTypeSuccess(res){
        let data = res.data;
        if(!data)return;
        data = data.child;
        this.disType = data;
      },

      //获取掌握程度
      getDeMasterDegreeSuccess(res){
        let data = res.data;
        if(!data)return;
        data = data.child;
        this.deMasterDegreeData = data;
      },

      //通过get请求列表数据
      updateListData(responseData) {
          this.tableData = responseData.data.depRequirements || [];
      },
    },
    created() {
      this.init();
    },
    mounted() {},
    components: {}
  }

</script>
