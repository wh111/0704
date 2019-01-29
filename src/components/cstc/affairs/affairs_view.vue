<template>
  <!--事务增加-->
  <div class="editForm">
    <el-form label-width="130px">

      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="事务名称：" prop="affairName">
            {{ formValidate.affairName }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="类型：" prop="affairType">
            {{ formValidate.affairType | affairType(self) }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="接待开始时间：" prop="startTime">
            {{ formValidate.startTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="接待结束时间：" prop="endTime">
            {{ formValidate.endTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="接待对象：" prop="receptionObject">
            {{ (formValidate.receptionObject || '').replace(/,/g,'、') }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="人数：" prop="peopleNum">
            {{ formValidate.peopleNum }}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="是否使用房间：" prop="isRoom">
            {{ formValidate.isRoom | typeText }}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1" v-if="formValidate.isRoom === 'YES'">
          <el-form-item label="使用房间：">
            <el-tag class="affairsRoomItem" :key="room.roomId" v-for="(room,index) in formValidate.roomList">{{ room.roomNum }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="附件：">
            <upload-file :show="true" :uploadFiles="filelist"></upload-file>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="事务描述：">
            {{ formValidate.trainingContent || '-' }}
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
  //  import typeOption from './typeOption'; // 事务类型
  //  import userOption from './userOption'; // 培训对象

  export default {
    props: ['operailityData'],
    data () {
      return {
        self: this,
        filelist: [],
        roomIds: [],
        roomNums: [],
        //form表单bind数据
        formValidate: {
          affairName: '', // 事务名称
          startTime: '', // 接待开始时间
          endTime: '', // 接待结束时间
          receptionObject: '', // 接待对象
          affairType: '', // 事务类型
          peopleNum: '', // 人数
          isRoom: '', // 是否使用房间 YES是|NO否
          roomIds: '', // 房间id字符串
          roomNums: '', // 房间号字符串 多个id以逗号分隔
          trainingContent: '', // 事务描述
          fileIds: '', // 附件id字符串
          roomList: [ //
            // {
            //   "roomId": "1",
            //   "roomNum": "101"
            // }
          ]
        },
//        userOption,
        typeOption: {} // 事务类型
      };
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init () {
        //this.ajax(this.listMessTitle)
//        this.getTypeOption();
        this.getDataForServer();
      },
      getTypeOption () {
        let opt = {
          ajaxSuccess: res => {
            if (!res.data.length) {
              return;
            }
            res.data.map(item => {
              this.typeOption[item.code] = item.name;
            });
            this.getDataForServer();
          },
          ajaxParams: {
            url: api.getAffairType.path,
            method: api.getAffairType.method
          }
        };
        this.ajax(opt);
      },
      // 获取数据
      getDataForServer () {
        this.ajax({
          ajaxSuccess: res => {
            this.formValidate = res.data;
            this.filelist.length = 0;

            for (let key in this.formValidate) {
              if (res.data[key]) {
                this.formValidate[key] = res.data[key];
              }
            }

            (res.data.roomList || []).map(item => {
              this.roomNums.push(item.roomNum);
              this.roomIds.push(item.roomId);
            });

            let fileId = [];
            for (let i = 0, list = res.data.fileList || [], l = list.length; i < l; i++) {
              this.filelist.push({
                fileId: list[i].fileId,
                fileName: list[i].fileName,
                filePath: list[i].path + list[i].fileName
              });
              fileId.push(list[i].fileId);
            }

            this.formValidate.fileIds = fileId.join(',');
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        });
      }
    },
    components: {}
  };

</script>
<style lang="scss">
  @import '../../../assets/ambuf/css/manage_v1.0/editForm';

  .affairsRoomItem {
    margin-right: 10px;
  }

  .affairsSelectRoom {
    cursor: pointer;
  }
</style>
