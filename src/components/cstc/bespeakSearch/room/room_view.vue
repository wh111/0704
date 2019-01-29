<!--
****--@file     room_view
****--@date     2018/6/8 17:05
****--@author   YC
****--@describe 预约查选-预约上课-查看
-->
<template>
  <div>
    <el-row v-if="showData && showData instanceof Object">
      <el-form label-width="130px">
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
          <el-form-item label="使用时间：">
            {{showData.openTimeList[0].date + ' ' + showData.openTimeList[0].startTime + '-' + showData.openTimeList[0].endTime}}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="场次要求：">
            {{ showData.roomRquirement || '暂无' }}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="房间：">
            <template v-if="showData.roomList && showData.roomList.length">
              <!--<el-tag class="brsdItem" :key="item.id" v-for="item in showData.roomList">-->
              <!--{{ item.roomNum }}-->
              <!--</el-tag>-->
              <template v-for="item in showData.roomList">
                <el-tooltip :key="item.roomId" v-if="hoverRoomId===item.roomId" effect="light" placement="left" :open-delay="600">
                  <template slot="content">
                    <room-view style="width: 500px;" isShowLoading="true" :id="item.roomId" :that="self"></room-view>
                  </template>
                  <span style="cursor: pointer;">{{ item.roomNum }}</span>
                </el-tooltip>
                <span style="cursor: pointer;" :key="item.roomId" v-else @mouseleave="roomMouseleave()" @mouseenter="roomMouseenter(item)">{{ item.roomNum }}</span>
              </template>
            </template>
            <span v-else>-</span>
            <!--<template v-if="formValidate.reservePojectRoom.roomNum">-->
            <!--<span style="display:inline;">{{ formValidate.reservePojectRoom.roomNum }}</span>-->
            <!--&lt;!&ndash;<span style="margin-left:10px;">承载量：</span>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-input style="width:200px;" v-model="formValidate.reservePojectRoom.bearingCapacity"></el-input>&ndash;&gt;-->
            <!--</template>-->
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="设备要求：">
            {{ showData.deviceRquirement || '暂无' }}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="房间中的设备：">
            <template v-if="roomDevice.length">
              <el-tag class="brsdItem" :key="item.id" v-for="item in roomDevice">
                {{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
              </el-tag>
            </template>
            <span v-else>-</span>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="设备库：">
            <template v-if="otherDevice.length">
              <el-tag class="brsdItem" :key="item.id" v-for="item in otherDevice">
                {{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
              </el-tag>
            </template>
            <span v-else>-</span>
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
          <el-form-item label="状态：">
            {{ showData.status | bespeakType }}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1" v-if="showData.opinion">
          <el-form-item label="审批意见：">
            {{ showData.opinion }}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <p v-else class="contentTips">正在加载...</p>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
  import roomView from '../../room/roomManage/roomManage_view'; // 房间查看

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'bespeakSearchRoomView',
    props: ['operailityData'],
    data () {
      return {
        self: this,
        hoverRoomId: '',
        showData: null,
        time: '',
        roomDeviceId: [],
        otherDeviceId: [],
        roomDevice: [], // 房间内的设备
        otherDevice: [], // 房间外的设备

        oneRoomTimeSlot: [], // 单个房间时间段
        openTimeList: {}, // 开放日期
        allDayTimeSlot: [], // 全天开放时间段(只记录索引)
        timeSlot: [] // 时间段
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.getShowData();
      },
      // 房间划入事件
      roomMouseenter (item) {
        this.hoverRoomId = item.roomId;
      },
      // 房间滑出事件
      roomMouseleave () {
        this.hoverRoomId = '';
      },
      getShowData () {
        let opt = {
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt);
      },
      // 初始化数据
      getDataSuccess (res) {
        this.showData = res.data;
        // 房间设备
        (res.data.deviceList || []).map(item => {
          if (item.inRoom) {
            this.roomDeviceId.push(item.deviceId);
            this.roomDevice.push(item);
          } else {
            this.otherDeviceId.push(item.deviceId);
            this.otherDevice.push(item);
          }
        });
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      roomView
    }
  };

</script>
