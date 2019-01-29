<!--
****--结业审核 - 添加
****--@date     2017/7/3
****--@author   gx
-->
<template>
  <div class="graduationAppraisalBox noPosition">
    <div class="graduationAppraisal">
      <h2 class="graduationAppraisalTitle">毕业实习总鉴定</h2>
      <div class="gaMain">
        <div class="gaSubject">共实习科目：
          <p>{{ showData.practiceSubject }}</p>
        </div>
        <div class="gaTimes">
          <div class="gaSumTime">共缺时间：<span>{{ showData.absenceDays }}</span>天</div>
          <div class="gaTimeItem">
            <p>其中病假<span>{{ showData.sickDays }}</span>天；</p>
            <p>其中事假<span>{{ showData.personalDays }}</span>天；</p>
            <p>其中旷实习<span>{{ showData.minerDays }}</span>天</p>
          </div>
        </div>
        <div class="gaContent">
          <p class="gacTitle">附件：</p>
          <upload-file :uploadFiles="showData.fileList" :show="true"></upload-file>
          <!--<p class="gacSignature">本人签名：</p>-->
          <!--<p class="gacDay">-->
          <!--<span>年</span>-->
          <!--<span>月</span>-->
          <!--<span>日</span>-->
          <!--</p>-->
        </div>
        <div class="gaContent">
          <p class="gacTitle">自我鉴定：</p>
          <p class="gacText">{{ showData.selfComment }}</p>
          <!--<p class="gacSignature">本人签名：</p>-->
          <!--<p class="gacDay">-->
            <!--<span>年</span>-->
            <!--<span>月</span>-->
            <!--<span>日</span>-->
          </p>
        </div>
        <div class="gaContent">
          <p class="gacTitle">单位意见：</p>
          <p class="gacText">{{ showData.unitComment }}</p>
          <!--<p class="gacSignature">单位盖章</p>-->
          <!--<p class="gacDay">-->
            <!--<span>年</span>-->
            <!--<span>月</span>-->
            <!--<span>日</span>-->
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  import api from './api';
  export default {
    props: ['operailityData'],
    data() {
      return {
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
        showData: {
          "practiceSubject": "-",
          "absenceDays": '-',
          "sickDays": '-',
          "personalDays": '-',
          "minerDays": '-',
          "selfComment": "",
          "unitComment": ""
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getInfo()
      },
      // 获取结业资料
      getInfo() {
        this.ajax({
          ajaxSuccess: res => {
            this.showData = res.data;
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.appraisalId
          }
        })
      },
    },
    created() {
      this.init();
    },
    mounted() {},
    components: {}
  }

</script>

<style lang="scss">
  @import'../../../../assets/ambuf/css/graduationAppraisal_v1.0/content';

</style>
