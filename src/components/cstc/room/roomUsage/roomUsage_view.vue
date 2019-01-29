<template>
  <el-row>
    <el-form label-width="100px">
      <el-col :span="12">
        <el-form-item label="房间号:">
          {{ (viewData.roomNums||'-').replace(/,/g,'、') }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="使用类型：">
          {{ viewData.employType | affairType(self) }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开始时间：">
          {{ viewData.startTime }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束时间：">
          {{ viewData.endTime }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="使用时长：">
          {{ viewData.timeLength }}
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="用途：">
          {{ viewData.purpose }}
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="房间图片：">
          <upload-file v-if="fileList.length" :fileList="fileList" :show="true"></upload-file>
          <template v-else>暂无图片</template>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
  import api        from './api';
  import uploadFile from '../uploadFile';

  export default {
    props: {
      id: {
        type: [String, Number],
        required: true
      }
    },
    data () {
      return {
        self: this,
        staticPath: '',
        fileList: [],
        viewData: {
          // "id": "1",
//          roomNum: "-",
          roomIds: '',
          roomNums: '',
          employType: '-',
          startTime: '-',
          endTime: '-',
          timeLength: '-',
          purpose: '-',
          imageList: []
        }
      };
    },
    methods: {
      getDataForServer () {
        let roomId = this.id,
          urlParams = this.urlParams; // props
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: api.get.path + roomId,
            method: api.get.method
          }
        });
      },
      getDataSuccess (res) {
        this.viewData = res.data; // 初始化编辑数据
        for (let i = 0, list = res.data.fileList, l = list.length; i < l; i++) {
          this.fileList.push({
            name: list[i].id,
            url: api.down.path + list[i].id
          });
        }
      }
    },
    created () {
      this.staticPath = this.$store.getters.getEnvPath.http;
      this.getDataForServer();
    },
    components: {
      uploadFile
    }
  };

</script>

<style lang="scss">
  .roomViewItem {
    padding: 10px 0;
  }

  .classViewImg {
    width: 148px;
    height: 148px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    overflow: hidden;
    margin: 0 22px 22px 0;
  }

</style>
