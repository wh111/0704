<template>
  <!-- 考核监控 -->
  <div>
    <template v-if="emTabHeader">
      <div class="em_tabHeader" style="position:relative;">
        <div style="padding-right:140px;">
          <el-tabs v-model="emTabHeader">
            <template v-for="item in tabList">
              <el-tab-pane :label="item.sceneName" :name="(item.id).toString()" :key="item.id"></el-tab-pane>
            </template>
          </el-tabs>
        </div>
        <div style="width:140px;height:42px;border-bottom:1px solid #d1dbe5;position:absolute;right:0;top:0;text-align:right;">
          <el-button type="info" @click="setDefault">设置为默认考场</el-button>
        </div>
      </div>
      <station :sceneId="emTabHeader"></station>
    </template>
    <p v-else style="position: absolute;top: 50%;text-align: center;width: 100%;">暂无可监控的考核场次</p>
  </div>
</template>

<script>
  import api from './api'; // Api
  import station from './examineMonitorStation/examineMonitorStation'; // 考站列表
  export default {
    data() {
      return {
        emTabHeader: '',
        tabList: [],
      }
    },
    methods: {
      // 获取监控考核场次列表
      getMonitorList() {
        this.ajax({
          ajaxSuccess: 'updateTabData',
          ajaxParams: {
            url: api.list.path,
            method: api.list.method
          }
        })
      },
      // 更新tab
      updateTabData(res) {
        if (res.data.length) {
          this.emTabHeader = (res.data[0].id).toString();
          this.tabList = res.data;
          this.activeName = res.data[0].id;
        }
      },
      // 设置为默认setDefault
      setDefault() {
        this.ajax({
          ajaxSuccess: () => this.$message.success('设置成功'),
          ajaxError: () => this.$message.error('设置失败'),
          ajaxParams: {
            url: api.set.path + this.emTabHeader,
            method: api.set.method,
            data: {
              id: this.emTabHeader
            }
          }
        })
      }
    },
    created() {
      // 做到此处
      this.getMonitorList();
    },
    components: {
      station
    }
  }

</script>

<style lang="scss">
  @import'~@/assets/ambuf/css/examineMonitor_v1.0/stationList';

</style>
