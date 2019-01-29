<!----------------------------------
****--减免申请
****--@date     2017/7/21
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div ref="content" class="rdyReductionApply" style="height: 100%;overflow: auto">
    <div v-if="showType=='applicationNotice'">
      <div class="application-notice">
        本人自愿申请缩减住院医师规范化培训时间，如缩减培训时间后未能按缩减期限通过各类考试，包括培训结业临床技能考试和理论省统考，后果自负。
      </div>

      <div align="center">
        <el-button type="primary" :disabled="countdown!=0" @click="agree">同意{{countdown == 0 ? '' : `(${countdown})`}}
        </el-button>
      </div>
    </div>

    <edit v-else  :info="info" :type="type" showType="USER"></edit>

  </div>
</template>
<script>
  import api from '../../api.js'
  import edit from './rdyReductionApply_edit.vue'
  let Util = null;
  export default {
    data () {
      return {
        api,
        info:{
          "reductionId":"",
          "userId":"",
          "userName":"",
          "sex":"",
          "birth":"",
          "mobile":"",
          "trainingBase":"",
          "rotaryProclass":"",
          "underGraduateSchool":"",
          "underSpecialty":"",
          "masterGraduateSchool":"",
          "masterSpecialty":"",
          "masterType":"KY",
          "doctorGraduateSchool":"",
          "doctorSpecialty":"",
          "doctorType":"KY",
          "experienceHospitalName":"",
          "experienceDepName":"",
          "applyTime":'',
          "applyContent":"本人自愿申请缩减住院医师规范化培训时间，如缩减培训时间后未能按缩减期限通过各类考试，包括培训结业临床技能考试和理论省统考，后果自负。",
          "fileList":[],
          "state":"NO_SUBMIT",
          "applyState":"Y",
          "expertsState":"Y",
          "spState":"Y",
          "spUserName":"",
          "spUserId":"",
          "spTime":"",
          "cutsDetail":{
            "applyState":'',
            'expertsState':'',
            'spState':'',
            "jdName":"",
            "jdRotaryName":"",
            "theoryTestForm":"pen",
            "theoryMark":"",
            "skillMark":"",
            "skillTestForm":"1",
            "basicClinicalSkill":"",
            "testTime":this.conductDate(new Date(),'yyyy-MM-dd'),
            "testResult":"",
            "testExperts":"",
            "oldRotaryAdmrank":"",
            "newRotaryAdmrank":"",
            "cutsContent":"",
            "note":"",
            "createTime":"",
            "createUserName":""
          }
        },
        showType: 'edit',
        countdown:60,
        tabHeight: 0,
        self: this,
        headerContent: {
          showId: {
            id: 'shortNoteId',
            title: '附件'
          },
          editId: {
            id: 'editNoteId',
            title: '审核'
          }
        },
        type:'',
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.info.applyTime=this.conductDate(new Date(),'yyyy-MM-dd')
        console.log(this.info.applyTime)
        console.log(this.$store.state)
        Util = this.$util;
        this.myPages = Util.pageInitPrams;
        this.getUser();
        let time = setInterval(() => {
          if (this.countdown == 0) {
            clearInterval(time)
            return
          }
          this.countdown--
        }, 1000)
      },
      getUser(){
        let opt = {
          ajaxSuccess: (res) => {

            if(res.data.reductionId){
              this.showType='edit';
              if(this.info.state=='PASS'||this.info.state=='NO_PASS'){
                 this.type='show';
              }
              for(var i in res.data){
                this.info[i]=res.data[i];
              }
              let {applyState,expertsState,spState}=this.info.cutsDetail;
              this.info.applyState=applyState;
              this.info.expertsState=expertsState;
              this.info.spState=spState;
            }else {
              this.showType='applicationNotice';
              let temp={
                "userId":"",
                "userName":"",
                "sex":"",
                "birth":"",
                "mobile":"",
                "trainingBase":"",
                "rotaryProclass":"",}
              for(var i in temp){
                this.info[i]=res.data[i];
              }


            }
          },
          ajaxParams: {
            url: api.breaksGetUser.path,
            method:  api.breaksGetUser.method,
          },
        }
        this.ajax(opt)
      },
      agree() {
        this.showType = 'edit'
      },

    },

    created () {
      this.init();
    },
    mounted () {

    },
    components: {
      edit
    }
  };
</script>

<style lang="scss">
  .rdyReductionApply {
    .application-notice {
      max-width: 600px;
      margin: 50px auto;
      font-size: 20px;
      font-weight: 700;
      line-height: 30px;
    }

  }
</style>
