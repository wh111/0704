<!--
****--@file     teachingTable
****--@date     2017/12/8 下午4:41
****--@author   jhd
****--@describe   带教老师评价表
-->
<template>
  <div class="teacher-table">
    <table>
      <tr>
        <th colspan="2">带教老师姓名</th>
        <th width="200"></th>
        <th>职称</th>
        <th colspan="2" width="100"></th>
        <th colspan="5" width="300">轮转起止时间</th>
      </tr>
      <tr>
        <th colspan="5">项目</th>
        <th>5分</th>
        <th>4分</th>
        <th>3分</th>
        <th>2分</th>
        <th>1分</th>
        <th>0分</th>
      </tr>
      <tr>
        <th colspan="5">临床能力扎实、操作规范，良好医德医风、良好医患沟通、责任心强</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th colspan="5">带教意识强、关心住院医师，为人师表，亲和力强</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th colspan="5">明确培训任务、按照计划指导住院医师开展各项日常医疗活动</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th colspan="5">及时修改医疗文件，指导住院医师严格落实各项医疗核心制度</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th colspan="5">注重培训临床技能临床思维能力，多提供临床实践机会</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th colspan="5">认真进行各类教学活动，如教学查房、小讲课、病例讨论</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th colspan="5">及时认真核查《轮转登记手册》、培训目标达成情况及记录真实性</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th colspan="5">严肃认真、实事求是对住院医师进行评估和考核，及时进行出科鉴定</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th colspan="5">激发主动学习能力，及时有效反馈</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th colspan="5">指导理论学习和知识更新，培养创造性思维和科研能力</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th colspan="5">满分   100分</th>
        <th></th>
        <th colspan="5"></th>
      </tr>
      <tr>
        <th colspan="11">
          是否推选其为优秀带教老师
          <el-radio style="margin-left: 400px" v-model="radio" label="1">是</el-radio>
          <el-radio v-model="radio" label="2">否</el-radio>
        </th>
      </tr>
    </table>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        radio:'1'
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
  .teacher-table{
    table{
      font-size: 16px;
      border:1px solid #000000;
      overflow-x: scroll;
      th{
        border:1px solid #000000;
        line-height: 30px;

      }
      .chioce{
        text-align: center;
        width: 80px;
      }
    }
  }
</style>
