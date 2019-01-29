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
          <el-form-item label="可预约数量：">
            {{ showData.reservePojectRoom.bearingCapacity }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="最少开课人数：">
            {{ showData.minNum }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="开课时间：">
            {{ showData.reserveOpenTimeDto.date + ' ' + showData.reserveOpenTimeDto.time }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="房间号：">
            {{ showData.reservePojectRoom.roomNum || '未分配' }}
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
          <el-form-item label="设备：">
            <template v-if="showData.reservePojectDeviceList.length">
              <!--<el-tooltip class="item" effect="light" placement="bottom-start" v-for="(item,index) in showData.reservePojectDeviceList"-->
                <!--:key="index">-->
                <!--<div slot="content" style="max-width:200px;">-->
                  <!--<p>设备名称：{{ item.deviceTypeName }}</p>-->
                  <!--<p>开放数量：{{ item.openNum || 0 }}</p>-->
                  <!--<p>设备简介：{{ item.describes || '暂无简介' }}</p>-->
                <!--</div>-->
                <!--<el-button>{{ item.deviceTypeName + ' 数量：' + item.reserveNum }}</el-button>-->
              <el-button type="text" v-for="(item,index) in showData.reservePojectDeviceList" :key="index">{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}</el-button>
              <!--</el-tooltip>-->
            </template>
            <span v-else>暂未分配</span>
          </el-form-item>
        </el-col>
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
  export default {
    props: ['operailityData'],
    data() {
      return {
        // 展示数据
        showData: {
          name: "",
          lecturer: "",
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
      }
    },
    methods: {
      init() {
        this.getShowData();
      },
      /*********************************************** 数据获取 ***********************************/
      // 获取当前登录用户所能申请的项目列表
      getShowData() {
        this.ajax({
          ajaxSuccess: res => {
            this.showData = res.data || {};
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        })
      },
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  /* 新建申请 */

  .dpkvUserList {
    .el-tag {
      margin-right: 10px;
    }
  }

</style>
