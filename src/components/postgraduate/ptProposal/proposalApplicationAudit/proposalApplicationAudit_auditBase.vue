<template>

  <div>
    <el-form class="demo-form-inline" label-width="90px">
      <fieldset class="layui-elem-field ">
        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="申请人:">
              {{operailityData.name}}
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="学号:">
              {{operailityData.studentId}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!--<el-col :span="8" :offset="2">-->
          <!--<el-form-item label="年级:"  >-->
          <!--{{operailityData.boundary}}-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8" :offset="2">
            <el-form-item label="手机号:">
              {{operailityData.phone}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="专业方向:">
              {{operailityData.specialtyName}}
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="专业代码:">
              {{operailityData.specialtyCode}}
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="时间:" prop="applicationDate">
              {{operailityData.applicationDate}}
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2">
            <el-form-item label="地点:" prop="place">
              {{operailityData.place}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="研究方向:" prop="researchDirection">
              {{operailityData.researchDirection}}
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2">
            <el-form-item label="论文题目:" prop="thesisTitle">
              {{operailityData.thesisTitle}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18" :offset="2">
            <el-form-item label="课题摘要:" prop="projectSummary">
              {{operailityData.projectSummary}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22" :offset="1">
            <div style="text-align: center;margin: 10px;font-size: 18px">
              <strong>组员</strong>
            </div>
          </el-col>
          <el-col :span="22" :offset="1">
            <el-table
              align="center"
              :data="operailityData.memberList"
              tooltip-effect="dark"
              highlight-current-row
              style="width: 100%;height: 100%">
              <el-table-column
                align="center"
                label="序号"
                type="index"
                width="75">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="name"
                align="center"
                label="姓名">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="sex"
                align="center"
                label="性别">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                align="positionalTitle"
                prop="name"
                label="职称">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="professionalDirection"
                align="center"
                label="专业方向">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="company"
                label="单位"
                align="center">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <!--<el-row >-->
        <!--<el-col :span="8" :offset="2">-->
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
    methods: {}

  };
</script>

