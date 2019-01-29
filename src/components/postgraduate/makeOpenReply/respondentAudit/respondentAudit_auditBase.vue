<template>
  <div>
    <el-form class="demo-form-inline" label-width="90px">
      <fieldset class="layui-elem-field ">
        <basic-info :operailityData="operailityData"></basic-info>
        <!--<el-row class="table-back-one">-->
        <!--<el-col :span="12" >-->
        <!--<el-form-item label="答辩专科:" >-->
        <!--{{operailityData.defenseSpecialist}}-->
        <!--</el-form-item>-->
        <!--</el-col>-->

        <!--<el-col :span="12" >-->
        <!--<el-form-item label="答辩时间:"  >-->
        <!--{{operailityData.defenseTime}}-->
        <!--</el-form-item>-->
        <!--</el-col >-->
        <!--</el-row >-->

        <!--<el-row class="table-back-two">-->
        <!--<el-col :span="12" >-->
        <!--<slot>-->
        <!--<el-form-item  label="答辩地点:" >-->
        <!--{{operailityData.defensePlace}}-->
        <!--</el-form-item>-->
        <!--</slot>-->
        <!--</el-col >-->
        <!--<el-col :span="12" >-->
        <!--<el-form-item  label="是否预答辩:" prop="isPreDefense" >-->
        <!--{{operailityData.isPreDefense==1?'是':'否'}}-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row >-->

        <!--  <el-row class="table-back-one" style="padding: 0">
            <el-col :span="4" style="text-align: center;">
              <div style="font-size: 14px;color: #48576a;line-height: 96px">拟答辩研究生名单</div>
            </el-col>

            <el-col :span="20">
              <el-row class="table-back-two" style="border-top: none;border-right:none;">
                <el-col :span="24">
                  <el-form-item  label="博士:" >
                    {{operailityData.degreeType=='DOCTOR'?operailityData.applicantName:''}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="table-back-one" style="border-right:none;">
                <el-col :span="24" >
                  <el-form-item  label="硕士:" >
                    {{operailityData.degreeType=='MASTER'?operailityData.applicantName:''}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col >
          </el-row >-->

        <!--<el-row class="table-back-one" style="padding: 0">-->
        <!--<el-col :span="4" style="text-align: center;">-->
        <!--<div style="font-size: 14px;color: #48576a;line-height: 48px">拟答辩研究生名单</div>-->
        <!--</el-col>-->

        <!--<el-col :span="20">-->
        <!--<el-row class="table-back-two" style="border-top: none;border-right:none;">-->
        <!--<el-col :span="24">-->
        <!--<el-form-item  :label="operailityData.degreeType=='MASTER'?'硕士:':'博士:'" >-->
        <!--{{operailityData.applicantName}}-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--</el-col >-->
        <!--</el-row >-->

        <!--<el-row class="table-back-two-d">-->
        <!--<el-col :span="24">-->
        <!--<el-form-item label="导师:" prop="tutorName" >-->
        <!--{{operailityData.tutorName}}-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row >-->
        <!--<el-table-->
        <!--align="center"-->
        <!--:data="operailityData.memberList"-->
        <!--tooltip-effect="dark"-->
        <!--highlight-current-row-->
        <!--style="width: 100%;height: 100%">-->
        <!--<el-table-column-->
        <!--align="center"-->
        <!--label="序号"-->
        <!--type="index"-->
        <!--width="75">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--show-overflow-tooltip-->
        <!--align="center"-->
        <!--prop="name"-->
        <!--label="姓名">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--show-overflow-tooltip-->
        <!--prop="positionalTitle"-->
        <!--label="职称"-->
        <!--align="center">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--show-overflow-tooltip-->
        <!--prop="company"-->
        <!--label="单位"-->
        <!--align="center">-->
        <!--</el-table-column>-->
        <!--</el-table>-->

        <!--&lt;!&ndash;要办理的事项&ndash;&gt;-->
        <!--<el-table-->
        <!--align="center"-->
        <!--:data="operailityData.matter"-->
        <!--tooltip-effect="dark"-->
        <!--highlight-current-row-->
        <!--style="width: 100%;height: 100%">-->
        <!--<el-table-column-->
        <!--show-overflow-tooltip-->
        <!--prop="key"-->
        <!--label="办理事项">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--show-overflow-tooltip-->
        <!--align="center"-->
        <!--label="状态"-->
        <!--prop="name"-->
        <!--width="200">-->
        <!--<template scope="scope">-->
        <!--<span v-if="scope.row.name=='未填写'" style="color:#FF4949;">未填写</span>-->
        <!--<span v-else style="color:#13CE66" >已填写</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--<el-row class="table-back-one-d">-->
        <!--<el-col :span="8" >-->
        <!--<el-form-item label="状态:" >-->
        <!--{{operailityData.status | typeText}}-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--</el-row >-->
      </fieldset>
    </el-form>
  </div>
</template>
<script>
  import basicInfo from '../common/makeOpenReply_base-view';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'view', 'peport'],
    data () {
      return {};
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted () {
      //初始化
    },
    methods: {},
    components: {
      basicInfo
    }
  };
</script>

