<template>

  <div>

    <el-row class="but-space">
      <el-col :span="3" :offset="2">
        <Icon style="font-size: 50px" type="arrow-down-a"/>
      </el-col>
      <el-col :span="16">
        <p>填写事务表格</p>
        </br>
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
        <p>上传填好的事务列表 ( 仅支持.xls/.xlsx格式)</p>
        </br>
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
    <Modal close-on-click-modal="false" width="1100" v-model="toChannelModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <to-channel v-if="toChannelModal" @cancel="closeChannel" :url="excelImportUrl" @success="subHandelEvent" :data="convertedData"
                  :format="format" :commitBefFun="commitBefFun"></to-channel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import api from './api';
  import toChannel from '../../common/toChannel_base';
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'deptId'],
    data () {
      return {
        active: 0,
        //保存按钮基本信息
        excelImportUrl: api.excelImport.path,
        //导入条件
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        toChannelId: {
          id: 'toChannelId',
          title: '事务列表'
        },
        convertedData: [],
        format: {
          '名称': 'affairName',
          '类型': 'affairType',
          '开始时间': 'startTime',
          '结束时间': 'endTime',
          '接待对象': 'receptionObject',
          '人数': 'peopleNum',
          '房间': 'roomNums',
          '描述': 'trainingContent'
        },

        //记录总条数
        totalNumber: 0,
        toChannelModal: false,
        //form表单bind数据
        formValidate: {
          name: '',
          identify: null,
          remark: '',
          type: []
        },
        //table
        dynamicHt: 100,
        tableData1: [],
        http: ''
      };
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted () {
      //初始化
      let http = this.$store.getters.getEnvPath.http;
      this.http = http + 'static/template/事务信息模板.xls';
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init () {
        //默认请求加载数据
      },
      commitBefFun (data) {
        let res = data;
        res.map(item => item.roomNums = item.roomNums.replace(/，/g, ','));
        return res;
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      success () {
        this.$emit('toChannel', 'toChannel', `导入${this.totalNumber}条数据`);
      },

      cancel () {
        this.$emit('cancel', 'toChannel');
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
      //下一步
      next () {

        this.active = this.active + 1;
      },
      load () {
        this.active = 0;
      },

      closeChannel () {
        this.toChannelModal = false;
      },
      //点击上传获取文件回调函数
      handleSelectedFile (convertedData) {
        if (convertedData.body == 0) {
          this.errorMess('导入数据为空，请重新选择数据');
          return;
        }
        this.convertedData = convertedData;
        this.toChannelModal = true;
      },

      //导入成功回调函数
      subHandelEvent (data) {
        this.closeChannel();
        this.totalNumber += data.length;
      }

    },
    components: {
      toChannel
    }

  };

</script>
