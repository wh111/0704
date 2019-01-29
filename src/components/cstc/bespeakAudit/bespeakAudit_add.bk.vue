<template>
  <!-- 预约审核 - 查看 -->
  <div>
    <el-row>
      <el-form label-width="100px">
        <el-col :span="10" :offset="1">
          <el-form-item label="课程名称：">
            {{ showData.name }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="授课老师：">
            {{ showData.lecturer }}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="课程内容：">
            {{ showData.summary || '暂无' }}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="场次要求：">
            {{ showData.roomRquirement || '暂无' }}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="选择房间：">
            <template v-if="formValidate.reservePojectRoom.roomNum">
              <span style="display:inline;">{{ formValidate.reservePojectRoom.roomNum }}</span>
              <!--<span style="margin-left:10px;">承载量：</span>-->
              <!--<el-input style="width:200px;" v-model="formValidate.reservePojectRoom.bearingCapacity"></el-input>-->
            </template>
            <el-button type="info" @click="selectRoom">选择房间</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="设备要求：">
            {{ showData.deviceRquirement || '暂无' }}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="设备：">
            <div class="bpkdBox">
              <div v-for="(item,index) in formValidate.deviceList" :key="index" class="bpkdItem">
                <!--<el-tooltip class="item" effect="light" placement="bottom-start">-->
                  <!--<div slot="content" style="max-width:200px;">-->
                    <!--<p>设备名称：{{ deviceList[index].deviceTypeName }}</p>-->
                    <!--<p>设备数量：{{ deviceList[index].deviceNum || 0 }}</p>-->
                    <!--<p>设备简介：{{ deviceList[index].describe || '暂无简介' }}</p>-->
                  <!--</div>-->
                  <!--<el-button>{{ deviceList[index].deviceTypeName }}</el-button>-->
                <el-button type="text">{{ deviceList[index].deviceTypeName + '(' + deviceList[index].deviceIdentifier + ')' }}</el-button>
                <!--</el-tooltip>-->
                <!--<span class="bpkdTitle">数量：</span>-->
                <!--<el-input style="width:200px;" v-model="item.reserveNum"></el-input>-->
              </div>
            </div>
            <el-button type="primary" @click="selectDevice">选择模型</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="审批意见：">
            <el-input type="textarea" v-model="formValidate.opinion" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容">
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="6" :offset="6" align="center">
        <el-button type="success" @click="subData('ADOPT')">通过</el-button>
      </el-col>
      <el-col :span="6" align="center">
        <el-button type="danger" @click="subData('REJECT')">驳回</el-button>
      </el-col>
    </el-row>
    <!--选择房间-->
    <Modal :mask-closable="false" v-model="selectRoomModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" @cancel="cancel" :selectOne="true" @select="selectRoomCall" :select="roomIds"></select-room>
      <div slot="footer"></div>
    </Modal>
    <!--选择设备-->
    <Modal :mask-closable="false" v-model="selectDeviceModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" @cancel="cancel" @select="selectDeviceCall" :select="deviceIds" :roomId="formValidate.reservePojectRoom.roomId"></select-device>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;

  import api from './api';
  import selectRoom from '../../common/selectRoom'; // 选择房间
  import selectDevice from '../bespeakClass/bespeakClass_selectDevice.vue'; // 选择设备
  export default {
    props: ['operailityData'],
    data() {
      return {
        deviceIds: [],
        formValidate: {
          status: '',
          opinion: '',
          reservePojectRoom: {
            id: '',
            roomId: '',
            bearingCapacity: '',
            roomNum: '',
          },
          deviceList: [],
        },
        showData: {
          name: "-",
          lecturer: "-",
          userType: "",
          userList: [],
          minNum: "",
          summary: "",
          roomRquirement: "",
          deviceRquirement: "",
          reservePojectRoom: {
            roomNum: "",
            bearingCapacity: ""
          },
          reserveOpenTimeDto: {
            reserveSetType: "PROJECT",
            date: "",
            timeSetId: "",
            time: ""
          },
          reservePojectDeviceList: [],
          status: "",
          opinion: ""
        },
        // 选择数据
        deviceList: [],
        roomIds: [],
        roomNums: [],
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
        selectRoomModal: false,
        selectDeviceModal: false,
        headerContent: {
          selectRoomId: {
            id: "selectRoomId",
            title: "选择房间"
          },
          selectDeviceId: {
            id: "selectDeviceId",
            title: "选择设备"
          }
        }
      }
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        this.getShowData()
      },
      // 提交数据
      subData(status) {
        let msg = status === 'ADOPT' ? '通过' : '驳回';
        this.formValidate.status = status;
        this.ajax({
          type: 'add',
          successTitle: `${msg}成功`,
          errorTitle: `${msg}失败`,
          ajaxParams: {
            jsonString: true,
            url: api.approval.path + this.operailityData.id,
            method: api.approval.method,
            data: this.$util._.defaultsDeep({}, this.formValidate)
          }
        })
      },
      /*********************************************** 数据获取 ***********************************/
      // 获取当前登录用户所能申请的项目列表
      getShowData() {
        this.ajax({
          ajaxSuccess: res => {
            this.showData = res.data || {};
            // 房间
            this.formValidate.reservePojectRoom.id = res.data.reservePojectRoom.id || '';
            this.formValidate.reservePojectRoom.roomId = res.data.reservePojectRoom.roomId;
            this.formValidate.reservePojectRoom.roomNum = res.data.reservePojectRoom.roomNum;
            this.formValidate.reservePojectRoom.bearingCapacity = res.data.reservePojectRoom.bearingCapacity;
            // 设备
            res.data.reservePojectDeviceList.map(item => {
              this.formValidate.deviceList.push({
                deviceId: item.deviceId,
                reserveNum: item.reserveNum || ''
              });
              this.deviceIds.push(item.deviceId)
            });
            this.deviceList = res.data.reservePojectDeviceList;
            this.formValidate.opinion = res.data.opinion || '';
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        })
      },
      /********************************* 按钮事件 *****************************/
      // 选择房间
      selectRoom() {
        this.openModel('selectRoom')
      },
      // 选择设备模型
      selectDevice() {
        this.openModel('selectDevice')
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
      selectRoomCall(res) {
        this.formValidate.reservePojectRoom.roomId = res[0].id;
        this.formValidate.reservePojectRoom.roomNum = res[0].roomNum || '';
        this.formValidate.reservePojectRoom.bearingCapacity = res[0].capacity; // 可容量
        this.formValidate.deviceList.length = 0;
        this.deviceList.length = 0;
        this.deviceIds.length=0;
        this.cancel('selectRoom')
      },
      // 选择设备模型
      selectDeviceCall(res) {
        let temp = [];
        this.deviceIds.length=0;
        res.map(item => {
          temp.push({
            deviceId: item.id,
            reserveNum: ""
          })
          this.deviceIds.push(item.id);
        })
        this.formValidate.deviceList = temp;
        this.deviceList = res;
        this.cancel('selectDevice')
      },
    },
    components: {
      selectRoom,
      selectDevice
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  /* 预约审核 - 查看 */

  .bpkdBox {
    .bpkdItem {
      margin-bottom: 16px;
    }
    .bpkdTitle {
      margin-left: 10px;
    }
  }

</style>
