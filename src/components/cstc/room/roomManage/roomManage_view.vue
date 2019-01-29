<template>
  <div>
    <el-form class="editForm" label-width="100px">

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="房间号：" prop="roomNum">
            {{ formValidate.roomNum || '-' }}
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="房间名称：" prop="roomName">
            {{ formValidate.roomName || '-' }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="类型：" prop="roomType">
            {{ (formValidate.roomType || '-') | roomType(roomTypeOptions) }}
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="所在楼层：" prop="floor">
            {{ formValidate.floor }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="可容量：" prop="capacity">
            {{ formValidate.capacity || '-' }}
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="有无设备：" prop="isDevice">
            {{ formValidate.isDevice == 1 ? '有' : '无' }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="formValidate.isDevice == 1">
        <el-col :span="18" :offset="2">
          <el-form-item label="设备：">
            <el-tag class="rmDeviceItem"
                    v-for="(item,index) in formValidate.deviceList"
                    :key="item.id"
            >{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="房间位置：" prop="address">
            {{ formValidate.address || '-' }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="房间简介：" prop="summary">
            {{ formValidate.summary || '-' }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="房间图片：">
            <upload-file v-if="fileList.length" :show="true" :fileList="fileList"></upload-file>
            <span v-else>暂无图片</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  import api from './api';
  import uploadFile from '../uploadFile';

  export default {
    props: ['id', 'isShowLoading', 'that'],
    data () {
      return {
        self: null,
        staticPath: '',

        roomTypeOptions: {},
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
        fileList: []
      };
    },
    created () {
      //给当前组件注入全局util
      console.log(this.id);
      Util = this.$util;
      if (this.that) {
        this.$store = this.that.$store;
      }
      this.staticPath = this.$store.getters.getEnvPath.http || '';
      this.getRoomTypeOptions();
      if (this.isShowLoading) {
        this.ajaxCreateLoading(false);
      }
    },
    // mounted(){
    //   console.log(this.$store.getters.getEnvPath.http);
    //   // this.init()
    // },
    methods: {
      init () {

      },
      getRoomTypeOptions () {
        let opt = {
          ajaxSuccess: res => {
            (res.data || []).map(item => this.roomTypeOptions[item.code] = item.name);
            this.getDataForServer();
            if (this.isShowLoading) {
              // this.ajaxCreateLoading(false);
            }
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
       * 组件初始化入口
       * */
      init () {
        //this.ajax(this.listMessTitle)
      }
    },
    filters: {
      roomType (val, obj) {
        return obj[val] || val;
      }
    },
    components: {
      uploadFile
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
