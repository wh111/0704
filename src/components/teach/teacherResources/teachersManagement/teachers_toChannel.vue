<template>

  <div>

    <el-row class="but-space">
      <el-col :span="3" :offset="2">
        <Icon style="font-size: 50px" type="arrow-down-a"/>
      </el-col>
      <el-col :span="16">
        <p>下载{{title}}</p></br>
        <a :href="http">
          <el-button size="mini" type="primary">下载模板<i class="ivu-icon ivu-icon-arrow-down-a"></i></el-button>
        </a>
      </el-col>
    </el-row>
    <el-row class="but-space">
      <el-col :span="3" :offset="2">
        <Icon style="font-size: 50px" type="upload"/>
      </el-col>
      <el-col :span="16">
        <p>上传填好的人员信息表 ( 仅支持.xls/.xlsx格式)</p></br>
        <xlsx @on-select-file="handleSelectedFile" :row="1">上传</xlsx>

      </el-col>
    </el-row>
    <el-row class="but-space">
      <el-col :span="18" :offset="5">
        <p>本次已导入记录数 : {{totalNumber}}条</p>
      </el-col>
    </el-row>

    <el-row class="but-space">
      <el-col :span="10" :offset="9">
        <el-button @click="success">完成</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>

    <!--导入-->
    <Modal
      :mask-closable="false"
      width="1100"
      v-model="toChannelModal"
      title="对话框标题"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <to-channel v-if="toChannelModal" @cancel="closeChannel" :url="uploadTypeUrl"
                  :validate="validate" @success="subHandelEvent" :data="convertedData" :addData="{typeId:deptId}"
                  :format="format" :ch2en="ch2en"></to-channel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import toChannel from '../../../common/toChannel_base-handsontable.vue'
  import baseRules from '../../../../formRules/base.js'
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'deptId', 'type'],
    data() {
      return {
        active: 0,
        //保存按钮基本信息

        //导入条件
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        toChannelId: {id: 'toChannelId', title: '导入师资人员信息表'},
        convertedData: {},
        title: this.type == 'DS' ? '导师导入模板' : '带教老师导入模板',
        uploadTypeUrl:'',   // 导师tutor: archives/tutor/importExcel  带教老师teacher: archives/teacher/importExcel
        format: {
          '导师编号':'codeNumber',
          '带教老师编号': 'codeNumber',
          '教师姓名':'name',
          '性别':'sex',
          '出生年月':'birth',
          'email':'email',
          '联系电话':'telephone'
        },
        dsData:{
          '职称':'teachTitle',
          '学科专业':'specialtyName',
          '博导/硕导':'tutorType',
          '担任导师':'serveTutor',
          '主要研究方向':'researchDirection',
        },

        ch2en: {
          sex: {
            "男": "BOY",
            "女": "GIRL",
          },
          tutorType: {
            "博导": "BD",
            "硕导": "SD",
          },
//          strtus: {
//            "未组织": "UNORGANIZED",
//            "已组织": "ORGANIZE",
//          },
        },

        //记录总条数
        totalNumber: 0,
        toChannelModal: false,
        //table
        http: '',
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      if (this.type == 'DS') {
        this.format = Object.assign(this.format, this.dsData);
        this.uploadTypeUrl = 'archives/tutor/importExcel'
      }else{
        this.uploadTypeUrl = 'archives/teacher/importExcel'
      }
    },
    mounted() {
      //初始化
      let http = this.$store.getters.getEnvPath.http;
      this.http = http + 'static/template/'+this.title+'.xls';
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据

      },

      hot(hot){
        console.log("----",hot)
      },

      validate(data){
        let validate = {
          codeNumber: [{validate: baseRules._require, message: (this.type == 'DS' ? '导师' : '带教老师') + '编号必填'}],
          name: [{validate: baseRules._require, message: "教师姓名必填"}],
          email: [{validate: baseRules._email, message: "邮箱格式不正确"}],
        };
        if (this.type == 'DS') {
          validate = Object.assign(validate,{
            teachTitle: [{validate: baseRules._require, message: "职称必填"}],
            specialtyName: [{validate: baseRules._require, message: "学科专业必填"}],
            tutorType: [{validate: baseRules._require, message: "博导/硕导必填"}],
            serveTutor: [{validate: baseRules._require, message: "担任导师必填"}],
            researchDirection: [{validate: baseRules._require, message: "主要研究方向必填"}],
          })
        }
        return this._Gvalidate(data, validate)
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      success() {
        this.$emit('toChannel', 'toChannel', `导入${this.totalNumber}条数据`);
      },

      cancel() {
        this.$emit('cancel', 'toChannel');
      },

      closeChannel() {
        this.toChannelModal = false;
      },
      //点击上传获取文件回调函数
      handleSelectedFile(convertedData) {
        if (convertedData.body == 0) {
          this.errorMess('导入数据为空，请重新选择数据');
          return;
        }
        this.convertedData = convertedData;
        this.toChannelModal = true
      },

      //导入成功回调函数
      subHandelEvent(data) {
        this.closeChannel()
        this.totalNumber += data.length;
      },

    },
    components: {
      toChannel
    }

  }
</script>
