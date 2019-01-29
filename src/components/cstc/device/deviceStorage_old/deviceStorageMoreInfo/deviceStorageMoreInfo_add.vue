<template>
  <div>
    <el-row class="editForm">
      <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="124px">
        <el-col :span="9" :offset="2">
          <el-form-item label="购买时间：" prop="purchaseTime" required>
            <el-date-picker v-model="formValidate.purchaseTime" :editable="false" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="单价：" prop="price" required>
            <!--<el-input v-model="formValidate.price" @blur="formatRMB" placeholder="请输入单价"></el-input>-->
            <el-input v-model="formValidate.price" placeholder="请输入单价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="维修电话：" prop="servicingPhone">
            <el-input v-model="formValidate.servicingPhone" placeholder="请输入维修电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="厂商电话：" prop="manufacturerPhone">
            <el-input v-model="formValidate.manufacturerPhone" placeholder="请输入厂商电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="购买地址：" prop="buyAdderss">
            <el-input v-model="formValidate.buyAdderss" placeholder="请输入购买地址"></el-input>
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
          <el-form-item label="设备编号：" prop="deviceIdentifier" required>
            <el-input v-model="formValidate.deviceIdentifier" placeholder="请输入设备编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="设备型号：" prop="model" required>
            <el-input v-model="formValidate.model" placeholder="请输入设备型号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="生产日期：" prop="manufactureDate" required>
            <el-date-picker v-model="formValidate.manufactureDate" :editable="false" type="date" placeholder="选择生产日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="保修截止日期：" prop="guaranteeDate" required>
            <el-date-picker v-model="formValidate.guaranteeDate" :editable="false" type="date" placeholder="选择保修截止日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="2">
          <el-form-item label="设备状态：" prop="status" required>
            <el-select v-model="formValidate.status" placeholder="请选择">
              <el-option v-for="item in stateOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="设备描述：" prop="describes">
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

  import {
    deviceStorageMoreInfo as rules
  } from '../../../rules'; // 表单验证规则

  import selectRoom from '../../../../common/selectRoom.vue';

  // 设备状态
  import stateOption from './stateOption';

  export default {
    props: {
      urlParams: { // 编辑
        type: Object,
        required: true
      },
      id: { // 部门id
        type: Number,
        required: true,
      },
      depId: { // 设备类型id
        type: [Number, String],
        required: true,
      }
    },
    data() {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {
          loading: false,
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        roomIds:[],
        stateOption, // 设备状态选择项
        // 表单数据
        formValidate: {
          model: "", // 设备型号
          deviceIdentifier: "", // 设备编号
          price: "", // 单价
          purchaseTime: "", // 购买时间
          manufacturerPhone: "", // 厂商电话
          servicingPhone: "", // 维修电话
          storageLocation: "", // 存放地点
          roomId:"", // 存放的房间id
          buyAdderss: "", // 购买地点
          manufactureDate: "", // 生产日期
          guaranteeDate: "", // 保修截止日期
          status: "", // 状态
          describes: "" // 描述
        },
        //当前组件提交数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'storage',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.urlParams.path,
            method: this.urlParams.method
          }
        },
        selectRoomModal:false,
        selectRoomId:{
          id:'selectRoomId',
          title:"选择房间",
        },
      }
    },
    methods: {
      // 转换为保留两位小数
      formatRMB() {
        if (!isNaN(this.formValidate.price)) {
          this.formValidate.price = (+this.formValidate.price).toFixed(2)
        } else {
          this.formValidate.price = '0.00'
        }
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          let data = this.addMessTitle.ajaxParams.data;
          data.purchaseTime = this.conductDate(data.purchaseTime, 'yyyy-MM-dd hh:mm:ss');
          data.manufactureDate = this.conductDate(data.manufactureDate, 'yyyy-MM-dd');
          data.guaranteeDate = this.conductDate(data.guaranteeDate, 'yyyy-MM-dd');
          data.depId = this.depId;
          data.deviceTypeId = this.id;
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
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      // 选择房间
      selectRoom(){
        this.selectRoomModal = true;
      },

      // 选择房间回调
      selectRoomCall(res){
        this.roomIds[0] = res[0].id;
        this.formValidate.roomId = res[0].id;
        this.formValidate.storageLocation = res[0].roomNum;
        this.selectRoomModal = false;
      },

      // 输入存放地点
      inputStorageLocation(){
        this.formValidate.roomId = '';
        this.roomIds = [];
      },
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    components:{
      selectRoom,
    }
  }

</script>

<style lang="scss">
  @import '../../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
