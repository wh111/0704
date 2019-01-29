<!--
****--@file     ProposalPeportWriting_input
****--@date     2018/8/3 11:27
****--@author   YC
****--@describe 开题报告填写-编辑
-->
<template>
  <div class="ProposalPeportWritingInput" ref="inputContent">
    <div class="worldContentBox">
      <el-form ref="formValidate" :model="formValidate">
        <div class="worldContentItem">
          <br>
          <br>
          <p class="yihao" align="center">{{ schoolName }}</p>
          <p class="erhao" align="center">研究生学位论文开题报告</p>
          <p class="erhao" align="center">及论文工作实施计划</p>
          <p class="sihao" align="center">（供中医硕士专业学位研究生用）</p>
          <br>
          <br>
          <br>
          <el-row>
            <el-col :span="10" :offset="7" align="center">
              <el-form-item label="基  地  名   称" label-width="140px" prop="baseName">
                <input class="el-input__inner borderBottom" v-model="formValidate.baseName"/>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="7" align="center">
              <el-form-item label="专           业" label-width="140px" prop="major">
                <input readonly class="el-input__inner borderBottom" v-model="formValidate.major"/>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="7" align="center">
              <el-form-item label="研 究 生 姓 名" label-width="140px" prop="applicantName">
                <input readonly class="el-input__inner borderBottom" v-model="formValidate.applicantName"/>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="7" align="center">
              <el-form-item label="导  师  姓  名" label-width="140px" prop="tutorName">
                <input readonly class="el-input__inner borderBottom" v-model="formValidate.tutorName"/>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="7" align="center">
              <el-form-item label="入  学  年  月" label-width="140px" prop="enrolmentYear">
                <el-date-picker class="borderBottom" v-model="formValidate.enrolmentYear" type="month" placeholder="选择年月"></el-date-picker>
                <!--<input class="el-input__inner borderBottom" v-model="formValidate.enrolmentYear"/>-->
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="7" align="center">
              <el-form-item label="开 题 报 告 日 期" label-width="140px" prop="reportDate">
                <el-date-picker class="borderBottom" v-model="formValidate.reportDate" type="date" placeholder="选择日期"></el-date-picker>
                <!--<input class="el-input__inner borderBottom" v-model="formValidate.reportDate"/>-->
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <br>
          <br>
        </div>

        <div class="worldContentItem">
          <p align="center"><b class="sanhao">{{ schoolName }}研究生院</b></p>
          <br>
          <p class="erhao" align="center">填 表 须 知</p>
          <ul>
            <li class="sihao">1.本表须经导师审批，评议小组签署意见。</li>
            <li class="sihao">2.随本表应附本人的文献综述,博士还需附查新报告。</li>
            <li class="sihao">3.应在第四学期3月31日前完成开题工作。</li>
            <li class="sihao">4.本表原件由研究生本人保存，申请学位时提供审核。</li>
            <li class="sihao">5.本表请如实填写、备查，如有造假，责任自负。</li>
            <li class="sihao">6.本表请用A4纸打印，切勿改变表格格式，内容较多时可以加页。</li>
          </ul>
          <!--<br><br><br><br><br><br><br><br>-->
          <!--</div>-->
          <br><br>
          <!--<div class="worldContentItem">-->
          <p class="sihao">一、学位论文开题报告</p>
          <table class="el-table el-table--border">
            <tr style="height: 0;border: 0;overflow: hidden;">
              <th width="4" height="0"></th>
              <th width="2" height="0"></th>
              <th width="2" height="0"></th>
              <th width="2" height="0"></th>
              <th width="2" height="0"></th>
              <th width="2" height="0"></th>
              <th width="2" height="0"></th>
              <th width="5" height="0"></th>
              <th width="6" height="0"></th>
              <th width="6" height="0"></th>
            </tr>
            <tr align="center">
              <td>
                <div class="cell">论 文 题 目</div>
              </td>
              <td colspan="9">
                <div class="cell">
                  <textarea class="input" readonly v-model="formValidate.topicName"/>
                </div>
              </td>
            </tr>
            <tr align="center">
              <td>
                <div class="cell">研 究 方 向</div>
              </td>
              <td colspan="9">
                <div class="cell">
                  <textarea class="input" readonly v-model="formValidate.researchDirection"/>
                </div>
              </td>
            </tr>
            <tr align="center">
              <td rowspan="2">
                <div class="cell">题 目 来 源</div>
              </td>
              <td>
                <div class="cell"><label for="国家">国家</label></div>
              </td>
              <td>
                <div class="cell"><label for="部委">部委</label></div>
              </td>
              <td>
                <div class="cell"><label for="省">省</label></div>
              </td>
              <td>
                <div class="cell"><label for="市">市</label></div>
              </td>
              <td>
                <div class="cell"><label for="厂、矿">厂、矿</label></div>
              </td>
              <td>
                <div class="cell"><label for="自选">自选</label></div>
              </td>
              <td>
                <div class="cell">有无合同</div>
              </td>
              <td>
                <div class="cell">经费数</div>
              </td>
              <td>
                <div class="cell">备注</div>
              </td>
            </tr>
            <tr align="center">
              <td>
                <div class="cell">
                  <input type="radio" value="国家" id="国家" v-model="formValidate.topicSource">
                </div>
              </td>
              <td>
                <div class="cell">
                  <input type="radio" value="部委" id="部委" v-model="formValidate.topicSource">
                </div>
              </td>
              <td>
                <div class="cell">
                  <input type="radio" value="省" id="省" v-model="formValidate.topicSource">
                </div>
              </td>
              <td>
                <div class="cell">
                  <input type="radio" value="市" id="市" v-model="formValidate.topicSource">
                </div>
              </td>
              <td>
                <div class="cell">
                  <input type="radio" value="厂、矿" id="厂、矿" v-model="formValidate.topicSource">
                </div>
              </td>
              <td>
                <div class="cell">
                  <input type="radio" value="自选" id="自选" v-model="formValidate.topicSource">
                </div>
              </td>
              <td>
                <!--<div class="cell">-->
                <input type="radio" id="hasIsContract" value="YES" v-model="formValidate.isContract">
                <label for="hasIsContract">有</label>
                <input type="radio" id="noIsContract" value="NO" v-model="formValidate.isContract">
                <label for="noIsContract">无</label>
                <!--</div>-->
              </td>
              <td>
                <div class="cell"><input type="text" class="input" v-model="formValidate.funds"></div>
              </td>
              <td>
                <div class="cell">
                  <textarea class="input" v-model="formValidate.remarks"/>
                </div>
              </td>
            </tr>
            <tr align="center">
              <td rowspan="2">
                <div class="cell">题 目 类 型</div>
              </td>
              <td colspan="2">
                <div class="cell"><label for="理论研究">理论研究</label></div>
              </td>
              <td colspan="2">
                <div class="cell"><label for="应用研究">应用研究</label></div>
              </td>
              <td colspan="2">
                <div class="cell"><label for="工程技术">工程技术</label></div>
              </td>
              <td colspan="2">
                <div class="cell"><label for="跨学科研究">跨学科研究</label></div>
              </td>
              <td>
                <div class="cell">其他</div>
              </td>
            </tr>
            <tr align="center">
              <td colspan="2">
                <div class="cell">
                  <input type="radio" value="理论研究" id="理论研究" v-model="formValidate.topicType">
                </div>
              </td>
              <td colspan="2">
                <div class="cell">
                  <input type="radio" value="应用研究" id="应用研究" v-model="formValidate.topicType">
                </div>
              </td>
              <td colspan="2">
                <div class="cell">
                  <input type="radio" value="工程技术" id="工程技术" v-model="formValidate.topicType">
                </div>
              </td>
              <td colspan="2">
                <div class="cell">
                  <input type="radio" value="跨学科研究" id="跨学科研究" v-model="formValidate.topicType">
                </div>
              </td>
              <td colspan="2">
                <div class="cell">
                  <input class="input" v-model="formValidate.topicType">
                </div>
              </td>
            </tr>
            <tr align="center">
              <td>
                <div class="cell">
                  论文开题前上网检索情况（硕士生可不作要求；博士生应填写并附查新报告）
                </div>
              </td>
              <td colspan="9">
                <div class="cell" style="height: 100%">
                  <textarea class="input" v-model="formValidate.networkRetrieval"/>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="10">
                <div class="cell">
                  <p class="sihao margin-top-14px">开题报告内容（具体要求见《南京中医药大学研究生选题、开题报告的原则和要求》）</p>
                  <p class="sihao">（一）课题研究目的，其理论与实际意义，国内外研究动态和发展趋势</p>
                  <textarea style="height: 100px;min-width: 100%;max-width: 100%;min-height: 50px;max-height: 600px;" class="input"
                            v-model="formValidate.researchObjective"/>
                  <p class="sihao">（二）课题研究的内容和主要研究方法</p>
                  <textarea style="height: 100px;min-width: 100%;max-width: 100%;min-height: 50px;max-height: 600px;" class="input"
                            v-model="formValidate.contentAndMethod"/>
                  <p class="sihao">（三）课题研究的目标</p>
                  <textarea style="height: 100px;min-width: 100%;max-width: 100%;min-height: 50px;max-height: 600px;" class="input"
                            v-model="formValidate.subjectTarget"/>
                  <p class="sihao">（四）完成课题的条件</p>
                  <textarea style="height: 100px;min-width: 100%;max-width: 100%;min-height: 50px;max-height: 600px;" class="input"
                            v-model="formValidate.completionConditions"/>
                  <p class="sihao">（五）研究进度、具体安排及预期结果 </p>
                  <textarea style="height: 100px;min-width: 100%;max-width: 100%;min-height: 50px;max-height: 600px;" class="input"
                            v-model="formValidate.expectedResults"/>
                  <br>
                  <p align="right">
                    <span class="sihao">研究生签名 {{ formValidate.applicantName }}</span>
                    <span style="width: 25px;display: inline-block;"></span>
                  </p>
                  <br>
                  <p align="right">
                    <span class="sihao">年</span>
                    <span style="width: 20px;display: inline-block;"></span>
                    <span class="sihao">月</span>
                    <span style="width: 20px;display: inline-block;"></span>
                    <span class="sihao" style="margin-right: 40px;">日</span>
                  </p>
                  <br><br>
                </div>
              </td>
            </tr>
          </table>
          <!--</div>-->
          <br>
          <br>
          <!--<div class="worldContentItem">-->
          <p class="sihao">二、学位论文工作实施计划</p>
          <p class="sihao">（一）论文的理论分析与硬件要求及其预期达到的水平与结果</p>
          <textarea class="input" style="height: 100px;min-width: 100%;max-width: 100%;min-height: 50px;max-height: 600px;"
                    v-model="formValidate.theoreticalAnalysisResults"/>
          <p><br></p>
          <p class="sihao">（二）论文工作进度与安排 <span style="margin-left: 20px;margin-bottom: 10px;"><el-button type="info" size="small" @click="addArrange">点击添加</el-button></span></p>
          <table class="el-table el-table--border">
            <tr align="center">
              <td>
                <div class="cell">起讫日期</div>
              </td>
              <td>
                <div class="cell">工 作 内 容 和 要 求</div>
              </td>
              <td>
                <div class="cell">备 注</div>
              </td>
            </tr>
            <tr v-for="(item,index) in formValidate.arrangeList" :key="index">
              <td>
                <el-date-picker class="borderBottom" v-model="item.startDate" type="date" placeholder="选择日期"></el-date-picker>
                <!--<input type="text" v-model="item.startDate">-->
                -
                <el-date-picker class="borderBottom" v-model="item.endDate" type="date" placeholder="选择日期"></el-date-picker>
                <!--<input type="text" v-model="item.endDate">-->
              </td>
              <td>
                <div class="cell">
                  <textarea v-model="item.workArrangement" class="input"></textarea>
                  <!--<input type="text" v-model="item.workArrangement">-->
                </div>
              </td>
              <td>
                <div class="cell">
                  <textarea v-model="item.remarks" class="input"></textarea>

                  <!--<input type="text" v-model="item.remarks">-->
                </div>
              </td>
            </tr>
          </table>
          <br>
          <p class="sihao">（三）论文的大纲</p>
          <textarea class="input" style="height: 250px;min-width: 100%;max-width: 100%;min-height: 50px;max-height: 600px;" v-model="formValidate.outline"/>
          <p></p>
          <br>
          <!--</div>-->
          <br>
          <!--<div class="worldContentItem">-->
          <p class="sihao textCenter">学 科 评 议 小 组 意 见 统 计</p>
          <table class="el-table el-table--border">
            <tr align="center">
              <td>
                <div class="cell">
                  评议项目
                </div>
              </td>
              <td colspan="3">
                <div class="cell">评议意见</div>
              </td>
            </tr>
            <tr align="center">
              <td>
                <div class="cell">论文选题的意义</div>
              </td>
              <td>
                <div class="cell">
                  <p>好</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.significanceGood">)人</p>
                </div>
              </td>
              <td>
                <div class="cell">
                  <p>一般</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.significanceOrdinary">)人</p>
                </div>
              </td>
              <td>
                <div class="cell">
                  <p>差</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.significanceBad">)人</p>
                </div>
              </td>
            </tr>
            <tr align="center">
              <td>
                <div class="cell">论文难度与工作量是否适度</div>
              </td>
              <td>
                <div class="cell">
                  <p>偏高</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.workloadBig">)人</p>
                </div>
              </td>
              <td>
                <div class="cell">
                  <p>适当</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.workloadAppropriate">)人</p>
                </div>
              </td>
              <td>
                <div class="cell">
                  <p>偏低</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.workloadSmall">)人</p>
                </div>
              </td>
            </tr>
            <tr align="center">
              <td>
                <div class="cell">研究方案的可行性</div>
              </td>
              <td>
                <div class="cell">
                  <p>可行性高</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.feasibilityBig">)人</p>
                </div>
              </td>
              <td>
                <div class="cell">
                  <p>一般</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.feasibilityOrdinary">)人</p>
                </div>
              </td>
              <td>
                <div class="cell">
                  <p>不可行</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.infeasible">)人</p>
                </div>
              </td>
            </tr>
            <tr align="center">
              <td>
                <div class="cell">是否同意论文开题</div>
              </td>
              <td>
                <div class="cell">
                  <p>同意</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.agree">)人</p>
                </div>
              </td>
              <td>
                <div class="cell">
                  <p>不同意</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.disagree">)人</p>
                </div>
              </td>
              <td>
                <div class="cell">
                  <p>弃权</p>
                  <p>(<input class="textCenter smallInput" type="text" v-model="formValidate.waiver">)人</p>
                </div>
              </td>
            </tr>
          </table>
          <br>
          <p class="sihao textCenter">评 议 小 组 组 成 人 员 <span class="printHidden" style="margin-left: 20px;margin-bottom: 10px;"><el-button type="info" size="small" @click="addGroup">点击添加</el-button></span></p>
          <table class="el-table el-table--border">
            <tr align="center">
              <td>
                <div class="cell">评议小组</div>
              </td>
              <td>
                <div class="cell">姓 名</div>
              </td>
              <td>
                <div class="cell">职 称</div>
              </td>
              <td>
                <div class="cell">研究方向</div>
              </td>
              <td>
                <div class="cell">所在单位或部门</div>
              </td>
            </tr>
            <tr v-for="(item,index) in formValidate.groupList" :key="index" align="center">
              <td>
                <div class="cell">组{{ index ===0 ? '长' : '员'}}</div>
              </td>
              <td>
                <div class="cell"><input class="input" type="text" v-model="item.name"></div>
              </td>
              <td>
                <div class="cell"><input class="input" type="text" v-model="item.dutiesTitle"></div>
              </td>
              <td>
                <div class="cell"><input class="input" type="text" v-model="item.researchDirection"></div>
              </td>
              <td>
                <div class="cell"><input class="input" type="text" v-model="item.dept"></div>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <div class="cell">
                  <p class="margin-top-14px">记录人：</p>
                  <br>
                  <br>
                  <p align="right">
                    <span class="sihao">年</span>
                    <span style="width: 20px;display: inline-block;"></span>
                    <span class="sihao">月</span>
                    <span style="width: 20px;display: inline-block;"></span>
                    <span class="sihao" style="margin-right: 40px;">日</span>
                  </p>
                  <br><br>
                </div>
              </td>
            </tr>
          </table>
          <!--</div>-->
          <br><br>
          <!--<div class="worldContentItem">-->
          <el-row style="border: 1px solid #ccc;position: relative;">
            <el-col style="width: 100px;padding: 18px;position: absolute;left: 0;top: 50%;transform: translateY(-50%)">
              <span class="cell">导师对开题报告的综合意见</span>
            </el-col>
            <el-col style="padding-left: 100px;">
              <div style="padding: 18px;border-left: 1px solid #ccc;">
                  <textarea style="height: 100px;min-width: 100%;max-width: 100%;min-height: 50px;max-height: 600px;" class="input"
                            v-model="formValidate.tutorOpinion"/>
                <br>
                <p align="right">
                  <span class="sihao">指导教师（签名） {{ formValidate.tutorName }}</span>
                  <span style="width: 25px;display: inline-block;"></span>
                </p>
                <br>
                <p align="right">
                  <span class="sihao">年</span>
                  <span style="width: 20px;display: inline-block;"></span>
                  <span class="sihao">月</span>
                  <span style="width: 20px;display: inline-block;"></span>
                  <span class="sihao" style="margin-right: 40px;">日</span>
                </p>
                <br><br>
              </div>
            </el-col>
          </el-row>
          <el-row style="border: 1px solid #ccc;position: relative;">
            <el-col style="width: 100px;padding: 18px;position: absolute;left: 0;top: 50%;transform: translateY(-50%)">
              <span class="cell">开题报告评议情况记录</span>
            </el-col>
            <el-col style="padding-left: 100px;">
              <div style="padding: 18px;border-left: 1px solid #ccc;" class="cell">
                <p>
                  1.评议小组成员（一般不少于5人）
                </p>
                <p style="padding: 5px 0;">组长：{{ groupInfo.leader }}</p>
                <p style="padding: 5px 0;">组员：{{ groupInfo.member.join('、') }}</p>
                <p style="padding: 5px 0;">2.评议小组意见</p>
                <textarea style="height: 100px;min-width: 100%;max-width: 100%;min-height: 50px;max-height: 600px;" class="input"
                          v-model="formValidate.groupOpinion"/>
                <br>
                <p style="padding: 5px 0;">3.开题结果</p>
                <p style="padding: 5px 0;">
                  <input type="radio" value="通过" id="resultTG" v-model="formValidate.result">
                  <label for="resultTG">通过</label>
                  <input type="radio" value="不通过" id="resultBTG" v-model="formValidate.result">
                  <label for="resultBTG">不通过</label>
                </p>
                <p align="right">
                  <span class="sihao">年</span>
                  <span style="width: 20px;display: inline-block;"></span>
                  <span class="sihao">月</span>
                  <span style="width: 20px;display: inline-block;"></span>
                  <span class="sihao" style="margin-right: 40px;">日</span>
                </p>
                <br><br>
              </div>
            </el-col>
          </el-row>

        </div>
      </el-form>
    </div>
    <div class="btnBox" align="right">
      <!--<el-checkbox style="margin-right: 10px;" v-model="isBackList" true-label="1" false-label="0">返回列表</el-checkbox>-->
      <load-btn @save="save" :btnData="saveBtn" v-if="formValidate.id"></load-btn>
      <load-btn @save="saveBackList" :btnData="saveBackListBtn"></load-btn>
      <el-button @click="backList">取消</el-button>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../../../../assets/ambuf/css/common/worldContent";

  .ProposalPeportWritingInput {
    height: 100%;
    position: relative;
    .worldContentBox {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 50px;
    }
    .btnBox {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'ProposalPeportWritingInput',
    props: ['operailityData'],
    data () {
      return {
//        isBackList: '0',
        userInfo: {},
        schoolName:'',
        formValidate: {
          'id': '', // 1,
          'applicantId': '', // 1,
          'applicantName': '', // "张三",
          'sex': '', // 申请人性别
//          'name': '', // "申请人",
          'baseName': '', // "基地名称",
          'major': '', // "专业",
          'tutorId': '', // "导师id",
          'tutorName': '', // "导师姓名",
          'enrolmentYear': '', // "入学年月",
          'reportDate': '', // "开题报告日期",
          'topicName': '', // "论文题目",
          'researchDirection': '', // "研究方向",
          'topicSource': '', // "题目来源",
          'isContract': 'NO', // "是否有合同",
          'funds': '', // "经费数",
          'remarks': '', // "备注",
          'topicType': '', // "题目类型",
          'networkRetrieval': '', // "上网检索情况",
          'researchObjective': '', // "研究目的",
          'contentAndMethod': '', // "研究内容和方法",
          'subjectTarget': '', // "课题目标",
          'completionConditions': '', // "课题条件",
          'expectedResults': '', // "安排及预期结果",
          'outline': '', // "论文大纲",
          'tutorOpinion': '', // "导师综合意见",
          'groupOpinion': '', // "评议小组意见",
          'result': '', // "开题结果",
          'status': 'WSB', // "开题报告状态", 发布状态 枚举：('WSB未上报','DSDSH待导师审核','DSBH导师审核驳回','JYSDSH待教研室审核','JYSBH教研室审核驳回','JYCDSH待教育处审核','JYCBH教育处审核驳回','TG通过')
          'auditName': '', // "审核人",
          'auditTime': '', // "审核时间",
          'auditOpinion': '', // "审核意见",
          'jysAuditName': '', // "教研室审核人",
          'jysAuditTime': '', // "教研室审核时间",
          'jysAuditOpinion': '', // "教研室审核意见",
          'jycAuditName': '', // "教育处审核人",
          'jycAuditTime': '', // "教育处审核时间",
          'jycAuditOpinion': '', // "教育处审核意见",
          'significanceGood': '', // "意义好的人数",
          'significanceOrdinary': '', // "意义一般的人数",
          'significanceBad': '', // "意义差的人数",
          'workloadBig': '', // "工作量偏大的人数",
          'workloadAppropriate': '', // "工作量适当的人数",
          'workloadSmall': '', // "工作量偏低的人数",
          'feasibilityBig': '', // "可行性高的人数",
          'feasibilityOrdinary': '', // "可行性一般的人数",
          'infeasible': '', // "不可行的人数",
          'agree': '', // "同意的人数",
          'disagree': '', // "不同意的人数",
          'waiver': '', // "弃权的人数",
          'groupList': [
            {
              'name': '', // "姓名",
              'dutiesTitle': '', // "职称",
              'researchDirection': '', // "研究方向",
              'dept': '', // "所在部门或单位",
              'role': '' // "角色"
            },
            {
              'name': '', // "姓名",
              'dutiesTitle': '', // "职称",
              'researchDirection': '', // "研究方向",
              'dept': '', // "所在部门或单位",
              'role': '' // "角色"
            }
          ],
          arrangeList: [ // 论文工作进度与安排
            {
              startDate: '', // 开始日期
              endDate: '', // 结束日期
              workArrangement: '', // 工作安排
              remarks: '' // 备注
            }
          ]
        },
        saveBtn: {title: '保存', callParEvent: 'save'},
        saveBackListBtn: {title: '保存并返回列表', callParEvent: 'save'},
        editType: 'add'
      };
    },
    computed: {
      groupInfo () {
        let info = {leader: '', member: []};
        this.formValidate.groupList.map((item, index) => {
          if (index === 0) {
            info.leader = item.name;
          } else {
            info.member.push(item.name);
          }
        });
        return info;
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        let userInfo = this.$store.getters['getUserInfo'];
        Util = this.$util;
        this.userInfo = userInfo;
        this.schoolName = userInfo.schoolName || userInfo.school;
        if (this.operailityData && this.operailityData.id) {
          this.editType = 'edit';
          this.getViewData();
        } else {
          this.initInfo();
        }
      },
      /************************* 按钮事件 *************************/
      // 返回列表
      backList () {
        this.$emit('show', 'list');
      },
      // 保存
      save (isLoadingFun) {
        this.saveDataToServer(isLoadingFun);
      },
      // 保存并返回列表
      saveBackList (isLoadingFun) {
        this.saveDataToServer(isLoadingFun, () => this.backList());
      },

      // 添加论文计划安排
      addArrange () {
        this.formValidate.arrangeList.push({
          startDate: '', // 开始日期
          endDate: '', // 结束日期
          workArrangement: '', // 工作安排
          remarks: '' // 备注}))
        });
      },

      // 添加组员
      addGroup () {
        this.formValidate.groupList.push({
          'name': '', // "姓名",
          'dutiesTitle': '', // "职称",
          'researchDirection': '', // "研究方向",
          'dept': '', // "所在部门或单位",
          'role': '' // "角色"
        });
      },
      /************************* 数据转换 *************************/
      // 获取保存数据
      getSaveData () {
        let data = Util._.defaultsDeep({}, this.formValidate);
        let dateType = {month: 'yyyy-MM', date: 'yyyy-MM-dd'};
        let dateMap = [
          {key: 'enrolmentYear', dataType: 'month'},
          {key: 'reportDate', dataType: 'date'}
        ];
        // 日期格式转换
        dateMap.map(item => data[item.key] = this.conductDate(data[item.key], data[dateType[item.dateType]]));
        data.arrangeList.map(item => {
          item.startDate = this.conductDate(item.startDate, dateType.date);
          item.endDate = this.conductDate(item.endDate, dateType.date);
        });
        // 第一个默认为组长
        data.groupList.map((item, index) => item.role = (index === 0 ? 'LEADER' : 'MEMBER'));
        return data;
      },
      // 初始化报告的学生信息
      initInfo () {
        let {id, name, sex} = this.userInfo;
        this.formValidate.applicantId = id;
        this.formValidate.applicantName = name;
        this.formValidate.sex = sex;
        // 从选择的开题申请中获取到的数据
        ['applicationId', 'topicName', 'researchDirection', 'deptId'].map(key => this.formValidate[key] = this.operailityData[key]);
        this.getTeacherAndMajor();
      },
      /************************* 数据获取 *************************/
      // 保存数据到服务器
      saveDataToServer (isLoadingFun, callFun) {
        let opt = {
          errorTitle: '保存失败，请重试！',
          ajaxSuccess: res => {
            this.successMess('保存成功！');
            callFun && callFun(res);
          },
          ajaxParams: {
            jsonString: true,
            url: api[this.editType === 'add' ? 'applicationAdd' : 'applicationModify'].path + (this.editType === 'add' ? '' : this.formValidate.id),
            method: api[this.editType === 'add' ? 'applicationAdd' : 'applicationModify'].method,
            data: this.getSaveData()
          }
        };
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        return this.ajax(opt, isLoadingFun);
      },
      // 获取当前学生的导师和专业
      getTeacherAndMajor () {
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            if (data instanceof Object) {
              let {major, teacherName = '', teacherId = ''} = data;
              this.formValidate.major = major;
              this.formValidate.tutorId = teacherId;
              this.formValidate.tutorName = teacherName;
            } else {
              this.errorMess('获取导师和专业信息失败，请重试！');
            }
          },
          ajaxParams: {
            url: api.getTeacherAndMajor.path,
            method: api.getTeacherAndMajor.method,
            params: {
              userId: this.userInfo.id
            }
          }
        };
        this.ajax(opt);
      },
      // 获取编辑数据
      getViewData () {
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            if (!data.arrangeList.length) {
              data.arrangeList.push({
                startDate: '', // 开始日期
                endDate: '', // 结束日期
                workArrangement: '', // 工作安排
                remarks: '' // 备注}))
              });
            }
            if (!data.groupList.length) {
              data.groupList.push({
                'name': '', // "姓名",
                'dutiesTitle': '', // "职称",
                'researchDirection': '', // "研究方向",
                'dept': '', // "所在部门或单位",
                'role': '' // "角色"
              });
            }
            this.formValidate = data;
          },
          ajaxParams: {
            url: api.auditGet.path + this.operailityData.id,
            method: api.auditGet.method,
            params: {
              id: this.operailityData.id
            }
          }
        };
        this.ajax(opt);
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
