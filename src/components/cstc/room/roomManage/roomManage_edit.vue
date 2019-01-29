<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="editForm" label-width="100px">

      <el-row>
        <el-col :span="12">
          <el-form-item label="房间号：" prop="roomNum">
            <el-input v-model="formValidate.roomNum" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="房间名称：" prop="roomName">
            <el-input v-model="formValidate.roomName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="类型：" prop="roomType">
            <el-select v-model="formValidate.roomType" placeholder="请选择">
              <el-option
                v-for="(item,index) in roomTypeOptions"
                :key="index"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所在楼层：" prop="floor">
            <el-input v-model="formValidate.floor" placeholder="请输入所在楼层：1"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="可容量：" prop="capacity">
            <el-input v-model="formValidate.capacity" placeholder="请输入房间可容纳数量：50"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="有无设备：" prop="isDevice">
            <el-radio-group v-model="formValidate.isDevice">
              <el-radio label="1">有</el-radio>
              <el-radio label="0">无</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="formValidate.isDevice == 1">
        <el-col>
          <el-form-item label="设备：">
            <el-tag class="rmDeviceItem"
                    v-for="(item,index) in formValidate.deviceList"
                    :key="item.id" :closable="true"
                    :close-transition="false"
                    @close="removeDevice(index)"
            >{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
            </el-tag>
            <el-tag class="rmDeviceItem" type="primary" style="cursor: pointer;" @click.native="selectDevice">+选择设备</el-tag>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="房间位置：" prop="address">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="房间简介：" prop="summary">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.summary"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="房间图片：">
            <upload-file @upladSuccess="upladSuccess" :fileList="fileList"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="resetForm('formValidate')">重置</el-button>
      </el-col>
    </el-row>
    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="selectDeviceModal" class-name="vertical-center-modal" :loading="true" :width="900">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" :select="selectDeviceId" @cancel="cancel" @select="selectDeviceCall"></select-device>
      <div slot="footer"></div>
    </Modal>
  </div>

</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  import {
    roomManage as rules
  }                   from '../../rules'; // 表单验证规则
  import api          from './api';
  import uploadFile   from '../uploadFile';
  import selectDevice from '../../device/deviceType_select.vue';

  export default {
//    props: {
//      urlParams: { // api对象
//        type: Object,
//        required: true
//      }
//    },
    props: ['id'],
    data () {
      return {
        rules,
        self: this,
        staticPath: '',
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        selectDeviceModal: false,
        contentHeader: {
          selectDeviceId: {
            id: 'selectDeviceId',
            title: '选择设备'
          }
        },
        roomTypeOptions: [],
        selectDeviceId: [],
        //form表单bind数据
        formValidate: {
          roomNum: '', // 房间号
          roomName: '', // 房间名称
          summary: '', // 简介
          floor: '', // 所在楼层
          address: '', // 房间位置
          roomType: '', // 房间类型
          capacity: '', // 可容量
          isDevice: '0', // 有无设备
          deviceIds: '', // 设备id
          deviceList: [
//            {id:"",name:""}
          ],
          imgIds: '' // 房间图片 | 多个id以逗号分隔 ---> 1,2
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modify.path + this.id,
            method: api.modify.method
          }
        },
        fileList: []
      };
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      this.staticPath = this.$store.getters.getEnvPath.http || '';
      this.getRoomTypeOptions();
    },
    methods: {
      getRoomTypeOptions () {
        let opt = {
          ajaxSuccess: res => {
            this.roomTypeOptions = res.data || [];
            this.getDataForServer();
          },
          ajaxParams: {
            url: api.getAffairType.path
          }
        };
        this.ajax(opt);
      },
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer () {
        let roomId = this.id;
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + roomId,
            method: api.get.method
          }
        });
      },
      getDataSuccess (res) {
        for (let key in this.formValidate) {
          if (res.data[key]) {
            this.formValidate[key] = res.data[key];
          }
        }

        // 初始化编辑数据
        this.fileList = [];
        let imgIds = [];
        for (let i = 0, list = res.data.imageList, l = list.length; i < l; i++) {
          this.fileList.push({
            name: list[i].id,
            url: api.down.path + list[i].id
          });
          imgIds.push(list[i].id);
        }
        this.formValidate.imgIds = imgIds.join(',');

        this.selectDeviceId = [];
        (res.data.deviceList || []).map(item => this.selectDeviceId.push(item.deviceId));

        this.formValidate.isDevice = !res.data.deviceList.length ? '0' : '1';
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        let data;
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          data = this.getFormData(this.formValidate);
          data.deviceIds = data.isDevice == 1 ? this.selectDeviceId.join(',') || '' : '';
          this.addMessTitle.ajaxParams.data = data;
          this.ajax(this.addMessTitle, isLoadingFun);
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
        if (flag && this.formValidate.isDevice == 1 && !this.selectDeviceId.length) {
          this.errorMess('请至少选择一个设备！');
          flag = false;
        }
        return flag;
      },
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * 注:当前为添加页面暂时未用到,属于预留
       * */
      oneDataSuccess (res) {
        /*let responseData = res.data;
         if(this.$util._.isObject(responseData["status"])&&responseData["status"]["code"]==0) {
         let type = [];
         let data = responseData.data;
         type.push(data.type+"");
         this.formValidate = data;
         this.formValidate.type = type;
         }*/
      },
      /*
       * 重置当前表单
       * */
      resetForm (formName) {
        // this.$emit('cancel', this.addMessTitle.type);
        this.$refs[formName].resetFields();
        this.fileList = [];
        this.selectDeviceId = [];
        this.formValidate.imgIds = '';
        this.formValidate.deviceIds = '';
        this.formValidate.deviceList = [];
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init () {
        //this.ajax(this.listMessTitle)
      },
      // 图片上传
      upladSuccess (ids) {
        this.formValidate.imgIds = ids;
      },
      // 选择设备
      selectDevice () {
        this.openModel('selectDevice');
      },
      // 选择设备模型
      selectDeviceCall (res) {
        (res || []).map(item => {
          if (this.selectDeviceId.indexOf(item.id) == -1) {
            this.selectDeviceId.push(item.id);
            this.formValidate.deviceList.push({
              deviceId: item.id,
              deviceTypeName: item.deviceTypeName,
              deviceIdentifier: item.deviceIdentifier
            });
          }
        });
        this.cancel('selectDevice');
      },
      // 移除选择的设备
      removeDevice (index) {
        this.formValidate.deviceList.splice(index, 1);
        this.selectDeviceId.splice(index, 1);
      },
      /********************************* 模态窗 **********************/
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 模态窗关闭
      cancel (options) {
        this[options + 'Modal'] = false;
      }
    },
    components: {
      uploadFile,
      selectDevice
    }
  };

</script>
<style>
  .date {
    line-height: 25px;
  }

  .date .countDate {
    display: inline-block;
    width: 70px;
    text-align: center;
    border-bottom: 1px solid;
  }

  .rmDeviceItem {
    margin-right: 10px;
  }
</style>
