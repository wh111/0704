<template>
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" label-width="94px">
      <el-row>

        <el-col align="center" style="margin:10px 0 20px 0;">
          <h4>病例名称：{{ formValidate.caseName }}</h4>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="患者姓名：">
            {{ formValidate.patientName }}
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="患者性别：">
            {{ formValidate.sex | typeText }}
          </el-form-item>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="患者职业：">
            {{ formValidate.occupation }}
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="患者年龄：">
            {{ formValidate.age }}
          </el-form-item>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="婚姻状况：">
            {{ formValidate.maritalStatus }}
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="入院时间：">
            {{ formValidate.hospitalTime }}
          </el-form-item>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="病历日期：">
            {{ formValidate.caseDate }}
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="申诉人：">
            {{ formValidate.teller }}
          </el-form-item>
        </el-col>

        <el-col :span="9" :offset="2">
          <el-form-item label="住址：">
            {{ formValidate.address }}
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="原籍：">
            {{ formValidate.origin }}
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="主诉：">
            {{ formValidate.complaint }}
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="现病史：">
            {{ formValidate.presentIllness }}
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="既往史：">
            {{ formValidate.pastHistory }}
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="家族史：">
            {{ formValidate.familyHistory }}
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="体格检查：">
            {{ formValidate.physicalExamination }}
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="专科情况：">
            {{ formValidate.specialCircumstances }}
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="辅助检查：" prop="supplementaryExamination">
            {{ formValidate.supplementaryExamination }}
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="问题：">
            <template v-if="formValidate.questionList.length">
              <div style="padding-bottom:10px;overflow:hidden;" v-for="(item,index) in formValidate.questionList">
                <el-col :span="1">{{ index + 1 }}.</el-col>
                <el-col :span="21">
                  <el-form-item class="assessmentContentCaseQue">
                    <div v-html="item.question"></div>
                  </el-form-item>
                </el-col>
              </div>
            </template>
            <p v-else style="line-height:36px;">暂无问题</p>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="剧本：">
            <template v-if="formValidate.scriptList.length">
              <div>
                <template v-for="(item,index) in formValidate.scriptList">
                  <span>{{ index + 1 }}.</span>
                  <span class="scriptIdListItemText" @click="showScript(item.id)">{{ item.scriptName }}</span>
                </template>
              </div>
            </template>
            <p v-else style="line-height:36px;">暂无剧本</p>
          </el-form-item>
        </el-col>

        <el-col :span="20" :offset="2">
          <el-form-item label="评分表：">
            <div class="scriptIdListItemText" v-if="formValidate.scoreTableId">
              <span @click="showScore(formValidate.scoreTableId)">{{ formValidate.scoreTableName }}</span>
            </div>
            <p v-else style="line-height:36px;">暂无评分表</p>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <!-- 模态框 查看剧本（show） -->
    <Modal :mask-closable="false" v-model="scriptsShowModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.scriptsShowId"></modal-header>
      <scripts-show v-if="scriptsShowModal" @cancel="cancel" :url-params="scriptsApi.get" :id="viewId"></scripts-show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看评分表（show） -->
    <Modal :mask-closable="false" v-model="scoreShowModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="headerContent.scoreShowId"></modal-header>
      <score-show v-if="scoreShowModal" @cancel="cancel" :id="viewId"></score-show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;
  import scriptsApi from '../assessmentContentScript/api'; // 病例剧本api
  import scriptsShow from '../assessmentContentScript/assessmentContentScript_view'; // 查看剧本
  import scoreShow from '../assessmentContentScore/assessmentContentScore_view'; // 查看评分表

  export default {
    props: {
      urlParams: { // api对象
        type: Object,
        required: true,
      },
      todoId: {
        type: Object,
        default: () => ({
          treeId: 0,
          treeRoad: '',
        }),
      },
    },
    data () {
      return {
        self: this,
        viewId: '', // 查看id
        scriptsApi,
        formValidate: {
          // "treeId": "1",
          // "treeRoad": "1,2",
          caseName: '-',
          patientName: '-',
          sex: '',
          occupation: '-',
          age: '-',
          maritalStatus: '-',
          hospitalTime: '-',
          caseDate: '-',
          teller: '-',
          address: '-',
          origin: '-',
          complaint: '-',
          presentIllness: '-',
          pastHistory: '-',
          familyHistory: '-',
          physicalExamination: '-',
          specialCircumstances: '-',
          supplementaryExamination: '-',
          scriptList: [],
          scriptIdList: [], // 剧本
          // scriptIds: "1,2,3",
          scoreTableId: '', // 评分表
          scoreTableName: '', // 评分表名称
          questionList: [],
        },
        // 剧本模态框
        scriptsShowModal: false, // 查看
        // 选择评分表
        scoreShowModal: false, // 查看
        // 模态框顶部标识
        headerContent: {
          scriptsShowId: {
            id: 'scriptsShowId',
            title: '查看剧本',
          },
          scoreShowId: {
            id: 'scoreShowId',
            title: '查看评分表',
          },
        },
      }
    },
    methods: {
      /***************************************** 模态框 ************************************************************************/
      // 查看剧本
      showScript (id) {
        // console.log(id);
        this.viewId = id;
        this.openModel('scriptsShow')
      },

      // 查看评分表
      showScore (id) {
        // console.log(id);
        this.viewId = id;
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
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer () {
        // console.log(this.todoId);
        this.ajax({
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: `${this.urlParams.path}/${this.todoId.id}`,
            method: this.urlParams.method,
          },
        })
      },
      ajaxSuccess (res) {
        this.formValidate = res.data // 初始化编辑数据
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
      scriptsShow,
      scoreShow,
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      this.childrenTodo = Util.getFormData(this.todoId);
      this.init();
      // console.log(this.todoId);
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

  .assessmentContentCaseQue{
    * {line-height: inherit;}
    table,tr,td{border: 1px solid #ccc;}
  }

</style>
