<template>
  <div>
    <el-row>
      <el-form :inline="true" :model="formInline">
        <el-row>
          <el-col>
            <el-form-item label="专业方向:" label-width="90px">
              <el-select v-model="formInline.major" placeholder="请选择专业">
                <option-list></option-list>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="导师:" label-width="90px">
              <el-button @click="openHost(true)">选择导师</el-button>
              <div style="white-space:normal;" v-if="mentorArr.length>0" class="tip">
                {{mentorArr.join('、')}}
              </div>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="学员:" label-width="90px">
              <el-button @click="openHost(false)">选择学员</el-button>
              <div style="white-space:normal;" v-if="studentArr.length>0" class="tip">{{
                studentArr.join('、')}}
              </div>
            </el-form-item>
          </el-col>
          <el-col>
            <date-group :dateGroup="{text:'',startDate:formInline.startTime,endDate:formInline.endTime}">
              <el-form-item label="开放时间：" label-width="90px">
                <el-date-picker name="start" v-model="formInline.startTime" :editable="false" type="date"
                                placeholder="选择起始时间"
                                :picker-options="pickerOptions0"
                                @change="handleStartTime"></el-date-picker>
              </el-form-item>
              <el-form-item label="-">
                <el-date-picker name="end" v-model="formInline.endTime" :editable="false" type="date"
                                placeholder="选择截止时间"
                                :picker-options="pickerOptions1"
                                @change="handleEndTime"></el-date-picker>
              </el-form-item>
            </date-group>
          </el-col>
        </el-row>

      </el-form>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>

    <!--选择人员-->
    <Modal
      :mask-closable="false"
      width="890"
      v-model="hostModal"
      title="新建导师选择"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="hostId"></modal-header>
      <selectU v-if="hostModal" @cancel="hostModal=false" :isOnlyOne="false" :url="treeUrl" :ajaxData="{rootId:-102}"
               @setUsers="selectHostCallback" :initUser="selectUserMentor"></selectU>
      <div slot="footer"></div>
    </Modal>
    <!--选择学生-->
    <Modal
      :mask-closable="false"
      width="890"
      v-model="studentModal"
      title="新建学生选择"
      class-name="vertical-center-modal"
    >
      <modal-header slot="header" :content="hostId"></modal-header>
      <select-user v-if="studentModal" @cancel="studentModal=false" :url="url" :isOnlyOne="false"
                   @setUsers="selectHostCallback1" :initUser="selectUserStudent"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import api        from '../api';

  let Util = null;
  import selectU    from './setMentor_base/selectUser.vue';   //选择主持人
  import optionList from '../../common/major_nameCode.vue';

  export default {
    props: {
      id: {
        type: [Number, String],
        required: true
      }
    },
    data () {
      return {
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        hostModal: false,
        studentModal: false,
        isMentor: true,
        url: '/dept/tree-by-YJS',
        treeUrl: '/teacherType/tree/', //目录树结构请求地址
        mentorArr: [], //导师数组
        studentArr: [],//学生数组
        selectUserMentor: [],//当前选中导师的数据
        selectUserStudent: [],//当前选中的学生的数据
        hostId: {
          id: 'hostId',
          title: '选择导师'
        },
        formValidate: {},
        //form表单bind数据
        formInline: {
          major: '',
          majorCode: '',
          teacherIds: '',
          studentIds: '',
          startTime: '',
          endTime: ''
        },
        isStudentClick: false,
        isTeachClick: false,
        //当前组件提交(add)数据时,ajax处理的
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modify.path + this.id,
            method: api.modify.method,
            data: {}
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        let roomId = this.id;
        this.ajax({
          ajaxSuccess: res => {
            res.data.major = res.data.major + '-' + res.data.majorCode;
            this.formInline = res.data;
            let mentorArr = [];
            let ids = [];
            let names = [];
            for (let i = 0; i < res.data.teacherList.length; i++) {
              let item = res.data.teacherList[i];
              let obj = {
                disabled: false,
                key: res.data.teacherList[i].teacherUserId,
                label: res.data.teacherList[i].name
              };
              ids.push(item.key);
              mentorArr.push(item.name);
              names.push(obj);
            }
            this.mentorArr = mentorArr;

            //this.formInline.teacherIds = names.join(',');
            this.formInline.teacherIds = ids.join(',');
            this.hostModal = false;
            let ids1 = [];
            let names1 = [];
            let studentArr = [];
            for (let i = 0; i < res.data.studentList.length; i++) {
              let item = res.data.studentList[i];
              let obj = {
                disabled: false,
                key: res.data.studentList[i].studentId,
                label: res.data.studentList[i].name
              };
              ids1.push(item.key);
              studentArr.push(item.name);
              names1.push(obj);
            }
            this.studentArr = studentArr;
            this.selectUserMentor = names;
            //this.formInline.teacherIds = names.join(',');
            this.formInline.studentIds = ids1.join(',');
            this.studentModal = false;
            this.selectUserStudent = names1;
          },
          ajaxParams: {
            url: api.choiceGet.path + roomId,
            method: api.choiceGet.method
          }
        });

      },
      //选择人员的回调函数
      selectHostCallback (data) {
        //this.rowData.planActivityHost = data
        this.isTeachClick = true;
        let ids = [];
        let names = [];
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          ids.push(item.key);
          names.push(item.label);
        }
        this.mentorArr = names;
        //this.formInline.teacherIds = names.join(',');
        this.formInline.teacherIds = ids.join(',');
        this.hostModal = false;
        this.selectUserMentor = data;
      },
      selectHostCallback1 (data) {
        this.isStudentClick = true;
        let ids1 = [];
        let names1 = [];
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          ids1.push(item.key);
          names1.push(item.label);
        }
        this.studentArr = names1;
        //this.formInline.teacherIds = names.join(',');
        this.formInline.studentIds = ids1.join(',');
        this.studentModal = false;
        this.selectUserStudent = data;
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
//              myData.type = data.type.join(",");
        let obj = {};
        obj.major = myData.major;
        obj.majorCode = myData.majorCode;
        if (!this.isTeachClick) {
          let teacherArr = [];
          for (let i = 0; i < myData.teacherList.length; i++) {
            teacherArr.push(myData.teacherList[i].teacherUserId);
          }
          obj.teacherIds = teacherArr.join(',');
        } else {
          obj.teacherIds = this.formInline.teacherIds;
        }
        if (!this.isStudentClick) {
          let studentArr = [];
          for (let i = 0; i < myData.studentList.length; i++) {
            studentArr.push(myData.studentList[i].studentId);
          }
          obj.studentIds = studentArr.join(',');
        } else {
          obj.studentIds = this.formInline.studentIds;
        }
        obj.startTime = myData.startTime;
        obj.endTime = myData.endTime;
        return obj;
      },
      openHost (item) {
        if (item) {
          this.hostModal = true;

        } else {
          this.studentModal = true;
        }
        //this.selectUser = item.planActivityHost;
        //因为点击主持人的时候不赋值，所以重新赋值

      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', 'edit');
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
//            let isSubmit = this.submitForm("formValidate");
//            if (isSubmit) {
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        let formInline = Util._.defaultsDeep({}, this.formInline);
        let major = this.formInline.major.split('-');
        formInline.major = major[0];
        formInline.majorCode = major[1];
        this.editMessTitle.ajaxParams.data = this.formDate(this.getFormData(formInline), ['startTime', 'endTime'],
          'yyyy-MM-dd');
        console.log(this.formInline.teacherIds, this.formInline.studentIds);
        this.ajax(this.editMessTitle, isLoadingFun);
//            }
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      optionList,
      selectU
    }
  };
</script>
