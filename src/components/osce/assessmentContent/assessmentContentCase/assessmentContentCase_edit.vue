<template>
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" label-width="108px" :rules="rules">
      <el-row>

        <el-col :span="8" :offset="8" align="center">
          <el-form-item label="病例名称：" prop="caseName" required>
            <el-input v-model.trim="formValidate.caseName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="患者姓名：" prop="patientName" required>
            <el-input v-model="formValidate.patientName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="患者性别：" prop="sex">
            <el-radio-group v-model="formValidate.sex">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="患者职业：" prop="occupation" required>
            <el-input v-model="formValidate.occupation" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="患者年龄：" prop="age" required>
            <el-input v-model="formValidate.age" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="婚姻状况：" prop="maritalStatus">
            <el-radio-group v-model="formValidate.maritalStatus">
              <el-radio label="未婚">未婚</el-radio>
              <el-radio label="已婚">已婚</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="入院时间：" prop="hospitalTime" required>
            <el-date-picker v-model="formValidate.hospitalTime" :editable="false" type="datetime" placeholder="选择时间"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="病历日期：" prop="caseDate" required>
            <el-date-picker v-model="formValidate.caseDate" :editable="false" type="date" placeholder="选择时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="病例提供者：" prop="teller" required>
            <el-input v-model="formValidate.teller" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="住址：" prop="address">
            <el-input v-model="formValidate.address" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="原籍：" prop="origin">
            <el-input v-model="formValidate.origin" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="主诉：" prop="complaint">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.complaint"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="现病史：" prop="presentIllness">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.presentIllness"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="既往史：" prop="pastHistory">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.pastHistory"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="家族史：" prop="familyHistory">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.familyHistory"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="体格检查：" prop="physicalExamination">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.physicalExamination"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="专科情况：" prop="specialCircumstances">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.specialCircumstances"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="辅助检查：" prop="supplementaryExamination">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.supplementaryExamination"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="问题：">
            <template v-for="(item,index) in formValidate.questionList">
              <div style="padding-bottom:10px;overflow:hidden;" :key="item._id">
                <el-col :span="1">{{ index + 1 }}.</el-col>
                <el-col :span="21">
                  <el-form-item>
                    <ueditor :key="item._id" name="question" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="item"
                             :ueditor-config="ueditorConfig" :valKey="'question_'+index" style="width: 100%"></ueditor>
                    <!--<el-input v-model="item.question" placeholder="请输入问题"></el-input>-->
                  </el-form-item>
                </el-col>
                <el-col :span="2" align="right">
                  <el-button size="small" type="danger" @click="del">删除</el-button>
                </el-col>
              </div>
            </template>
            <el-col :span="1">
              <el-button size="small" type="success" @click="add">添加</el-button>
            </el-col>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="剧本：">
            <template v-for="(item,index) in formValidate.scriptList">
              <div v-if="item.id">
                <span>{{ index + 1 }}.</span>
                <span class="scriptIdListItemText" @click="showScript(item.id)">{{ item.scriptName }}</span>
                <el-button size="small" type="success" @click="editScript(item.id,index)" style="margin-left:20px;">修改</el-button>
                <el-button size="small" type="danger" @click="delScript(index,item.id)">删除</el-button>
              </div>
            </template>
            <el-col>
              <el-button size="small" type="success" @click="addScripts">添加剧本</el-button>
            </el-col>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="评分表：">
            <div class="scriptIdListItemText" v-if="formValidate.scoreTableId">
              <span @click="showScore(formValidate.scoreTableId)">{{ formValidate.scoreTableName }}</span>
              <el-button size="small" type="danger" style="margin-left:20px;" @click="delScore">删除</el-button>
            </div>
            <el-col>
              <el-button size="small" type="success" @click="scoreSelect">选择评分表</el-button>
            </el-col>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <el-row>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>

    <!-- 模态框 增加剧本（add） -->
    <Modal :mask-closable="false" v-model="scriptsAddModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.scriptsAddId"></modal-header>
      <scripts-add v-if="scriptsAddModal" @cancel="cancel" @upDataScript="upDataScript" :operaility-data="operailityData" :todoId="todoId"
                   :url-params="{add:scriptsApi.add,save:scriptsApi.save}"></scripts-add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑剧本（edit） -->
    <Modal :mask-closable="false" v-model="scriptsEditModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.scriptsEditId"></modal-header>
      <scripts-edit v-if="scriptsEditModal" @cancel="cancel" @upDataScript="upDataScriptEdit" :operaility-data="operailityData"
                    :url-params="{modify:scriptsApi.modify,save:scriptsApi.save,get:scriptsApi.get}" :todoId="childrenTodoId"></scripts-edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看剧本（show） -->
    <Modal :mask-closable="false" v-model="scriptsShowModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.scriptsShowId"></modal-header>
      <scripts-show v-if="scriptsShowModal" @cancel="cancel" :url-params="scriptsApi.get" :id="childrenTodoId.id"></scripts-show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择评分表（select） -->
    <Modal :mask-closable="false" v-model="scoreSelectModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.scoreSelectId"></modal-header>
      <score-select v-if="scoreSelectModal" @cancel="cancel" @select="selectScore" :url-params="scriptsApi.get"></score-select>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看评分表（show） -->
    <Modal :mask-closable="false" v-model="scoreShowModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.scoreShowId"></modal-header>
      <score-show v-if="scoreShowModal" @cancel="cancel" :id="childrenTodoId.id"></score-show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 剧本删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
           :width="500">
      <modal-header slot="header" :content="headerContent.scriptsRemoveId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="scriptsApi.delete" @remove="delScriptCall" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;

  import scriptsApi from '../assessmentContentScript/api'; // 病例剧本api

  import scriptsAdd from '../assessmentContentScript/assessmentContentScript_add'; // 增加剧本
  import scriptsEdit from '../assessmentContentScript/assessmentContentScript_edit'; // 增加剧本
  import scriptsShow from '../assessmentContentScript/assessmentContentScript_view'; // 查看剧本

  import scoreSelect from '../assessmentContentScore/assessmentContentScore_select'; // 选择评分表
  import scoreShow from '../assessmentContentScore/assessmentContentScore_view'; // 查看评分表
  import Ueditor from '../../../common/showUeditor'

  import { assessmentContentCase as rules, } from '../../rules'; // 表单验证

  export default {
    props: {
      urlParams: { // api对象
        type: Object,
        required: true,
      },
      todoId: {
        type: Object,
        default: () => ({
          id: 0,
          treeId: 0,
          treeRoad: '',
        }),
      },
    },
    data () {
      return {
        rules,
        scriptsApi,
        self: this,
        loading: false,
        childrenTodoId: {}, // 子组件使用的id集合
        operailityData: [],
        formValidate: {
          // "treeId": "1",
          // "treeRoad": "1,2",
          caseName: '',
          patientName: '',
          sex: '',
          occupation: '',
          age: '',
          maritalStatus: '',
          hospitalTime: '',
          caseDate: '',
          teller: '',
          address: '',
          origin: '',
          complaint: '',
          presentIllness: '',
          pastHistory: '',
          familyHistory: '',
          physicalExamination: '',
          specialCircumstances: '',
          supplementaryExamination: '',
          scriptList: [], // 剧本
          // scriptIds: "1,2,3",
          scoreTableId: '', // 评分表
          scoreTableName: '', // 评分表名称
          questionList: [ //
            // {
            //   question: "孩子多大了？"
            // },
          ],
        },
        //保存按钮基本信息
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent',
        },
        // 剧本模态框
        scriptsAddModal: false, // 增加
        scriptsEditModal: false, // 编辑
        scriptsShowModal: false, // 查看
        scriptsDelModal: false, // 删除
        // 选择评分表
        scoreSelectModal: false, // 删除
        scoreShowModal: false, // 查看
        // 模态框顶部标识
        headerContent: {
          scriptsAddId: {
            id: 'scriptsAddId',
            title: '添加剧本',
          },
          scriptsEditId: {
            id: 'scriptsEditId',
            title: '修改剧本',
          },
          scriptsShowId: {
            id: 'scriptsShowId',
            title: '查看剧本',
          },
          scriptsRemoveId: {
            id: 'scriptsRemoveId',
            title: '删除剧本',
          },
          scoreSelectId: {
            id: 'scoreSelectId',
            title: '选择评分表',
          },
          scoreShowId: {
            id: 'scoreShowId',
            title: '查看评分表',
          },
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: this.urlParams.modify.path + '/' + this.todoId.id,
            method: this.urlParams.modify.method,
          },
        },
        UE: {}, // 编辑器
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          // zIndex: 9,
          initialFrameHeight: 300 //初始化编辑器高度,默认320
        },
      }
    },
    methods: {
      /**
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       * @param editor {}      编辑器的对象
       */
      storeUE (name, editor) {
        this.UE[name] = editor;
      },
      /**
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       * @param val  {string}  编辑器的内容
       */
      getUeditorVal (name, val) {
        let questionIndex = name.split('_');
        console.log(questionIndex)
        this.formValidate.questionList[questionIndex[1]].question = val;
      },
      /**************************************** 问题列表 ************************************************************************/
      // 添加
      add () {
        let questionList = this.formValidate.questionList
        let _id = questionList.length ? questionList[questionList.length - 1]._id + 1 : 0
        this.formValidate.questionList.push({
          _id,
          question: '',
        })
        console.log(_id)
      },
      // 删除
      del (index) {
        this.formValidate.questionList.length && this.formValidate.questionList.splice(index, 1)
      },
      /***************************************** 增加删除 **********************************************************************/
      // 删除剧本
      delScriptCall (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        // 如果成功则移除
        if (title.indexOf('成') > -1) {
          this.formValidate.scriptList.splice(this.operailityData[0].index, 1);
        }
      },
      // 删除评分表
      delScore () {
        this.formValidate.scoreTableId = '';
        this.formValidate.scoreTableName = '';
      },
      /***************************************** 模态框 ************************************************************************/
      // 增加剧本
      addScripts () {
        this.openModel('scriptsAdd')
      },
      // 删除剧本
      delScript (index, id) {
        this.operailityData = [{
          id, // 需要删除的id
          index // 需要删除的索引
        }];
        this.openModel('remove')
      },
      // 编辑剧本
      editScript (id, index) {
        // console.log(id);
        this.childrenTodoId.id = id;
        this.childrenTodoId.index = index;
        this.openModel('scriptsEdit')
      },
      // 查看剧本
      showScript (id) {
        // console.log(id);
        this.childrenTodoId.id = id;
        this.openModel('scriptsShow')
      },
      // 选择评分表
      scoreSelect () {
        this.openModel('scoreSelect')
      },
      // 查看评分表
      showScore (id) {
        // console.log(id);
        this.childrenTodoId.id = id;
        this.openModel('scoreShow')
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      // 回调
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
      },
      /***************************************** 模态框回调 ********************************************************************/
      /**
       * 增加|修改剧本之后更新当前组件的剧本数据
       * */
      upDataScript (res) {
        this.cancel('scriptsAdd');
        this.formValidate.scriptList.push(res.data);
      },
      // 修改更新剧本
      upDataScriptEdit (name) {
        this.cancel('scriptsEdit');
        this.formValidate.scriptList[this.childrenTodoId.index].scriptName = name;
      },
      /**
       * 选择分表回调
       * */
      selectScore (res) {
        this.formValidate.scoreTableId = res.id;
        this.formValidate.scoreTableName = res.scoreTableName;
      },
      /***************************************** 提交处理 **********************************************************************/
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let idArr = this.formValidate.scriptList && ((this.formValidate.scriptList.map(item => item.id)).join(
            ',')) || '';
          this.editMessTitle.ajaxParams.data = Util.getFormData(this.formValidate, this.todoId, {
            scriptIds: idArr,
          });
          let data = this.editMessTitle.ajaxParams.data;
          data.isScript = this.formValidate.scriptList.length > 0 ? 1 : 0;
          data.hospitalTime = this.conductDate(data.hospitalTime, 'yyyy-MM-dd hh:mm:ss') || '';
          data.caseDate = this.conductDate(data.caseDate, 'yyyy-MM-dd') || '';
          this.ajax(this.editMessTitle, isLoadingFun)
        } else {
          this.errorMess('资料填写不完整，不能提交！')
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer () {
        this.ajax({
          ajaxSuccess: res => {
            let data = res.data;
            (data.questionList || []).map((item, index) => item._id = index);
            this.formValidate = data;
          },
          ajaxParams: {
            url: `${this.urlParams.get.path}/${this.todoId.id}`,
            method: this.urlParams.get.method,
          },
        })
      },
      /*
       * 组件初始化入口
       * */
      init () {
        // 获取编辑数据
        this.getDataForServer();
      },
    },
    components: {
      Ueditor,
      scriptsAdd,
      scriptsEdit,
      scriptsShow,
      scoreSelect,
      scoreShow,
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      this.childrenTodo = Util.getFormData(this.todoId);
      this.init();
    },
  }

</script>
<style lang="scss">
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';

  .scriptIdListItemText {
    color: #58B7FF;
    cursor: pointer;
    &:empty {
      display: none;
    }
  }

</style>
