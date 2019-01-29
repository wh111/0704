<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div class="editForm">
    <el-row>
      <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="80px">
        <el-col :span="12">
          <el-form-item label="房间：" prop="roomId">
            <el-select v-model="formValidate.roomId" placeholder="请选择房间号" @change="selectRoom">
              <el-option v-for="item in roomSelectList" :key="item.id" :value="item.id"
                         :label="item.roomNum"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IP：" prop="readerIp">
            <el-input v-model="formValidate.readerIp" placeholder="请输入读卡器IP"></el-input>
          </el-form-item>
        </el-col>
        <el-col align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancelEdit">取消</el-button>
        </el-col>
      </el-form>
    </el-row>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {reader as rules} from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        roomSelectList: {},
        formValidate: {
          roomNum: '',
          roomId: '',
          readerIp: '',
        },
        selectRoomId: {
          id: 'selectRoomId',
          title: '选择房间',
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        editType: 'add',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        if (this.operailityData) {
          this.editType = 'edit';
        }
        this.getRoomList();
      },
      getRoomList() {
        let opt = {
          ajaxSuccess: res => {
            let obj = {};
            (res.data || []).map(item => obj[item.id] = item);
            this.roomSelectList = obj;
            if (this.editType == 'edit') {
              this.getEditData()
            }
          },
          ajaxError: () => this.errorMess('获取房间数据失败'),
          ajaxParams: {
            url: api.roomList.path,
            method: api.roomList.method
          }
        };
        this.ajax(opt)
      },
      getEditData() {
        let opt = {
          ajaxSuccess: res => {
            for (let key in this.formValidate) {
              this.formValidate[key] = res.data[key]
            }
          },
          ajaxError: () => this.errorMess('获取数据失败'),
          ajaxParams: {
            url: api.get.path + this.operailityData.readerId,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        let msg = {add: '添加', edit: '修改'};
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let opt = {
            type: this.editType,
            successTitle: msg[this.editType] + '成功!',
            errorTitle: msg[this.editType] + '失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api[this.editType].path + (this.editType === 'add' ? '' : this.operailityData.id),
              method: api[this.editType].method,
              data: this.getFormData(this.formValidate)
            }
          };
          this.ajax(opt, isLoadingFun)
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
      cancelEdit() {
        this.$emit('cancel', this.editType);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },
      selectRoom(roomId) {
        if (this.roomSelectList[roomId]) {
          this.formValidate.roomNum = this.roomSelectList[roomId].roomNum;
        } else {
          this.formValidate.roomNum = '';
        }
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }

</script>
