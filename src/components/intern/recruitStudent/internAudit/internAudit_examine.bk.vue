<template>
  <!-- 审核 -->
  <div>
    <!-- 基本信息 -->
    <basic :data-id="operailityData.id"></basic>
    <!-- 身份证照片 -->
    <el-row class="internAuditExaminePhoto">
      <el-col :span="11" :offset="1">
        <img :src="(photoData['5'][0] && photoData['5'][0].cerCopiesHttp) || ''" alt="">
      </el-col>
      <el-col :span="11" align="right">
        <img :src="(photoData['5'][1] && photoData['5'][1].cerCopiesHttp) || ''" alt="">
      </el-col>
    </el-row>
    <el-row>
      <!-- 住宿信息 -->
      <el-form class="editForm internAuditExamine" ref="formValidate" :model="formValidate" :rules="rules" label-width="120px">
        <el-col :span="11" :offset="1">
          <el-form-item label="是否需要住宿：">
            <el-radio class="radio" v-model="formValidate.isDormitory" label="1">需要</el-radio>
            <el-radio class="radio" v-model="formValidate.isDormitory" label="0">不需要</el-radio>
          </el-form-item>
        </el-col>
        <template v-if="formValidate.isDormitory === '1'">
          <el-col :span="11" :offset="1">
            <el-form-item label="选择宿舍：">
              <el-radio class="radio" v-model="formValidate.isFreeSelect" label="0">服从安排</el-radio>
              <el-radio class="radio" v-model="formValidate.isFreeSelect" label="1">自由选择</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="22" :offset="1" v-show="formValidate.isFreeSelect === '1'">
            <el-form-item label="已选宿舍："><span>{{ selectRoomText || '-' }}</span>
              <el-button type="info" size="small" @click="selectRoomEvn">选择宿舍</el-button>
            </el-form-item>
          </el-col>
        </template>

        <!-- 审核信息 -->
        <el-col :span="22" :offset="1">
          <fieldset>
            <legend style="font-size:16px">&nbsp;&nbsp;审核信息&nbsp;&nbsp;</legend>
            <el-col :span="12">
              <el-form-item label="审核结果：">
                <el-radio-group v-model="formValidate.spState">
                  <el-radio label="PASS">通过</el-radio>
                  <el-radio label="REJECT">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <template v-if="formValidate.spState === 'PASS'">
              <el-col :span="12">
                <el-form-item label="收费标准：" prop="chargeStandard">
                  <el-input v-model="formValidate.chargeStandard" :maxlength="5"></el-input>
                </el-form-item>
              </el-col>
              <date-group :dateGroup="{text:'',startDate:formValidate.sxBeginTime,endDate:formValidate.sxEndTime}">
                <el-col :span="12">
                  <el-form-item label="实习开始时间：" prop="sxBeginTime">
                    <el-date-picker v-model="formValidate.sxBeginTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"
                      @change="handleStartTime"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="实习结束时间：" prop="sxEndTime">
                    <el-date-picker v-model="formValidate.sxEndTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"
                      @change="handleEndTime"></el-date-picker>
                  </el-form-item>
                </el-col>
              </date-group>
            </template>
            <el-form-item label="审核意见：" style="margin-bottom:0;clear:both;">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :maxlength="200" placeholder="请输入审核意见" v-model="formValidate.reviewMess"></el-input>
            </el-form-item>
          </fieldset>
        </el-col>
      </el-form>
      <!-- 操作按钮 -->
      <div style="padding-top:30px;clear:both;">
        <el-col :span="6" :offset="6" align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <el-col :span="6" align="center">
          <el-button @click="cancelExamine">取消</el-button>
        </el-col>
      </div>
    </el-row>
    <!-- 选择宿舍 -->
    <Modal :mask-closable="false" v-model="selectRoomModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :parent="self" :content="headerContent.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" @cancel="cancel" :selectData="selectData" @selectRoom="selectRoomDataFun"></select-room>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util;
  import api from './api';
  import {
    internAudit as rules
  } from '../../rules';
  import basic from '../../../teach/archivesManagement/archivesManagement/archivesManagement_view/archivesManagement_view_basic';
  import selectRoom from './internAudit_selectRoom';
  export default {
    props: ['operailityData'],
    data() {
      return {
        api,
        rules,
        self: this,
        // 附件
        photoData: {
          '1': [],
          '2': [],
          '3': [],
          '4': [],
          '5': [], // 身份证
        },
        chargeStandard: {}, // 费用
        formValidate: {
          spState: 'PASS',
          chargeStandard: '',
          reviewMess: '',
          buildId: 0, // 大楼ID
          roomId: 0, // 房间ID
          objectName: this.operailityData.userName, // 被审核名称
          isFreeSelect: '1', // 是否自由选择(1自由 0 服从安排)
          isDormitory: '1', // 是否需要住宿(1是 0否),
          sxBeginTime: '', // 实习开始时间(yyyy-MM-dd)
          sxEndTime: '', // 实习结束时间(yyyy-MM-dd)
        },
        selectData: { // 选中的宿舍信息
          buildId: 0, // 大楼
          roomId: 0 // 宿舍
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'examine',
          successTitle: '审核成功!',
          errorTitle: '审核失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.trialSxUser.path + this.operailityData.userId,
            method: api.trialSxUser.method
          }
        },
        selectRoomText: '',
        selectRoomModal: false,
        headerContent: {
          selectRoomId: {
            id: 'selectRoomId',
            title: '选择宿舍'
          }
        }
      }
    },
    methods: {
      init() {
        Util = this.$util;
        this.getPhoto();
        this.getChargeStandard();
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit && this.checkRoomHasSelect()) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          let data = this.addMessTitle.ajaxParams.data;
          data.sxBeginTime = this.conductDate(data.sxBeginTime, 'yyyy-MM-dd') || '';
          data.sxEndTime = this.conductDate(data.sxEndTime, 'yyyy-MM-dd') || '';
          this.ajax(this.addMessTitle, isLoadingFun)
          // console.log(this.addMessTitle)
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
        if (this.formValidate.spState === 'PASS') {
          if (!this.formValidate.sxBeginTime) {
            this.errorMess('请选择开始时间');
            flag = false
          }
          if (!this.formValidate.sxEndTime) {
            this.errorMess('请选择结束时间');
            flag = false
          }
        }
        return flag;
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      // 检测自由选择时是否选择了宿舍
      checkRoomHasSelect() {
        let tag = ((this.formValidate.isDormitory === '1' && this.formValidate.isFreeSelect === '1') && !this.formValidate
          .roomId);
        if (tag) {
          this.errorMess('请选择宿舍！')
        }
        return !tag
      },

      // 获取身份证照片
      getPhoto() {
        this.ajax({
          ajaxSuccess: res => this.setPhotos(res.data),
          ajaxParams: {
            url: api.files.path + this.operailityData.id
          }
        })
      },

      // 处理附件集
      setPhotos(data) {
        for (var i = 0, item, obj; i < data.length; i++) {
          item = data[i];
          if (typeof this.photoData[item.cerType] == "undefined") {
            this.photoData[item.cerType] = [];
          }
          this.photoData[item.cerType].push(item);
        }
      },

      // 获取收费标准
      getChargeStandard() {
        this.ajax({
          ajaxSuccess: res => {
            this.chargeStandard = res.data;
            this.formValidate.chargeStandard = res.data.configValue
          },
          ajaxParams: {
            url: api.getByKey.path
          }
        })
      },

      // 取消
      cancelExamine() {
        this.$emit('cancel', 'examine')
      },

      // 选择宿舍
      selectRoomEvn() {
        this.openModel('selectRoom')
      },

      // 选择宿舍回调
      selectRoomDataFun(room, build) {
        this.cancel('selectRoom')
        this.formValidate.roomId = room.id;
        this.formValidate.buildId = room.buildId;
        this.selectRoomText = build.name + ' - ' + room.no;
        this.selectData.roomId = room.id;
        this.selectData.buildId = room.buildId;
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
    },
    components: {
      basic,
      selectRoom
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';
  /* 审核 */

  .internAuditExaminePhoto {
    margin: 20px 0;
    img {
      width: 300px;
      height: 150px;
    }
  }

</style>
