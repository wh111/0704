<template>

  <div>
    <div >
      <el-form  label-width="160px" :model="operailityData" :rules="rules">
        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="一、培养目标:" >
              <el-input type="textarea"  readonly v-model="operailityData.target"></el-input>
            </el-form-item>
          </el-col>
        </el-row >
        <el-row class="table-back-two">
          <el-col :span="24">
            <el-form-item label="二、培养对象:" >
              <el-input type="textarea"  readonly v-model="operailityData.pyobject"></el-input>
            </el-form-item>
          </el-col>
        </el-row >
        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="三、学制:" >
              <el-input type="textarea" readonly v-model="operailityData.length"></el-input>
            </el-form-item>
          </el-col>
        </el-row >
        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="四、研究方向:"  >
              <div      class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
                <div class="el-table__body-wrapper" >
                  <table   style="width: 100%">
                    <tbody>
                    <tr v-for="(item,index) in operailityData.directionList">
                      <td> {{item.name}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row >
        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="五、培养方式:"  >
              <el-input type="textarea" readonly v-model="operailityData.mode"></el-input>
            </el-form-item>
          </el-col>
        </el-row >
        <el-row class="table-back-one" style="padding: 0">
          <el-col :span="24" >
            <el-form-item label="六、课程设置与考核要求 :"  >
              <div      class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
                <div class="el-table__body-wrapper" >
                  <table   style="width: 100%">
                    <thead>
                    <tr  >
                      <th class="cell" v-for="(item,index) in header"  style="text-align: center;">
                        {{item.label}}
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(data,index) in operailityData.curriculumLists[0]">
                      <td  v-if="index==0"  :rowspan="operailityData.curriculumLists[0].length" style="text-align: center;">公共基础课A类</td>
                      <td v-for="(item,i) in header" v-if="item.key" style="text-align: center;">{{data[item.key]}}</td>
                    </tr>

                    <tr v-for="(data,index) in operailityData.curriculumLists[1]">
                      <td v-if="index==0"  :rowspan="operailityData.curriculumLists[1].length" style="text-align: center;">专业基础课B类</td>
                      <td v-for="(item,i) in header" v-if="item.key" style="text-align: center;"> {{data[item.key]}}</td>
                    </tr>

                    <tr v-for="(data,index) in operailityData.curriculumLists[2]">
                      <td v-if="index==0" :rowspan="operailityData.curriculumLists[2].length" style="text-align: center;">专业实践课C类</td>
                      <td v-for="(item,i) in header" v-if="item.key" style="text-align: center;">{{data[item.key]}}</td>
                    </tr>

                    <tr v-for="(data,index) in operailityData.curriculumLists[3]">
                      <td  v-if="index==0"  :rowspan="operailityData.curriculumLists[3].length" style="text-align: center;">公共选修课程D类（8个专业方向）</td>
                      <td v-for="(item,i) in header" v-if="item.key" style="text-align: center;">{{data[item.key]}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </el-form-item>
            <el-form-item label=" 申请学位要求:"  >
              一般不少于32学分，非专业本科及同等学力入学者为36学分（包括本科课程3-4门约6-8学分）。
              其中，
            </el-form-item>
            <el-form-item label=" 公共课程(A类课):"  >
              全校公共外语、政治理论等公共基础课程，7学分。
            </el-form-item>
            <el-form-item label=" 专业基础课程(B类课):" >
              以知识基础构建为重点的专业基础课程，6学分。
            </el-form-item>
            <el-form-item label=" 专业选修课程(C类课):"  >
              以实践能力培养为重点的专业实践课程，10学分。
            </el-form-item>
            <el-form-item label="公共选修课(D类课):"  >
              各系（院）开设的公共选修课，10学分，其中跨二级或一级学科选修的硕士课程不少于3-4学分。其中，《护理管理》、《循证护理》和《护理研究》为必选。临床医学开设的C、D类课程（见临床医学硕士研究生培养方案课程设置）均为本专业的公共选修课程。
            </el-form-item>
          </el-col>
        </el-row >

        <el-row >
          <el-col :span="24" >
            <el-collapse v-model="activeNames" >
              <el-collapse-item title="七、护理硕士专业学位研究生实践要求 " name="1">
                <el-form-item label="（一）目的 :" >
                  <el-input type="textarea" readonly v-model="operailityData.yqobjective"></el-input>
                </el-form-item>
                <el-form-item label="（二）轮转时间和要求 :"  >
                  <el-input type="textarea" readonly v-model="operailityData.yqrequire"></el-input>
                </el-form-item>
                <el-form-item label="（三）临床实践考核 :"  >
                  <el-input type="textarea" readonly v-model="operailityData.yqassessment"></el-input>
                </el-form-item>
                <el-form-item label="（四）教学实践:">
                  <el-input type="textarea" readonly v-model="operailityData.yqpractice"></el-input>
                </el-form-item>
                <el-form-item label="（五）读书报告 :"  >
                  <el-input type="textarea" readonly v-model="operailityData.yqpresentation"></el-input>
                </el-form-item>
                <el-form-item label="（六）学术活动 :" >
                  <el-input type="textarea" readonly v-model="operailityData.yqactivity"></el-input>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row >

        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="八、学术论文:" >
              <el-input type="textarea" readonly v-model="operailityData.dissertation"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-collapse v-model="activeName1" >
              <el-collapse-item title="九、学位论文" name="1">
                <el-form-item label="1. 开题报告 :"  >
                  <el-input type="textarea" readonly v-model="operailityData.paperTopic"></el-input>
                </el-form-item>
                <el-form-item label="2. 论文中期汇报:"  >
                  <el-input type="textarea" readonly v-model="operailityData.paperReport"></el-input>
                </el-form-item>
                <el-form-item label="3. 学位论文撰写与答辩"  >
                  <el-input type="textarea" readonly v-model="operailityData.paperDefence"></el-input>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row >

        <el-row class="table-back-one">
          <el-col :span="24" >
            <el-form-item label="十、学位授予:"  >
              <el-input type="textarea" readonly v-model="operailityData.degreeAwarding"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-two">
          <el-col :span="24" >
            <el-form-item label="十一、就业去向:"  >
              <el-input type="textarea" readonly v-model="operailityData.whereabouts"></el-input>
            </el-form-item>
          </el-col>
        </el-row >

        <el-row class="table-back-one-d">
          <el-col :span="24" >
            <el-form-item label="十二、必读书目:"  >
              <el-table
                align="center"
                :data="operailityData.bookList"
                tooltip-effect="dark"
                highlight-current-row
                style="width: 100%;height: 100%">
                <el-table-column
                  align="center"
                  label="序号"
                  type="index"
                  width="100">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  prop="name"
                  label="书籍名称">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  align="center"
                  prop="author"
                  label="作者">
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row >
      </el-form>
    </div>
    <!--审核列表-->

  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  import { graduateApplyAudit as rules} from '../rules'

  export default {
    props:['operailityData','view'],
    data (){
      return{
        rules,
        tableData:[],
        activeNames:'1',
        activeName1:'1',
        header:[
          {
            width:200,
            label:'课程类型',
          },
          {
            label:'课程名称',
            key:'name',
          },
          {
            width:200,
            label:'拟任授课老师',
            key:'teacher',
          },
          {
            width:200,
            label:'学分',
            key:'credit',
          },
          {
            width:200,
            label:'学时',
            key:'hour',
          },
        ],
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
    },
    methods:{

    },


  }
</script>

