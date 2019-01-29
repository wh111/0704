<template>
  <!-- 新建申请 -->
  <div>
    <el-form label-width="110px">
      <el-row>
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
        <el-col :span="22" :offset="1">
          <el-form-item label="授课对象：">
            {{ showData.userType | userType }}
            <div v-if="showData.userList.length" class="dpkvUserList">
              <el-tag type="primary" v-for="item in showData.userList" :key="item.userId">{{ item.userName }}</el-tag>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="最少开课人数：">
            {{ showData.minNum }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item>&nbsp;</el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="开课时间：">
            {{ showData.reserveOpenTimeDto.date + ' ' + showData.reserveOpenTimeDto.startTime + '-' + showData.reserveOpenTimeDto.endTime
            }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="房间号：">
            <template v-if="showData.reservePojectRoom.roomNum">
              <el-tooltip v-if="hoverRoomId===showData.reservePojectRoom.roomId" effect="light" placement="left" :open-delay="600">
                <template slot="content">
                  <room-view style="width: 500px;" isShowLoading="true" :id="showData.reservePojectRoom.roomId" :that="self"></room-view>
                </template>
                <span style="cursor: pointer;">{{ showData.reservePojectRoom.roomNum }}</span>
              </el-tooltip>
              <span style="cursor: pointer;" v-else @mouseleave="roomMouseleave()" @mouseenter="roomMouseenter()">
                {{ showData.reservePojectRoom.roomNum }}
              </span>
            </template>
            <span v-else>未分配</span>
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-form-item label="课程内容：">
            {{ showData.summary || '暂无' }}
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-form-item label="场次要求：">
            {{ showData.roomRquirement || '暂无' }}
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-form-item label="设备要求：">
            {{ showData.deviceRquirement || '暂无' }}
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-form-item label="预约设备：">
            <template v-if="roomDevice.length">
              <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in roomDevice">
                {{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
              </el-tag>
            </template>
            <span v-else>暂未分配</span>
          </el-form-item>
        </el-col>
        <!--<el-col :span="22" :offset="1">-->
        <!--<el-form-item label="设备库：">-->
        <!--<template v-if="otherDevice.length">-->
        <!--<el-tag class="brsdItem" :key="item.id" v-for="(item,index) in otherDevice">-->
        <!--{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}-->
        <!--</el-tag>-->
        <!--</template>-->
        <!--<span v-else>暂未分配</span>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <template v-if="showData.status && showData.status !== 'UNREPORTED'">
          <el-col :span="22" :offset="1">
            <el-form-item label="审核结果：">
              {{ showData.status | bespeakType }}
            </el-form-item>
          </el-col>
          <el-col :span="22" :offset="1">
            <el-form-item label="审核意见：">
              {{ showData.opinion || '暂无' }}
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import api from './api';
  import roomView from '../room/roomManage/roomManage_view'; // 房间查看

  export default {
    props: ['operailityData'],
    data () {
      return {
        self: this,
        // 展示数据
        showData: {
          name: '',
          lecturer: '',
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
            time: '',
            startTime: '',
            endTime: ''
          },
          reservePojectDeviceList: [],
          status: '',
          opinion: ''
        },
        roomDevice: [],
        otherDevice: [],
        hoverRoomId: ''
      };
    },
    methods: {
      init () {
        this.getShowData();
      },
      // 房间划入事件
      roomMouseenter () {
        this.hoverRoomId = this.showData.reservePojectRoom.roomId;
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
            /* 设备 */
            ((res.data.deviceList instanceof Array) && res.data.deviceList || []).map(item => {
//              if (item.inRoom) {
//                this.roomDevice.push(item);
//              } else {
//                this.otherDevice.push(item);
//              }
              this.roomDevice.push(item);
            });
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        });
      }
    },
    created () {
      this.init();
    },
    components: {
      roomView
    }
  };

</script>

<style lang="scss">
  /* 新建申请 */

  .dpkvUserList {
    .el-tag {
      margin-right: 10px;
    }
  }

</style>
