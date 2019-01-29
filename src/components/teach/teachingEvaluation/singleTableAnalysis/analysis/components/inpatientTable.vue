<!--
****--@file     teacherPhysicianTable
****--@date     2017/12/8 下午4:10
****--@author   jhd
****--@describe   住院医师评价表
-->
<template>
  <div class="cttsacd-content">
    <p class="tip">
      <span >住院医师姓名：</span>
      <span class="right" style="margin-right: 150px">科室：</span>
    </p>
    <el-table
      align="center"
      border
      :data="tableData1"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;height: 100%"
    >
      <el-table-column
        prop="title"
        label="项目"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        prop="bzt"
        label="优（5分）">
      </el-table-column>
      <el-table-column
        prop="bztbfd"
        label="良（4分）">
      </el-table-column>
      <el-table-column
        prop="jbzt"
        label="中（3分）"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="hzt"
        label="差（2分）"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="wqzt"
        label="很差（1分）"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="wqzt"
        label="无成绩（0分）"
        align="center"
      >
      </el-table-column>
    </el-table>
    <p class="tip">
      <span >总分：</span>
      <span style="margin:0 200px 0 200px">评价时间：</span>
      <span>患者签字：</span>
    </p>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        tableData1:[{
          title:'入科教育',
          bzt:'',
          bztbfd:'',
          jbzt:'',
          hzt:'',
          wqzt:'',
          last:''
        },{
          title:'安排专人进行带教',
          bzt:'',
          bztbfd:'',
          jbzt:'',
          hzt:'',
          wqzt:'',
          last:''
        },{
          title:'具备充足的学习资源（病种、病人数及分管床位数等）',
          bzt:'',
          bztbfd:'',
          jbzt:'',
          hzt:'',
          wqzt:'',
          last:''
        },{
          title:'提供详细的带教计划（教学查房、病例讨论、小讲课、讲座等）',
          bzt:'',
          bztbfd:'',
          jbzt:'',
          hzt:'',
          wqzt:'',
          last:''
        },{
          title:'布置明确的培训任务（需完成的病例数、操作数、手术量及具体要求等）',
          bzt:'',
          bztbfd:'',
          jbzt:'',
          hzt:'',
          wqzt:'',
          last:''
        },{
          title:'科室具有良好医德医风，带教态度积极、认真，带教意识和责任心强',
          bzt:'',
          bztbfd:'',
          jbzt:'',
          hzt:'',
          wqzt:'',
          last:''
        },{
          title:'全体老师主动指导住院医师，医疗文书审阅修改仔细及时',
          bzt:'',
          bztbfd:'',
          jbzt:'',
          hzt:'',
          wqzt:'',
          last:''
        },{
          title:'尽可能多提供临床实践机会',
          bzt:'',
          bztbfd:'',
          jbzt:'',
          hzt:'',
          wqzt:'',
          last:''
        },{
          title:'出科考核严格认真、轮转手册审核及时',
          bzt:'',
          bztbfd:'',
          jbzt:'',
          hzt:'',
          wqzt:'',
          last:''
        },{
          title:'医护人员尊重学员 ',
          bzt:'',
          bztbfd:'',
          jbzt:'',
          hzt:'',
          wqzt:'',
          last:''
        },]
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

      }

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }

</script>
<style lang="scss">
  @import './style';
</style>
