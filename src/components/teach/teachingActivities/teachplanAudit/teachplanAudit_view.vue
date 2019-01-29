<!--
****--@file     teachplanAudit_view
****--@date     2018-12-07 16:47
****--@author   YC
****--@describe
-->
<template>
  <div>
    <el-form :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="科室：">{{ viewData.activityPlanDepName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计划年份：">{{ viewData.activityPlanYear }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计划月份：">{{ viewData.activityPlanMonth }}
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
      :data="viewData.activityDetails"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="75">
      </el-table-column>
      <el-table-column
        prop="planActivitySite"
        show-overflow-tooltip
        label="活动名称">
      </el-table-column>
      <el-table-column
        prop="planActivityType"
        label="活动类型"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="planActivityHostUserName"
        label="授课老师"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="planActivityTime"
        label="活动时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="planActivityTimeids"
        label="活动时间段"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="planActivityContent"
        label="活动内容"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="操作"
        show-overflow-tooltip>
        <template scope="scope">
          <el-tooltip v-show="scope.row.planActivityFiles.length!=0"
                      class="item" effect="dark" placement="bottom">
            <div slot="content">
              <div v-for="(item,index) in scope.row.planActivityFiles"
                   :key="index">{{item}}
              </div>
            </div>
            <el-button size="small" @click="files(scope.row)" type="info">附件管理
            </el-button>
          </el-tooltip>
          <el-button style="margin-left: 0"
                     v-show="scope.row.planActivityFiles.length==0" size="small"
                     @click="files(scope.row)">附件管理
          </el-button>
          <!--<el-button size="small" @click="remove(scope.$index)" type="danger">删除</el-button>-->
        </template>
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
    <!--附件-->
    <Modal
      :mask-closable="false"
      width="890"
      v-model="uploadModal"
      title="新建教学活动"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="uploadId"></modal-header>
      <upload v-if="uploadModal" :isshow="true" :fileList="fileList"
              @cancel="uploadModal=false" @upLoad="uploadCallback"
              :initUser="selectUser"></upload>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import upload from './teachplan_uploadFile'

  export default {
    components: {upload},
    props: ['operailityData', 'url'],
    data () {
      return {
        viewData: {},
        uploadModal: false,
        uploadId: {
          id: 'uploadId',
          title: '附件管理',
        },
        selectUser: [],
      }
    },
    methods: {
      getInfo () {
        let opt = {
          ajaxSuccess: res => {
            this.viewData = res.data
          },
          ajaxParams: {
            url: this.url.getTeachPlanData.path + '/' +
            this.operailityData.activityPlanId,
            method: this.url.getTeachPlanData.method,
          },
        }
        this.ajax(opt)
      },
      //点击文件管理按钮
      files (item) {
        this.fileList = item.planActivityFileList
        this.uploadModal = true
      },
    },
    created () {
      this.getInfo()
    },
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


</

style

>

