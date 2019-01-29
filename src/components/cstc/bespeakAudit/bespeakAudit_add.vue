<template>
  <!-- 预约审核 - 查看 -->
  <div>
    <el-row>
      <el-form label-width="130px" ref="formValidate" :model="formValidate" :rules="rules">
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
          <el-form-item label="使用时间：">
            {{showData.reserveOpenTimeDto.date + ' ' + showData.reserveOpenTimeDto.startTime + '-' + showData.reserveOpenTimeDto.endTime}}
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
              <el-tooltip v-if="hoverRoomId===formValidate.reservePojectRoom.roomId" effect="light" placement="left" :open-delay="600">
                <template slot="content">
                  <room-view style="width: 500px;" isShowLoading="true" :id="formValidate.reservePojectRoom.roomId" :that="self"></room-view>
                </template>
                <span>{{ formValidate.reservePojectRoom.roomNum }}</span>
              </el-tooltip>
              <span v-else style="cursor: pointer;" @mouseenter="roomMouseenter()" @mouseleave="roomMouseleave()">{{ formValidate.reservePojectRoom.roomNum }}</span>

              <!--<span style="margin-left:10px;">承载量：</span>-->
              <!--<el-input style="width:200px;" v-model="formValidate.reservePojectRoom.bearingCapacity"></el-input>-->
            </template>
            <el-button type="info" @click="selectRoom">选择房间</el-button>
            <span v-if="roomUseState" class="cbbaRoomUseState" :class="[roomUseState]">（{{ roomUseState=='optional' ? '可以使用' : '已被占用' }}）</span>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="设备要求：">
            {{ showData.deviceRquirement || '暂无' }}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="房间中的设备：">
            <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in roomDevice"
                    :closable="true"
                    :close-transition="false"
                    @close="handleClose('room',index)"
            >{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
            </el-tag>
            <el-tag class="brsdSelBtn brsdItem" type="primary" @click.native="selectDevice('room')">+选择设备</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="设备库：">
            <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in otherDevice"
                    :closable="true"
                    :close-transition="false"
                    @close="handleClose('other',index)"
            >{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
            </el-tag>
            <el-tag class="brsdSelBtn brsdItem" type="primary" @click.native="selectDevice('other')">+选择设备</el-tag>
          </el-form-item>
        </el-col>
        <!--<el-col :span="21" :offset="1">-->
        <!--<el-form-item label="设备：">-->
        <!--<div class="bpkdBox">-->
        <!--<div v-for="(item,index) in formValidate.deviceList" :key="index" class="bpkdItem">-->
        <!--&lt;!&ndash;<el-tooltip class="item" effect="light" placement="bottom-start">&ndash;&gt;-->
        <!--&lt;!&ndash;<div slot="content" style="max-width:200px;">&ndash;&gt;-->
        <!--&lt;!&ndash;<p>设备名称：{{ deviceList[index].deviceTypeName }}</p>&ndash;&gt;-->
        <!--&lt;!&ndash;<p>设备数量：{{ deviceList[index].deviceNum || 0 }}</p>&ndash;&gt;-->
        <!--&lt;!&ndash;<p>设备简介：{{ deviceList[index].describe || '暂无简介' }}</p>&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-button>{{ deviceList[index].deviceTypeName }}</el-button>&ndash;&gt;-->
        <!--<el-button type="text">{{ deviceList[index].deviceTypeName + '(' + deviceList[index].deviceIdentifier + ')' }}</el-button>-->
        <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
        <!--&lt;!&ndash;<span class="bpkdTitle">数量：</span>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-input style="width:200px;" v-model="item.reserveNum"></el-input>&ndash;&gt;-->
        <!--</div>-->
        <!--</div>-->
        <!--<el-button type="primary" @click="selectDevice">选择模型</el-button>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="21" :offset="1">
          <el-form-item label="审批意见：" prop="opinion">
            <el-input type="textarea" v-model="formValidate.opinion" :autosize="{ minRows: 4, maxRows: 6}"
                      placeholder="请输入内容">
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
    <Modal :mask-closable="false" v-model="selectRoomModal" height="200" class-name="vertical-center-modal"
           :width="960">
      <modal-header slot="header" :content="headerContent.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" @cancel="cancel" :selectOne="true" @select="selectRoomCall"
                   :select="roomIds"></select-room>
      <div slot="footer"></div>
    </Modal>
    <!--选择设备-->
    <Modal :mask-closable="false" v-model="selectDeviceModal" height="200" class-name="vertical-center-modal"
           :width="960">
      <modal-header slot="header" :content="headerContent.selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" @select="selectDeviceCall" @cancel="cancel"
                     :select="selectDeviceType == 'room' ? roomDeviceId : otherDeviceId "
                     :url="selectDeviceUrl" :selectDeviceType="selectDeviceType"></select-device>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;

  import api from './api';
  import selectRoom from '../../common/selectRoom'; // 选择房间
  import selectDevice from '../bespeakSetting/room/device_select.vue'; // 选择设备
  import roomView from '../room/roomManage/roomManage_view'; // 查看房间
  import { bespeakAudit as rules } from '../rules';

  export default {
    props: ['operailityData'],
    data () {
      return {
        rules,
        self: this,
        hoverRoomId: '',
        formValidate: {
          status: '',
          opinion: '',
          reservePojectRoom: {
            id: '',
            roomId: '',
            bearingCapacity: '',
            roomNum: ''
          },
          deviceList: []
        },
        showData: {
          name: '-',
          lecturer: '-',
          userType: '',
          userList: [],
          minNum: '',
          summary: '',
          roomRquirement: '',
          deviceRquirement: '',
          reservePojectRoom: {
            roomNum: '',
            bearingCapacity: ''
          },
          reserveOpenTimeDto: {
            reserveSetType: 'PROJECT',
            date: '',
            timeSetId: '',
            time: ''
          },
          reservePojectDeviceList: [],
          status: '',
          opinion: ''
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
            id: 'selectRoomId',
            title: '选择房间'
          },
          selectDeviceId: {
            id: 'selectDeviceId',
            title: '选择设备'
          }
        },
        roomDeviceId: [],
        otherDeviceId: [],
        roomDevice: [], // 房间内的设备
        otherDevice: [], // 房间外的设备
        selectDeviceUrl: '',
        selectDeviceType: '', // room|other
        roomUseState: '' // 房间指定时间使用状态
      };
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init () {
        this.getShowData();
      },
      // 提交数据
      subData (status) {
        let msg = status === 'ADOPT' ? '通过' : '驳回';
        if (!this.submitForm('formValidate')) {
          return false;
        }
        if (status === 'ADOPT' && !this.formValidate.reservePojectRoom.roomId) {
          this.errorMess('请选择房间！');
          return false;
        }
        let data = this.$util._.defaultsDeep({}, this.formValidate);
        data.status = status;

        this.roomDeviceId.map(deviceId => {
          data.deviceList.push({
            deviceId,
            inRoom: 1
          });
        });

        this.otherDeviceId.map(deviceId => {
          data.deviceList.push({
            deviceId,
            inRoom: 0
          });
        });

        this.formValidate.status = status;
        this.ajax({
          type: 'add',
          successTitle: `${msg}成功`,
          errorTitle: `${msg}失败`,
          ajaxParams: {
            jsonString: true,
            url: api.approval.path + this.operailityData.id,
            method: api.approval.method,
            data
          }
        });
      },
      handleClose (type, index) {
        let del = this[type + 'Device'][index];
        let delIndex = this[type + 'DeviceId'].indexOf(del.deviceId);
        this[type + 'Device'].splice(index, 1);
        !!~delIndex && this[type + 'DeviceId'].splice(delIndex, 1);
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
      // 房间划入事件
      roomMouseenter () {
        this.hoverRoomId = this.formValidate.reservePojectRoom.roomId;
      },
      // 房间滑出事件
      roomMouseleave () {
        this.hoverRoomId = '';
      },
      /*********************************************** 数据获取 ***********************************/
      // 获取当前登录用户所能申请的项目列表
      getShowData () {
        this.ajax({
          ajaxSuccess: res => {
            this.showData = res.data || {};
            // 房间
            this.formValidate.reservePojectRoom.id = res.data.reservePojectRoom.id || '';
            this.formValidate.reservePojectRoom.roomId = res.data.reservePojectRoom.roomId;
            this.formValidate.reservePojectRoom.roomNum = res.data.reservePojectRoom.roomNum;
            this.formValidate.reservePojectRoom.bearingCapacity = res.data.reservePojectRoom.bearingCapacity;
            // 设备
            ((res.data.deviceList instanceof Array) && res.data.deviceList || []).map(item => {
              if (item.inRoom) {
                this.roomDeviceId.push(item.deviceId);
                this.roomDevice.push(item);
              } else {
                this.otherDeviceId.push(item.deviceId);
                this.otherDevice.push(item);
              }
            });
//            res.data.reservePojectDeviceList.map(item => {
//              this.formValidate.deviceList.push({
//                deviceId: item.deviceId,
//                reserveNum: item.reserveNum || ''
//              });
//              this.deviceIds.push(item.deviceId)
//            });
//            this.deviceList = res.data.reservePojectDeviceList;
            this.formValidate.opinion = res.data.opinion || '';
            this.testRoomCanUse(res.data.reservePojectRoom.roomId);
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        });
      },
      testRoomCanUse (roomId) {
        if(!roomId){
          return
        }
        let opt = {
          ajaxSuccess: res => this.roomUseState = res.data,
          ajaxParams: {
            url: api.inspect.path,
            method: api.inspect.method,
            params: {
              date: this.showData.reserveOpenTimeDto.date,
              startTime: this.showData.reserveOpenTimeDto.startTime,
              endTime: this.showData.reserveOpenTimeDto.endTime,
              reservePojectId: this.operailityData.id,
              roomId
            }
          }
        };
        this.roomUseState = '';
        this.ajax(opt);
      },
      /********************************* 按钮事件 *****************************/
      // 选择房间
      selectRoom () {
        this.openModel('selectRoom');
      },
      // 选择设备模型
//      selectDevice() {
//        this.openModel('selectDevice')
//      },

      // 选择设备
      selectDevice (type) {
        if (this.formValidate.reservePojectRoom.roomId) {
          this.selectDeviceUrl = api[type].path + this.formValidate.reservePojectRoom.roomId;
          this.selectDeviceType = type;
          this.openModel('selectDevice');
        } else {
          this.showMess('请选择预约房间');
        }

      },

      // 选择设备回调
      selectDeviceCall (arr) {
        (arr || []).map(item => {
          item.deviceId = item.id;
          if (this.selectDeviceType == 'room') {
//            this.roomDevice[item.id] = item;
//            roomDeviceId:[],
//              otherDeviceId:[],
            if (this.roomDeviceId.indexOf(item.id) == -1) {
              this.roomDeviceId.push(item.id);
              this.roomDevice.push(item);
            }
          } else {
//            this.otherDevice[item.id] = item;
            if (this.otherDeviceId.indexOf(item.id) == -1) {
              this.otherDeviceId.push(item.id);
              this.otherDevice.push(item);
            }
          }
        });
        this.cancel('selectDevice');
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      /********************************* 弹窗回调 *****************************/
      // 选择房间
      selectRoomCall (res) {
        this.formValidate.reservePojectRoom.roomId = res[0].id;
        this.formValidate.reservePojectRoom.roomNum = res[0].roomNum || '';
        this.formValidate.reservePojectRoom.bearingCapacity = res[0].capacity; // 可容量
        this.formValidate.deviceList.length = 0;
        this.roomDeviceId = [];
        this.otherDeviceId = [];
        this.roomDevice = []; // 房间内的设备
        this.otherDevice = []; // 房间外的设备
        this.testRoomCanUse(res[0].id); // 检测放开是否可用
        this.cancel('selectRoom');
      }
//      // 选择设备模型
//      selectDeviceCall(res) {
//        let temp = [];
//        this.deviceIds.length = 0;
//        res.map(item => {
//          temp.push({
//            deviceId: item.id
//          })
//          this.deviceIds.push(item.id);
//        })
//        this.formValidate.deviceList = temp;
//        this.deviceList = res;
//        this.cancel('selectDevice')
//      },
    },
    components: {
      selectRoom,
      selectDevice,
      roomView
    },
    created () {
      this.init();
    }
  };

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

  .cbbaRoomUseState {
    color: red;
    &.optional {
      color: green;
    }
  }

</style>
