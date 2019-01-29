<template>

  <div>

    <el-row class="but-space">
      <el-col :span="3" :offset="2">
        <Icon style="font-size: 50px" type="arrow-down-a"/>
      </el-col>
      <el-col :span="16">
        <p>填写导入人员的信息</p>
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
        <p>上传填好的人员信息表 ( 仅支持.xls/.xlsx格式)</p>
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
    <Modal close-on-click-modal="false" width="1100" v-model="toChannelModal" title="对话框标题"
           class-name="vertical-center-modal">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <to-channel v-if="toChannelModal" @cancel="closeChannel" :url="'/user/importSXS/'+deptId"
                  @success="subHandelEvent" :date="date" :data="convertedData"
                  :commitBefFun="commitBefFun"
                  :handsontableOptions="handsontableOptions"
                  :validate="validate"
                  :format="format"></to-channel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import baseRules from '../../../../formRules/base'; // 公共规则
  //  import toChannel from '../../../common/toChannel_base'
  import toChannel from '../../../common/toChannel_base-handsontable.vue'
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'deptId'],
    data() {
      return {
        baseRules,
        active: 0,
        //保存按钮基本信息
        handsontableOptions: {
          columns: '',
        },
        //保存按钮基本信息
        //导入条件
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        toChannelId: {
          id: 'toChannelId',
          title: '人员信息表'
        },
        date: [ 'startDate'],

        convertedData: ['startDate'],
        format: {
          '部门节点1': 'deptName1',
          '部门节点2': 'deptName2',
          '部门节点3': 'deptName3',
          '部门节点4': 'deptName4',

          '姓名': 'name',
          "编号": "codeNumber",
          "专业": "specialty",
          "学校": "schoolName",
          "年级": "grade",
          "学制": "length",
          "手机号码": "mobile",
          "邮箱": "email",

          "籍贯": "origin",
          "性别": "sex",
          "民族": "nation",

          "出生年月": "birth",
          "籍贯": "origin",
          "办公电话": "telephone",
          "政治面貌": "political",
          "身份证号": "idNumber",
          "最高学历": "highestEdu",
          "紧急联系人": "emgContact",
          "紧急联系人电话": "emgContactMobile",
          "现住址": "address",
          "邮编": "postCode",
          "紧急联系人电话": "emgContactMobile",
          "QQ": "qq",
          "邮箱": "email",
          "办公电话": "telephone",
          "现住址": "address",
          "邮编": "postCode",
          "实习开始日期": "startDate",
          "实习期": "internshipNum",
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
        tableData1: [],
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
      this.http = http + 'static/template/部门人员信息模板-实习生.xls';
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
          isLoadingFun(true)
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
        this.handsontableOptions.columns = this.handsontableValidate(convertedData.header);
        this.convertedData = convertedData;
        this.toChannelModal = true
      },


      //导入成功回调函数
      subHandelEvent(data) {
        this.closeChannel()
        this.totalNumber += data.length;
      },

      //导入提交前的数据处理
      commitBefFun(data) {
        data.map(item => {
          item.sex = item.sex == '男' ? 'BOY' : item.sex == '女' ? 'GIRL' : item.sex;
        });
        return data;
      },

      //自定已验证
      validate(data) {
        let baseRules = this.baseRules;
        let validate = {
          name: [{validate: baseRules._require, message: "姓名必填"}],
          codeNumber: [{validate: baseRules._require, message: "编号必填"}],
//          specialty: [{validate: baseRules._require, message: "专业必填"}],
          schoolName: [{validate: baseRules._require, message: "学校必填"}],
//          grade: [{validate: baseRules._integer, message: "年级"},{validate: baseRules._inputLen(4,4), message: "年级"}],
//          length: [{validate: baseRules._require, message: "学制必填"}],
          mobile: [{validate: baseRules._mobile, message: "手机号格式不正确"}],
          email: [{validate: baseRules._email, message: "邮箱不合法"}],
          startDate: [{validate: baseRules._date, message: "实习开始日期格式为2017-01-01"}],
//          internshipNum: [{validate: baseRules._integer, message: "实习期"}],

//          idNumber: [{validate: baseRules._idNumber, message: "身份证号不合法"}],
//          birth: [{validate: baseRules._integer, message: "出生年月"},{validate: baseRules._inputLen(6,6), message: "出生年月格式为:201701"}],
//          postCode: [{validate: baseRules._postCode, message: "请输入6位邮编数字"},],
        };
        return this._Gvalidate(data, validate)
      },

      //验证必填
      _require(value, callback, message) {
        if (value !== '' && value != null) {
          callback(true)
        } else {
          callback(false);
        }
      },
      /**handsontable验证规则  根据列表头部自动生成验证规则
       * @params  data {Array}  头部
       * @return  {null|Array}  头部
       * */
      handsontableValidate(header) {
        let arr = []
        let index = header.indexOf('性别');
        arr[index] = {
          type: 'autocomplete',  //从里面选择
          source: ['男', '女'], //数据源
          strict: true //是否是严格模式，严格模式就只允许从数据源里面选择
        }
        index = header.indexOf('部门节点1');
        arr[index] = {data: index + '', validator: this._require, allowInvalid: true}
        return arr;

      },


    },
    components: {
      toChannel
    }

  }

</script>
