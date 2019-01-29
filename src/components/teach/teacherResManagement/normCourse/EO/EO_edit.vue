<template>
  <!-- 评测与作业 -->
  <el-row class="nTestTable">
    <el-form inline ref="item" v-for="(item,index) in planDtoList" :key="index">
      <fieldset class="nPlanItem">
        <legend style="font-size:16px">&nbsp;&nbsp;第{{ indexText(index) }}节：{{ item.content || '未填写' }}&nbsp;&nbsp;</legend>
        <el-col :span="4">
          <el-form-item label="课前评测"></el-form-item>
        </el-col>
        <el-col :span="20" align="right">
          <el-form :model="item.testingDtoListTemp.before" :rules="rules" ref="score">
            <el-form-item label="达标分数：" prop="score">
              <el-input :readonly="isReadOnly" class="tdlbScoreInput" size="small" v-model="item.testingDtoListTemp.before.score"></el-input>
              <!-- <span>(系统可自动根据试题数量折算满分100)</span> -->
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <el-form-item>
            <template v-if="!isReadOnly">
              <el-button size="small" type="success" @click="addTestingDto('before',index)">添加试题</el-button>
              <el-button size="small" type="danger" @click="removeTestingDto('before',index)">删除试题</el-button>
              <!-- <el-button size="small" type="warning" @click="importTestingDto('before',index)">导入试题</el-button>
              <el-button size="small" type="info" @click="exportTestingDto('before',index)">导出试题</el-button> -->
            </template>
            <el-button size="small" type="primary" @click="showTestingDto('before',index)">整体预览</el-button>
          </el-form-item>
        </el-col>
        <el-table ref="singleTable" :data="item.testingDtoListTemp.before.questionsDtoList" @selection-change="handleSelectionChangeBefore">
          <el-table-column v-if="!isReadOnly" type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="68">
          </el-table-column>
          <el-table-column property="types" label="试题类型" width="122">
            <template scope="scope">
              <el-select v-if="!isReadOnly" v-model="scope.row.types" size="small" @change="changeTypes('before',index,scope.$index,scope.row.types)">
                <el-option v-for="item in testTypeOption" v-if="item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <template v-else>
                {{ scope.row.types | typeText }}
              </template>
            </template>
          </el-table-column>
          <el-table-column property="subject" label="题干">
            <template scope="scope">
              <el-tooltip effect="light" content="请编辑题干" placement="bottom">
                <view-subject slot="content" :val="scope.row.subject" v-if="scope.row.subject"></view-subject>
                <el-button :disabled="isReadOnly" size="small" @click="edit('before',index,scope.$index,'editSubject','subject')">编辑</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column property="optionsDtoList" label="候选项">
            <template scope="scope">
              <el-tooltip effect="light" content="请编辑选项" placement="bottom">
                <view-option slot="content" :val="scope.row.optionsDtoList" v-if="scope.row.optionsDtoList && scope.row.optionsDtoList.length"></view-option>
                <el-button size="small" @click="edit('before',index,scope.$index,'editOption','optionsDtoList')" :disabled="isReadOnly || ['RADIO','CHECKBOX','JUDGMENT'].indexOf(scope.row.types) < 0">编辑</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="正确答案">
            <template scope="scope">
              <!-- 单选\多\判断选题 -->
              <template v-if="['RADIO','CHECKBOX','JUDGMENT'].indexOf(scope.row.types) > -1 && scope.row.optionsDtoList">
                <el-tooltip effect="light" content="请选择正确答案" placement="bottom">
                  <view-answer slot="content" :val="scope.row.options" :the-type="scope.row.types" v-if="scope.row.options"></view-answer>
                  <el-button size="small" :disabled="isReadOnly || !scope.row.optionsDtoList.length" @click="edit('before',index,scope.$index,'editAnswer','options')">编辑</el-button>
                </el-tooltip>
              </template>
              <!-- 简答题 -->
              <template v-else-if="scope.row.keyWords">
                <el-tooltip effect="light" content="请填写正确答案" placement="bottom">
                  <view-answer slot="content" :val="scope.row.keyWords" :the-type="scope.row.types" v-if="scope.row.keyWords"></view-answer>
                  <el-button :disabled="isReadOnly" size="small" @click="edit('before',index,scope.$index,'editAnswer','keyWords')">编辑</el-button>
                </el-tooltip>
              </template>
            </template>
          </el-table-column>
          <el-table-column property="answerExplain" label="答案解析">
            <template scope="scope">
              <el-tooltip effect="light" content="请编辑答案解析" placement="bottom">
                <view-subject slot="content" :val="scope.row.answerExplain" v-if="scope.row.answerExplain"></view-subject>
                <el-button :disabled="isReadOnly" size="small" @click="edit('before',index,scope.$index,'editAnswerExplain','answerExplain')">编辑</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="分数">
            <template scope="scope">
              <el-input v-model="scope.row.optionScore"></el-input>
              <!-- {{ getScoreByTable(item.testingDtoListTemp.before.questionsDtoList,scope.$index) }} -->
            </template>
          </el-table-column>
        </el-table>

        <!-- 课中 -->
        <el-col :span="4">
          <el-form-item label="课中评测"></el-form-item>
        </el-col>
        <el-col :span="20" align="right">
          <el-form :model="item.testingDtoListTemp.in_progress" :rules="rules" ref="score">
            <el-form-item label="达标分数：" prop="score">
              <el-input :readonly="isReadOnly" class="tdlbScoreInput" size="small" v-model="item.testingDtoListTemp.in_progress.score"></el-input>
              <!-- <span>(系统可自动根据试题数量折算满分100)</span> -->
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <el-form-item>
            <template v-if="!isReadOnly">
              <el-button size="small" type="success" @click="addTestingDto('in_progress',index)">添加试题</el-button>
              <el-button size="small" type="danger" @click="removeTestingDto('in_progress',index)">删除试题</el-button>
              <!-- <el-button size="small" type="warning" @click="importTestingDto('in_progress',index)">导入试题</el-button>
              <el-button size="small" type="info" @click="exportTestingDto('in_progress',index)">导出试题</el-button> -->
            </template>
            <el-button size="small" type="primary" @click="showTestingDto('in_progress',index)">整体预览</el-button>
          </el-form-item>
        </el-col>
        <el-table ref="singleTable" :data="item.testingDtoListTemp.in_progress.questionsDtoList" @selection-change="handleSelectionChangeIn_progress">
          <el-table-column v-if="!isReadOnly" type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="68">
          </el-table-column>
          <el-table-column property="types" label="试题类型" width="122">
            <template scope="scope">
              <el-select v-if="!isReadOnly" v-model="scope.row.types" size="small" @change="changeTypes('in_progress',index,scope.$index,scope.row.types)">
                <el-option v-for="item in testTypeOption" v-if="item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <template v-else>
                {{ scope.row.types | typeText }}
              </template>
            </template>
          </el-table-column>
          <el-table-column property="subject" label="题干">
            <template scope="scope">
              <el-tooltip effect="light" content="请编辑题干" placement="bottom">
                <view-subject slot="content" :val="scope.row.subject" v-if="scope.row.subject"></view-subject>
                <el-button :disabled="isReadOnly" size="small" @click="edit('in_progress',index,scope.$index,'editSubject','subject')">编辑</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column property="optionsDtoList" label="候选项">
            <template scope="scope">
              <el-tooltip effect="light" content="请编辑选项" placement="bottom">
                <view-option slot="content" :val="scope.row.optionsDtoList" v-if="scope.row.optionsDtoList && scope.row.optionsDtoList.length"></view-option>
                <el-button size="small" @click="edit('in_progress',index,scope.$index,'editOption','optionsDtoList')" :disabled="isReadOnly || ['RADIO','CHECKBOX','JUDGMENT'].indexOf(scope.row.types) < 0">编辑</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="正确答案">
            <template scope="scope">
              <!-- 单选\多\判断选题 -->
              <template v-if="['RADIO','CHECKBOX','JUDGMENT'].indexOf(scope.row.types) > -1 && scope.row.optionsDtoList">
                <el-tooltip effect="light" content="请选择正确答案" placement="bottom">
                  <view-answer slot="content" :val="scope.row.options" :the-type="scope.row.types" v-if="scope.row.options"></view-answer>
                  <el-button size="small" :disabled="isReadOnly || !scope.row.optionsDtoList.length" @click="edit('in_progress',index,scope.$index,'editAnswer','options')">编辑</el-button>
                </el-tooltip>
              </template>
              <!-- 简答题 -->
              <template v-else-if="scope.row.keyWords">
                <el-tooltip effect="light" content="请填写正确答案" placement="bottom">
                  <view-answer slot="content" :val="scope.row.keyWords" :the-type="scope.row.types" v-if="scope.row.keyWords"></view-answer>
                  <el-button :disabled="isReadOnly" size="small" @click="edit('in_progress',index,scope.$index,'editAnswer','keyWords')">编辑</el-button>
                </el-tooltip>
              </template>
            </template>
          </el-table-column>
          <el-table-column property="answerExplain" label="答案解析">
            <template scope="scope">
              <el-tooltip effect="light" content="请编辑答案解析" placement="bottom">
                <view-subject slot="content" :val="scope.row.answerExplain" v-if="scope.row.answerExplain"></view-subject>
                <el-button :disabled="isReadOnly" size="small" @click="edit('in_progress',index,scope.$index,'editAnswerExplain','answerExplain')">编辑</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column property="title" label="分数">
            <template scope="scope">
              <el-input v-model="scope.row.optionScore"></el-input>
              <!-- {{ getScoreByTable(item.testingDtoListTemp.in_progress.questionsDtoList,scope.$index) }} -->
            </template>
          </el-table-column>
        </el-table>

        <!-- 课后 -->
        <el-col :span="4">
          <el-form-item label="课后评测"></el-form-item>
        </el-col>
        <el-col :span="20" align="right">
          <el-form :model="item.testingDtoListTemp.after" :rules="rules" ref="score">
            <el-form-item label="达标分数：" prop="score">
              <el-input :readonly="isReadOnly" class="tdlbScoreInput" size="small" v-model="item.testingDtoListTemp.after.score"></el-input>
              <!-- <span>(系统可自动根据试题数量折算满分100)</span> -->
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <el-form-item>
            <template v-if="!isReadOnly">
              <el-button size="small" type="success" @click="addTestingDto('after',index)">添加试题</el-button>
              <el-button size="small" type="danger" @click="removeTestingDto('after',index)">删除试题</el-button>
              <!-- <el-button size="small" type="warning" @click="importTestingDto('after',index)">导入试题</el-button>
              <el-button size="small" type="info" @click="exportTestingDto('after',index)">导出试题</el-button> -->
            </template>
            <el-button size="small" type="primary" @click="showTestingDto('after',index)">整体预览</el-button>
          </el-form-item>
        </el-col>
        <el-table ref="singleTable" :data="item.testingDtoListTemp.after.questionsDtoList" @selection-change="handleSelectionChangeAfter">
          <el-table-column v-if="!isReadOnly" type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="68">
          </el-table-column>
          <el-table-column property="types" label="试题类型" width="122">
            <template scope="scope">
              <el-select v-if="!isReadOnly" v-model="scope.row.types" size="small" @change="changeTypes('after',index,scope.$index,scope.row.types)">
                <el-option v-for="item in testTypeOption" v-if="item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <template v-else>
                {{ scope.row.types | typeText }}
              </template>
            </template>
          </el-table-column>
          <el-table-column property="subject" label="题干">
            <template scope="scope">
              <el-tooltip effect="light" content="请编辑题干" placement="bottom">
                <view-subject slot="content" :val="scope.row.subject" v-if="scope.row.subject"></view-subject>
                <el-button :disabled="isReadOnly" size="small" @click="edit('after',index,scope.$index,'editSubject','subject')">编辑</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column property="optionsDtoList" label="候选项">
            <template scope="scope">
              <el-tooltip effect="light" content="请编辑选项" placement="bottom">
                <view-option slot="content" :val="scope.row.optionsDtoList" v-if="scope.row.optionsDtoList && scope.row.optionsDtoList.length"></view-option>
                <el-button size="small" @click="edit('after',index,scope.$index,'editOption','optionsDtoList')" :disabled="isReadOnly || ['RADIO','CHECKBOX','JUDGMENT'].indexOf(scope.row.types) < 0">编辑</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="正确答案">
            <template scope="scope">
              <!-- 单选\多\判断选题 -->
              <template v-if="['RADIO','CHECKBOX','JUDGMENT'].indexOf(scope.row.types) > -1 && scope.row.optionsDtoList">
                <el-tooltip effect="light" content="请选择正确答案" placement="bottom">
                  <view-answer slot="content" :val="scope.row.options" :the-type="scope.row.types" v-if="scope.row.options"></view-answer>
                  <el-button size="small" :disabled="isReadOnly || !scope.row.optionsDtoList.length" @click="edit('after',index,scope.$index,'editAnswer','options')">编辑</el-button>
                </el-tooltip>
              </template>
              <!-- 简答题 -->
              <template v-else-if="scope.row.keyWords">
                <el-tooltip effect="light" content="请填写正确答案" placement="bottom">
                  <view-answer slot="content" :val="scope.row.keyWords" :the-type="scope.row.types" v-if="scope.row.keyWords"></view-answer>
                  <el-button :disabled="isReadOnly" size="small" @click="edit('after',index,scope.$index,'editAnswer','keyWords')">编辑</el-button>
                </el-tooltip>
              </template>
            </template>
          </el-table-column>
          <el-table-column property="answerExplain" label="答案解析">
            <template scope="scope">
              <el-tooltip effect="light" content="请编辑答案解析" placement="bottom">
                <view-subject slot="content" :val="scope.row.answerExplain" v-if="scope.row.answerExplain"></view-subject>
                <el-button :disabled="isReadOnly" size="small" @click="edit('after',index,scope.$index,'editAnswerExplain','answerExplain')">编辑</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column property="optionScore" label="分数">
            <template scope="scope">
              <el-input v-model="scope.row.optionScore"></el-input>
              <!-- {{ getScoreByTable(item.testingDtoListTemp.after.questionsDtoList,scope.$index) }} -->
            </template>
          </el-table-column>
        </el-table>
      </fieldset>
    </el-form>

    <!-- 编辑题干 -->
    <Modal :mask-closable="false" v-model="model.editSubject" height="200" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :parent="self" :content="headerContent.editSubjectId"></modal-header>
      <edit-subject v-if="model.editSubject" @save="subCallback" :operaility-data="operailityData"></edit-subject>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑选项 -->
    <Modal :mask-closable="false" v-model="model.editOption" height="200" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :parent="self" :content="headerContent.editOptionId"></modal-header>
      <edit-option v-if="model.editOption" @save="subCallback" :operaility-data="operailityData" :the-type="theTypes"></edit-option>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑答案 -->
    <Modal :mask-closable="false" v-model="model.editAnswer" height="200" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :parent="self" :content="headerContent.editAnswerId"></modal-header>
      <edit-answer v-if="model.editAnswer" @save="subCallback" :operaility-data="operailityData" :the-type="theTypes" :row-data="rowData"></edit-answer>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑答案解析 -->
    <Modal :mask-closable="false" v-model="model.editAnswerExplain" height="200" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :parent="self" :content="headerContent.editAnswerExplainId"></modal-header>
      <edit-subject v-if="model.editAnswerExplain" @save="subCallback" :operaility-data="operailityData"></edit-subject>
      <div slot="footer"></div>
    </Modal>
    <!-- 试题预览 -->
    <Modal :mask-closable="false" v-model="model.eqLook" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :parent="self" :content="headerContent.eqLookId"></modal-header>
      <eq-look v-if="model.eqLook" :show-data="viewTestData"></eq-look>
      <div slot="footer"></div>
    </Modal>
  </el-row>
</template>

<script>
  import {
    eq as rules
  } from '../rules';
  import testTypeOption from './testTypeOption';
  import editSubject from './subject/edit'; // 编辑题干
  import viewSubject from './subject/view'; // 查看题干
  import editOption from './options/edit'; // 编辑选项
  import viewOption from './options/view'; // 查看选项
  import editAnswer from './answer/edit'; // 编辑正确答案
  import viewAnswer from './answer/view'; // 查看正确答案
  import eqLook from './EO_look'; // 试题预览

  export default {
    props: ['readOnly'],
    data() {
      return {
        self: this,
        rules, // 验证输入规则
        testTypeOption, // 试题类型
        multipleSelection: [],
        rowData: {}, // 当前行数据
        planDtoList: [],
        isReadOnly: false, // 只读
        theTypes: '', // 当前操作题目的类型
        todoObj: { // 操作记录
          type: '', // 所属类型（课前|课中|课后）
          types: '', // 题目类型（单选|多选|判断题|问答题）
          planIndex: -1, // 第几节课的索引
          todoIndex: -1, // 第几题索引
          model: '', // 打开的弹窗
          valKey: '', // 操作值的键名
        },
        operailityData: '',
        model: {
          editSubject: false,
          editOption: false,
          editAnswer: false,
          editAnswerExplain: false,
          eqLook: false,
        },
        headerContent: {
          editSubjectId: {
            id: 'editSubjectId',
            title: '编辑题干'
          },
          editOptionId: {
            id: 'editOptionId',
            title: '编辑选项'
          },
          editAnswerId: {
            id: 'editAnswerId',
            title: '编辑答案'
          },
          editAnswerExplainId: {
            id: 'editAnswerExplainId',
            title: '编辑答案解析'
          },
          eqLookId: {
            id: 'eqLookId',
            title: '试题预览'
          },
        },
        viewTestData: {}, // 试题整体预览数据
      }
    },
    methods: {
      // 初始化
      init() {
        this.isReadOnly = this.readOnly !== undefined;
        this.planDtoList = this.$store.state.curriculum.data.planDtoList;
      },
      /******************************************** 作业操作 ***************************************/
      // 编辑（参数对应data中的todoObj对象）
      edit(type, planIndex, todoIndex, model, valKey) {
        let mustHasType = ['editOption']; // 必须要有题目类型才能打开的弹窗
        this.todoObj = {
          type,
          planIndex,
          todoIndex,
          model,
          valKey
        };
        // 取值
        let theVal = this.todoVal();
        this.operailityData = theVal.val;
        if ((mustHasType.indexOf(model) > -1) && !theVal.data.types) {
          this.errorMess('请先选择题目类型');
          return
        }
        this.rowData = theVal.data;
        this.theTypes = theVal.data.types; // 记录当前操作的试题类型
        this.openModel(model);
      },
      /******************************************** 弹窗相关 ***************************************/
      // 打开弹窗
      openModel(targer) {
        this.model[targer] = true;
      },
      // 关闭弹窗
      cancel(targer) {
        this.model[targer] = false;
      },
      // 弹窗回调
      subCallback(valObj) {
        this.todoVal(valObj);
        this.rowData = null;
        this.operailityData = null;
        // 关闭弹窗
        this.cancel(this.todoObj.model);
      },
      // 值操作
      todoVal(val) {
        let todoObj = this.todoObj;
        // 获取操作的数据
        let data = this.planDtoList[todoObj.planIndex].testingDtoListTemp[todoObj.type].questionsDtoList[todoObj.todoIndex];
        if (val !== undefined) {
          // 赋值
          data[todoObj.valKey] = val;
        } else {
          // 取值
          return {
            val: data[todoObj.valKey], // 目标值
            data // 当前操作的题目对象
          }
        }
      },
      /******************************************** 按钮事件 ***************************************/
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChangeBefore(val) {
        this.multipleSelection = val;
      },
      handleSelectionChangeIn_progress(val) {
        this.multipleSelection = val;
      },
      handleSelectionChangeAfter(val) {
        this.multipleSelection = val;
      },
      // 改变试题类型
      changeTypes(type, planIndex, todoIndex, theEQTypes) {
        let rowData = this.planDtoList[planIndex].testingDtoListTemp[type].questionsDtoList[todoIndex];
        rowData.subject = ''; //题干
        rowData.answerExplain = ''; //正确答案解析
        if (['RADIO', 'CHECKBOX', 'JUDGMENT'].indexOf(theEQTypes) > -1) {
          rowData.options = ''; //正确答案（多选题，多个正确答案|隔开。问答题，该项赋值null）
          rowData.optionsDtoList = []; // 单选、多选、判断题，该项不能为空，必须有值。
          rowData.keyWords = null; //单选、多选、判断题，该项赋值null。问答题该项参见下面格式
        } else {
          rowData.options = null;
          rowData.optionsDtoList = null;
          rowData.keyWords = [];
        }
      },
      /**
       * 添加试题
       * type 课题类型
       * planIndex 第几节课索引
       */
      addTestingDto(type, planIndex) {
        this.$store.commit('curriculum/data/addTestingDto', {
          type,
          planIndex
        })
      },
      /**
       * 删除试题
       */
      removeTestingDto(type, planIndex) {
        if (!this.multipleSelection.length) {
          this.errorMess('请选择需要删除的试题');
          return
        }
        let delTheId = []; // 待删除的索引集
        this.multipleSelection.map(item => delTheId.push(item.theId));
        this.$store.commit('curriculum/data/removeQuestionsDtoList', {
          type,
          planIndex,
          delTheId
        })
        // console.log('删除试题：', type, planIndex)
      },
      // 导入试题
      importTestingDto(type, planIndex) {
        // console.log('倒入试题：', type, planIndex)
      },
      // 导出试题
      exportTestingDto(type, planIndex) {
        // console.log('倒出试题：', type, planIndex)
      },
      // 整体预览
      showTestingDto(type, planIndex) {
        let rowData = this.planDtoList[planIndex].testingDtoListTemp[type].questionsDtoList;
        this.viewTestData = null;
        if (rowData.length) {
          this.viewTestData = rowData;
          this.openModel('eqLook')
        } else {
          this.errorMess('请先添加试题才能预览')
        }
      },
      /******************************************** 数据提交 ***************************************/
      // 保存
      saveToStore() {
        if (!this.checkData()) {
          return false;
        }
        this.$store.commit('curriculum/data/updatePlanDto', this.planDtoList);
        return true
      },
      // 检测数据完整性
      checkData() {
        let flag = true;
        if (this.$refs.score) {
          for (let i = 0; i < this.$refs.score.length; i++) {
            this.$refs.score[i].validate((valid) => {
              if (!valid) {
                flag = false;
              }
            });
          }
        }
        return flag;
      },

      // 索引数字转换
      indexText(index) {
        index += 1;
        let text = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        let str = [];
        let bit = index % 10; // 个位
        let ten = (index - bit) / 10; // 十位
        ten > 1 && (str[0] = text[ten - 1]);
        index > 9 && (str[1] = text[9]);
        str[2] = (text[bit - 1]) || '';
        return str.join('')
      },

      // 根据题目计算分数
      getScoreByTable(data, index) {
        let weight = 100; // 默认满分为100
        let len = data.length;
        let m = weight % len;
        let num = parseInt(weight / len);
        let arr = [];
        let optionScore = 0;
        if (m === 0) { // 整除
          optionScore = parseInt(num)
        } else if (m - index > 0) { // 有余平均+1
          optionScore = num + 1
        } else { // 整数
          optionScore = num
        }
        data[index].optionScore = optionScore;
        return optionScore
      },
    },
    components: {
      editSubject,
      viewSubject,
      editOption,
      viewOption,
      editAnswer,
      viewAnswer,
      eqLook,
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  /* 评测与作业 */

  .nTestTable {
    // padding-left: 16px;
    .el-form-item {
      margin: 4px 0;
    }
    .el-select .el-input {
      min-width: auto;
      width: 100%;
    }
  }

  .tdlbScoreInput {
    width: 130px;
    &~span {
      margin-left: 6px;
      color: red;
    }
  }

  .modelSaveBtn {
    margin-top: 20px;
  }

</style>
