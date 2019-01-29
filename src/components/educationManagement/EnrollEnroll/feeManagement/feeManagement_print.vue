<template>
  <div>
    <print-data>
      <div class="printBPMain">
        <template v-if="jxPrintDatas.length">
          <div class="printBPItem" v-for="(item,index) in jxPrintDatas" :key="index">
            <div class="printMain">
              <p>财务处：</p>
              <div class="printCon">
                请收
                <div>{{ item.workName }}</div>
                单位
                <div>{{ item.userName }}</div>
                同学进修费用共计
                <div>{{ item.paymentAmount }}</div>
                元。
              </div>
              <div class="signature">
                <p>教育处</p>
                <p>日期：</p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="zsPrintDatas.length">
          <div class="printBPItem" v-for="(item,index) in zsPrintDatas" :key="index">
            <div class="printMain">
              <p>财务处：</p>
              <div class="printCon">
                请收
                <div>{{ item.workName }}</div>
                单位
                <div>{{ item.userName }}</div>
                同学住宿费
                <div>{{ item.totalZsCost }}</div>
                元及押金
                <div>{{ item.deposit }}</div>
                元；费用共计
                <div>{{ ((+(item.totalZsCost || 0)) + (+(item.deposit || 0))).toFixed(1) }}</div>
                元。
              </div>
              <div class="signature">
                <p>教育处</p>
                <p>日期：</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </print-data>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import printData from '../../../common/print.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData','printType'],
    data() {
      return {
        subjectsIds: [],
        jxPrintDatas: [],
        zsPrintDatas: [],
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.operailityData.map(item => this.subjectsIds.push(item.subjectsId));
//        this.getPrintData();
//        if(this.printType == 'one'){
//
//        }else if(){
//
//        }
        switch (this.printType){
          case 'one':
            this.getJXPrintData();
            this.getZSPrintData();
            break;
          case 'jx':
            this.getJXPrintData();
            break;
          case 'zs':
            this.getZSPrintData();
            break;
          default:''
        }
      },
      // 进修费
      getJXPrintData() {
        let opt = {
          ajaxSuccess: res => this.jxPrintDatas = res.data || [],
          ajaxParams: {
            url: api.getPaySingle.path + this.subjectsIds.join(','),
            method: api.getPaySingle.method
          }
        };
        this.ajax(opt)
      },
      // 住宿费
      getZSPrintData() {
        let opt = {
          ajaxSuccess: res => this.zsPrintDatas = res.data || [],
          ajaxParams: {
            url: api.getPayZs.path + this.subjectsIds.join(','),
            method: api.getPayZs.method
          }
        };
        this.ajax(opt)
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      printData
    }
  }
</script>
