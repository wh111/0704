<template>

  <div>
    <el-row>
      <el-form :model="formInline" :inline="true">
        <el-row>
          <el-col>
            <el-form-item label="专业方向：" label-width="90px">
              <el-select v-model="formInline.major" placeholder="">
                <major :selectDefault="true" @majorDefault="majorDefault"></major>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="导师：" label-width="90px">
              <el-button @click="openHost(true)">选择导师</el-button>
              <div v-if="mentorArr.length>0" class="tip">{{mentorArr.join('、')}}</div>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="学员：" label-width="90px">
              <el-button @click="openHost(false)">选择学员</el-button>
              <div v-if="studentArr.length>0" class="tip">{{ studentArr.join('、')}}
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
      class-name="vertical-center-modal"
    >
      <modal-header slot="header" :content="hostId"></modal-header>
      <selectU @cancel="hostModal=false" :url="treeUrl" :isOnlyOne="false" :ajaxData="{rootId:-102}"
               @setUsers="selectHostCallback" :initUser="selectUserMentor"></selectU>
      <div slot="footer"></div>
    </Modal>
    <!--选择学生-->
    <Modal
      :mask-closable="false"
      width="890"
      v-model="hostModal1"
      title="新建学生选择"
      class-name="vertical-center-modal"
    >
      <modal-header slot="header" :content="hostId"></modal-header>
      <select-user @cancel="hostModal1=false" :url="url" :isOnlyOne="false" @setUsers="selectHostCallback1"
                   :initUser="selectUserStudent"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import api     from '../api';

  let Util = null;
  import selectU from './setMentor_base/selectUser.vue';  //选择主持人
  import major   from '../../common/major_nameCode.vue';

  export default {
    components: {selectU, major},
    data () {
      return {
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        countDate: 0,
        hostModal: false,
        hostModal1: false,
        isMentor: true,
        url: '/dept/tree-by-YJS',
        mentorArr: [], //导师数组
        studentArr: [],//学生数组
        selectUserMentor: [],//当前选中导师的数据
        selectUserStudent: [],//当前选中的学生的数据
        hostId: {
          id: 'hostId',
          title: '选择导师'
        },

        treeUrl: '/teacherType/tree/', //目录树结构请求地址
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
        //当前组件提交(add)数据时,ajax处理的
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method,
            data: {}
          }
        }
      };
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted () {
      //暂时没有初始化,预留初始化入口
      //this.init();
    },
    methods: {
      //选择导师按钮
      checkData () {
        let flag = true;
        let data = {
          majorCode: '专业',
          teacherIds: '导师',
          studentIds: '学生',
          startTime: '开始时间',
          endTime: '结束时间'
        };
        for (let key in data) {
          if (this.formInline[key] == '') {
            this.errorMess(`"${data[key]}"不能为空！`);
            return false;
          }
        }
        return flag;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        if (this.checkData()) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let formInline = Util._.defaultsDeep({}, this.formInline);
          let major = this.formInline.major.split('-');
          formInline.major = major[0];
          formInline.majorCode = major[1];
          formInline.startTime = this.conductDate(formInline.startTime, 'yyyy-MM-dd');
          formInline.endTime = this.conductDate(formInline.endTime, 'yyyy-MM-dd');
          this.addMessTitle.ajaxParams.data = formInline;
          this.ajax(this.addMessTitle, isLoadingFun);
        }
      },
      //选择人员的回调函数
      selectHostCallback (data) {
        //this.rowData.planActivityHost = data
        let ids = this.formInline.teacherIds ? this.formInline.teacherIds.split(',') : [];
        let names = [];
        data.map(item => {
          if (this.mentorArr.indexOf(item.label) == -1) {
            ids.push(item.key);
            this.mentorArr.push(item.label);
          }
        });
        // for(let i=0;i<data.length;i++){
        //   let item = data[i];
        //   ids.push(item.key);
        //   this.mentorArr.push(item.label);
        // }
        //this.formInline.teacherIds = names.join(',');
        this.formInline.teacherIds = ids.join(',');
        this.hostModal = false;
        this.selectUserMentor = data;
      },
      selectHostCallback1 (data) {
        let ids = this.formInline.studentIds ? this.formInline.studentIds.split(',') : [];
        let names = [];
        data.map(item => {
          if (this.studentArr.indexOf(item.label) == -1) {
            ids.push(item.key);
            this.studentArr.push(item.label);
          }
        });
        // for(let i=0;i<data.length;i++){
        //   let item = data[i];
        //   ids.push(item.key);
        //   this.studentArr.push(item.label);
        // }

        //this.formInline.teacherIds = names.join(',');
        this.formInline.studentIds = ids.join(',');
        this.hostModal1 = false;
        this.selectUserStudent = data;
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
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', this.addMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        myData.type = data.type.join(',');
        return myData;
      },
      openHost (item) {
        if (item) {
          this.hostModal = true;
        } else {
          this.hostModal1 = true;
        }
        //this.selectUser = item.planActivityHost;
        //因为点击主持人的时候不赋值，所以重新赋值
      },
      /*
       * 组件初始化入口
       * */
      init () {
        //this.ajax(this.listMessTitle)
      },

      /**
       * 设置默认选择的专业
       * @param {Object} item 第一个数据
       * */
      majorDefault (item) {
        console.log(item);
        this.formInline.major = item.major + '-' + item.majorCode;
        this.formInline.majorCode = item.majorCode;
      }
    }
  };
</script>
<style>
  .tip {
    display: inline-block;
    line-height: 1;
    white-space: inherit;
    background: #fff;
    max-width: 800px;
    border: 1px solid #6edcdc;
    color: #1f2d3d;
    margin-right: 5px;
    padding: 7px 10px;
    border-radius: 5px
  }

  .date {
    line-height: 25px;
  }

  .date .countDate {
    display: inline-block;
    width: 70px;
    text-align: center;
    border-bottom: 1px solid;
  }
</style>
