<template>
  <!-- 选择宿舍 -->
  <div>
    <el-form class="editForm" label-width="90px">
      <el-form-item label="大楼信息：">
        <el-select v-model="buildIndex" filterable placeholder="请选择">
          <el-option v-for="(item,index) in buildData" :key="item.id" :label="item.name" :value="index">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!--表格数据-->
    <el-table align="center" :height="400" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%;">
      <el-table-column width="40">
        <template scope="scope">
          <el-radio v-model="selectRoomIndex" :label="scope.$index">{{' '}}</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" type="index" width="75">
      </el-table-column>
      <el-table-column align="center" prop="no" label="房间号">
      </el-table-column>
      <el-table-column prop="bedNum" label="床位数">
      </el-table-column>
      <el-table-column prop="yetBedNum" label="已入住人数">
      </el-table-column>
      <el-table-column prop="bedCount" label="空床数">
      </el-table-column>
      <el-table-column prop="sex" label="房间类型">
        <template scope="scope">
          {{scope.row.sex | roomSex}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
      </el-table-column>

    </el-table>
    <div align="center" style="margin-top:16px">
      <el-button type="info" @click="listenSubEvent">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>

<script>
  import api from './api';
  export default {
    props: {
      selectData: {
        type: Object,
        default: () => ({
          buildId: '',
          roomId: ''
        })
      }
    },
    data() {
      return {
        buildIndex: '',
        selectRoomIndex: '',
        buildData: [], // 大楼id
        tableData: [], // 宿舍id
      }
    },
    methods: {
      /*
       * 确定选择宿舍
       * */
      listenSubEvent() {
        if (!this.selectRoomIndex && this.selectRoomIndex !== 0) {
          this.errorMess('还未选择宿舍！')
          return
        }
        // 返回宿舍集、大楼集
        this.$emit('selectRoom', this.tableData[this.selectRoomIndex], this.buildData[this.buildIndex])
      },
      // 获取大楼
      getBuildData() {
        this.ajax({
          ajaxSuccess: res => {
            this.buildData = res.data || [];
            this.tableData = [];
            if (this.selectData.buildId) {
              for (let index in res.data) {
                if (res.data[index].id === this.selectData.buildId) {
                  this.buildIndex = +index;
                  return;
                }
              }
            }
          },
          ajaxParams: {
            url: api.allBuild.path
          }
        })
      },
      // 获取大楼对应的宿舍
      getRoomForBuild() {
        this.ajax({
          ajaxSuccess: res => {
            this.tableData = res.data || [];
            for (let index in res.data) {
              if (res.data[index].id === this.selectData.roomId) {
                this.selectRoomIndex = +index;
                return
              }
              this.selectRoomIndex = ''
            }
          },
          ajaxParams: {
            url: api.roomList.path,
            params: {
              buildId: this.buildData[this.buildIndex].id
            }
          }
        })
      },
      close() {
        this.$emit('cancel', 'selectRoom')
      },
    },
    created() {
      this.getBuildData();
    },
    watch: {
      buildIndex(val) {
        this.getRoomForBuild()
      }
    }
  }

</script>

<style lang="scss">
  /* 选择宿舍 */

  @import'../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
