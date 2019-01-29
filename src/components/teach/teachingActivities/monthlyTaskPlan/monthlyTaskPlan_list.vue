<!----------------------------------
****--@name     周任务计划
****--@role     ${*}
****--@date     2018/7/8
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-row>
      <el-col :span="12">
        <el-button @click="add" type="success">增加</el-button>
      </el-col>
      <el-col :span="12" align="right">
        <load-btn @listenSubEvent="listenSubEvent"
                  :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
    <br>
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          v-for="item in 1"
          :key="item"
          align="center"
          :height="dynamicHt"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          max-height="500"
          style="width: 100%;height: 100%">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="75">
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="planActivityType"
            class-name="valiTableStyle"
            label="活动类型"
            width="180">
            <template scope="scope">
              <el-form :model="scope.row" ref="formValidate"
                       :rules="rules.weeklyTaskPlan"
                       class="demo-form-inline my-tooltip-button"
                       label-width="0">
                <el-form-item prop="planActivityType">
                  <el-select v-model="scope.row.planActivityType"
                             placeholder="请选择">
                    <el-option
                      v-for="item in planActivityTypeData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="isGovernmentStandard"
            class-name="valiTableStyle"
            label="标准分类"
            width="180">
            <template scope="scope">
              <el-form :model="scope.row" ref="formValidate"
                       :rules="rules.weeklyTaskPlan"
                       class="demo-form-inline my-tooltip-button"
                       label-width="0">
                <el-form-item prop="isGovernmentStandard">
                  <el-select v-model="scope.row.isGovernmentStandard"
                             placeholder="请选择">
                    <el-option
                      v-for="item in standardData"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="num"
            class-name="valiTableStyle"
            label="例数"
            width="180">
            <template scope="scope">
              <el-form :model="scope.row" ref="formValidate"
                       :rules="rules.weeklyTaskPlan"
                       class="demo-form-inline my-tooltip-button"
                       label-width="0">
                <el-form-item prop="num">
                  <el-input v-model="scope.row.num"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="remark"
            class-name="valiTableStyle"
            label="备注">
            <template scope="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template scope="scope">
              <el-button size="small" @click="remove(scope.$index)"
                         type="danger">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- <el-row >
       <el-col :span="10" :offset="10">
         <load-btn @listenSubEvent="noreleaseEvent" :btnData="loadBtn"></load-btn>
         <load-btn @listenSubEvent="releaseEvent" :btnData="releaseBtn"></load-btn>
         <el-button  @click="cancel">取消</el-button>
       </el-col>
     </el-row >-->
  </div>
</template>
<script>

  import api from '../app'
  import rules from '../../rules'
  import selectUser from '../../../common/selectUser.vue'  //选择主持人
  //当前组件引入全局的util
  let Util = null
  export default {
    props: [],
    data () {
      return {
        //保存按钮基本信息
        rules,
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        //form表单bind数据
        tableData: [],
        dynamicHt: 200,
        fileList: [], //当前选中附件的数据
        selectUser: [],//当前选中选择人员的数据
        planActivityTypeData: [],  //获取的活动类型数据
        rowData: {},  //当前选择的是第几行
        hostModal: false,
        uploadModal: false,
        uploadId: {
          id: 'uploadId',
          title: '附件管理',
        },
        hostId: {
          id: 'hostId',
          title: '选择主持人',
        },
        standardData: [
          {
            value: '固定培训项目',
            id: 0,
          },
          {
            value: '计划内项目',
            id: 1,
          },
        ],
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          ajaxSuccess: res => {
            this.successMess('保存成功')
            this.init()
          },
          ajaxError: res => {
            this.errorMess('保存失败')
          },
          ajaxParams: {
            url: api.planWeeklyAdd.path,
            jsonString: true,
            method: 'post',
            data: {},
          },
        },
        planActivityTypeMessTitle: {
          ajaxSuccess: 'planActivityTypeSuccess',
          ajaxParams: {
            url: '/dictionary/getByCode/TEACH_ACTIVITY_TYPE',
            method: 'get',
          },
        },

        timeIdsData: [],
        //获取活动时间段
        timeIdsMessTitle: {
          ajaxSuccess: 'timeIdsList',
          ajaxParams: {
            url: api.teachCourseTime,
            params: {},
          },
        },

        //获取数据
        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: api.PlanWeeklyListPage.path,
          },
        },
      }
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util
      //请求教学活动类型数据
      this.ajax(this.planActivityTypeMessTitle)
      this.init()//获取详情
    },
    mounted () {
      //暂时没有初始化,预留初始化入口
    },
    methods: {

      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content
        let parHt = content.parentNode.offsetHeight
        let myTable = this.$refs.myTable
        let paginationHt = 50
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {}
          if (this.tableData == 0) {
            this.errorMess('周任务计划列表不能为空')
            return
          }
          let tableData = this.getFormData(this.tableData)
          this.editMessTitle.ajaxParams.data = tableData
          isLoadingFun(true)
          this.ajax(this.editMessTitle, isLoadingFun)
        } else {
          this.errorMess('数据格式有误，请修改后再次提交')
        }
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = true
        if (this.$refs[formName]) {
          console.log(this.$refs[formName])
          for (let i = 0; i < this.$refs[formName].length; i++) {
            this.$refs[formName][i].validate((valid) => {
              if (!valid) {
                flag = false
              }
            })
          }
        }
        return flag
      },

      //获取到详情数据
      SuccessGetCurrData (res) {
        let data = res.data
        if (!data) return
        this.tableData = data
      },

      //获取到的教学活动类型数据
      planActivityTypeSuccess (res) {
        let data = res.data
        if (!data) return
        this.planActivityTypeData = data.child
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', this.editMessTitle.type)
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep([], data)
        return myData
      },
      /*
       * 组件初始化入口
       * */
      init () {
        this.ajax(this.listMessTitle)
      },

      //点击删除
      remove (index) {
        this.tableData.splice(index, 1)
      },

      //增加一行
      add () {
        this.tableData.push({
          'id': '',
          'planActivityType': '',
          'isGovernmentStandard': '',
          'num': '',
          'remark': '',
        })
      },

    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight()
        //为窗体绑定改变大小事件
        let Event = Util.events
        Event.addHandler(window, 'resize', this.setTableDynHeight)
      })
    },
    components: {
      selectUser,
    },
  }
</script>

