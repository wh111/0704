<!--
****--@file     input
****--@date     2018/2/28 15:00
****--@author   YC
****--@describe 理论考试试题编辑
-->
<template>
  <el-row class="thethory_test-root">
    <el-col style="margin-bottom: 20px">
      <el-button type="success" @click="addTestItem">新增</el-button>
      <el-button type="danger" @click="removeTestItem">删除</el-button>
      <el-button type="primary" @click="showAllTest">预览</el-button>
    </el-col>
    <el-table ref="paperContentTable" :data="paperContentList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" width="100" class-name="questionIndex" align="center">
        <template scope="scope">
          <span class="index">{{ scope.$index + 1 }}</span>
          <el-button @click="moveQuestionsIndex(scope.$index,'up')" type="text" class="hnxyIcon-up" :disabled="!scope.$index"></el-button>
          <el-button @click="moveQuestionsIndex(scope.$index,'down')" type="text" class="hnxyIcon-down"
                     :disabled="scope.$index >= paperContentList.length-1"></el-button>
        </template>
      </el-table-column>
      <el-table-column property="types" label="试题类型" width="122">
        <template scope="scope">
          <el-select v-model="scope.row.types" size="small"
                     @change="changeTypes(scope.$index,scope.row.types)">
            <el-option v-for="item in testTypeOption" v-if="item.value" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column property="subject" label="题干">
        <template scope="scope">
          <el-tooltip effect="light" content="请编辑题干" placement="bottom">
            <view-subject class="paperContentTooltip" slot="content" :val="scope.row.subject" v-if="scope.row.subject"></view-subject>
            <el-button size="small" @click="edit(scope.$index,'editSubject','subject')">编辑
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column property="optionsDtoList" label="候选项">
        <template scope="scope">
          <el-tooltip effect="light" content="请编辑选项" placement="bottom">
            <view-option class="paperContentTooltip" slot="content" :val="scope.row.optionsDtoList"
                         v-if="scope.row.optionsDtoList && scope.row.optionsDtoList.length"></view-option>
            <el-button size="small" @click="edit(scope.$index,'editOption','optionsDtoList')">编辑
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="正确答案">
        <template scope="scope">
          <!-- 单选\多\判断选题 -->
          <template v-if="scope.row.optionsDtoList">
            <el-tooltip effect="light" content="请选择正确答案" placement="bottom">
              <view-answer class="paperContentTooltip" slot="content" :val="scope.row.options" :the-type="scope.row.types"
                           v-if="scope.row.options"></view-answer>
              <el-button size="small" :disabled="!scope.row.optionsDtoList.length"
                         @click="edit(scope.$index,'editAnswer','options')">编辑
              </el-button>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
      <el-table-column property="answerExplain" label="答案解析">
        <template scope="scope">
          <el-tooltip effect="light" content="请编辑答案解析" placement="bottom">
            <view-subject class="paperContentTooltip" slot="content" :val="scope.row.answerExplain" v-if="scope.row.answerExplain"></view-subject>
            <el-button size="small" @click="edit(scope.$index,'editAnswerExplain','answerExplain')">编辑
            </el-button>
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
    <el-col align="right" style="margin-top: 20px">
      <el-button @click="save">确定</el-button>
    </el-col>
    <!-- 编辑题干 -->
    <Modal :mask-closable="false" v-model="model.editSubject" height="200" class-name="vertical-center-modal"
           :width="832">
      <modal-header slot="header" :parent="self" :content="headerContent.editSubjectId"></modal-header>
      <edit-subject v-if="model.editSubject" @save="subCallback" :operaility-data="operailityData"></edit-subject>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑选项 -->
    <Modal :mask-closable="false" v-model="model.editOption" height="200" class-name="vertical-center-modal"
           :width="832">
      <modal-header slot="header" :parent="self" :content="headerContent.editOptionId"></modal-header>
      <edit-option v-if="model.editOption" @save="subCallback" :operaility-data="operailityData"
                   :the-type="theTypes"></edit-option>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑答案 -->
    <Modal :mask-closable="false" v-model="model.editAnswer" height="200" class-name="vertical-center-modal"
           :width="832">
      <modal-header slot="header" :parent="self" :content="headerContent.editAnswerId"></modal-header>
      <edit-answer v-if="model.editAnswer" @save="subCallback" :operaility-data="operailityData" :the-type="theTypes"
                   :row-data="rowData"></edit-answer>
      <div slot="footer"></div>
    </Modal>
    <!-- 编辑答案解析 -->
    <Modal :mask-closable="false" v-model="model.editAnswerExplain" height="200" class-name="vertical-center-modal"
           :width="832">
      <modal-header slot="header" :parent="self" :content="headerContent.editAnswerExplainId"></modal-header>
      <edit-subject v-if="model.editAnswerExplain" @save="subCallback" :operaility-data="operailityData"></edit-subject>
      <div slot="footer"></div>
    </Modal>
    <!-- 试题预览 -->
    <Modal :mask-closable="false" v-model="model.eqLook" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :parent="self" :content="headerContent.eqLookId"></modal-header>
      <eq-look v-if="model.eqLook" :show-data="showPaperContentList" type="manageSession" showType="answer"></eq-look>
      <div slot="footer"></div>
    </Modal>
  </el-row>
</template>
<script>
  /*当前组件必要引入*/
  import testTypeOption from './testTypeOption';
  import editSubject from './subject/edit'; // 编辑题干
  import viewSubject from './subject/view'; // 查看题干
  import editOption from './options/edit'; // 编辑选项
  import viewOption from './options/view'; // 查看选项
  import editAnswer from './answer/edit'; // 编辑正确答案
  import viewAnswer from './answer/view'; // 查看正确答案
  import eqLook from './view'; // 整体预览

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['paperContent'],
    data () {
      return {
        testTypeOption,
        paperContentList: [],
        showPaperContentList: [],
        oldPaperContentList: [],
        self: this,
        multipleSelection: [],
        rowData: {}, // 当前行数据
        theTypes: '', // 当前操作题目的类型
        todoObj: { // 操作记录
          // type: '', // 所属类型（课前|课中|课后）
          // types: '', // 题目类型（单选|多选|判断题|问答题）
          // planIndex: -1, // 第几节课的索引
          todoIndex: -1, // 第几题索引
          model: '', // 打开的弹窗
          valKey: '' // 操作值的键名
        },
        operailityData: '',
        model: {
          editSubject: false,
          editOption: false,
          editAnswer: false,
          editAnswerExplain: false,
          eqLook: false
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
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.paperContentList = Util._.defaultsDeep([], this.paperContent);
        if (!this.paperContentList.length) {
          this.addTestItem();
          this.oldPaperContentList = Util._.defaultsDeep([], this.paperContentList);
        }
      },
      /******************************************** 作业操作 ***************************************/
      // 编辑（参数对应data中的todoObj对象）
      edit (todoIndex, model, valKey) {
        let mustHasType = ['editOption']; // 必须要有题目类型才能打开的弹窗
        this.todoObj = {
          todoIndex,
          model,
          valKey
        };
        // 取值
        let theVal = this.todoVal();
        this.operailityData = theVal.val;
        if ((mustHasType.indexOf(model) > -1) && !theVal.data.types) {
          this.errorMess('请先选择题目类型');
          return;
        }
        this.rowData = theVal.data;
        this.theTypes = theVal.data.types; // 记录当前操作的试题类型
        this.openModel(model);
      },
      /**
       * 改变试题顺序
       * @param index '移动的索引'
       * @param type  'up|down'
       */
      moveQuestionsIndex (index, type) {
        this.oldPaperContentList = this.$util._.defaultsDeep([], this.paperContentList);//保存试题数据 供changeTypes函数使用
        let moveData = this.paperContentList[index]; // 记录删除之前的值
        console.log(this.paperContentList);
        if (type === 'down') {
          this.paperContentList.splice(index, 1); // 先删
          this.paperContentList.splice(index + 1, 0, moveData); // 再加
        } else {
          this.paperContentList.splice(index, 1); // 先删
          this.paperContentList.splice(index - 1, 0, moveData); // 再加
        }
      },
      /******************************************** 弹窗相关 ***************************************/
      // 打开弹窗
      openModel (targer) {
        this.model[targer] = true;
      },
      // 关闭弹窗
      cancel (targer) {
        this.model[targer] = false;
      },
      // 弹窗回调
      subCallback (valObj) {
        this.todoVal(valObj);
        this.rowData = null;
        this.operailityData = null;
        // 关闭弹窗
        this.cancel(this.todoObj.model);
      },
      // 值操作
      todoVal (val) {
        let todoObj = this.todoObj;
        // 获取操作的数据
        let data = this.paperContentList[todoObj.todoIndex];
        if (val !== undefined) {
          // 赋值
          data[todoObj.valKey] = val;
        } else {
          // 取值
          return {
            val: data[todoObj.valKey], // 目标值
            data // 当前操作的题目对象
          };
        }
      },
      /******************************************** 按钮事件 ***************************************/
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      // 改变试题类型
      changeTypes (todoIndex, theEQTypes) {

//        this.oldPaperContentList = this.$util._.defaultsDeep([], this.paperContentList);
        //如果是因为改变试题顺序引起的试题类型函数的调用，则把最新的试题类型赋值给改变顺序保存的旧的数据，来确保试题类型函数正常运行
        if (this.oldPaperContentList[todoIndex].theId !== this.paperContentList[todoIndex].theId) {
          this.oldPaperContentList[todoIndex] = this.paperContentList[todoIndex];
          return;
        }
        console.log(2);
        let rowData = this.paperContentList[todoIndex];
        console.log(rowData);
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
      addTestItem () {
        let len = this.paperContentList.length;
        let theId = len ? this.paperContentList[len - 1].theId : 0;
        this.paperContentList.push({ // 测评试题对象集合
          'theId': ++theId, // 唯一标识
          'types': 'RADIO', //题型：RADIO单选题、CHECKBOX多选题、JUDGMENT判断题、ANSWER问答题
          'subject': '', //题干
          'optionScore': '', // 该项分数
          'options': '', //正确答案（多选题，多个正确答案|隔开。问答题，该项赋值null）
          'answerExplain': '', //正确答案解析
          'optionsDtoList': [], // 单选、多选、判断题，该项不能为空，必须有值。
          'keyWords': null //单选、多选、判断题，该项赋值null。问答题该项参见下面格式
        });
      },
      /**
       * 删除试题
       */
      removeTestItem () {
        if (!this.multipleSelection.length) {
          this.errorMess('请选择需要删除的试题');
          return;
        }
        let delTheId = [];
        let tempArr = [];
        this.multipleSelection.map(item => delTheId.push(item.theId));
        this.paperContentList.map(item => !~delTheId.indexOf(item.theId) && tempArr.push(item));
        this.paperContentList = tempArr;
      },
      // 整体预览
      showAllTest () {
        if (this.paperContentList.length) {
          let showPaperContentList = Util._.defaultsDeep([], this.paperContentList);
          showPaperContentList.map(item => item.userOptions = item.options);
          this.showPaperContentList = showPaperContentList;
          this.openModel('eqLook');
        } else {
          this.errorMess('请先添加试题才能预览');
        }
      },
      /******************************************** 数据提交 ***************************************/
      // 保存
      save () {
        if (this.checkData()) {
          this.$emit('save', Util._.defaultsDeep([], this.paperContentList));
        }
      },
      // 检测数据完整性
      checkData () {
        let flag = true;
        let checkData = this.paperContentList;
        let strArr = [];
        if (!checkData.length) {
          flag = false;
          this.errorMess('至少需要录入一道试题！');
          return flag;
        }
        for (let i = 0, item; i < checkData.length; i++) {
          item = checkData[i];
          //subject //题干
          //optionsDtoList //候选项
          //options  //正确答案（多选题，多个正确答案|隔开。问答题，该项赋值null）
          //answerExplain  //正确答案解析
          //optionScore // 该项分数
          //keyWords  //单选、多选、判断题，该项赋值null。问答题该项参见下面格式
          if (item['subject'] === '' || item['optionsDtoList'].length === 0 || item['options'] === '' || item['answerExplain'] === '' || item['optionScore'] === '') {
            strArr.push((i + 1));
          }
        }
        if (strArr.length > 0) {
          let trError = strArr.join('、');
          if (strArr.length > 10) {
            let tempArr = strArr.splice(0, 10);
            trError = tempArr.join('、') + '等';
          }
          this.showMess('第' + trError + '行试题编写不完整需重新填写，如不需要请删除！');
          flag = false;
        }
        /*if (this.$refs.score) {
          for (let i = 0; i < this.$refs.score.length; i++) {
            this.$refs.score[i].validate((valid) => {
              if (!valid) {
                flag = false;
              }
            });
          }
        }*/
        return flag;
      },

      // 索引数字转换
      indexText (index) {
        index += 1;
        let text = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        let str = [];
        let bit = index % 10; // 个位
        let ten = (index - bit) / 10; // 十位
        ten > 1 && (str[0] = text[ten - 1]);
        index > 9 && (str[1] = text[9]);
        str[2] = (text[bit - 1]) || '';
        return str.join('');
      },

      // 根据题目计算分数
      getScoreByTable (data, index) {
        let weight = 100; // 默认满分为100
        let len = data.length;
        let m = weight % len;
        let num = parseInt(weight / len);
        let optionScore = 0;
        if (m === 0) { // 整除
          optionScore = parseInt(num);
        } else if (m - index > 0) { // 有余平均+1
          optionScore = num + 1;
        } else { // 整数
          optionScore = num;
        }
        data[index].optionScore = optionScore;
        return optionScore;
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      editSubject,
      viewSubject,
      editOption,
      viewOption,
      editAnswer,
      viewAnswer,
      eqLook
    }
  };

</script>
<style lang="scss">
  .modelSaveBtn {
    margin-top: 20px;
  }

  .questionIndex {
    line-height: 26px;
    .index {
      width: 20px;
      display: inline-block;
      text-align: left;
      margin-right: 4px;
    }
    .el-button {
      padding-top: 4px;
      padding-bottom: 0;
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }

  .paperContentTooltip {
    max-height: 300px;overflow: auto;
    img { max-width: 98%; }
  }
</style>
