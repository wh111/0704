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
         <!-- <p class="gacSignature">本人签名：</p>
          <p class="gacDay">
            <span>年</span>
            <span>月</span>
            <span>日</span>
          </p>-->
        </div>
        <div class="gaContent">
          <p class="gacTitle">单位意见：</p>
          <el-input type="textarea" :autosize="{ minRows: 4}" v-model="showData.unitComment"></el-input>
          <!--<p class="gacSignature">单位盖章</p>-->
          <!--<p class="gacDay">-->
            <!--<span>年</span>-->
            <!--<span>月</span>-->
            <!--<span>日</span>-->
          <!--</p>-->
        </div>
      </div>
    </div>
    <el-row style="padding:20px 0;">
      <el-col :span="8" :offset="6" align="center">
        <load-btn @listenSubEvent="draft" :btnData="loadBtn"></load-btn>
        <el-button type="success" @click="save('SB')">通过</el-button>
        <el-button type="danger" @click="save('NO_PASS')">不通过</el-button>
      </el-col>
      <el-col :span="2" align="center">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
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
          title: '存为草稿',
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
            // res.data = {
            //   "appraisalId": 123,
            //   "practiceSubject": "实习科目",
            //   "absenceDays": 123,
            //   "sickDays": 1,
            //   "personalDays": 12,
            //   "minerDays": 123,
            //   "selfComment": "自我鉴定",
            //   "fileList": [{
            //     "id": 1,
            //     "fileName": "123",
            //     "fileType": "txt",
            //     "fileUrl": "www.baidu.com"
            //   }]
            // };
//            res.data.unitComment = '';
            this.showData = res.data;
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.appraisalId
          }
        })
      },
      draft(){
        this.listenSubEvent('BC')
      },
      save(type){
        this.listenSubEvent(type)
      },
      // 保存
      listenSubEvent(type) {
        if (!this.showData.appraisalId) {
          return
        }
        this.ajax({
          type: 'add',
          successTitle: '操作成功!',
          errorTitle: '操作失败!',
          ajaxParams: {
            url: api.manageAdd.path + this.showData.appraisalId,
            method: api.manageAdd.method,
            data: {
              comment: this.showData.unitComment,
              czType:type,
            }
          }
        })
      },
      // 取消
      cancel() {
        this.$emit('cancel', 'add')
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
