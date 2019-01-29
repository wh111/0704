<!--设备导入-->
<template>
  <div>
    <el-row class="but-space">
      <el-col :span="3" :offset="2">
        <Icon style="font-size: 50px" type="arrow-down-a"/>
      </el-col>
      <el-col :span="16">
        <p>填写导入设备的信息</p>
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
        <p>上传填好的设备信息表 ( 仅支持.xls/.xlsx格式)</p>
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
    <Modal close-on-click-modal="false" width="1100" v-model="toChannelModal" title="对话框标题" class-name="vertical-center-modal">
      <modal-header slot="header" :content="toChannelId"></modal-header>
      <to-channel v-if="toChannelModal" :deptId="id" :date="date" @cancel="closeChannel" :url="url.excelImportSave.path" @success="subHandelEvent"
                  :data="convertedData" :format="format" :addData="addData" :ch2en="ch2en"></to-channel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import toChannel from '../../../common/toChannel_base.vue'
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'url', 'id'],
    data () {
      return {
        active: 0,
        //保存按钮基本信息
        //导入条件
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent',
        },
        toChannelId: {
          id: 'toChannelId',
          title: '设备信息表',
        },
        convertedData: {},
        ch2en: {
          status: {
            '正常': 'NORMAL',
            '缺损': 'DEFECT',
            '损坏': 'DAMAGE',
            '维修中': 'SERVICING',
            '使用中': 'INUSE',
          },
        },
        format: {
//          '设备名称': 'deviceTypeName',
//          '设备编号': 'deviceIdentifier',
//          '设备型号': 'model',
//          '单价': 'price',
//          '购买日期': 'purchaseTime',
//          '厂商电话': 'manufacturerPhone',
//          '维修电话': 'servicingPhone',
//          '存放地点': 'storageLocation',
//          '购买地址': 'buyAdderss',
//          '生产日期': 'manufactureDate',
//          '保修截至日期': 'guaranteeDate',
//          '设备状态': 'status',
//          '设备描述': 'describes',
//          "depId":"1",

          '存放地点': 'storageLocation',
          '设备名称': 'deviceTypeName',
          '设备编号': 'deviceIdentifier',
          '规格': 'specifications',
          '型号': 'model',
          '单价(元)': 'price',
          '使用次数': 'useTime',
          '供应商': 'supplier',
          '设备状态': 'status',
          '使用方向': 'directionUse',
          '使用部门': 'useDepartment',
          '责任人': 'personLiable',
          '购置日期': 'purchaseDate',
          '厂家': 'manufactor',
          '出厂编号': 'factoryNumber',
          '出厂日期': 'manufactureDate',
          '发票号': 'invoiceNumber',
          '保修期限': 'guaranteeDate',
          '购置来源': 'purchaseSource',
          '折旧方式': 'depreciationMethod',
          '备注': 'describes',

//          "useTime":"5",
//          "status":"NORMAL",
//          "manufactureDate":"2016-01-01",
//          "purchaseTime":"2016-01-02",
//          "buyAdderss":"购买地址",
//          "manufacturerPhone":"20178787872748",
//          "guaranteeDate":"2016-12-31",
        },
        date: ['purchaseTime', 'manufactureDate', 'guaranteeDate'],
        addData: {
          purchaseTime: this.conductDate(new Date(), 'yyyy-MM-dd'), // 入库时间
        },

        //记录总条数
        toChannelModal: false,
        //form表单bind数据
        formValidate: {
          name: '',
          identify: null,
          remark: '',
          type: [],
        },
        totalNumber: 0,
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        //        addMessTitle:{
        //          type:'add',
        //          successTitle:'添加成功!',
        //          errorTitle:'添加失败!',
        //          ajaxSuccess:'ajaxSuccess',
        //          ajaxError:'ajaxError',
        //          ajaxParams:{
        //            url:'/role/add',
        //            method:'post'
        //          }
        //        },
        //table
        dynamicHt: 100,
        tableData1: [{
          l: '1',
        }, {
          l: '1',
        }],
        http: '',
      }
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted () {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init () {
        //默认请求加载数据
        let http = this.$store.getters.getEnvPath.http;
        this.http = http + 'static/template/设备入库模版.xls';

      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
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
      success () {
        this.$emit('toChannel', 'leadin', `导入${this.totalNumber}条数据`);
      },

      cancel () {
        this.$emit('cancel', 'leadin');
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
        this.active = this.active + 1
      },
      load () {
        this.active = 0
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
        this.toChannelModal = true
      },

      //导入成功回调函数
      subHandelEvent (data) {
        this.closeChannel()
        this.totalNumber += data.length;
      },

      //下载模板
      downTemplate () {

      },
    },
    components: {
      toChannel,
    },
  }

</script>
