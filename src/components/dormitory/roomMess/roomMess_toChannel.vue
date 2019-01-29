<template>

  <div>
    <el-row class="but-space">
      <el-col :span="10" :offset="2" style="font-size: 16px">
        <strong>大楼名称 : &nbsp; &nbsp; {{selectBuildData.name}}</strong>
      </el-col>
    </el-row>
    <el-row class="but-space">
      <el-col :span="3" :offset="2">
        <Icon style="font-size: 50px" type="arrow-down-a"/>
      </el-col>
      <el-col :span="16">
        <p>填写导入房间模板</p></br>
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
        <p>上传填好的房间模板 ( 仅支持.xls/.xlsx格式)</p></br>
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
      close-on-click-modal="false"
      width="1100"
      v-model="toChannelModal"
      title="对话框标题"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <to-channel v-if="toChannelModal" @cancel="closeChannel" :url="url.importRoom" @success="subHandelEvent"
                  :commitBefFun="commitBefFun"
                  :validate="validate"
                  :data="convertedData" :format="format"></to-channel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import toChannel from '../../common/toChannel_base.vue'
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'selectBuildData', 'url'],
    data() {
      return {
        active: 0,
        //保存按钮基本信息
        //导入条件
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        toChannelId: {id: 'toChannelId', title: '房间表'},
        convertedData: {},
        format: {
          '房间类别': 'sex',
          "房间号": "no",
          "床位数": "bedNum",
          "备注": "remark",
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

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: '/role/add',
            method: 'post'
          }
        },
        //table
        dynamicHt: 100,
        tableData1: [{l: '1'}, {l: '1'}],
        http: '',
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      let http = this.$store.getters.getEnvPath.http;
      this.http = http + 'static/template/导入房间模板.xls';
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据

      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
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
      success() {
        this.$emit('toChannel', 'toChannel', `导入${this.totalNumber}条数据`);
      },

      cancel() {
        this.$emit('cancel', 'toChannel');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        myData.type = data.type.join(",");
        return myData;
      },
      //下一步
      next() {

        this.active = this.active + 1
      },
      load() {
        this.active = 0
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
        this.closeChannel();
        this.totalNumber += data.length;
      },


      //导入提交前的数据处理
      commitBefFun(data) {
        data.map(item => {
          item.sex = item.sex == '男' ? 'BOY' : item.sex == '女' ? 'GIRL' : item.sex;
          item.buildId = this.selectBuildData.id
        });
        return data;
      },


      //导入验证
      validate: function (data) {
        let validate = {
          no: [{validate: this.require, message: "房间号必填"}, {validate: this.integer, message: "房间号"}],
          sex: [{validate: this.require, message: "房间类别必填"}, {validate: this.roomSex, message: "房间性别只能输入男和女"}],
          bedNum: [{validate: this.require, message: "床位数必填"}, {validate: this.integer, message: "床位数"}],
        };
        let errorData = [];
        let flag = false;
        for (let i = 0; i < data.length; i++) {
          let item = data[i]; //一行数据
          let errObj = {seq:i,errorMsgList: []};
          for (let key in validate) { //获取对象的每一项数据
            if (!validate[key]) continue; //没有进行验证则下一项
            for (let l = 0; l < validate[key].length; l++) {
              let valid = validate[key][l]; //每一项验证
              valid.validate(item[key], (mes) => {
                if (mes) {
                  flag = true;
                  errObj.errorMsgList.push(mes);
                }
              }, valid.message); //进项验证
            }
          }
          if(errObj.errorMsgList!=0){
            errorData.push(errObj)
          }
        }
        if(flag){
          return errorData;
        }else {
          return;
        }
      },

      //必填
      require(value, callback, message) {
        if (value !== '' && value != null) {
        } else {
          callback(message)
        }
      },

      //房间类别
      roomSex(value, callback, message) {
        if (value != '男' && value != '女') {
          callback(message)
        }
      },


      //整数验证
      integer: function (value, callback, message) {
        if (value == '' || value == null) {
          return;
        }
        //检验位的检测
        if (!/^\+?[1-9]\d*$/.test(value)) {
          callback(message + '必须正整数且大于零');
        }
        callback();
      },


    },
    components: {
      toChannel
    }

  }
</script>
