<template>
  <!--事务增加-->
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="130px">

      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="事务名称：" prop="affairName">
            <el-input v-model="formValidate.affairName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="类型：" prop="affairType">
            <el-select placeholder="请选择" v-model="formValidate.affairType" clearable>
              <el-option v-for="item in typeOption" :key="item.value" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <date-group :dateGroup="{text:'',startDate:formValidate.startTime,endDate:formValidate.endTimeEnd}">
          <el-col :span="10" :offset="1" name="start">
            <el-form-item label="接待开始时间：" prop="startTime">
              <el-date-picker v-model="formValidate.startTime" :editable="false" type="datetime" placeholder="选择时间" :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1" name="end">
            <el-form-item label="接待结束时间：" prop="endTime">
              <el-date-picker v-model="formValidate.endTime" :editable="false" type="datetime" placeholder="选择时间" :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
            </el-form-item>
          </el-col>
        </date-group>
        <el-col :span="10" :offset="1">
          <el-form-item label="接待对象：" prop="receptionObject">
            <el-input v-model="formValidate.receptionObject"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="人数：" prop="peopleNum">
            <el-input v-model="formValidate.peopleNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="是否使用房间：" prop="isRoom">
            <el-radio-group v-model="formValidate.isRoom">
              <el-radio label="YES">是</el-radio>
              <el-radio label="NO">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1" v-if="formValidate.isRoom === 'YES'">
          <el-form-item label="使用房间：">
            <el-tag class="affairsRoomItem" :key="room.roomId" v-for="(room,index) in formValidate.roomList">{{ room.roomNum }}</el-tag>
            <el-tag class="affairsSelectRoom" type="primary" @click.native="selectRoom">+选择房间</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="附件：">
            <upload-file @setUploadFiles="setUploadFiles" :uploadFiles="filelist"></upload-file>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="事务描述：">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              v-model="formValidate.trainingContent">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="4" class="btnBox">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="4" class="btnBox" :offset="2">
        <el-button @click="cancelAdd">取消</el-button>
      </el-col>
    </el-row>
    <!--选择房间-->
    <Modal :mask-closable="false" v-model="selectRoomModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" @cancel="cancel" @select="selectRoomCallback" :select="roomIds"></select-room>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;

  import api from './api';
  //  import typeOption from './typeOption'; // 事务类型
  //  import userOption from './userOption'; // 培训对象
  import selectRoom from '../../common/selectRoom'; // 选择房间

  import {
    affairs as rules
  } from '../rules'; // 验证规则
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        filelist: [],
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        roomIds: [],
        roomNums: [],
        //form表单bind数据
        formValidate: {
          affairName:"", // 事务名称
          startTime:"", // 接待开始时间
          endTime:"", // 接待结束时间
          receptionObject:"", // 接待对象
          affairType:"", // 事务类型
          peopleNum:"", // 人数
          isRoom:"YES", // 是否使用房间 YES是|NO否
          roomIds:"", // 房间id字符串
          roomNums:"", // 房间号字符串 多个id以逗号分隔
          trainingContent:"", // 事务描述
          fileIds:"", // 附件id字符串
          roomList: [ //
            // {
            //   "roomId": "1",
            //   "roomNum": "101"
            // }
          ],
        },
//        userOption,
        typeOption:[], // 事务类型
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.edit.path + this.operailityData.id,
            method: api.edit.method
          }
        },
        selectRoomModal: false,
        selectUserModal: false,
        headerContent: {
          selectRoomId: {
            id: "selectRoomId",
            title: "选择房间"
          },
        },
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      this.init()
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        //this.ajax(this.listMessTitle)
        this.getTypeOption();
        this.getDataForServer();
      },
      getTypeOption(){
        let opt = {
          ajaxSuccess:res=>this.typeOption = res.data || [],
          ajaxParams:{
            url:api.getAffairType.path,
            method:api.getAffairType.method,
          }
        };
        this.ajax(opt)
      },
      // 获取数据
      getDataForServer() {
        this.ajax({
          ajaxSuccess: res => {
            this.formValidate = res.data;
            this.filelist.length = 0;

            for(let key in this.formValidate){
              if(res.data[key]){
                this.formValidate[key] = res.data[key]
              }
            }

            (res.data.roomList || []).map(item => {
              this.roomNums.push(item.roomNum);
              this.roomIds.push(item.roomId);
            })

            let fileId = [];
            for (let i = 0, list = res.data.fileList || [], l = list.length; i < l; i++) {
              this.filelist.push({
                fileId: list[i].fileId,
                fileName: list[i].fileName,
                filePath: list[i].path + list[i].fileName
              });
              fileId.push(list[i].fileId)
            }

            this.formValidate.fileIds = fileId.join(',')
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        })
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if(this.formValidate.isRoom == 'YES' && !this.roomIds.length){
            this.errorMess('请选择需要使用的房间')
            return
          }
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          let data = this.addMessTitle.ajaxParams.data;
          data.roomIds = this.roomIds.join(',');
          data.roomNums = this.roomNums.join(',');
          data.startTime = this.conductDate(data.startTime, 'yyyy-MM-dd HH:mm:ss');
          data.endTime = this.conductDate(data.endTime, 'yyyy-MM-dd HH:mm:ss');
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
      cancelAdd() {
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
      // 上传附件
      setUploadFiles(ids) {
        this.formValidate.fileIds = ids;
      },
      /********************************* 按钮事件 *****************************/
      // 选择房间
      selectRoom() {
        this.openModel('selectRoom')
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      /********************************* 弹窗回调 *****************************/
      // 选择房间
      selectRoomCallback(res) {
        this.roomIds.length = 0;
        this.roomNums.length = 0;
        this.formValidate.roomList.length=0;
        res.map(item => {
          this.roomIds.push(item.id);
          this.roomNums.push(item.roomNum);
          this.formValidate.roomList.push({
            roomId:item.id,
            roomNum:item.roomNum
          })
        });
        this.cancel('selectRoom')
      },
    },
    components: {
      selectRoom
    }
  }

</script>
<style lang="scss">
  @import '../../../assets/ambuf/css/manage_v1.0/editForm';
  .affairsRoomItem{margin-right: 10px;}
  .affairsSelectRoom{cursor: pointer;}
</style>
