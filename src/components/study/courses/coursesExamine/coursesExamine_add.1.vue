<template>
  <!-- 授课审核 -->
  <div>
    <webCoursesView :operailityData="operailityData" style="height:606px;" @getViewData="getViewData"></webCoursesView>
    <!-- 授课审核填写 -->
    <el-row>
      <el-form label-width="100px">
        <el-col>
          <el-form-item label="审核状态：">
            <el-radio-group v-model="formValidate.audit">
              <el-radio label="TG">通过</el-radio>
              <el-radio label="BH">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="审核意见：">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.reason">
            </el-input>
          </el-form-item>
        </el-col>

        <!-- 时间安排 -->
        <el-col v-if="formValidate.audit === 'TG'">
          <el-form-item label="授课时间：">
            <el-col>
              <el-table ref="multipleTable" align="center" :maxHeight="400" :context="self" :data="formValidate.planList" tooltip-effect="dark" style="width: 100%">
                </el-table-column>
                <el-table-column label="操作" align="center" width="210">
                  <template scope="scope">
                    <el-button size="small" type="info" @click="selectDayAndTime(scope.row,scope.$index)">安排</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="课程" show-overflow-tooltip>
                  <template scope="scope">
                    第{{ indexText(scope.$index) }}节：{{ scope.row.content }}
                  </template>
                </el-table-column>
                <el-table-column prop="roomNum" label="房间号" show-overflow-tooltip>
                  <template scope="scope">
                    {{ scope.row.roomNum || '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="dates" label="上课日期" show-overflow-tooltip>
                  <template scope="scope">
                    {{ scope.row.dates || '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="startTime" label="上课时间" show-overflow-tooltip>
                  <template scope="scope">
                    {{ scope.row.startTime || '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="endTime" label="下课时间" show-overflow-tooltip>
                  <template scope="scope">
                    {{ scope.row.endTime || '-' }}
                  </template>
                </el-table-column>
                <el-table-column prop="deviceList" label="所需设备" show-overflow-tooltip>
                  <template scope="scope">
                    {{ getDeviceInfo(scope.row.deviceList) || '-' }}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-form-item>
        </el-col>

      </el-form>

      <p align="center">
        <el-button type="success" @click="audit">确定</el-button>
        <el-button @click="cancelAdd">取消</el-button>
      </p>
    </el-row>
    <!-- 模态框 选择时间 -->
    <Modal :mask-closable="false" v-model="selectTimeModal" class-name="vertical-center-modal" :loading="true" :width="1000">
      <modal-header slot="header" :parent="self" :content="selectTimeId"></modal-header>
      <select-time v-if="selectTimeModal" :operailityData="selectData" : @cancel="cancel" @select="selectTimeCall"></select-time>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';
  // 授课基本信息
  import webCoursesView from './coursesExamine_view';
  import selectTime from './selectTime';
  export default {
    props: ['operailityData'],
    data() {
      return {
        self: this,
        planIndex: -1, // 第几节课索引
        formValidate: {
          courseId: this.operailityData.id, // 授课ID
          audit: "TG", // 审核状态：通TG、驳回BH
          reason: "", // 审核原因
          planList: [], // 时间安排
        },
        selectData: { // 已经选过的日期
          // '110': { // 房间id
          // "2017-10-10":[ // 日期
          // "08:00-09:00", // 时间段
          // ],            
          // }
        },
        selectTimeModal: false,
        selectTimeId: {
          id: "selectTimeId",
          title: "课程上课时间安排"
        }
      }
    },
    methods: {
      // 审核
      audit() {
        let msg = this.formValidate.audit === 'BH' ? '驳回' : '通过';
        let data = this.$util._.defaultsDeep({}, this.formValidate);
        if (data.audit === 'BH') {
          data.planList.length = 0;
        }
        let opt = {
          type: 'add',
          successTitle: msg + '操作成功!',
          errorTitle: msg + '操作失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.submitAudit.path,
            method: api.submitAudit.method,
            data
          }
        };
        this.ajax(opt)
      },
      // 获取预览数据成功
      getViewData(res) {
        res.planDtoList.map(item => {
          this.formValidate.planList.push({
            "planId": item.id, //第几节课ID
            "content": item.content, //课程名称
            "roomId": '', //房间ID
            "roomNum": '', //房间号
            "timeId": "", //  时间段ID
            "dates": "", //上课日期
            "startTime": "", //上课时间
            "endTime": "", //下课时间
            "deviceList": [], // 所需模型
          })
        })
      },
      // 选择时间
      selectDayAndTime(row, index) {
        this.planIndex = index;
        this.openModel('selectTime')
      },
      // 选择时间回调
      selectTimeCall(res) {
        let data = this.formValidate.planList[this.planIndex];
        let deviceList = [];
        data.roomId = res.reservePojectRoom.roomId || '';
        data.roomNum = res.reservePojectRoom.roomNum || '';
        data.dates = res.openTime.date || '';
        data.timeId = res.openTime.timeSetId || '';
        data.startTime = (res.openTime.time || '-').split('-')[0];
        data.endTime = (res.openTime.time || '-').split('-')[1];
        res.deviceList.map(item => deviceList.push({
          deviceId: item.derviceTypeId,
          nums: item.reserveNum || 0,
          name: item.deviceTypeName,
        }));
        data.deviceList = deviceList;
        this.addSelectTimeData(res);
        this.cancel('selectTime')
      },
      // 把选择的房间的日期及时间段都加入到选择记录中
      addSelectTimeData(res) {
        console.log(res)
      },
      // 索引数字转换
      indexText(index) {
        index += 1;
        let text = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        let str = [];
        let bit = index % 10; // 个位
        let ten = (index - bit) / 10; // 十位
        ten > 1 && (str[0] = text[ten - 1]);
        index > 9 && (str[1] = text[9]);
        str[2] = (text[bit - 1]) || '';
        return str.join('')
      },
      // 获取设备信息
      getDeviceInfo(arr) {
        let temp = [];
        // arr.map(item => temp.push(`${item.name}（${item.nums}）`));
        return temp.join('、')
      },
      /****************************************** 弹窗相关 ********************************************/
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

      // 关闭审核
      cancelAdd() {
        this.$emit('cancel', 'add')
      },
    },
    components: {
      webCoursesView,
      selectTime,
    }
  }

</script>

<style>
  /* 授课审核 */

</style>
