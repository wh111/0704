<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div class="uwContentBox">
    <el-row class="uwContent">
      <template v-if="arr.length">
        <div v-for="(item,i) in arr" :key="i">
          <el-col :span="14" class="overflow-txt1">
            【{{ item.types | todoTypes }}】
            <template v-if="contentType === 'handle'">待办事宜</template>
            <template v-else>已办事宜</template>
            - {{ item.content }}
          </el-col>
          <el-col :span="5" :offset="1">{{ (item.times || '-') | formatDate('yyyy-MM-dd') }}</el-col>
          <el-col :span="2" align="right">
            <el-button v-if="contentType === 'handle'" type="text" @click="needTodo(item)">办理</el-button>
            <el-button v-else type="text" @click="lookTodo(item)">查看</el-button>
          </el-col>
        </div>
      </template>
      <p v-else class="uwContentNoDataTips">暂无相关事项</p>
    </el-row>
    <!-- 模态框 办理 -->
    <Modal :mask-closable="false" class="spanModal" v-model="addModal" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <div style="min-height: 200px;position: relative;" v-if="addModal">
        <!-------------轮转管理--start-------------->
        <!-- demo
        <rotarybigcases-push-model-do v-if="todoModelName === 'ROTARYBIGCASES_PUSH_MODEL'" @audit="addSubCallback"
                                      @cancel="addCancel"
                                      :operaility-data="operailityData"></rotarybigcases-push-model-do>
        -->

        <!--答辩申请 DEFENSE_APPLICATION    defenseApplicationDo  defenseApplicationView-->
        <defenseApplicationDo v-if="todoModelName === 'DEFENSE_APPLICATION'" @audit="addSubCallback"
                              @cancel="addCancel"
                              :operaility-data="operailityData"></defenseApplicationDo>

        <!--开题报告 OPEN_TOPI_REPORT   openTopiReportDo  openTopiReportView-->
        <openTopiReportDo v-if="todoModelName === 'OPEN_TOPI_REPORT'" @audit="addSubCallback"
                          @cancel="addCancel"
                          :operaility-data="operailityData"></openTopiReportDo>
        <div style="min-height: 500px" v-if="todoModelName === 'OPEN_TOPI_APPLICATION'">
          <!--开题申请 OPEN_TOPI_APPLICATION  openTopiApplicationDo  openTopiApplicationView-->
          <openTopiApplicationDo v-if="todoModelName === 'OPEN_TOPI_APPLICATION'" @audit="addSubCallback"
                                 @cancel="addCancel"
                                 :operaility-data="operailityData"></openTopiApplicationDo>
        </div>
        <!--奖学金 BURSARY   bursaryDo  bursaryView-->
        <bursaryDo v-if="todoModelName === 'BURSARY'" @audit="addSubCallback"
                   @cancel="addCancel"
                   :operaility-data="operailityData"></bursaryDo>

        <!--评优自荐 APPRAISING_SELLONESELF    appraisingSelloneselfDo  appraisingSelloneselfView-->
        <appraisingSelloneselfDo v-if="todoModelName === 'APPRAISING_SELLONESELF'" @audit="addSubCallback"
                                 @cancel="addCancel"
                                 :operaility-data="operailityData"></appraisingSelloneselfDo>

        <!--出科鉴定学生推送类型	DEPEXAMINATION_SELF_PUSH_MODEL    depexaminationSelfPushModelDo  depexaminationSelfPushModelView-->
        <depexaminationSelfPushModelDo v-if="todoModelName === 'DEPEXAMINATION_SELF_PUSH_MODEL'" @audit="addSubCallback"
                                       @cancel="addCancel" @rotary="addSubCallback"
                                       :operaility-data="operailityData"></depexaminationSelfPushModelDo>

        <!--出科鉴定推送类型	 DEPEXAMINATION_PUSH_MODEL        depexaminationPushModelDo   depexaminationPushModelView-->
        <depexaminationPushModelDo v-if="todoModelName === 'DEPEXAMINATION_PUSH_MODEL'" @audit="addSubCallback"
                                   @cancel="addCancel" @rotary="addSubCallback" work="true"
                                   :operaility-data="operailityData"></depexaminationPushModelDo>

        <!--出科鉴定老师推送类型	DEPEXAMINATION_TEACHCER_PUSH_MODEL   depexaminationTeachcerPushModelDo   depexaminationTeachcerPushModelView-->
        <depexaminationTeachcerPushModelDo v-if="todoModelName === 'DEPEXAMINATION_TEACHCER_PUSH_MODEL'"
                                           @rotary="addSubCallback"
                                           @cancel="addCancel"
                                           :operaility-data="operailityData"></depexaminationTeachcerPushModelDo>

        <!--奖惩记录 REWARD   rewardDo   rewardView-->
        <rewardDo v-if="todoModelName === 'REWARD'" @audit="addSubCallback"
                  @cancel="addCancel"
                  :operaility-data="operailityData"></rewardDo>

        <!--预约代办事宜	RESERVE  reserveDo   reserveView-->
        <reserveDo v-if="todoModelName === 'RESERVE'"
                   @cancel="addCancel" @add="addSubCallback"
                   :operaility-data="operailityData"></reserveDo>

        <!--培养计划	TRAINING   trainingDo    trainingView-->
        <trainingDo v-if="todoModelName === 'TRAINING'" @audit="addSubCallback"
                    @cancel="addCancel"
                    :operaility-data="operailityData"></trainingDo>

        <!--毕业	GRADUATION     graduationDo    graduationView-->
        <graduationDo v-if="todoModelName === 'GRADUATION'" @audit="addSubCallback"
                      @cancel="addCancel"
                      :operaility-data="operailityData"></graduationDo>

        <!--科室主任大出科鉴定推送类型	BIG_DEPEXAMINATION_DEP_PUSH_MODEL    bigDepexaminationDepPushModelDo  bigDepexaminationDepPushModelView-->
        <bigDepexaminationDepPushModelDo v-if="todoModelName === 'BIG_DEPEXAMINATION_DEP_PUSH_MODEL'"
                                         @add="addSubCallback"
                                         @cancel="addCancel" :url="api"
                                         :operaility-data="operailityData"></bigDepexaminationDepPushModelDo>

        <!--病种推送类型	DISEASERECORD_PUSH_MODEL    diseaserecordPushModelDo   diseaserecordPushModelView-->
        <diseaserecordPushModelDo v-if="todoModelName === 'DISEASERECORD_PUSH_MODEL'" @audit="addSubCallback"
                                  @cancel="addCancel" :url="api" @add="addSubCallback"
                                  :operaility-data="operailityData"></diseaserecordPushModelDo>

        <!--技能推送类型	SKILLRECORD_PUSH_MODEL    skillrecordPushModelDo    skillrecordPushModelView-->
        <skillrecordPushModelDo v-if="todoModelName === 'SKILLRECORD_PUSH_MODEL'" @audit="addSubCallback"
                                @cancel="addCancel" :url="api" @add="addSubCallback"
                                :operaility-data="operailityData"></skillrecordPushModelDo>

        <!--病种审核消息推送至申请人类型	DISEASE_RECORD_PUSHTOUSER_MODEL   diseaseRecordPushtouserModelDo   diseaseRecordPushtouserModelView-->
        <diseaseRecordPushtouserModelDo v-if="todoModelName === 'DISEASE_RECORD_PUSHTOUSER_MODEL'"
                                        @audit="addSubCallback" @add="addSubCallback"
                                        @cancel="addCancel" :url="api"
                                        :operaility-data="operailityData"></diseaseRecordPushtouserModelDo>

        <!--技能审核消息推送至申请人类型 	SKILLRECORD_PUSHTOUSER_MODEL    skillrecordPushtouserModelDo   skillrecordPushtouserModelView-->
        <skillrecordPushtouserModelDo v-if="todoModelName === 'SKILLRECORD_PUSHTOUSER_MODEL'" @audit="addSubCallback"
                                      @cancel="addCancel" :url="api" @add="addSubCallback"
                                      :operaility-data="operailityData"></skillrecordPushtouserModelDo>

        <!--大病历审核消息推送至申请人类型	BIG_CASE_PUSHTOUSER_MODEL    bigCasePushtouserModelDo    bigCasePushtouserModelView-->
        <bigCasePushtouserModelDo v-if="todoModelName === 'BIG_CASE_PUSHTOUSER_MODEL'" @audit="addSubCallback"
                                  @cancel="addCancel" :url="api" @add="addSubCallback"
                                  :operaility-data="operailityData"></bigCasePushtouserModelDo>

        <!--抢救记录审核消息推送至申请人类型	PATIENT_RECORD_PUSHTOUSER_MODEL   patientRecordPushtouserModelDo   patientRecordPushtouserModelView-->
        <patientRecordPushtouserModelDo v-if="todoModelName === 'PATIENT_RECORD_PUSHTOUSER_MODEL'"
                                        @audit="addSubCallback" @add="addSubCallback"
                                        :url="api" @cancel="addCancel"
                                        :operaility-data="operailityData"></patientRecordPushtouserModelDo>

        <!--专题综述记录审核消息推送至申请人类型	THEMATIC_REVIEW_PUSHTOUSER_MODEL   thematicReviewPushtouserModelDo   thematicReviewPushtouserModelView-->
        <thematicReviewPushtouserModelDo v-if="todoModelName === 'THEMATIC_REVIEW_PUSHTOUSER_MODEL'"
                                         @audit="addSubCallback" @add="addSubCallback"
                                         @cancel="addCancel" :url="api"
                                         :operaility-data="operailityData"></thematicReviewPushtouserModelDo>

        <!--调查报告记录审核消息推送至申请人类型	MEDICAL_ETHICS_PUSHTOUSER_MODEL   medicalEthicsPushtouserModelDo    medicalEthicsPushtouserModelView-->
        <medicalEthicsPushtouserModelDo v-if="todoModelName === 'MEDICAL_ETHICS_PUSHTOUSER_MODEL'"
                                        @audit="addSubCallback" @add="addSubCallback"
                                        @cancel="addCancel" :url="api"
                                        :operaility-data="operailityData"></medicalEthicsPushtouserModelDo>

        <!--科研日志记录审核消息推送至申请人类型	SCIENTIFIC_RESEARCH_PUSHTOUSER_MODEL   scientificResearchPushtouserModelDo   scientificResearchPushtouserModelView-->
        <scientificResearchPushtouserModelDo v-if="todoModelName === 'SCIENTIFIC_RESEARCH_PUSHTOUSER_MODEL'"
                                             @audit="addSubCallback" @add="addSubCallback"
                                             @cancel="addCancel" :url="api"
                                             :operaility-data="operailityData"></scientificResearchPushtouserModelDo>

        <!--手术操作记录审核类型消息推送至申请人类型	ROTARY_SSCZ_PUSHTOUSER_MODEL   rotarySsczPushtouserModelDo   rotarySsczPushtouserModelView-->
        <rotarySsczPushtouserModelDo v-if="todoModelName === 'ROTARY_SSCZ_PUSHTOUSER_MODEL'" @audit="addSubCallback"
                                     @cancel="addCancel" :url="api" @add="addSubCallback"
                                     :operaility-data="operailityData"></rotarySsczPushtouserModelDo>

        <!--延期出科申请审核类型消息推送至申请人类型	DELAY_GIVEN_PUSHTOUSER_MODEL   delayGivenPushtouserModelDo   delayGivenPushtouserModelView-->
        <delayGivenPushtouserModelDo v-if="todoModelName === 'DELAY_GIVEN_PUSHTOUSER_MODEL'" @audit="addSubCallback"
                                     @cancel="addCancel" :url="api" @add="addSubCallback"
                                     :operaility-data="operailityData"></delayGivenPushtouserModelDo>

        <!--结业申请审核类型消息推送至申请人类型	PERSONAL_APPRAISAL_PUSHTOUSER_MODEL   personalAppraisalPushtouserModelDo   personalAppraisalPushtouserModelView-->
        <personalAppraisalPushtouserModelDo v-if="todoModelName === 'PERSONAL_APPRAISAL_PUSHTOUSER_MODEL'"
                                            @audit="addSubCallback" @add="addSubCallback"
                                            @cancel="addCancel" :url="api"
                                            :operaility-data="operailityData"></personalAppraisalPushtouserModelDo>

        <!--出科申请审核消息推送至申请人类型	DEP_COMMENT_PUSHTOUSER_MODEL   depCommentPushtouserModelDo   depCommentPushtouserModelView-->
        <depCommentPushtouserModelDo v-if="todoModelName === 'DEP_COMMENT_PUSHTOUSER_MODEL'" @audit="addSubCallback"
                                     @cancel="addCancel" :url="api" @add="addSubCallback"
                                     :operaility-data="operailityData"></depCommentPushtouserModelDo>

        <!--阶段考核申请审核消息推送至申请人类型	BIG_DEP_COMMENT_PUSHTOUSER_MODEL    bigDepCommentPushtouserModelDo   bigDepCommentPushtouserModelView-->
        <bigDepCommentPushtouserModelDo v-if="todoModelName === 'BIG_DEP_COMMENT_PUSHTOUSER_MODEL'"
                                        @audit="addSubCallback" @add="addSubCallback"
                                        @cancel="addCancel" :url="api"
                                        :operaility-data="operailityData"></bigDepCommentPushtouserModelDo>

        <!--手术操作推送类型	SURGERY_OPERATION_PUSH_MODEL    surgeryOperationPushModelDo   surgeryOperationPushModelView-->
        <surgeryOperationPushModelDo v-if="todoModelName === 'SURGERY_OPERATION_PUSH_MODEL'" @audit="addSubCallback"
                                     @cancel="addCancel" :url="api" @add="addSubCallback"
                                     :operaility-data="operailityData"></surgeryOperationPushModelDo>

        <!--临床操作推送类型	ROTARY_CLINICALRECORD_PUSH_MODEL    rotaryClinicalrecordPushModelDo   rotaryClinicalrecordPushModelView-->
        <rotaryClinicalrecordPushModelDo v-if="todoModelName === 'ROTARY_CLINICALRECORD_PUSH_MODEL'"
                                         @audit="addSubCallback" @add="addSubCallback"
                                         @cancel="addCancel" :url="api"
                                         :operaility-data="operailityData"></rotaryClinicalrecordPushModelDo>

        <!--管床记录推送类型	 ROTARY_TUBEBED_RECORD_PUSH_MODEL    rotaryTubebedRecordPushModelDo   rotaryTubebedRecordPushModelView-->
        <rotaryTubebedRecordPushModelDo v-if="todoModelName === 'ROTARY_TUBEBED_RECORD_PUSH_MODEL'"
                                        @audit="addSubCallback" @add="addSubCallback"
                                        @cancel="addCancel" :url="api"
                                        :operaility-data="operailityData"></rotaryTubebedRecordPushModelDo>

        <!--参加抢救危重病人记录推送类型 	ROTARY_RESCUE_PATIENT_RECORD_PUSH_MODEL    rotaryRescuePatientRecordPushModelDo    rotaryRescuePatientRecordPushModelView-->
        <rotaryRescuePatientRecordPushModelDo v-if="todoModelName === 'ROTARY_RESCUE_PATIENT_RECORD_PUSH_MODEL'"
                                              @audit="addSubCallback" @add="addSubCallback"
                                              @cancel="addCancel" :url="api"
                                              :operaility-data="operailityData"></rotaryRescuePatientRecordPushModelDo>

        <!--教学活动推送类型	 TEACHACTIVITY_PUSH_MODEL   teachactivityPushModelDo   teachactivityPushModelView-->
        <teachactivityPushModelDo v-if="todoModelName === 'TEACHACTIVITY_PUSH_MODEL'" @audit="addSubCallback"
                                  @cancel="addCancel" :url="api" @add="addSubCallback"
                                  :operaility-data="operailityData"></teachactivityPushModelDo>

        <!--请假推送类型	LEAVE_PUSH_MODEL    leavePushModelDo  leavePushModelView-->
        <leavePushModelDo v-if="todoModelName === 'LEAVE_PUSH_MODEL'" @audit="addSubCallback"
                          @cancel="addCancel" :url="api" @add="addSubCallback"
                          :operaility-data="operailityData"></leavePushModelDo>

        <!--考情推送类型	CLOCK_REMIND    clockRemindDo   clockRemindView-->
        <clockRemindDo v-if="todoModelName === 'CLOCK_REMIND'" @audit="addSubCallback"
                       @cancel="addCancel" :url="api" @add="addSubCallback"
                       :operaility-data="operailityData"></clockRemindDo>

        <!--学术会议	CONFERENCE_PUSH_MODEL    conferencePushModelDo   conferencePushModelView-->
        <conferencePushModelDo v-if="todoModelName === 'CONFERENCE_PUSH_MODEL'" @audit="addSubCallback"
                               @cancel="addCancel" :url="api" @add="addSubCallback"
                               :operaility-data="operailityData"></conferencePushModelDo>

        <!--外出进修	OUTSTUDY_PUSH_MODEL   outstudyPushModelDo   outstudyPushModelView-->
        <outstudyPushModelDo v-if="todoModelName === 'OUTSTUDY_PUSH_MODEL'" @audit="addSubCallback"
                             @cancel="addCancel" :url="api" @add="addSubCallback"
                             :operaility-data="operailityData"></outstudyPushModelDo>

        <!--外出进修申请	OUTSTUDY_PUSH_APPLY_MODEL    outstudyPushApplyModelDo    outstudyPushApplyModelView-->
        <outstudyPushApplyModelDo v-if="todoModelName === 'OUTSTUDY_PUSH_APPLY_MODEL'" @audit="addSubCallback"
                                  @cancel="addCancel" :url="api" @add="addSubCallback"
                                  :operaility-data="operailityData"></outstudyPushApplyModelDo>

        <!--外出进修汇报	OUTSTUDY_PUSH_REPORT_MODEL    outstudyPushReportModelDo   outstudyPushReportModelView-->
        <outstudyPushReportModelDo v-if="todoModelName === 'OUTSTUDY_PUSH_REPORT_MODEL'" @audit="addSubCallback"
                                   @add="addSubCallback"
                                   @cancel="addCancel" :url="api"
                                   :operaility-data="operailityData"></outstudyPushReportModelDo>

        <!--专题概述推送类型	 ROTARY_THEMATIC_REVIEW_MODEL    rotaryThematicReviewModelDo   rotaryThematicReviewModelView-->
        <rotaryThematicReviewModelDo v-if="todoModelName === 'ROTARY_THEMATIC_REVIEW_MODEL'" @audit="addSubCallback"
                                     @cancel="addCancel" :url="api" @add="addSubCallback"
                                     :operaility-data="operailityData"></rotaryThematicReviewModelDo>

        <!--阶段考核申请个人小结类型	ROTARY_BIGDEP_EXAM_MODEL    rotaryBigdepExamModelDo   rotaryBigdepExamModelView-->
        <rotaryBigdepExamModelDo v-if="todoModelName === 'ROTARY_BIGDEP_EXAM_MODEL'" @audit="addSubCallback"
                                 @cancel="addCancel" :url="api" @add="addSubCallback"
                                 :operaility-data="operailityData"></rotaryBigdepExamModelDo>

        <!--结业鉴定个人小结推送类型	ROTARY_GRADUATION_APPRSISE_MODEL    rotaryGraduationApprsiseModelDo   rotaryGraduationApprsiseModelView-->
        <rotaryGraduationApprsiseModelDo v-if="todoModelName === 'ROTARY_GRADUATION_APPRSISE_MODEL'"
                                         @add="addSubCallback"
                                         @cancel="addCancel" :url="api"
                                         :operaility-data="operailityData"></rotaryGraduationApprsiseModelDo>

        <!--科研日志推送类型	 ROTARY_SCIENTIFIC_RESEARCH_MODEL    rotaryScientificResearchModelDo   rotaryScientificResearchModelView-->
        <rotaryScientificResearchModelDo v-if="todoModelName === 'ROTARY_SCIENTIFIC_RESEARCH_MODEL'"
                                         @audit="addSubCallback" @add="addSubCallback"
                                         @cancel="addCancel" :url="api"
                                         :operaility-data="operailityData"></rotaryScientificResearchModelDo>

        <!--调查报告推送类型 	ROTARY_SURVEYEMPIRICAL_MODEL    rotarySurveyempiricalModelDo   rotarySurveyempiricalModelView-->
        <rotarySurveyempiricalModelDo v-if="todoModelName === 'ROTARY_SURVEYEMPIRICAL_MODEL'" @audit="addSubCallback"
                                      @cancel="addCancel" :url="api" @add="addSubCallback"
                                      :operaility-data="operailityData"></rotarySurveyempiricalModelDo>

        <!--大病历推送类型	 ROTARYBIGCASES_PUSH_MODEL    rotarybigcasesPushModelDo   rotarybigcasesPushModelView-->
        <rotarybigcasesPushModelDo v-if="todoModelName === 'ROTARYBIGCASES_PUSH_MODEL'" @audit="addSubCallback"
                                   @cancel="addCancel" :url="api" @add="addSubCallback"
                                   :operaility-data="operailityData"></rotarybigcasesPushModelDo>

        <!--经典病历推送类型	 ROTARY_CLASSIC_BIGCASES_PUSH_MODEL    rotaryClassicBigcasesPushModelDo   rotaryClassicBigcasesPushModelView-->
        <rotaryClassicBigcasesPushModelDo v-if="todoModelName === 'ROTARY_CLASSIC_BIGCASES_PUSH_MODEL'"
                                          @audit="addSubCallback" @add="addSubCallback"
                                          @cancel="addCancel" :url="api"
                                          :operaility-data="operailityData"></rotaryClassicBigcasesPushModelDo>

        <!--职业暴露 DAILY_OCCUPATIONALEXPOSURE   dailyOccupationalexposureDo   dailyOccupationalexposureView-->
        <dailyOccupationalexposureDo v-if="todoModelName === 'DAILY_OCCUPATIONALEXPOSURE'" @audit="addSubCallback"
                                     @cancel="addCancel" @add="addSubCallback"
                                     :operaility-data="operailityData"></dailyOccupationalexposureDo>

        <!--职业暴露报销审核 DAILY_OCCUPATIONALEXPOSURE_REIMBURSEMENT  dailyOccupationalexposureReimbursementDo   dailyOccupationalexposureView-->
        <dailyOccupationalexposureReimbursementDo v-if="todoModelName === 'DAILY_OCCUPATIONALEXPOSURE_REIMBURSEMENT'"
                                                  @expenseAudit="addSubCallback"
                                                  @cancel="addCancel"
                                                  :operaility-data="operailityData"></dailyOccupationalexposureReimbursementDo>

        <!--职业暴露体检报告审核 DAILY_OCCUPATIONALEXPOSURE_REPORT dailyOccupationalexposureReportDo   dailyOccupationalexposureView-->
        <dailyOccupationalexposureReportDo v-if="todoModelName === 'DAILY_OCCUPATIONALEXPOSURE_REPORT'"
                                           @medicalAudit="addSubCallback"
                                           @cancel="addCancel"
                                           :operaility-data="operailityData"></dailyOccupationalexposureReportDo>
        <!-- 研究生开题报告 -->
        <yjs-opentopic v-if="todoModelName === 'OPENTOPIC'" @view="subCallback" view="work" :operaility-data="operailityData"></yjs-opentopic>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看 -->
    <Modal :mask-closable="false" class="spanModal" v-model="showModal" class-name="vertical-center-modal"
           :loading="true"
           :width="1000">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <div style="min-height: 200px;position: relative;" v-if="showModal">
        <!-------------轮转管理--start-------------->
        <!-- demo
        <rotarybigcases-push-model v-if="todoModelName === 'ROTARYBIGCASES_PUSH_MODEL'" @cancel="cancel"
                                   :operaility-data="operailityData"></rotarybigcases-push-model>
        -->
        <!--答辩申请 DEFENSE_APPLICATION    defenseApplicationDo  defenseApplicationView-->
        <defenseApplicationView v-if="todoModelName === 'DEFENSE_APPLICATION'"
                                @cancel="cancel" :url="api"
                                :operaility-data="operailityData"></defenseApplicationView>

        <!--开题报告 OPEN_TOPI_REPORT   openTopiReportDo  openTopiReportView-->
        <openTopiReportView v-if="todoModelName === 'OPEN_TOPI_REPORT'"
                            @cancel="cancel" :url="api"
                            :operaility-data="operailityData"></openTopiReportView>

        <!--开题申请 OPEN_TOPI_APPLICATION  openTopiApplicationDo  openTopiApplicationView-->
        <openTopiApplicationView v-if="todoModelName === 'OPEN_TOPI_APPLICATION'"
                                 @cancel="cancel" :url="api"
                                 :operaility-data="operailityData"></openTopiApplicationView>

        <!--奖学金 BURSARY   bursaryDo  bursaryView-->
        <bursaryView v-if="todoModelName === 'BURSARY'"
                     @cancel="cancel" :url="api"
                     :operaility-data="operailityData"></bursaryView>

        <!--评优自荐 APPRAISING_SELLONESELF    appraisingSelloneselfDo  appraisingSelloneselfView-->
        <appraisingSelloneselfView v-if="todoModelName === 'APPRAISING_SELLONESELF'"
                                   @cancel="cancel" :url="api"
                                   :operaility-data="operailityData"></appraisingSelloneselfView>

        <!--出科鉴定学生推送类型	DEPEXAMINATION_SELF_PUSH_MODEL    depexaminationSelfPushModelDo  depexaminationSelfPushModelView-->
        <depexaminationSelfPushModelView v-if="todoModelName === 'DEPEXAMINATION_SELF_PUSH_MODEL'"
                                         @cancel="cancel" :url="api"
                                         :operaility-data="operailityData"></depexaminationSelfPushModelView>

        <!--出科鉴定推送类型	 DEPEXAMINATION_PUSH_MODEL        depexaminationPushModelDo   depexaminationPushModelView-->
        <depexaminationPushModelView v-if="todoModelName === 'DEPEXAMINATION_PUSH_MODEL'"
                                     @cancel="cancel" :url="api" viewByPodId="true"
                                     :operaility-data="operailityData"></depexaminationPushModelView>

        <!--出科鉴定老师推送类型	DEPEXAMINATION_TEACHCER_PUSH_MODEL   depexaminationTeachcerPushModelDo   depexaminationTeachcerPushModelView-->
        <depexaminationTeachcerPushModelView v-if="todoModelName === 'DEPEXAMINATION_TEACHCER_PUSH_MODEL'"
                                             @cancel="cancel" :url="api"
                                             :operaility-data="operailityData"></depexaminationTeachcerPushModelView>

        <!--奖惩记录 REWARD   rewardDo   rewardView-->
        <rewardView v-if="todoModelName === 'REWARD'"
                    @cancel="cancel" :url="api"
                    :operaility-data="operailityData"></rewardView>

        <!--预约代办事宜	RESERVE  reserveDo   reserveView-->
        <reserveView v-if="todoModelName === 'RESERVE'"
                     @cancel="cancel" :url="api"
                     :operaility-data="operailityData"></reserveView>

        <!--培养计划	TRAINING   trainingDo    trainingView-->
        <trainingView v-if="todoModelName === 'TRAINING'"
                      @cancel="cancel" :url="api"
                      :operaility-data="operailityData"></trainingView>

        <!--毕业	GRADUATION     graduationDo    graduationView-->
        <graduationView v-if="todoModelName === 'GRADUATION'"
                        @cancel="cancel" :url="api"
                        :operaility-data="operailityData"></graduationView>

        <!--科室主任大出科鉴定推送类型	BIG_DEPEXAMINATION_DEP_PUSH_MODEL    bigDepexaminationDepPushModelDo  bigDepexaminationDepPushModelView-->
        <bigDepexaminationDepPushModelView v-if="todoModelName === 'BIG_DEPEXAMINATION_DEP_PUSH_MODEL'"
                                           @cancel="cancel" :url="api"
                                           :operaility-data="operailityData"></bigDepexaminationDepPushModelView>

        <!--病种推送类型	DISEASERECORD_PUSH_MODEL    diseaserecordPushModelDo   diseaserecordPushModelView-->
        <diseaserecordPushModelView v-if="todoModelName === 'DISEASERECORD_PUSH_MODEL'"
                                    @cancel="cancel" :url="api"
                                    :operaility-data="operailityData"></diseaserecordPushModelView>

        <!--技能推送类型	SKILLRECORD_PUSH_MODEL    skillrecordPushModelDo    skillrecordPushModelView-->
        <skillrecordPushModelView v-if="todoModelName === 'SKILLRECORD_PUSH_MODEL'"
                                  @cancel="cancel" :url="api"
                                  :operaility-data="operailityData"></skillrecordPushModelView>

        <!--病种审核消息推送至申请人类型	DISEASE_RECORD_PUSHTOUSER_MODEL   diseaseRecordPushtouserModelDo   diseaseRecordPushtouserModelView-->
        <diseaseRecordPushtouserModelView v-if="todoModelName === 'DISEASE_RECORD_PUSHTOUSER_MODEL'"
                                          @cancel="cancel" :url="api"
                                          :operaility-data="operailityData"></diseaseRecordPushtouserModelView>

        <!--技能审核消息推送至申请人类型 	SKILLRECORD_PUSHTOUSER_MODEL    skillrecordPushtouserModelDo   skillrecordPushtouserModelView-->
        <skillrecordPushtouserModelView v-if="todoModelName === 'SKILLRECORD_PUSHTOUSER_MODEL'"
                                        @cancel="cancel" :url="api"
                                        :operaility-data="operailityData"></skillrecordPushtouserModelView>

        <!--大病历审核消息推送至申请人类型	BIG_CASE_PUSHTOUSER_MODEL    bigCasePushtouserModelDo    bigCasePushtouserModelView-->
        <bigCasePushtouserModelView v-if="todoModelName === 'BIG_CASE_PUSHTOUSER_MODEL'"
                                    @cancel="cancel" :url="api"
                                    :operaility-data="operailityData"></bigCasePushtouserModelView>

        <!--抢救记录审核消息推送至申请人类型	PATIENT_RECORD_PUSHTOUSER_MODEL   patientRecordPushtouserModelDo   patientRecordPushtouserModelView-->
        <patientRecordPushtouserModelView v-if="todoModelName === 'PATIENT_RECORD_PUSHTOUSER_MODEL'"
                                          @cancel="cancel" :url="api"
                                          :operaility-data="operailityData"></patientRecordPushtouserModelView>

        <!--专题综述记录审核消息推送至申请人类型	THEMATIC_REVIEW_PUSHTOUSER_MODEL   thematicReviewPushtouserModelDo   thematicReviewPushtouserModelView-->
        <thematicReviewPushtouserModelView v-if="todoModelName === 'THEMATIC_REVIEW_PUSHTOUSER_MODEL'"
                                           @cancel="cancel" :url="api"
                                           :operaility-data="operailityData"></thematicReviewPushtouserModelView>

        <!--调查报告记录审核消息推送至申请人类型	MEDICAL_ETHICS_PUSHTOUSER_MODEL   medicalEthicsPushtouserModelDo    medicalEthicsPushtouserModelView-->
        <medicalEthicsPushtouserModelView v-if="todoModelName === 'MEDICAL_ETHICS_PUSHTOUSER_MODEL'"
                                          @cancel="cancel" :url="api"
                                          :operaility-data="operailityData"></medicalEthicsPushtouserModelView>

        <!--科研日志记录审核消息推送至申请人类型	SCIENTIFIC_RESEARCH_PUSHTOUSER_MODEL   scientificResearchPushtouserModelDo   scientificResearchPushtouserModelView-->
        <scientificResearchPushtouserModelView v-if="todoModelName === 'SCIENTIFIC_RESEARCH_PUSHTOUSER_MODEL'"
                                               @cancel="cancel" :url="api"
                                               :operaility-data="operailityData"></scientificResearchPushtouserModelView>

        <!--手术操作记录审核类型消息推送至申请人类型	ROTARY_SSCZ_PUSHTOUSER_MODEL   rotarySsczPushtouserModelDo   rotarySsczPushtouserModelView-->
        <rotarySsczPushtouserModelView v-if="todoModelName === 'ROTARY_SSCZ_PUSHTOUSER_MODEL'"
                                       @cancel="cancel" :url="api"
                                       :operaility-data="operailityData"></rotarySsczPushtouserModelView>

        <!--延期出科申请审核类型消息推送至申请人类型	DELAY_GIVEN_PUSHTOUSER_MODEL   delayGivenPushtouserModelDo   delayGivenPushtouserModelView-->
        <delayGivenPushtouserModelView v-if="todoModelName === 'DELAY_GIVEN_PUSHTOUSER_MODEL'"
                                       @cancel="cancel" :url="api"
                                       :operaility-data="operailityData"></delayGivenPushtouserModelView>

        <!--结业申请审核类型消息推送至申请人类型	PERSONAL_APPRAISAL_PUSHTOUSER_MODEL   personalAppraisalPushtouserModelDo   personalAppraisalPushtouserModelView-->
        <personalAppraisalPushtouserModelView v-if="todoModelName === 'PERSONAL_APPRAISAL_PUSHTOUSER_MODEL'"
                                              @cancel="cancel" :url="api"
                                              :operaility-data="operailityData"></personalAppraisalPushtouserModelView>

        <!--出科申请审核消息推送至申请人类型	DEP_COMMENT_PUSHTOUSER_MODEL   depCommentPushtouserModelDo   depCommentPushtouserModelView-->
        <depCommentPushtouserModelView v-if="todoModelName === 'DEP_COMMENT_PUSHTOUSER_MODEL'"
                                       @cancel="cancel" :url="api"
                                       :operaility-data="operailityData"></depCommentPushtouserModelView>

        <!--阶段考核申请审核消息推送至申请人类型	BIG_DEP_COMMENT_PUSHTOUSER_MODEL    bigDepCommentPushtouserModelDo   bigDepCommentPushtouserModelView-->
        <bigDepCommentPushtouserModelView v-if="todoModelName === 'BIG_DEP_COMMENT_PUSHTOUSER_MODEL'"
                                          @cancel="cancel" :url="api"
                                          :operaility-data="operailityData"></bigDepCommentPushtouserModelView>

        <!--手术操作推送类型	SURGERY_OPERATION_PUSH_MODEL    surgeryOperationPushModelDo   surgeryOperationPushModelView-->
        <surgeryOperationPushModelView v-if="todoModelName === 'SURGERY_OPERATION_PUSH_MODEL'"
                                       @cancel="cancel" :url="api"
                                       :operaility-data="operailityData"></surgeryOperationPushModelView>

        <!--临床操作推送类型	ROTARY_CLINICALRECORD_PUSH_MODEL    rotaryClinicalrecordPushModelDo   rotaryClinicalrecordPushModelView-->
        <rotaryClinicalrecordPushModelView v-if="todoModelName === 'ROTARY_CLINICALRECORD_PUSH_MODEL'"
                                           @cancel="cancel" :url="api"
                                           :operaility-data="operailityData"></rotaryClinicalrecordPushModelView>

        <!--管床记录推送类型	 ROTARY_TUBEBED_RECORD_PUSH_MODEL    rotaryTubebedRecordPushModelDo   rotaryTubebedRecordPushModelView-->
        <rotaryTubebedRecordPushModelView v-if="todoModelName === 'ROTARY_TUBEBED_RECORD_PUSH_MODEL'"
                                          @cancel="cancel" :url="api"
                                          :operaility-data="operailityData"></rotaryTubebedRecordPushModelView>

        <!--参加抢救危重病人记录推送类型 	ROTARY_RESCUE_PATIENT_RECORD_PUSH_MODEL    rotaryRescuePatientRecordPushModelDo    rotaryRescuePatientRecordPushModelView-->
        <rotaryRescuePatientRecordPushModelView v-if="todoModelName === 'ROTARY_RESCUE_PATIENT_RECORD_PUSH_MODEL'"
                                                @cancel="cancel" :url="api"
                                                :operaility-data="operailityData"></rotaryRescuePatientRecordPushModelView>

        <!--教学活动推送类型	 TEACHACTIVITY_PUSH_MODEL   teachactivityPushModelDo   teachactivityPushModelView-->
        <teachactivityPushModelView v-if="todoModelName === 'TEACHACTIVITY_PUSH_MODEL'"
                                    @cancel="cancel" :url="api"
                                    :operaility-data="operailityData"></teachactivityPushModelView>

        <!--请假推送类型	LEAVE_PUSH_MODEL    leavePushModelDo  leavePushModelView-->
        <leavePushModelView v-if="todoModelName === 'LEAVE_PUSH_MODEL'"
                            @cancel="cancel" :url="api"
                            :operaility-data="operailityData"></leavePushModelView>

        <!--考情推送类型	CLOCK_REMIND    clockRemindDo   clockRemindView-->
        <clockRemindView v-if="todoModelName === 'CLOCK_REMIND'"
                         @cancel="cancel" :url="api"
                         :operaility-data="operailityData"></clockRemindView>

        <!--学术会议	CONFERENCE_PUSH_MODEL    conferencePushModelDo   conferencePushModelView-->
        <conferencePushModelView v-if="todoModelName === 'CONFERENCE_PUSH_MODEL'"
                                 @cancel="cancel" :url="api"
                                 :operaility-data="operailityData"></conferencePushModelView>

        <!--外出进修	OUTSTUDY_PUSH_MODEL   outstudyPushModelDo   outstudyPushModelView-->
        <outstudyPushModelView v-if="todoModelName === 'OUTSTUDY_PUSH_MODEL'"
                               @cancel="cancel" :url="api"
                               :operaility-data="operailityData"></outstudyPushModelView>

        <!--外出进修申请	OUTSTUDY_PUSH_APPLY_MODEL    outstudyPushApplyModelDo    outstudyPushApplyModelView-->
        <outstudyPushApplyModelView v-if="todoModelName === 'OUTSTUDY_PUSH_APPLY_MODEL'"
                                    @cancel="cancel" :url="api"
                                    :operaility-data="operailityData"></outstudyPushApplyModelView>

        <!--外出进修汇报	OUTSTUDY_PUSH_REPORT_MODEL    outstudyPushReportModelDo   outstudyPushReportModelView-->
        <outstudyPushReportModelView v-if="todoModelName === 'OUTSTUDY_PUSH_REPORT_MODEL'"
                                     @cancel="cancel" :url="api"
                                     :operaility-data="operailityData"></outstudyPushReportModelView>

        <!--专题概述推送类型	 ROTARY_THEMATIC_REVIEW_MODEL    rotaryThematicReviewModelDo   rotaryThematicReviewModelView-->
        <rotaryThematicReviewModelView v-if="todoModelName === 'ROTARY_THEMATIC_REVIEW_MODEL'"
                                       @cancel="cancel" :url="api"
                                       :operaility-data="operailityData"></rotaryThematicReviewModelView>

        <!--阶段考核申请个人小结类型	ROTARY_BIGDEP_EXAM_MODEL    rotaryBigdepExamModelDo   rotaryBigdepExamModelView-->
        <rotaryBigdepExamModelView v-if="todoModelName === 'ROTARY_BIGDEP_EXAM_MODEL'"
                                   @cancel="cancel" :url="api"
                                   :operaility-data="operailityData"></rotaryBigdepExamModelView>

        <!--结业鉴定个人小结推送类型	ROTARY_GRADUATION_APPRSISE_MODEL    rotaryGraduationApprsiseModelDo   rotaryGraduationApprsiseModelView-->
        <rotaryGraduationApprsiseModelView v-if="todoModelName === 'ROTARY_GRADUATION_APPRSISE_MODEL'"
                                           @cancel="cancel" :url="api"
                                           :operaility-data="operailityData"></rotaryGraduationApprsiseModelView>

        <!--科研日志推送类型	 ROTARY_SCIENTIFIC_RESEARCH_MODEL    rotaryScientificResearchModelDo   rotaryScientificResearchModelView-->
        <rotaryScientificResearchModelView v-if="todoModelName === 'ROTARY_SCIENTIFIC_RESEARCH_MODEL'"
                                           @cancel="cancel" :url="api"
                                           :operaility-data="operailityData"></rotaryScientificResearchModelView>

        <!--调查报告推送类型 	ROTARY_SURVEYEMPIRICAL_MODEL    rotarySurveyempiricalModelDo   rotarySurveyempiricalModelView-->
        <rotarySurveyempiricalModelView v-if="todoModelName === 'ROTARY_SURVEYEMPIRICAL_MODEL'"
                                        @cancel="cancel" :url="api"
                                        :operaility-data="operailityData"></rotarySurveyempiricalModelView>

        <!--大病历推送类型	 ROTARYBIGCASES_PUSH_MODEL    rotarybigcasesPushModelDo   rotarybigcasesPushModelView-->
        <rotarybigcasesPushModelView v-if="todoModelName === 'ROTARYBIGCASES_PUSH_MODEL'"
                                     @cancel="cancel" :url="api"
                                     :operaility-data="operailityData"></rotarybigcasesPushModelView>

        <!--经典病历推送类型	 ROTARY_CLASSIC_BIGCASES_PUSH_MODEL    rotaryClassicBigcasesPushModelDo   rotaryClassicBigcasesPushModelView-->
        <rotaryClassicBigcasesPushModelView v-if="todoModelName === 'ROTARY_CLASSIC_BIGCASES_PUSH_MODEL'"
                                            @cancel="cancel" :url="api"
                                            :operaility-data="operailityData"></rotaryClassicBigcasesPushModelView>

        <!--职业暴露 DAILY_OCCUPATIONALEXPOSURE   dailyOccupationalexposureDo   dailyOccupationalexposureView-->
        <!--<dailyOccupationalexposureView v-if="todoModelName === 'DAILY_OCCUPATIONALEXPOSURE'"-->
        <!--@cancel="cancel" :url="api"-->
        <!--:operaility-data="operailityData"></dailyOccupationalexposureView>-->
        <!-- 职业暴露\职业暴露报销审核\职业暴露体检报告审核 公用查看视图 -->
        <dailyOccupationalexposureView
          v-if="!!~['DAILY_OCCUPATIONALEXPOSURE','DAILY_OCCUPATIONALEXPOSURE_REIMBURSEMENT','DAILY_OCCUPATIONALEXPOSURE_REPORT'].indexOf(todoModelName)"
          @cancel="cancel" :url="api"
          :operaility-data="operailityData"></dailyOccupationalexposureView>

        <!-- 研究生开题报告 -->
        <yjs-opentopic v-if="todoModelName === 'OPENTOPIC'" @cancel="cancel" :operaility-data="operailityData"></yjs-opentopic>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style lang="scss">
  .uwContentNoDataTips {
    text-align: center;
    line-height: 300px;
  }

  .uwContentBox {
    .spanModal {
      display: initial;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import todoTypes from './todoTypes';
  /* 所需办理弹窗 */
  //答辩申请 DEFENSE_APPLICATION    defenseApplicationDo  defenseApplicationView
  import defenseApplicationDo from '../../../postgraduate/pttrainingPlan/cultivatePlanAudit/cultivatePlanAudit_list.vue';
  import defenseApplicationView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //开题报告 OPEN_TOPI_REPORT   openTopiReportDo  openTopiReportView
  import openTopiReportDo from '../../../postgraduate/ptProposal/ProposalPeportAudit/ProposalPeportAudit_list.vue';
  import openTopiReportView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //开题申请 OPEN_TOPI_APPLICATION  openTopiApplicationDo  openTopiApplicationView
  import openTopiApplicationDo from '../../../postgraduate/ptProposal/proposalApplicationAudit/proposalApplicationAudit_list.vue';
  import openTopiApplicationView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //奖学金 BURSARY   bursaryDo  bursaryView
  import bursaryDo from '../../../daily/dailyManagement/highestQuality/scholarship/scholarship_audit.vue';
  import bursaryView from '../../../daily/dailyManagement/highestQuality/scholarship/scholarship_view.vue';

  //评优自荐 APPRAISING_SELLONESELF    appraisingSelloneselfDo  appraisingSelloneselfView
  import appraisingSelloneselfDo from '../../../daily/dailyManagement/highestQuality/recommend/recommend_audit.vue';
  import appraisingSelloneselfView from '../../../daily/dailyManagement/highestQuality/recommend/recommend_view.vue';

  //出科鉴定学生推送类型	DEPEXAMINATION_SELF_PUSH_MODEL    depexaminationSelfPushModelDo  depexaminationSelfPushModelView
  import depexaminationSelfPushModelDo from '../../../rotateManagement/rotateRecordAudit/givenAudit/user_teacher/rotary.vue';
  import depexaminationSelfPushModelView from '../../../rotateManagement/rotateRecordWrite/givenTheApplication/givenTheApplication_view.vue';

  //出科鉴定推送类型	DEPEXAMINATION_PUSH_MODEL        depexaminationPushModelDo   depexaminationPushModelView
  import depexaminationPushModelDo from '../../../rotateManagement/rotateRecordWrite/givenTheApplication/givenTheApplication_rotary.vue';
  import depexaminationPushModelView from '../../../rotateManagement/rotateRecordWrite/givenTheApplication/givenTheApplication_view.vue';

  //出科鉴定老师推送类型	DEPEXAMINATION_TEACHCER_PUSH_MODEL   depexaminationTeachcerPushModelDo   depexaminationTeachcerPushModelView
  import depexaminationTeachcerPushModelDo from '../../../rotateManagement/rotateRecordAudit/givenAudit/user_kezr/rotary.vue';
  import depexaminationTeachcerPushModelView from '../../../rotateManagement/rotateRecordWrite/givenTheApplication/givenTheApplication_view.vue';

  //奖惩记录 REWARD   rewardDo   rewardView
  import rewardDo from '../../../daily/dailyManagement/practiceRecords/practiceRecords_audit.vue';
  import rewardView from '../../../daily/dailyManagement/practiceRecordsRegister/practiceRecords_view.vue';

  //预约代办事宜	RESERVE  reserveDo   reserveView
  import reserveDo from '../../../cstc/bespeakAudit/bespeakAudit_add.vue';
  import reserveView from '../../../cstc/bespeakAudit/bespeakAudit_view.vue';

  //培养计划	TRAINING   trainingDo    trainingView
  import trainingDo from '../../../postgraduate/pttrainingPlan/cultivatePlanAudit/cultivatePlanAudit_list.vue';
  import trainingView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //毕业	GRADUATION     graduationDo    graduationView
  import graduationDo from '../../../postgraduate/graduate/graduateApplyAudit/graduateApplyAudit_audit.vue';
  import graduationView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //科室主任大出科鉴定推送类型	BIG_DEPEXAMINATION_DEP_PUSH_MODEL    bigDepexaminationDepPushModelDo  bigDepexaminationDepPushModelView
  import bigDepexaminationDepPushModelDo from '../../../rotateManagement/rotateRecordAudit/givenAuditOfLarge/givenAuditOfLarge_rotary';
  import bigDepexaminationDepPushModelView from '../../../rotateManagement/rotateRecordWrite/givenTheApplicationOfLarge/givenTheApplicationOfLarge_view.vue';

  //病种推送类型	DISEASERECORD_PUSH_MODEL    diseaserecordPushModelDo   diseaserecordPushModelView
  import diseaserecordPushModelDo from '../../../rotateManagement/rotateRecordAudit/entityAudit/entityWrite_audit.vue';
  import diseaserecordPushModelView from '../../../rotateManagement/rotateRecordAudit/entityAudit/entityWrite_view.vue';

  //技能推送类型	SKILLRECORD_PUSH_MODEL    skillrecordPushModelDo    skillrecordPushModelView
  import skillrecordPushModelDo from '../../../rotateManagement/rotateRecordAudit/skillAudit/skillAudit_audit.vue';
  import skillrecordPushModelView from '../../../rotateManagement/rotateRecordAudit/skillAudit/skillAudit_view.vue';

  //病种审核消息推送至申请人类型	DISEASE_RECORD_PUSHTOUSER_MODEL   diseaseRecordPushtouserModelDo   diseaseRecordPushtouserModelView
  import diseaseRecordPushtouserModelDo from '../../../rotateManagement/rotateRecordAudit/entityAudit/entityWrite_audit.vue';
  import diseaseRecordPushtouserModelView from '../../../rotateManagement/rotateRecordWrite/entityWrite/entityWrite_view.vue';

  //技能审核消息推送至申请人类型	SKILLRECORD_PUSHTOUSER_MODEL    skillrecordPushtouserModelDo   skillrecordPushtouserModelView
  import skillrecordPushtouserModelDo from '../../../rotateManagement/rotateRecordAudit/skillAudit/skillAudit_audit.vue';
  import skillrecordPushtouserModelView from '../../../rotateManagement/rotateRecordWrite/skillWrite/skillWrite_view.vue';

  //大病历审核消息推送至申请人类型	BIG_CASE_PUSHTOUSER_MODEL    bigCasePushtouserModelDo    bigCasePushtouserModelView
  import bigCasePushtouserModelDo from '../../../rotateManagement/rotateRecordAudit/givenAuditOfLarge/givenAuditOfLarge_rotary.vue';
  import bigCasePushtouserModelView from '../../../rotateManagement/rotateRecordWrite/largeCaseWrite/largeCaseWrite_view.vue';

  //抢救记录审核消息推送至申请人类型	PATIENT_RECORD_PUSHTOUSER_MODEL   patientRecordPushtouserModelDo   patientRecordPushtouserModelView
  import patientRecordPushtouserModelDo from '../../../rotateManagement/rotateRecordAudit/saveRecordAudit/saveRecordAudit_audit.vue';
  import patientRecordPushtouserModelView from '../../../rotateManagement/rotateRecordWrite/saveRecordWrite/saveRecordWrite_view.vue';

  //专题综述记录审核消息推送至申请人类型	THEMATIC_REVIEW_PUSHTOUSER_MODEL   thematicReviewPushtouserModelDo   thematicReviewPushtouserModelView
  import thematicReviewPushtouserModelDo from '../../../rotateManagement/rotateRecordAudit/monographReviewAudit/monographReviewAudit_audit.vue';
  import thematicReviewPushtouserModelView from '../../../rotateManagement/rotateRecordWrite/monographReviewWrite/monographReviewWrite_view.vue';

  //调查报告记录审核消息推送至申请人类型	MEDICAL_ETHICS_PUSHTOUSER_MODEL   medicalEthicsPushtouserModelDo    medicalEthicsPushtouserModelView
  import medicalEthicsPushtouserModelDo from '../../../rotateManagement/rotateRecordAudit/surveyReportAudit/surveyReportAudit_audit.vue';
  import medicalEthicsPushtouserModelView from '../../../rotateManagement/rotateRecordAudit/surveyReportAudit/surveyReportAudit_view.vue';

  //科研日志记录审核消息推送至申请人类型	SCIENTIFIC_RESEARCH_PUSHTOUSER_MODEL   scientificResearchPushtouserModelDo   scientificResearchPushtouserModelView
  import scientificResearchPushtouserModelDo from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';
  import scientificResearchPushtouserModelView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //手术操作记录审核类型消息推送至申请人类型	ROTARY_SSCZ_PUSHTOUSER_MODEL   rotarySsczPushtouserModelDo   rotarySsczPushtouserModelView
  import rotarySsczPushtouserModelDo from '../../../rotateManagement/rotateRecordAudit/operationAudit/operationAudit_audit.vue';
  import rotarySsczPushtouserModelView from '../../../rotateManagement/rotateRecordAudit/operationAudit/operationAudit_view.vue';

  //延期出科申请审核类型消息推送至申请人类型	DELAY_GIVEN_PUSHTOUSER_MODEL   delayGivenPushtouserModelDo   delayGivenPushtouserModelView
  import delayGivenPushtouserModelDo from '../../../rotateManagement/rotateRecordAudit/extensionRequestAudit/extensionRequestAudit_audit.vue';
  import delayGivenPushtouserModelView from '../../../rotateManagement/rotateRecordAudit/extensionRequestAudit/extensionRequestAudit_view.vue';

  //结业申请审核类型消息推送至申请人类型	PERSONAL_APPRAISAL_PUSHTOUSER_MODEL   personalAppraisalPushtouserModelDo   personalAppraisalPushtouserModelView
  import personalAppraisalPushtouserModelDo from '../../../rotateManagement/rotateRecordAudit/graduationAppraisal/graduationAppraisal_add.vue';
  import personalAppraisalPushtouserModelView from '../../../rotateManagement/rotateRecordAudit/graduationAppraisal/graduationAppraisal_view.vue';

  //出科申请审核消息推送至申请人类型	DEP_COMMENT_PUSHTOUSER_MODEL   depCommentPushtouserModelDo   depCommentPushtouserModelView
  import depCommentPushtouserModelDo from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';
  import depCommentPushtouserModelView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //阶段考核申请审核消息推送至申请人类型	BIG_DEP_COMMENT_PUSHTOUSER_MODEL    bigDepCommentPushtouserModelDo   bigDepCommentPushtouserModelView
  import bigDepCommentPushtouserModelDo from '../../../rotateManagement/rotateRecordAudit/givenAuditOfLarge/givenAuditOfLarge_rotary';
  import bigDepCommentPushtouserModelView from '../../../rotateManagement/rotateRecordWrite/givenTheApplicationOfLarge/givenTheApplicationOfLarge_view.vue';

  //手术操作推送类型	SURGERY_OPERATION_PUSH_MODEL    surgeryOperationPushModelDo   surgeryOperationPushModelView
  import surgeryOperationPushModelDo from '../../../rotateManagement/rotateRecordAudit/operationAudit/operationAudit_audit.vue';
  import surgeryOperationPushModelView from '../../../rotateManagement/rotateRecordAudit/operationAudit/operationAudit_view.vue';

  //临床操作推送类型	ROTARY_CLINICALRECORD_PUSH_MODEL    rotaryClinicalrecordPushModelDo   rotaryClinicalrecordPushModelView
  import rotaryClinicalrecordPushModelDo from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';
  import rotaryClinicalrecordPushModelView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //管床记录推送类型	ROTARY_TUBEBED_RECORD_PUSH_MODEL    rotaryTubebedRecordPushModelDo   rotaryTubebedRecordPushModelView
  import rotaryTubebedRecordPushModelDo from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';
  import rotaryTubebedRecordPushModelView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //参加抢救危重病人记录推送类型	ROTARY_RESCUE_PATIENT_RECORD_PUSH_MODEL    rotaryRescuePatientRecordPushModelDo    rotaryRescuePatientRecordPushModelView
  import rotaryRescuePatientRecordPushModelDo from '../../../rotateManagement/rotateRecordAudit/saveRecordAudit/saveRecordAudit_audit.vue';
  import rotaryRescuePatientRecordPushModelView from '../../../rotateManagement/rotateRecordWrite/saveRecordWrite/saveRecordWrite_view.vue';

  //教学活动推送类型	TEACHACTIVITY_PUSH_MODEL   teachactivityPushModelDo   teachactivityPushModelView
  import teachactivityPushModelDo from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';
  import teachactivityPushModelView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //请假推送类型	LEAVE_PUSH_MODEL    leavePushModelDo  leavePushModelView
  import leavePushModelDo from '../../../daily/dailyManagement/leaveManagement/leaveManagement_audit.vue';
  import leavePushModelView from '../../../daily/dailyManagement/leaveManagement/leaveManagement_view.vue';

  //考情推送类型	CLOCK_REMIND    clockRemindDo   clockRemindView
  import clockRemindDo from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';
  import clockRemindView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //学术会议	CONFERENCE_PUSH_MODEL    conferencePushModelDo   conferencePushModelView
  import conferencePushModelDo from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';
  import conferencePushModelView from '../../../educationManagement/academicConference/MeetingReportWrite/meetingReportWrite_view.vue';

  //外出进修	OUTSTUDY_PUSH_MODEL   outstudyPushModelDo   outstudyPushModelView
  import outstudyPushModelDo from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';
  import outstudyPushModelView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //外出进修申请	OUTSTUDY_PUSH_APPLY_MODEL    outstudyPushApplyModelDo    outstudyPushApplyModelView
  import outstudyPushApplyModelDo from '../../../educationManagement/outEducation/outEducationAntragAudit/outEducationAntragAudit_add.vue';
  import outstudyPushApplyModelView from '../../../educationManagement/outEducation/outEducationAntragWrite/outEducationAntragWrite_view.vue';

  //外出进修汇报	OUTSTUDY_PUSH_REPORT_MODEL    outstudyPushReportModelDo   outstudyPushReportModelView
  import outstudyPushReportModelDo from '../../../educationManagement/outEducation/outEducationReportAudit/outEducationReportAudit_add.vue';
  import outstudyPushReportModelView from '../../../educationManagement/outEducation/outEducationReportWrite/outEducationReportWrite_view.vue';

  //专题概述推送类型	ROTARY_THEMATIC_REVIEW_MODEL    rotaryThematicReviewModelDo   rotaryThematicReviewModelView
  import rotaryThematicReviewModelDo from '../../../rotateManagement/rotateRecordAudit/monographReviewAudit/monographReviewAudit_audit.vue';
  import rotaryThematicReviewModelView from '../../../rotateManagement/rotateRecordAudit/monographReviewAudit/monographReviewAudit_view.vue';

  //阶段考核申请个人小结类型	ROTARY_BIGDEP_EXAM_MODEL    rotaryBigdepExamModelDo   rotaryBigdepExamModelView
  import rotaryBigdepExamModelDo from '../../../rotateManagement/rotateRecordAudit/largeCaseAudit/largeCaseWrite_audit.vue';
  import rotaryBigdepExamModelView from '../../../educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_add.vue';

  //结业鉴定个人小结推送类型	ROTARY_GRADUATION_APPRSISE_MODEL    rotaryGraduationApprsiseModelDo   rotaryGraduationApprsiseModelView
  import rotaryGraduationApprsiseModelDo from '../../../rotateManagement/rotateRecordAudit/graduationAppraisal/graduationAppraisal_add.vue';
  import rotaryGraduationApprsiseModelView from '../../../rotateManagement/rotateRecordAudit/graduationAppraisal/graduationAppraisal_view.vue';

  //科研日志推送类型	ROTARY_SCIENTIFIC_RESEARCH_MODEL    rotaryScientificResearchModelDo   rotaryScientificResearchModelView
  import rotaryScientificResearchModelDo from '../../../rotateManagement/rotateRecordAudit/scientificResearchLogAudit/scientificResearchLogAudit_audit.vue';
  import rotaryScientificResearchModelView from '../../../rotateManagement/rotateRecordAudit/scientificResearchLogAudit/scientificResearchLogAudit_view.vue';

  //调查报告推送类型	ROTARY_SURVEYEMPIRICAL_MODEL    rotarySurveyempiricalModelDo   rotarySurveyempiricalModelView
  import rotarySurveyempiricalModelDo from '../../../rotateManagement/rotateRecordAudit/surveyReportAudit/surveyReportAudit_audit.vue';
  import rotarySurveyempiricalModelView from '../../../rotateManagement/rotateRecordAudit/surveyReportAudit/surveyReportAudit_view.vue';

  //大病历推送类型	ROTARYBIGCASES_PUSH_MODEL    rotarybigcasesPushModelDo   rotarybigcasesPushModelView
  import rotarybigcasesPushModelDo from '../../../rotateManagement/rotateRecordAudit/largeCaseAudit/largeCaseWrite_audit/audit_largeCaseTemplate.vue';
  import rotarybigcasesPushModelView from '../../../rotateManagement/rotateRecordWrite/largeCaseWrite/largeCaseWrite_view.vue';

  //经典病历推送类型	ROTARY_CLASSIC_BIGCASES_PUSH_MODEL    rotaryClassicBigcasesPushModelDo   rotaryClassicBigcasesPushModelView
  import rotaryClassicBigcasesPushModelDo from '../../../rotateManagement/rotateRecordAudit/manageClassicCase/manageClassicCase_audit.vue';
  import rotaryClassicBigcasesPushModelView from '../../../rotateManagement/rotateRecordWrite/userClassicCase/userClassicCase_view.vue';

  //职业暴露 DAILY_OCCUPATIONALEXPOSURE   dailyOccupationalexposureDo   dailyOccupationalexposureView
  import dailyOccupationalexposureDo from '../../../daily/dailyManagement/occupationalExposureAudit/occupationalExposure_audit.vue';
  import dailyOccupationalexposureView from '../../../daily/dailyManagement/occupationalExposureWrite/occupationalExposure_view.vue';

  //职业暴露报销审核 DAILY_OCCUPATIONALEXPOSURE_REIMBURSEMENT dailyOccupationalexposureReimbursementDo dailyOccupationalexposureReimbursementView
  import dailyOccupationalexposureReimbursementDo from '../../../daily/dailyManagement/occupationalExposureAudit/occupationalExposure_expenseAudit.vue';
  //import dailyOccupationalexposureReimbursementView from '../../../daily/dailyManagement/occupationalExposureWrite/occupationalExposure_view.vue';

  //职业暴露体检报告审核 DAILY_OCCUPATIONALEXPOSURE_REPORT dailyOccupationalexposureReportDo dailyOccupationalexposureReportView
  import dailyOccupationalexposureReportDo from '../../../daily/dailyManagement/occupationalExposureAudit/occupationalExposure_medicalAudit.vue';
  //import dailyOccupationalexposureReportView from '../../../daily/dailyManagement/occupationalExposureWrite/occupationalExposure_view.vue';

  // API
  import rotateRecordAudit from '../../../rotateManagement/rotateRecordAudit/api'; //轮转管理审核api
  import rotateRecordWrite from '../../../rotateManagement/rotateRecordWrite/api';//轮转管理添加api
  //  import teachingActivities from '../../../teach/teachingActivities/app.js';//教学活动api
  import archivesManagement_basic from '../../archivesManagement/archivesManagement_basic/api.js';//登录人basic
  // 研究生开题通知
  import yjsOpentopic from '../../../postgraduate/ptProposal/proposalNotificationManager/proposalNotificationManager_view';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['contentType', 'num'],
    data () {
      return {
        self: this,
        todoModelName: '',
        totalCount: 0,
        arr: [],
        identify: '', // 当前人员身份
        button: {
          addId: {
            id: 'addId',
            title: '办理'
          },
          showId: {
            id: 'showId',
            title: '查看'
          },
        },
        //获取uesr信息的types
        isGetUser: [''],
        userData: {},//用户信息
        propsData: { // 模块传值时的特殊id
          TEACHACTIVITY_PUSH_MODEL: 'activityId',
          ROTARY_BIGDEP_EXAM_MODEL: 'examinationId',
          DISEASERECORD_PUSH_MODEL: 'diseaseId',
          ROTARYBIGCASES_PUSH_MODEL: 'cid',
          ROTARY_CLASSIC_BIGCASES_PUSH_MODEL: 'cid',
          DEPEXAMINATION_SELF_PUSH_MODEL: 'depExaminationId',
          DEPEXAMINATION_TEACHCER_PUSH_MODEL: 'depExaminationId',
          DEPEXAMINATION_PUSH_MODEL: 'podId',
          LEAVE_PUSH_MODEL: 'applicantId',  //请假
          SKILLRECORD_PUSH_MODEL: 'skillId',  //技能操作
          ROTARY_GRADUATION_APPRSISE_MODEL: 'appraisalId', //结业鉴定
          DAILY_OCCUPATIONALEXPOSURE_REIMBURSEMENT: 'reimbursementId' // 职业暴露报销审核
        },

      }
    },
    methods: {
      //初始化请求列表数据

      init () {
        this.api = {
          ...rotateRecordAudit,
          ...rotateRecordWrite
//          ...teachingActivities,
        }
        this.getArrs();
        this.identify = this.$store.getters['getUserInfo'].roleList && this.$store.getters['getUserInfo'].roleList[0].identify;
      },
      getArrs () {
        this.arr = this.$store.getters['work/todoItems/workHandleArr'](this.contentType);
      },
      // 待办事宜 办理
      needTodo (item) {
        this.updateVal(item, '办理');
        this.openModel('add');
      },
      // 待办事宜 查看
      lookTodo (item) {
        this.updateVal(item, '查看');
        this.openModel('show');
      },
      // 更新值
      updateVal (obj, str) {
        this.todoModelName = obj.types;
        this.button.addId.title = (todoTypes[obj.types] || '') + str;

        let data = {
          // 统一处理为id传入
          id: obj.busId
        };
        // 特殊id
        if (this.propsData[obj.types]) {
          data[this.propsData[obj.types]] = obj.busId;
        }
        //console.log(data);
        this.operailityData = data;
      },

      /********************** 模态窗操作 ************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      addCancel () {
        this.addModal = false;
      },
      /*
     * 打开指定的模态窗体
     * @param options string 当前指定的模态:"add"、"edit"
     * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      addSubCallback (target, title, updata) {
        this.cancel('add');
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.$emit('update');
        }
      },
      // 操作回调
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.$emit('update');
        }
      },
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      //答辩申请DEFENSE_APPLICATION
      defenseApplicationDo, defenseApplicationView,

      //开题报告OPEN_TOPI_REPORT
      openTopiReportDo, openTopiReportView,

      //开题申请OPEN_TOPI_APPLICATION
      openTopiApplicationDo, openTopiApplicationView,

      //奖学金BURSARY
      bursaryDo, bursaryView,

      //评优自荐APPRAISING_SELLONESELF
      appraisingSelloneselfDo, appraisingSelloneselfView,

      //出科鉴定学生推送类型	DEPEXAMINATION_SELF_PUSH_MODEL
      depexaminationSelfPushModelDo, depexaminationSelfPushModelView,

      //出科鉴定推送类型	DEPEXAMINATION_PUSH_MODEL
      depexaminationPushModelDo, depexaminationPushModelView,

      //出科鉴定老师推送类型	DEPEXAMINATION_TEACHCER_PUSH_MODEL
      depexaminationTeachcerPushModelDo, depexaminationTeachcerPushModelView,

      //奖惩记录 REWARD
      rewardDo, rewardView,

      //预约代办事宜	RESERVE
      reserveDo, reserveView,

      //培养计划	TRAINING
      trainingDo, trainingView,

      //毕业	GRADUATION
      graduationDo, graduationView,

      //科室主任大出科鉴定推送类型	BIG_DEPEXAMINATION_DEP_PUSH_MODEL
      bigDepexaminationDepPushModelDo, bigDepexaminationDepPushModelView,

      //病种推送类型	DISEASERECORD_PUSH_MODEL
      diseaserecordPushModelDo, diseaserecordPushModelView,

      //技能推送类型	SKILLRECORD_PUSH_MODEL
      skillrecordPushModelDo, skillrecordPushModelView,

      //病种审核消息推送至申请人类型	DISEASE_RECORD_PUSHTOUSER_MODEL
      diseaseRecordPushtouserModelDo, diseaseRecordPushtouserModelView,

      //技能审核消息推送至申请人类型	SKILLRECORD_PUSHTOUSER_MODEL
      skillrecordPushtouserModelDo, skillrecordPushtouserModelView,

      //大病历审核消息推送至申请人类型	BIG_CASE_PUSHTOUSER_MODEL
      bigCasePushtouserModelDo, bigCasePushtouserModelView,

      //抢救记录审核消息推送至申请人类型	PATIENT_RECORD_PUSHTOUSER_MODEL
      patientRecordPushtouserModelDo, patientRecordPushtouserModelView,

      //专题综述记录审核消息推送至申请人类型	THEMATIC_REVIEW_PUSHTOUSER_MODEL
      thematicReviewPushtouserModelDo, thematicReviewPushtouserModelView,

      //调查报告记录审核消息推送至申请人类型	MEDICAL_ETHICS_PUSHTOUSER_MODEL
      medicalEthicsPushtouserModelDo, medicalEthicsPushtouserModelView,

      //科研日志记录审核消息推送至申请人类型	SCIENTIFIC_RESEARCH_PUSHTOUSER_MODEL
      scientificResearchPushtouserModelDo, scientificResearchPushtouserModelView,

      //手术操作记录审核类型消息推送至申请人类型	ROTARY_SSCZ_PUSHTOUSER_MODEL
      rotarySsczPushtouserModelDo, rotarySsczPushtouserModelView,

      //延期出科申请审核类型消息推送至申请人类型	DELAY_GIVEN_PUSHTOUSER_MODEL
      delayGivenPushtouserModelDo, delayGivenPushtouserModelView,

      //结业申请审核类型消息推送至申请人类型	PERSONAL_APPRAISAL_PUSHTOUSER_MODEL
      personalAppraisalPushtouserModelDo, personalAppraisalPushtouserModelView,

      //出科申请审核消息推送至申请人类型	DEP_COMMENT_PUSHTOUSER_MODEL
      depCommentPushtouserModelDo, depCommentPushtouserModelView,

      //阶段考核申请审核消息推送至申请人类型	BIG_DEP_COMMENT_PUSHTOUSER_MODEL
      bigDepCommentPushtouserModelDo, bigDepCommentPushtouserModelView,

      //手术操作推送类型	SURGERY_OPERATION_PUSH_MODEL
      surgeryOperationPushModelDo, surgeryOperationPushModelView,

      //临床操作推送类型	ROTARY_CLINICALRECORD_PUSH_MODEL
      rotaryClinicalrecordPushModelDo, rotaryClinicalrecordPushModelView,

      //管床记录推送类型	ROTARY_TUBEBED_RECORD_PUSH_MODEL
      rotaryTubebedRecordPushModelDo, rotaryTubebedRecordPushModelView,

      //参加抢救危重病人记录推送类型	ROTARY_RESCUE_PATIENT_RECORD_PUSH_MODEL
      rotaryRescuePatientRecordPushModelDo, rotaryRescuePatientRecordPushModelView,

      //教学活动推送类型	TEACHACTIVITY_PUSH_MODEL
      teachactivityPushModelDo, teachactivityPushModelView,

      //请假推送类型	LEAVE_PUSH_MODEL
      leavePushModelDo, leavePushModelView,

      //考情推送类型	CLOCK_REMIND
      clockRemindDo, clockRemindView,

      //学术会议	CONFERENCE_PUSH_MODEL
      conferencePushModelDo, conferencePushModelView,

      //外出进修	OUTSTUDY_PUSH_MODEL
      outstudyPushModelDo, outstudyPushModelView,

      //外出进修申请	OUTSTUDY_PUSH_APPLY_MODEL
      outstudyPushApplyModelDo, outstudyPushApplyModelView,

      //外出进修汇报	OUTSTUDY_PUSH_REPORT_MODEL
      outstudyPushReportModelDo, outstudyPushReportModelView,

      //专题概述推送类型	ROTARY_THEMATIC_REVIEW_MODEL
      rotaryThematicReviewModelDo, rotaryThematicReviewModelView,

      //阶段考核申请个人小结类型	ROTARY_BIGDEP_EXAM_MODEL
      rotaryBigdepExamModelDo, rotaryBigdepExamModelView,

      //结业鉴定个人小结推送类型	ROTARY_GRADUATION_APPRSISE_MODEL
      rotaryGraduationApprsiseModelDo, rotaryGraduationApprsiseModelView,

      //科研日志推送类型	ROTARY_SCIENTIFIC_RESEARCH_MODEL
      rotaryScientificResearchModelDo, rotaryScientificResearchModelView,

      //调查报告推送类型	ROTARY_SURVEYEMPIRICAL_MODEL
      rotarySurveyempiricalModelDo, rotarySurveyempiricalModelView,

      //大病历推送类型	ROTARYBIGCASES_PUSH_MODEL
      rotarybigcasesPushModelDo, rotarybigcasesPushModelView,

      //经典病历推送类型	ROTARY_CLASSIC_BIGCASES_PUSH_MODEL
      rotaryClassicBigcasesPushModelDo, rotaryClassicBigcasesPushModelView,

      //职业暴露 DAILY_OCCUPATIONALEXPOSURE
      dailyOccupationalexposureDo, dailyOccupationalexposureView,

      // 职业暴露报销审核 DAILY_OCCUPATIONALEXPOSURE_REIMBURSEMENT
      dailyOccupationalexposureReimbursementDo,

      // 职业暴露体检报告审核 DAILY_OCCUPATIONALEXPOSURE_REPORT
      dailyOccupationalexposureReportDo,

      // 研究生开题报告
      yjsOpentopic
    },
    watch: {
      num (val) {
        this.getArrs();
      }
    },
    filters: {
      todoTypes (val) {
        return todoTypes[val] || val;
      }
    }
  }

</script>
