<!--
****--@file     physicianExamineInterval_input
****--@date     2018/5/21 14:45
****--@author   YC
****--@describe 考核管理-编辑
-->
<template>
  <div ref="physicianContent">
    <el-row class="physicianExamineInterval">
      <h2 class="peiBorder">考核管理-新建</h2>
      <el-col class="infoInput">
        <el-col :span="12">
          <el-form ref="formValidate" :inline="true" :rules="rules" :model="formValidate">
            <el-form-item label="考试名称：" prop="examName">
              <el-input v-model="formValidate.examName"></el-input>
            </el-form-item>
            <el-form-item label="开始时间：">
              {{ formValidate.startTime || '-' }}
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" align="right">
          <el-button type="info" @click="toChannel">{{ 'import' | sysLan }}考试信息</el-button>
          <!--<xlsx class="uploadXLS" @on-select-file="handleSelectedFile" :row="2">导入</xlsx>-->
        </el-col>
      </el-col>
    </el-row>
    <div ref="table">
      <ab-table-gk :tableData="tableData" :tableHeight="tableHeight"></ab-table-gk>
    </div>
    <el-row>
      <el-col align="right" style="margin-top: 20px">
        <el-button type="danger" @click="cancelEdit">取消</el-button>
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
    <!--导入弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="toChannelModal"
           class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="headerContent.toChannelId"></modal-header>
      <to-channel v-if="toChannelModal" @toChannel="handleSelectedFile" @cancel="cancel"></to-channel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style lang="scss">
  .physicianExamineInterval {
    .peiBorder {
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }
    .infoInput {
      padding: 20px 0 0;
    }
    .uploadXLS .el-button--mini {
      padding: 10px 15px;
      font-size: 14px;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api'
  import { excel2ShowData, showData2Save, server2ShowData } from '../components/formatData'
  import { physicianExamineInterval as rules } from '../rules'
  import abTableGk from '../components/ab_table_gk'
  import toChannel from './physicianExamineInterval_toChannel'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianExamineIntervalInput',
    props: ['operailityData'],
    data () {
      return {
        rules,
        formValidate: {
          examName: '',
          startTime: '',
          examArrangementList: [
//            {
//              groupName: '', // 组名
//              groupOrder: '', // 组序
//              rooms: '', // 房间号
//              totalStage: '', // 总阶段
//              stageOrder: '', // 阶段顺序
//              detailedStage: '', // 阶段详情
//              examOrder: '', // 考核顺序
//              startTime: '', // 开始时间
//              endTime: '', // 结束时间
//              waitTime: '', // 等待时间
//              changeTime: '', // 换站时间
//            }
          ]
        },
        tableData: [
//          {
//            groupName: '', // 组名
////            groupOrder: '', // 组序
////            totalStage: '', // 总阶段
////            stageOrder: '', // 阶段顺序
////            detailedStage: '', // 阶段详情
////            examOrder: '', // 考核顺序
////            startTime: '', // 开始时间
////            endTime: '', // 结束时间
////            waitTime: '', // 等待时间
////            changeTime: '', // 换站时间
//
//            // 总候考
//            rooms1: '', // 房间号
//            waitTime1: '', // 等待时间（语音播报时间）
//
//            // 3楼-1、3考站（41min） 候考
//            rooms2: '', // 房间号（候考房间）
//            waitTime2: '', // 等待时间（语音播报时间）
//
//            // 3楼-1、3考站（41min） 1、3考站
//            rooms3: '', // 房间号（考试房间）
//            startTime3: '', // 开始时间
//            endTime3: '', // 结束时间
//
//            // 5楼-2考站 候考
//            rooms4: '', // 房间号（候考房间）
//            waitTime4: '', // 等待时间（语音播报时间）
//
//            // 5楼-2考站 2考站-技能（11min）
//            rooms5: '', // 房间号（考试房间）
//            startTime5: '', // 开始时间
//            endTime5: '', // 结束时间
//
//            // 5楼-2考站 2考站-体格检查（13min）
//            rooms6: '', // 房间号（考试房间）
//            startTime6: '', // 开始时间
//            endTime6: '', // 结束时间
//          }
        ],
        tableHeight: 600,
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        toChannelModal: false,
        headerContent: {
          toChannelId: {
            id: 'toChannelId',
            title: '导入考试信息'
          }
        },
        editType: 'add'
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        if (this.operailityData) {
          this.editType = 'edit'
          this.getShowData()
        }
      },
      // 上传Excel
      handleSelectedFile (convertedData) {
        let res = excel2ShowData(convertedData.body)
        this.tableData = res.resArr
        this.formValidate.startTime = res.startTime
        this.cancel('toChannel')
      },
      // 获取原来的数据
      getShowData () {
        let opt = {
          ajaxSuccess: res => {
            this.formValidate.examName = res.data.examName;
            this.formValidate.startTime = res.data.startTime;
            this.tableData = server2ShowData(res.data.examArrangementList).resArr
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.examId,
            method: api.get.method
          }
        }
        this.ajax(opt)
      },
      /***************************************** 提交处理 **********************************************************************/
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let roomRes = showData2Save(this.tableData)
          this.canSave(roomRes.allRoomNum, () => { // 可以保存
            this.saveCall(roomRes.resArr, isLoadingFun)
          }, res => { // 不可以保存
            isLoadingFun(false)
            this.$notify.error({
              title: '提示',
              message: `${res.status.msg} ${res.data.join('、')}`,
              duration: 0,
              offset: 68
            });
          })
        }
      },
      // 保存回调
      saveCall (resArr, isLoadingFun) {
        let data = Util._.defaultsDeep({}, this.formValidate)
        data.examArrangementList = resArr
        console.log(data)
        let opt = {
          ajaxSuccess: () => {
            this.successMess('保存成功！')
            this.cancelEdit()
          },
          ajaxParams: {
            jsonString: true,
            url: api[this.editType].path + (this.editType == 'add' ? '' : this.operailityData.examId),
            method: api[this.editType].method,
            data
          }
        }
        this.ajax(opt, isLoadingFun)
      },
      // 通过检查房间是否存在来确保是否可以保存
      canSave (data, successFun, errorFun) {
        let opt = {
          allowError: false,
          ajaxSuccess: successFun,
          error: errorFun,
          ajaxParams: {
            jsonString: true,
            url: api.checkByRoomNum.path,
            method: api.checkByRoomNum.method,
            data
          }
        }
        this.ajax(opt)
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
      // 取消
      cancelEdit () {
        this.$emit('viewChange', 'index')
      },
      // 导入
      toChannel () {
        this.openModel('toChannel')
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.physicianContent.parentNode;
        let table = this.$refs.table;
        let paginationHt = 50;
        this.tableHeight = content.offsetHeight - table.offsetTop - paginationHt;
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {
      abTableGk, toChannel
    }
  }

</script>
