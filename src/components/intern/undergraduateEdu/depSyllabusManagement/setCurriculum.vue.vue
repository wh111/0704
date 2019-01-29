<!----------------------------------
****--课程设置(setCurriculum)
****--@date     2017/6/17
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <h2 style="text-align: center;padding: 10px 0;">{{operailityData.date}}课程安排</h2>
    <br/>
    <el-table
      v-if="course!=0"
      v-for="item in 1"
      :key="item"
      align="center"
      :data="course"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        prop="courseName"
        label="课程名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="courseType"
        label="课程类型"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="timeInfo"
        label="课时"
        align="center"
        width="120">
        <template scope="scope">
          {{scope.row.timeInfoBegin}}-  {{scope.row.timeInfoEnd}}
        </template>
      </el-table-column>
      <el-table-column
        prop="classOrder"
        label="节次"
        width="70">
      </el-table-column>
      <el-table-column
        label="课程内容"
        align="center"
        width="150"
        class-name="valiTableStyle"
        show-overflow-tooltip>
        <template scope="scope">
          <el-form v-if="!['NO_PASS','PASS'].includes(scope.row.courseArrangeState)"
                   :model="{courseContent:scope.row.courseContent}"
                   ref="f" :rules="rules" label-width="0"
                   style="display: inline-block">
            <el-form-item prop="courseContent">
              <el-input v-model="scope.row.courseContent"></el-input>
            </el-form-item>
          </el-form>
          <div v-else>
            {{ scope.row.courseContent}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="教学方法"
        align="center"
        width="150"
        class-name="valiTableStyle"
        show-overflow-tooltip>
        <template scope="scope">
          <el-form v-if="!['NO_PASS','PASS'].includes(scope.row.courseArrangeState)"
                   :model="{courseMethod:scope.row.courseMethod}"
                   ref="f" :rules="rules" label-width="0"
                   style="display: inline-block">
            <el-form-item prop="courseMethod">
              <el-select
                v-model="scope.row.courseMethod"
                :filterable="true"
                style="width: 100%"
                placeholder="选择课程">
                <el-option
                  v-for="item in courseMethodData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div v-else>
            {{ scope.row.courseMethod}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="授课老师"
        align="center"
        class-name="valiTableStyle"
        show-overflow-tooltip>
        <template scope="scope">
          <el-form v-if="!['NO_PASS','PASS'].includes(scope.row.courseArrangeState)"
                   :model="{teachUserNames:scope.row.teachUserNames}" ref="f" :rules="rules" label-width="0"
                   style="display: inline-block">
            <el-form-item prop="teachUserNames">
              <el-input readonly v-model="scope.row.teachUserNames" @focus="addUser(scope.$index)"></el-input>
            </el-form-item>
          </el-form>
          <div v-else>
            {{ scope.row.teachUserNames}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="授课地点"
        align="center"
        class-name="valiTableStyle"
        width="150"
        show-overflow-tooltip>
        <template scope="scope">
          <div>
            {{ scope.row.courseAddress}}
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--label="评价意见"-->
      <!--align="center"-->
      <!--class-name="valiTableStyle"-->
      <!--show-overflow-tooltip-->
      <!--width="100">-->
      <!--<template scope="scope">-->
      <!--<div v-for="(item,index) in scope.row.userReviewList" :key="index">-->
      <!--审核人：{{item.createUserName}} ;审核意见：{{item.reviewMess}} ;审批状态:{{item.spState | typeText}}; &nbsp;-->
      <!--</div>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <br/>
    <el-row v-if="course!=0">
      <el-col :span="24" style="text-align: center;">
        <el-button type="success" @click="save('NO_SUBMIT')">保存</el-button>
        <!--<el-button :disabled="disabled.report" @click="save('NO_PASS')" type="info">提交</el-button>-->
        <!--<el-button :disabled="disabled.revoke" @click="revoke" type="warning">撤回</el-button>-->
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择人员-->
    <Modal
      width="890"
      v-model="selectUserModal"
      title="新建教学活动"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="closeUserModal" @setUsers="setUsers"
                   :initUser="initUser" :treeOptions="treeDefaults" :selectOption="selectOption"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入当前组件字典api
  import api from '../api.js';
  //引入--验证--组件
  import { depSyllabusManagement as rules } from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {
        rules,
        //保存按钮基本信息
        optionData: [{}],
        currSltUserName: '',
        course: [],
        courseMethodData: [],
        treeDefaults: {
          getTreeUrl: 'teacherType/tree?rootId=-101',
          getDataUrl: '',
          isShowMenus: true,
        },
        //搜索option
        selectOption: {
          url: '/archives/query/teachNoPage?typeId='
        },

        //请求科室列表
        getDepTitle: {
          ajaxSuccess: 'CourseType',
          ajaxParams: {
            url: api.getCourseTypeByCode.path,
            params: {}
          }
        },
        //教研室设置时间添加
        saveCoursetimeTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.courseTime.path,
            method: api.courseTime.method,
          }
        },

        //选择人员
        selectUserId: {
          id: 'selectUserId',
          title: '选择人员',
          usersData: ''
        },

        //给选择人员框传递的已选人员信息
        initUser: [],
        disabled: {
          report: false,
          revoke: false,
        },
        //获取课程
        getMyTeachRoomCourseTitle: {
          ajaxSuccess: 'getMyTeachRoomCourse',
          ajaxParams: {
            url: api.getMyTeachRoomCourse.path,
            method: api.getMyTeachRoomCourse.method,
            params: {
              courseTime: this.operailityData.date,
              weekSetId: this.operailityData.weekSetId,
              type: 'three'
            }
          }
        },
        //获取教学方法
        getByCode: {
          ajaxSuccess: 'getByCodeSuccess',
          ajaxParams: {
            url: api.getByCode.path,
            method: api.getByCode.method,
            params: {}
          }
        },

        //教研室设置时间添加
        saveRoomCourseTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.weekCourseModify.path,
            method: api.weekCourseModify.method,
            jsonString: true,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //获取科室option数据
        this.ajax(this.getDepTitle);
        this.ajax(this.getByCode);
        this.ajax(this.getMyTeachRoomCourseTitle);
      },

      //获取server端课程信息
      getMyTeachRoomCourse (responseData) {
        let disabled = {
          report: false,
          revoke: false,
        }
        let data = responseData.data;
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          item['weekSetId'] = this.operailityData.weekSetId;
          item['recordId'] = item['timeRecordId'];
          item['courseAddress'] = item['recordCourseAddress'];
//          if (['PASS', 'NO_PASS', 'JYC_NO_PASS'].includes(item.courseArrangeState)) {
//            disabled.report = true;
//          }
//          if (!['NO_PASS', 'JYC_NO_PASS'].includes(item.courseArrangeState)) {
//            disabled.revoke = true;
//          }
        }
        this.disabled = disabled;
        this.course = data;
      },

      //获取
      getByCodeSuccess (res) {
        let data = res.data;
        if (!data) return
        this.courseMethodData = data.child || []
      },
      //获取server端返回的科室
      CourseType (responseData) {
        let data = responseData.data;
        if (!Util.isEmptyObject(data)) {
          this.optionData = data.child;
        }
//        this.ajax(this.getMyTeachRoomCourseTitle);
      },

      //添加人员
      addUser (itmeName) {
        this.currSltUserName = itmeName;
        this.initUser = [];
        if (this.course[this.currSltUserName] != '') {
          let teachUserNames = this.course[this.currSltUserName]['teachUserNames'] + '';
          let teachUserIds = this.course[this.currSltUserName]['teachUserIds'];
          if (teachUserNames.indexOf(',') > -1) {
            let names = teachUserNames.split(',');
            let ids = teachUserIds.split(',');

            for (var i = 0; i < names.length; i++) {
              if (names[i] != '') {
                this.initUser.push({
                  key: ids[i],
                  label: names[i],
                  description: '人员id---' + ids[i] + '的描述信息',
                  disabled: false
                })
              }
            }
          } else {
            this.initUser.push({
              key: teachUserIds,
              label: teachUserNames,
              description: '人员id---' + teachUserIds + '的描述信息',
              disabled: false
            })
          }
          if (!this.course[this.currSltUserName]['teachUserNames']) {
            this.initUser = [];
          }
          ;
        }
        this.openModel('selectUser');
      },

      //关闭选择人员弹窗
      closeUserModal () {
        this.selectUserModal = false;
      },

      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers (users) {
        let namesArr = [];
        let idsArr = [];
        for (var i = 0; i < users.length; i++) {
          namesArr.push(users[i].label);
          idsArr.push(users[i].key);
        }
        this.course[this.currSltUserName]['teachUserIds'] = idsArr.join(',');
        this.course[this.currSltUserName]['teachUserNames'] = namesArr.join(',');
        this.closeUserModal();
      },

      /**保存或者上报*/
      save (type, isLoadingFun) {
        let isSubmit = this.submitForm();
        if (!isLoadingFun) isLoadingFun = function () {
        };
        if (isSubmit) {
          let saveRoomCourseTitle = {
            type: 'add',
            successTitle: `${type === 'NO_SUBMIT' ? '添加' : '提交'}成功!`,
            errorTitle: `${type === 'NO_SUBMIT' ? '添加' : '提交'}失败!`,
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api.weekCourseModify.path,
              method: api.weekCourseModify.method,
              jsonString: true,
              data: {
                courseArrangeState: type,
                paramList: this.getFormData(this.course),
              }
            }
          }
          this.ajax(saveRoomCourseTitle, isLoadingFun);
        }
      },

      /**撤销
       * */
      revoke () {
        let course = this.getFormData(this.course);
        let ids = course.reduce((arr, item) => {
          arr.push(item.courseArrangeId);
          return arr;
        }, []).join(',')
        let saveRoomCourseTitle = {
          type: 'add',
          successTitle: '撤销成功!',
          errorTitle: '撤销失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.revoke.path + ids,
            method: api.revoke.method,
          }
        };
        this.ajax(saveRoomCourseTitle);

      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = true;
        for (let i = 0; i < this.$refs.f.length; i++) {
          this.$refs.f[i].validate((valid) => {
            if (!valid) {
              flag = false;
            }
          });
        }
        return flag;
      },

      //选中值发生变化时触发
      change (val) {

      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', 'add');
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep([], data);
        return myData;
      },
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  }
</script>

