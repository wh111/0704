<!--
****--@file     assessmentTable
****--@date     2017/12/8 下午4:14
****--@author   jhd
****--@describe   日常考核表
-->
<template>
  <div class="daily-table">
    <p class="tip">
      <span >住院医师姓名：</span>
      <span class="right" style="margin-right: 150px">轮转科室：</span>
    </p>
    <table>
      <tr>
        <th rowspan="2" width="500px">考核项目</th>
        <th rowspan="2" width="70px">分值</th>
        <th colspan="5" width="70px">得分</th>
      </tr>
      <tr>
        <th width="70px">5</th>
        <th width="70px">4</th>
        <th width="70px">3</th>
        <th width="70px">2</th>
        <th width="70px">1</th>
      </tr>
      <tr>
        <th>是否遵守院纪院规、科室规章制度</th>
        <th>5</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>工作态度是否积极端正</th>
        <th>10</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>临床工作的质量和效率</th>
        <th>15</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>临床思维能力</th>
        <th>15</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>操作技能水平</th>
        <th>15</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>医患沟通能力（有无投诉）</th>
        <th>10</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>团队合作精神</th>
        <th>10</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>组织协调能力</th>
        <th>10</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>应变能力</th>
        <th>5</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>是否遵守院纪院规、科室规章制度</th>
        <th>5</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>自主学习能力</th>
        <th>5</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>总分</th>
        <th>100</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </table>
    <div class="tip">
      <p >科主任：</p>
      <p >带教医师：</p>
      <p >教学秘书：</p>
      <p >护士长：</p>
      <p >填表日期：</p>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {}
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
  .daily-table{
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
