<!----------------------------------
****--查看(respondentSumAudit_view)
****--@date     2017/9/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <baseView :operailityData="formValidate"></baseView>
  <!--<div>-->
  <!--<el-form :model="operailityData" ref="formValidate" label-width="90px">-->
  <!--<baseView :operailityData="formValidate"></baseView>-->
  <!--<el-row class="table-back-one-d">-->
  <!--<el-col :span="8">-->
  <!--<el-form-item label="状态:">-->
  <!--{{formValidate.resultStatus | dsresultRecord}}-->
  <!--</el-form-item>-->
  <!--</el-col>-->
  <!--</el-row>-->
  <!--</el-form>-->
  <!--</div>-->

</template>
<script>
  /*当前组件必要引入*/
  import api      from '../api.js';
  //  import baseView from '../common/makeOpenReply_base-view.vue';
  import baseView from '../common/makeOpenReply_view';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {
        auditStep: '',
        formValidate: {
//          'id': '',
//          defenseSpecialist: '',//defenseSpecialist
//          'applicantId': '',
//          'name': '',
//          'studentId': '',
//          'boundary': '',
//          'phone': '',
//          'specialtyCode': '',
//          'specialtyName': '',
//          'researchDirection': '',
//          'thesisTitle': '',
//          'status': '',
//          'defenseTime': '',  //答辩时间
//          'defensePlace': '',
//          'isPreDefense': 2,
//          'resultStatus': '2',
//          'attachmentId': '',
//          'fileInfo': {
//            'fileId': '',
//            'fileName': '',
//            'filePath': '',
//            'fileType': ''
//          },
//
//          tutorName: '',//老师名字
//          'memberList': [
//            {
//              'name': '',
//              'positionalTitle': '',
//              'company': ''
//            }
//
//          ],
//          matter: []//办理事项
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
//            url: api.defenseAppResGet.path + this.operailityData.id,
//            params: {}
            url: api.defenseAppGet.path,
            params: {
              userId: this.operailityData.applicantId
            }
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.ajax(this.listMessTitle);
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        if (!data) return;
//        data.matter = [
//          {
//            key: '培养计划',
//            name: data.trainingPlan
//          },
//          {
//            key: '开题申请',
//            name: data.openTopicApplication
//          },
//          {
//            key: '开题报告',
//            name: data.openTopicReport
//          }
//        ];
        this.auditStep = this.auditStepCall(responseData.data.status);
        this.formValidate = data;
      },
      //审核步骤
      auditStepCall (status) {
        let obj = {
          'WSB': '-1',
          'DSH': '0',
          'DSBH': '1',
          'JYSDSH': '2',
          'JYSBH': '3',
          'JYCDSH': '4',
          'JYCBH': '5',
          'TG': '6',
          'MODIFY_END': '-1',
          'AGAIN_END': '-1'
        };
        return obj[status];
      }
    },
    created () {
      Util = this.$util;
      this.init();
    },
    mounted () {
    },
    components: {
      baseView
    }
  };
</script>
