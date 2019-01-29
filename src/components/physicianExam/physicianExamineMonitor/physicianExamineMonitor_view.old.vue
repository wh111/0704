<!--
****--@file     physicianExamineMonitor_view
****--@date     2018/5/31 13:26
****--@author   YC
****--@describe 考核监控
-->
<template>
  <el-row class="physicianExamBox">
    <template v-if="formValidate instanceof Object">
      <el-col class="thereFloorBox">
        <div class="thereFloor">
          <h2>多媒体考试、笔试</h2>
          <br>
          <hr>
          <br>
          <el-row>
            <el-form>
              <el-col v-for="(item,index) in formValidate.three" :key="index" :span="3" align="center">
                <el-form-item>
                  <el-button :type="getThreeBtnColor(item)">{{ item.roomNum }}</el-button>
                  <p>{{ getThreeText(item) }}</p>
                  <p>{{ (item.timeLong || 0) | second2Format }}</p>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <hr>
          <br>
        </div>
      </el-col>
      <el-col :span="11" class="physicianExams left">
        <div class="fiveFloor">
          <h2>技能操作</h2>
          <br>
          <hr>
          <br>
          <div class="physicianExamContentBox">
            <el-col :span="8" v-for="(item,index) in formValidate.one" :key="index" align="center">
              <el-form>
                <el-form-item>
                  <el-button type="success" @click="add('one',index)" v-if="item.status === null">
                    {{ item.name }}
                  </el-button>
                  <el-button :type="item.status == 'START' ? 'danger' : 'info'" @click="()=>{}" v-else>
                    {{ item.name }}
                  </el-button>
                  <p>{{ getFiveText(item) }}</p>
                  <p>{{ item.timeLong | second2Format }}</p>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
        </div>
        <el-col class="physicianExamBtns">
          考室状态：
          <el-button type="success">无人</el-button>
          <el-button type="info">已安排</el-button>
          <el-button type="danger">考试中</el-button>
        </el-col>
      </el-col>
      <p class="lineBox"></p>
      <el-col :span="11" class="physicianExams right">
        <div class="fiveFloor">
          <h2>体格检查</h2>
          <br>
          <hr>
          <br>
          <div class="physicianExamContentBox">
            <el-col :span="8" v-for="(item,index) in formValidate.two" :key="index" align="center">
              <el-form>
                <el-form-item>
                  <el-button type="success" @click="add('two',index)" v-if="item.status === null">
                    {{ item.name }}
                  </el-button>
                  <el-button :type="item.status == 'START' ? 'danger' : 'info'" @click="()=>{}" v-else>
                    {{ item.name }}
                  </el-button>
                  <p>{{ getFiveText(item) }}</p>
                  <p>{{ item.timeLong | second2Format }}</p>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
        </div>
      </el-col>
    </template>
    <p v-else class="errTips">{{ msgText }}</p>
    <!--安排弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="addModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="headerContent.addId"></modal-header>
      <el-row v-if="addModal">
        <el-col>
          <p class="remove">确认安排考生到 <b>{{ name }}</b> ？</p>
        </el-col>
        <el-col align="right">
          <el-button @click="cancel('add')">取消</el-button>
          <el-button type="success" @click="addCall()">确认</el-button>
        </el-col>
      </el-row>
      <div slot="footer"></div>
    </Modal>
  </el-row>
</template>
<style lang="scss">
  @import "../style";
</style>
<script>
  /*当前组件必要引入*/
  import api from '../physicianExamineInterval/api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianExamineMonitorView',
    props: ['showData', 'msgStr'],
    data () {
      return {
        name: '',
        formValidate: null,
        msgText: '数据加载中...',
        headerContent: {
          addId: {
            id: 'addId',
            title: '安排确认'
          }
        },
        addData: {}
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.loadInfo()
      },
      getThreeBtnColor (obj) {
        let typeStr = {
          'START_ONE': 'danger',
          'END_ONE': 'danger',
          'START_TWO': 'danger',
          'END_TWO': 'success'
        }
        return obj.examType ? (typeStr[obj.examType] || '') : ''
      },
      getThreeText (obj) {
        let typeStr = {
          'START_ONE': '多媒体考试中',
          'END_ONE': '多媒体考试结束',
          'START_TWO': '笔试考试中',
          'END_TWO': '笔试考试结束'
        }
        return obj.examType ? (typeStr[obj.examType] || '未开始考试') : '未开始考试'
      },
      getFiveText (obj) {
        let str = {
          'START': '考试中',
          'END': '无人',
          'PLAN': '已安排'
        }
        return str[obj.status] || '无人'
      },
      loadInfo () {
        this.formValidate = this.showData || null;
        this.msgText = this.msgStr || '数据加载中...';
      },
      add (examType, index) {
        let {roomNum, timeLong, name} = this.formValidate[examType][index]
        this.name = name
        this.addData = {
          examType, roomNum, timeLong, status: 'PLAN' // START 开始  END 结束 PLAN 安排
        }
        this.openModel('add')
      },
      addCall () {
        let opt = {
          allowError: false,
          ajaxSuccess: () => {
            this.successMess('安排成功！')
            this.loadInfo()
          },
          error: res => this.errorMess(res.status.msg),
          ajaxParams: {
            url: api.saveTimeLong.path,
            method: api.saveTimeLong.method,
            data: this.addData
          }
        }
        this.ajax(opt)
        this.cancel('add')
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    watch: {
      showData () {
        this.formValidate = this.showData || null;
      },
      msgStr () {
        this.msgText = this.msgStr || '数据加载中...';
      }
    },
    components: {}
  }

</script>
