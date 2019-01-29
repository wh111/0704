<!--
****--@file     leaderTable
****--@date     2017/12/8 下午4:07
****--@author   jhd
****--@describe   基地领导评价表
-->
<template>
  <div>
    <div>
      <table class="tableList">
        <tr class="singleTable_tableHead">
          <th width="12%"></th>
          <th width="44%"></th>
          <th width="44%"></th>
        </tr>
        <tr>
          <td rowspan="3">基地领导</td>
          <td>1.你认为基地主任对住培工作感兴趣吗？</td>
          <td>
            <el-radio v-model="baseLeader" label="1"> 1.不感兴趣</el-radio>
            <el-radio v-model="baseLeader" label="2">2.很少感兴趣</el-radio>
            <el-radio v-model="baseLeader" label="3">3.尚可</el-radio>
            <el-radio v-model="baseLeader" label="4">4.有兴趣</el-radio>
            <el-radio v-model="baseLeader" label="5">5.非常有兴趣</el-radio>
          </td>
        </tr>
        <tr>
          <td>2.基地领导是否定期与住院医师讨论基地培训的相关问题，听取规培生对基地的意见和建议？</td>
          <td>
            <el-radio v-model="baseLeader1" label="1">1.没有</el-radio>
            <el-radio v-model="baseLeader1" label="2">2.很少</el-radio>
            <el-radio v-model="baseLeader1" label="3">3.有</el-radio>

          </td>
        </tr>
        <tr>
          <td class="cell">3.你对培训基地的有关意见或者建议是否得到基地主任或相关部门的回应？</td>
          <td class="cell">
            <el-radio v-model="baseLeader2" label="1">1.没有回应</el-radio>
            <el-radio v-model="baseLeader2" label="2">2.有回应</el-radio>
            <el-radio v-model="baseLeader2" label="3">3.有回应并积极改进基地工作</el-radio>
          </td>
        </tr>
      </table>
      <table class="tableList">

        <tr class="singleTable_tableHead">
          <th width="12%"></th>
          <th width="44%"></th>
          <th width="44%"></th>
        </tr>
        <tr class="el-table__row">
          <td class="cell" rowspan="5">基地培训</td>
          <td class="cell">1.基地的轮转是否按照国家要求的培训大纲对住院医师有明确的目的和要求(书面或电子版)？</td>
          <td class="cell">
            <el-radio v-model="baseEdu" label="1">1.没有目的和要求</el-radio>
            <el-radio v-model="baseEdu" label="2">2.目的和要求不明确</el-radio>
            <el-radio v-model="baseEdu" label="3">3.有目的和要求</el-radio>
            <el-radio v-model="baseEdu" label="4">4.目的和要求非常明确</el-radio>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="cell">2.基地对各类培训对象是否一视同仁，同等施教，待遇相同？</td>
          <td class="cell">
            <el-radio v-model="baseEdu1" label="1">1.不能一视同仁;</el-radio>
            <el-radio v-model="baseEdu1" label="2">2.很少一视同仁</el-radio>
            <el-radio v-model="baseEdu1" label="3">3.尚可</el-radio>
          </td>
        </tr>
        <tr class="el-table__row">
          <td class="cell">3.你的临床学习是否经常被过多事务性工作所占用？</td>
          <td class="cell">
            <el-radio v-model="baseEdu2" label="1"> 1.全被占用</el-radio>
            <el-radio v-model="baseEdu2" label="2">2.经常被占用</el-radio>
            <el-radio v-model="baseEdu2" label="3">3.尚可</el-radio>
            <el-radio v-model="baseEdu2" label="4">4.很少被占用</el-radio>
            <el-radio v-model="baseEdu2" label="5">5.从未被占用</el-radio>

          </td>

        </tr>
        <tr class="el-table__row">
          <td class="cell">4.基地是否对住院医师的临床职责和能力有螵旋式上升的要求并且有相应的轮转安排，对不同年资住院医生有不同的要求，直至最后毕业时的住院医生可以独立工作?</td>
          <td class="cell">
            <el-radio v-model="baseEdu3" label="1">1.没有要求</el-radio>
            <el-radio v-model="baseEdu3" label="2">2.要求很少</el-radio>
            <el-radio v-model="baseEdu3" label="3">3.尚可</el-radio>
            <el-radio v-model="baseEdu3" label="4">4.有明确的要求</el-radio>
            <el-radio v-model="baseEdu3" label="5">5.毕业的住院医生可以独立工作</el-radio>

          </td>

        </tr>
        <tr class="el-table__row">
          <td class="cell">5.基地是否为你创造条件，在带教医师的监督下独立进行临床工作？</td>
          <td class="cell">
            <el-radio v-model="baseEdu4" label="1">1.没有要求</el-radio>
            <el-radio v-model="baseEdu4" label="2">2.很少有要求</el-radio>
            <el-radio v-model="baseEdu4" label="3">3.有要求</el-radio>
            <el-radio v-model="baseEdu4" label="4">4.基地对住院医生独立工作能力很重视</el-radio>


          </td>

        </tr>


      </table>
      <table class="tableList">
        <tr class="singleTable_tableHead">
          <th width="12%"></th>
          <th width="44%"></th>
          <th width="44%"></th>
        </tr>
        <tr class="el-table__row">
          <td class="cell" rowspan="5">带教医师</td>
          <td>1.对基地带教医师的带教热情满意吗？</td>
          <td>
            <el-radio v-model="docTeacher" label="1">1.不满意</el-radio>
            <el-radio v-model="docTeacher" label="2">2.不太满意</el-radio>
            <el-radio v-model="docTeacher" label="3">3.尚可</el-radio>
            <el-radio v-model="docTeacher" label="4">4.满意</el-radio>
            <el-radio v-model="docTeacher" label="5">5.非常满意</el-radio>
          </td>
        </tr>

        <tr class="el-table__row">
          <td>2.带教医师有充分时间带教吗？</td>
          <td>
            <el-radio v-model="docTeacher1" label="1">1.没有</el-radio>
            <el-radio v-model="docTeacher1" label="2">2.非常少</el-radio>
            <el-radio v-model="docTeacher1" label="3">3.尚可</el-radio>
            <el-radio v-model="docTeacher1" label="4">4.有
            </el-radio>
            <el-radio v-model="docTeacher1" label="5">5.有很多</el-radio>

          </td>
        </tr>
        <tr class="el-table__row">
          <td>3.你对培训基地的有关意见或者建议是否得到基地主任或相关部门的回应？</td>
          <td>
            <el-radio v-model="docTeacher2" label="1">1.没有回应</el-radio>
            <el-radio v-model="docTeacher2" label="2">2.有回应</el-radio>
            <el-radio v-model="docTeacher2" label="3">3.有回应并积极改进基地工作</el-radio>
          </td>
        </tr>
      </table>
      <table class="tableList">
        <tr class="singleTable_tableHead">
          <th width="12%"></th>
          <th width="44%"></th>
          <th width="44%"></th>
        </tr>
        <tr class="el-table__row">
          <td class="cell" rowspan="5">评估</td>
          <td>1.每个轮转之后带教医师对你的培训表现有反馈和评估吗？</td>
          <td>
            <el-radio v-model="evalute" label="1">1.没有</el-radio>
            <el-radio v-model="evalute" label="2">2.偶尔有</el-radio>
            <el-radio v-model="evalute" label="3">3.有</el-radio>

          </td>
        </tr>
        <tr class="el-table__row">
          <td>2.你有机会评估带教医师的教学态度，方法和质量吗？</td>
          <td>
            <el-radio v-model="evalute1" label="1">1.没有</el-radio>
            <el-radio v-model="evalute1" label="2">2.偶尔有</el-radio>
            <el-radio v-model="evalute1" label="3">3.有</el-radio>
          </td>
        </tr>
        <tr class="el-table__row">
          <td>3.你有机会评估基地吗？</td>
          <td>
            <el-radio v-model="evalute2" label="1">1.没有</el-radio>
            <el-radio v-model="evalute2" label="2">2.偶尔有</el-radio>
            <el-radio v-model="evalute2" label="3">3.有</el-radio>
          </td>
        </tr>
        <tr class="el-table__row">
          <td>4.你对基地保密性处理住院医师评估带教老师和基地是否满意？</td>
          <td>
            <el-radio v-model="evalute3" label="1">1.不满意</el-radio>
            <el-radio v-model="evalute3" label="2">2.不太满意</el-radio>
            <el-radio v-model="evalute3" label="3">3.尚可</el-radio>
            <el-radio v-model="evalute3" label="4">4.满意</el-radio>
            <el-radio v-model="evalute3" label="5">5.非常满意</el-radio>
          </td>
        </tr>


      </table>


    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        baseLeader: "",
        baseLeader1: "",
        baseLeader2: "",
        baseEdu: "",
        baseEdu1: "",
        baseEdu2: "",
        baseEdu3: "",
        baseEdu4: "",
        docTeacher: "",
        docTeacher1: "",
        docTeacher2: "",
        evalute: "",
        evalute1: "",
        evalute2: "",
        evalute3: "",
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
  .singleTable_tableHead {
    th {
      height: 0;
    }
  }

  table.tableList {
    table-layout: fixed;
    width: 98%;
    margin: 0 auto 5px auto;
  }

  table.tableList td {
    border: 1px solid #dfe6ec;
    padding: 5px;
  }

  table.tableList td .el-radio {
    margin-left: 15px;
  }

  .singleTable_addBorder {
    margin-top: -1px;
    border-top: 1px solid #dfe6ec;
  }
</style>
