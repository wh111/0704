<template>
  <!-- 缴费查看 -->
  <div>
    <div class="printMain" v-for="(item,index) in printDatas" :key="index">
      <p>财务处：</p>
      <div class="printCon">
        请收
        <div>{{ item.schoolName }}</div>学校
        <div>{{ item.majors || item.major }}</div>专业
        <div>{{ item.userName }}</div>实习费/住宿费
        <div>{{ item.totalCost }}</div>元。
      </div>
      <div class="signature">
        <p>教育处</p>
        <p>日期：</p>
      </div>
    </div>
  </div>
</template>

<script>
  import api from './api';
  export default {
    props: ['operailityData'],
    data() {
      return {
        printDatas: [],
      }
    },
    methods: {
      // 获取查看数据
      getPrintDatas() {
        this.ajax({
          ajaxSuccess: res => this.printDatas = res.data || [],
          ajaxParams: {
            url: api.paymentSliplistByUsers.path,
            method: api.paymentSliplistByUsers.method,
            params: {
              userIds: this.operailityData.userId
            }
          }
        })
      },
    },
    created() {
      this.getPrintDatas()
    }
  }

</script>

<style lang="scss">
  /* 缴费查看 */

  .printMain {
    &,
    p {
      line-height: 2.5;
      font-size: 14px;
    }
    &~.printMain {
      margin-top: 70px;
    }
    .printCon {
      min-height: 5em;
      text-indent: 2em;
      margin: 10px 0 30px 0;
      div {
        padding: 0 60px;
        border-bottom: 1px solid black;
        display: inline;
      }
    }
    .signature {
      text-align: right;
      p {
        padding-right: 120px;
      }
    }
  }

</style>
