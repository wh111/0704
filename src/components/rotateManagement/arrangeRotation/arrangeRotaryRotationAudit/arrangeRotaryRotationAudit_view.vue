<!----------------------------------
****--@name    安排轮转审核(查看)
****--@role     ${*}
****--@date     2018/5/30
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名：">{{ viewData.userName }}
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="!podClass">
          <el-form-item label="科室：">{{ viewData.depName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开始时间：">{{ viewData.beginTime }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束时间：">{{ viewData.endTime }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <hr>
    <br>
    <el-table
      stripe
      align="center"
      :height="300"
      :data="viewData.auditDetils"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="75">
      </el-table-column>
      <el-table-column
        prop="userName"
        show-overflow-tooltip
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="depName"
        label="科室名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ts"
        label="周期"
        show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.ts + (scope.row.podClass == 'SXS' ? '周' : '月') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="beginTime"
        label="轮转开始时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="轮转结束时间"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <br>
    <hr>
    <br>
    <el-table
      stripe
      align="center"
      :height="180"
      :data="viewData.reviewMess"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="75">
      </el-table-column>
      <el-table-column
        prop="createUserName"
        label="审核人"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="审核时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="reviewMess"
        label="审核意见"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="spState"
        label="审核状态"
        show-overflow-tooltip>
        <template scope="scope">
          {{scope.row.spState | typeText}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: ['operailityData', 'url', 'podClass'],
    data() {
      return {
        viewData: {
          "id": "",//id
          "podId": "",//轮转ID
          "depId": "",//科室ID
          "depName": "",//科室名称
          "userId": "",//用户ID
          "userName": "",//用户姓名
          "beginTime": "",//开始时间
          "endTime": "",//结束时间
          "state": "",//状态(NO_SUBMIT 未上报 REJECT 驳回 NO_PASS 待审核 PASS 通过)
          "reviewMess": [],//审核意见列表
          "auditDetils": [],//审核详情,
        }

      }
    },
    methods: {
      getInfo() {
        let opt = {
          ajaxSuccess: res => {
            this.viewData = res.data;
          },
          ajaxParams: {
            url: this.url.auditDepRotaryDataGet.path,
            method: this.url.auditDepRotaryDataGet.method,
            params: {
              id: this.operailityData.id,
//              podId: this.operailityData.podId,
              podId: '',
            }
          }
        }
        this.ajax(opt)
      },
    },
    created() {
      this.getInfo()
    }
  }

</script>

<style lang="scss">
  .deptReported {
    margin-right: 10px;
    &:empty {
      margin-right: 0
    }
  }

</style>
