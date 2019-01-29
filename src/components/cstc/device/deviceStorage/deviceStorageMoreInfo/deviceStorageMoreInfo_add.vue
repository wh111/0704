<template>
  <div>
    <el-row class="editForm">
      <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="124px">
        <el-col :span="9" :offset="2">
          <el-form-item label="设备名称：" prop="">
            <el-select v-model="formValidate.deviceTypeId" filterable :disabled="!!id">
              <el-option v-for="item in deviceOption" :key="item.id" :value="item.id" :label="item.deviceTypeName">{{ item.deviceTypeName }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="设备编号：" prop="deviceIdentifier">
            <el-input v-model="formValidate.deviceIdentifier" placeholder="请输入设备编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="设备状态：" prop="status">
            <el-select v-model="formValidate.status" placeholder="请选择">
              <el-option v-for="item in stateOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="规格：" prop="specifications">
            <el-input v-model="formValidate.specifications" placeholder="请输入设备规格"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="型号：" prop="model">
            <el-input v-model="formValidate.model" placeholder="请输入设备型号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="使用次数：" prop="useTime">
            <el-input v-model="formValidate.useTime" placeholder="请输入使用次数"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="单价（元）：" prop="price">
            <!--<el-input v-model="formValidate.price" @blur="formatRMB" placeholder="请输入单价"></el-input>-->
            <el-input v-model="formValidate.price" placeholder="请输入单价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="供应商：" prop="supplier">
            <el-input v-model="formValidate.supplier" placeholder="请输入供应商"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="使用方向：" prop="directionUse">
            <el-input v-model="formValidate.directionUse" placeholder="请输入使用方向"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="购置时间：" prop="purchaseDate">
            <el-date-picker v-model="formValidate.purchaseDate" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="使用部门：" prop="useDepartment">
            <el-input v-model="formValidate.useDepartment" placeholder="请输入使用部门"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="责任人：" prop="personLiable">
            <el-input v-model="formValidate.personLiable" placeholder="请输入责任人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="厂家：" prop="manufactor">
            <el-input v-model="formValidate.manufactor" placeholder="请输入厂家"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="出厂编号：" prop="factoryNumber">
            <el-input v-model="formValidate.factoryNumber" placeholder="请输入出厂编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="出厂日期：" prop="manufactureDate">
            <el-date-picker v-model="formValidate.manufactureDate" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="购置来源：" prop="purchaseSource">
            <el-input v-model="formValidate.purchaseSource" placeholder="请输入购置来源"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="保修截止日期：" prop="guaranteeDate">
            <el-date-picker v-model="formValidate.guaranteeDate" :editable="false" type="date" placeholder="选择保修截止日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="折旧方式：" prop="depreciationMethod">
            <!--<el-select v-model="formValidate.depreciationMethod" placeholder="请选择">-->
            <!--<el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <el-input v-model="formValidate.depreciationMethod"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="存放地点：" prop="storageLocation" style="margin-bottom: 23px">
            <el-input v-model="formValidate.storageLocation" placeholder="请选择或者输入" @input="inputStorageLocation">
              <el-button slot="append" @click="selectRoom">选择房间</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="发票号：" prop="invoiceNumber">
            <el-input v-model="formValidate.invoiceNumber" placeholder="请输入发票号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="发票图片：">
            <upload-photo-wall type="picture" :actionUrl="'/file/upload/static'" :fileList="fileList" @upladSuccess="upladSuccess"></upload-photo-wall>
          </el-form-item>
        </el-col>


        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="维修电话：" prop="servicingPhone">-->
        <!--<el-input v-model="formValidate.servicingPhone" placeholder="请输入维修电话"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="厂商电话：" prop="manufacturerPhone">-->
        <!--<el-input v-model="formValidate.manufacturerPhone" placeholder="请输入厂商电话"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="购买地址：" prop="buyAdderss">-->
        <!--<el-input v-model="formValidate.buyAdderss" placeholder="请输入购买地址"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->


        <!--<el-col :span="9" :offset="2">-->
        <!--<el-form-item label="生产日期：" prop="manufactureDate" required>-->
        <!--<el-date-picker v-model="formValidate.manufactureDate" :editable="false" type="date" placeholder="选择生产日期">-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--</el-col>-->


        <el-col :span="20" :offset="2">
          <el-form-item label="备注：" prop="describes">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="formValidate.describes">
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 按钮 -->
    <el-row type="flex" class="row-bg" justify="center" solt="footer">
      <el-col :span="4" class="btnBox" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="4" class="btnBox" :offset="2" align="center">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
    <!--选择房间-->
    <Modal :mask-closable="false" v-model="selectRoomModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" @cancel="selectRoomModal=false" :selectOne="true" @select="selectRoomCall" :select="roomIds"></select-room>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;
  import api from './api';
  import {
    deviceStorageMoreInfo as rules
  } from '../../../rules'; // 表单验证规则

  import selectRoom from '../../../../common/selectRoom.vue';
  import uploadPhotoWall from '../../../../common/uploadPhotoWall';

  // 设备状态
  import stateOption from './stateOption';

  export default {
    props: {
      urlParams: { // 编辑
        type: Object,
        required: true
      },
      id: { // 编辑时主键id
        type: Number,
        default: 0
      },
      depId: { // 设备类型id
        type: [Number, String],
        required: true
      }
    },
    data () {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {
          loading: false,
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        roomIds: [],
        deviceOption: [], // 设备
        stateOption, // 设备状态选择项
        // 表单数据
        formValidate: {
//          model: "", // 设备型号
//          deviceIdentifier: "", // 设备编号
//          price: "", // 单价
//          purchaseDate: "", // 购买时间
//          manufacturerPhone: "", // 厂商电话
//          servicingPhone: "", // 维修电话
//          storageLocation: "", // 存放地点
//          roomId:"", // 存放的房间id
//          buyAdderss: "", // 购买地点
//          manufactureDate: "", // 生产日期
//          guaranteeDate: "", // 保修截止日期
//          status: "", // 状态
//          describes: "" // 描述
          'depId': '',
          'deviceTypeId': '', // 设备id
          'deviceIdentifier': '', // 设备编号
          'price': '', // 单价
          'useTime': '', // 使用次数
          'status': 'NORMAL', // 设备状态
          'manufactureDate': '', // 生产日期
          'buyAdderss': '', // 购买地址
          'manufacturerPhone': '', // 厂商电话
          'guaranteeDate': '', // 保修截止日期
          'storageLocation': '', // 存放地点
          'describe': '', // 设备描述
//          'QRCode': '/**/**.png',
          'model': '', // 设备型号
          'specifications': '', // 规格
          'supplier': '', // 供应商
          'directionUse': '', // 使用方向
          'factoryNumber': '', // 出厂编号
          'purchaseSource': '', // 购置来源
          'invoiceNumber': '', // 发票号
          'depreciationMethod': '', // 折旧方式
          'purchaseDate': '', // 购置日期
          'useDepartment': '', // 使用部门
          'personLiable': '', // 责任人
          'manufactor': '', // 厂家
          'invoicePictureList': [ // 发票照片
//            {
//              "originalPath":"*/*.jpg",
//              "thumbnailPath":"*/*.jpg"
//            }
          ]
        },
        //当前组件提交数据时,ajax处理的 基础信息设置
        selectRoomModal: false,
        selectRoomId: {
          id: 'selectRoomId',
          title: '选择房间'
        },
        editType: 'storage',
        fileList: [],
        staticPath: '',
      };
    },
    methods: {
      init () {
        //给当前组件注入全局util
        Util = this.$util;
        this.staticPath = this.$store.getters.getEnvPath.http;
        if (!this.id) {
          this.formValidate.depId = this.depId;
        } else {
          this.editType = 'edit';
        }
        this.getDeviceOption();
      },
      getEditData () {
        let opt = {
          ajaxSuccess: 'getEditDataSuccess',
          ajaxParams: {
            url: api.get.path + this.id,
            method: api.get.method
          }
        };
        this.ajax(opt);
      },
      getEditDataSuccess (res) {
        let fileList = [];
        if (res.data.roomId) {
          this.roomIds[0] = res.data.roomId;
        }
        if (res.data.invoicePictureList && res.data.invoicePictureList.length) {
          res.data.invoicePictureList.map(item => fileList.push({
            name: '',
            url: this.staticPath + item.originalPath
          }));
        }
        this.fileList = fileList;
        this.formValidate = res.data; // 初始化编辑数据
      },
      // 转换为保留两位小数
      formatRMB () {
        if (!isNaN(this.formValidate.price)) {
          this.formValidate.price = (+this.formValidate.price).toFixed(2);
        } else {
          this.formValidate.price = '0.00';
        }
      },
      // 获取设备
      getDeviceOption () {
        let opt = {
          ajaxSuccess: res => {
            this.deviceOption = res.data;
            if (this.id) {
              this.getEditData();
            }
          },
          ajaxParams: {
            url: this.urlParams.selectDevice.path,
            params: {
//              depId: this.depId
              depId: -1
            }
          }
        };
        this.ajax(opt);
      },
      // 图片上传
      upladSuccess (fileList, idx) {
        this.formValidate.invoicePictureList = [];
        for (var i = 0; i < fileList.length; i++) {
          let file = (fileList[i].src || '').match(/(static.*)(\..*)/);
          this.formValidate.invoicePictureList.push({
            originalPath: file[0],
            thumbnailPath: file[1] + '_MINI' + file[2]
          });
        }
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        let msg = {edit: '编辑', storage: '添加'};
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let data = this.getFormData(this.formValidate);
          data.purchaseDate = this.conductDate(data.purchaseDate, 'yyyy-MM-dd');
          data.purchaseTime = this.conductDate(new Date(), 'yyyy-MM-dd');
          data.manufactureDate = this.conductDate(data.manufactureDate, 'yyyy-MM-dd');
          data.guaranteeDate = this.conductDate(data.guaranteeDate, 'yyyy-MM-dd');
          let opt = {
            type: this.editType,
            successTitle: msg[this.editType] + '成功!',
            errorTitle: msg[this.editType] + '失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxParams: {
              jsonString: true,
              url: this.editType == 'storage' ? this.urlParams.storage.path : api.modify.path + this.id,
              method: this.editType == 'storage' ? this.urlParams.storage.method : api.modify.method,
              data
            }
          };
          this.ajax(opt, isLoadingFun);
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
      cancel () {
        this.$emit('cancel', this.editType);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      // 选择房间
      selectRoom () {
        this.selectRoomModal = true;
      },

      // 选择房间回调
      selectRoomCall (res) {
        this.roomIds[0] = res[0].id;
        this.formValidate.roomId = res[0].id;
        this.formValidate.storageLocation = res[0].roomNum;
        this.selectRoomModal = false;
      },

      // 输入存放地点
      inputStorageLocation () {
        this.formValidate.roomId = '';
        this.roomIds = [];
      }
    },
    created () {
      this.init();
    },
    components: {
      selectRoom, uploadPhotoWall
    }
  };

</script>

<style lang="scss">
  @import '../../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
