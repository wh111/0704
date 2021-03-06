const tableData = [
  //培训手册完成情况
  {
    classify:'实习生',
    firstLevel:'1.培训手册完成情况',
    secondLevel:'病种完成情况',
    weight:'',
    score:'5',
    remark:'完成率80%',
    type:'trainingManual',
    datum:'entity',
  },
  {
    classify:'',
    firstLevel:'',
    secondLevel:'技能操作完成情况',
    weight:'',
    score:'5',
    remark:'完成率80%',
    type:'trainingManual',
    datum:'skillOperation'
  },
  //培训工作量
  {
    classify:'',
    firstLevel:'2.培训工作量',
    secondLevel:'教学查房',
    weight:'',
    score:'5',
    remark:'每个月1次,以上加分',
    type:'workload',
    datum:'teachingRounds'
  },
  {
    classify:'',
    firstLevel:'',
    secondLevel:'小讲座',
    weight:'',
    score:'5',
    remark:'每个月2次,以上加分',
    type:'workload',
    datum:'miniLecture'
  },
  {
    classify:'',
    firstLevel:'',
    secondLevel:'病例讨论',
    weight:'',
    score:'5',
    remark:'每个月2次,以上加分',
    type:'workload',
    datum:'caseDiscussion'
  },
  {
    classify:'',
    firstLevel:'',
    secondLevel:'技能培训',
    weight:'',
    score:'5',
    remark:'每个月4次,以上加分',
    type:'workload',
    datum:'skillTraining'
  },
  //培训质量 trainingQuality
  {
    classify:'',
    firstLevel:'3.培训质量',
    secondLevel:'出科考试',
    weight:'',
    score:'5',
    remark:'出科分值，优秀，良，给分值',
    type:'departmentExamination' ,
  },
  {
    classify:'',
    firstLevel:'',
    secondLevel:'定期评价',
    weight:'',
    score:'5',
    remark:'出科分值，优秀，良，给分值',
    type:'regularAssessment',
  },
  {
    classify:'',
    firstLevel:'',
    secondLevel:'结业考核',
    weight:'',
    score:'5',
    remark:'通过则给分',
    type:'completion',
  },
  //日常管理
  {
    classify:'',
    firstLevel:'4.日常管理',
    secondLevel:'考勤情况',
    weight:'',
    score:'5',
    remark:'全勤加分，旷工>扣分()',
    type:'attendanceSituation',
  },

  {
    classify:'',
    firstLevel:'',
    secondLevel:'入科报道及时程度',
    weight:'',
    score:'5',
    remark:'未及时入科报道扣分()',
    type:'departmentReport',
  },
  {
    classify:'',
    firstLevel:'',
    secondLevel:'手册书写完成',
    weight:'',
    score:'5',
    remark:'按时提交(),出科一周()二周()',
    type:'manualWriting',
  },
  {
    classify:'',
    firstLevel:'',
    secondLevel:'教学评价完成度',
    weight:'',
    score:'5',
    remark:'完成率80%',
    type:'teachingEvaluation',
  },
  {
    classify:'',
    firstLevel:'',
    secondLevel:'奖励记录',
    weight:'',
    score:'5',
    remark:'表扬信,优秀住院医师,以及',
    type:'rewardsRecord',
  },
  {
    classify:'',
    firstLevel:'',
    secondLevel:'惩罚记录',
    weight:'',
    score:'5',
    remark:'丙级病例,有效投诉等',
    type:'punishmentRecord',
  },
  {
    classify:'',
    firstLevel:'5.能力提升',
    secondLevel:'各类竞赛',
    weight:'',
    score:'5',
    remark:'参与,获奖累加分值',
    type:'racingMiscellaneous',
  },

]
export  default tableData
