<template>
  <!-- 考生考核表信息 -->
  <div ref="content">
    <el-row style="height: 50px;line-height: 50px">
      <el-col :span="21">
        <div style="text-align: center;font:600 18px '微软雅黑'; line-height: 50px">统计分析-分站详情</div>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="goBack">返回考生详情</el-button>
      </el-col>
    </el-row>
    <hr>
    <div class="righrSched">
      <div>
        <!--表格数据-->
        <div id="myTable" ref="myTable">
          <!-- 理论考核显示试卷 -->
          <paper-show style="overflow: auto" :style="{maxHeight:dynamicHt+'px'}"
                      v-if="operailityData.stationType === 'THEORY'"
                      :show-data="paperData.paperContentList" showType="studentOption" showRight='Show'></paper-show>
          <!-- 非理论考核才显示 -->
          <template v-else>
            <!--列表数据-->
            <el-table :row-class-name="tableRowClassName" align="center" :height="dynamicHt-(contentDataList.deductList.length ? 250 : 50)"
                      :data="contentDataList.detailsList"
                      tooltip-effect="dark"
                      highlight-current-row style="width: 100%;height: 100%">
              <el-table-column prop="classify" label="项目" width="150" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="content" label="评分标准及要求" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="score" label="标准分" align="right" width="100">
              </el-table-column>
              <el-table-column prop="mark" label="得分" align="right" width="100">
              </el-table-column>
            </el-table>
            <!--扣分项-->
            <el-table v-if="contentDataList.deductList.length" align="center" height="200"
                      :data="contentDataList.deductList" tooltip-effect="dark" highlight-current-row
                      style="width: 100%;height: 100%" class="add-scope">
              <el-table-column prop="classify" label="项目" width="150">
              </el-table-column>
              <el-table-column prop="content" label="扣分标准及要求">
              </el-table-column>
              <el-table-column prop="score" label="标准分" align="right" width="80">
              </el-table-column>
              <el-table-column prop="mark" label="扣分" align="center" width="100">
                <template scope="scope">
                  <span class="el-checkbox__input" :class="{'is-checked': scope.row.mark > 0}">
                    <span class="el-checkbox__inner"></span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <div style="padding: 5px">
              老师评价：<span>{{ teachData.evaluate || '-' }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!--左侧-->
    <div class=" leftSched" style="top: 50px;">
      <img class="examineeUserPic" :src="getPhotoPath(operailityData.userPhoto)" onerror="javascript:this.src='/static/image/defAvatar.png';">
      <p class="infoItem bottom">考生姓名：{{data.userName}}</p>
      <p class="infoItem bottom">总分：{{data.totalMark}}</p>
      <p class="infoItem bottom">总排名：{{data.ranking}}</p>
      <p class="infoItem bottom">标准分：{{data.sceneStandardMark}}</p>
      <p class="infoItem bottom">该分站得分：{{data.sceneTotalMark}}</p>
      <p class="infoItem bottom">该分站排名：{{data.stationRanking}}</p>
      <p class="infoItem bottom" align="center">
        <el-button type="primary" @click="viewExamine('view')">查看监控</el-button>
        <el-button type="success" @click="viewExamine('down')">下载监控</el-button>
      </p>
      <!-- 非理论考核才显示 -->
      <el-table v-if="operailityData.stationType !== 'THEORY'" align="center" :height="200" border :data="scheduleList"
                tooltip-effect="dark" highlight-current-row style="width:100%;height: 100%"
                @row-click="rowClick">
        <el-table-column align="center" prop="teacherUserName" label="考官">
        </el-table-column>
        <el-table-column prop="mark" label="分数" align="center">
        </el-table-column>
        <!--<el-table-column prop="evaluate" label="评语" width="200" show-overflow-tooltip>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
    <download-examine-video v-if="viewExamineType=='down'" :operailityData="examineVideoData" @cancel="viewExamineType=''"></download-examine-video>
    <view-examine-video v-if="viewExamineType=='view'" :operailityData="examineVideoData" @cancel="viewExamineType=''"></view-examine-video>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import paperShow from '../../../examineInterval/examineIntervalSetInfo/paperContent/view';
  import DownloadExamineVideo from '../../../../common/downloadExamineVideo';
  import ViewExamineVideo from '../../../../common/viewExamineVideo';

  let Util = null;
  export default {
    props: ['operailityData', 'url'],

    data () {
      return {
        viewExamineType: '', // 监控操作类型
        examineVideoData: null, // 监控视频查看数据
        formValidate: {
          markId: this.operailityData.markId, //总成绩id
          arrangementId: this.operailityData.arrangementId //考核安排id
        },
        //老师列表提交的数据
        teaValidate: {
          id: '', //教师Id
          sceneId: '', //场次id
          stationId: '', //站点id
          arrangementId: this.operailityData.arrangementId //核安排id
        },
        operailityShowData: '',
        operailityListData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        //获取到的数据
        'data': {},
        paperData: { // 理论考核试卷数据
          paperContentList: []
        },
        markList: [], // 理论成绩列表
        scheduleList: [], //左侧老师列表
//        tableData: [],
        contentDataList: { //右侧评分列表
          detailsList: [],
          deductList: []
        },
        teachData: {},
        loading: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.markGet + this.operailityData.markId,
            params: {}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        teaListMessTitle: {
          ajaxSuccess: 'teaListData',
          ajaxParams: {
            url: this.url.teacherGet,
            params: {}
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        let {arrangementId: id, stationName: sceneName} = this.operailityData;
        this.examineVideoData = {id, sceneName};
        console.log(this.operailityData);
        if (this.operailityData.stationType === 'THEORY') { // 理论考核
          this.getPaperContent();
        } else {
          //ajax请求参数设置
          this.setTableData();
        }
      },

      // 考核监控
      viewExamine (type) {
        this.viewExamineType = type;
      },

      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      // 获取试卷信息
      getPaperContent () {
        let opt = {
          ajaxSuccess: res => {

            this.paperData = res.data.markSchedule;
            this.data = res.data;
          },
          ajaxParams: {
            url: this.url.paperMarkGet,
            params: {
              arrangementId: this.operailityData.arrangementId //考核安排id
            }
          }
        };
        this.ajax(opt);
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        if (!data) return;
        this.data = data;

        if (!data.scheduleList) {
          this.showMess('获取列表数据失败');
        } else {
          this.scheduleList = this.teaAddIndex(data.scheduleList);
          this.operailityListData = this.scheduleList[0];
          this.setTeachData(this.scheduleList[0]);
        }
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //为教师列表添加id
      teaAddIndex (data) {
        for (let i = 0; i < data.length; i++) {
          data[0].__index = i;
        }
        return data;
      },

      //设置教师请求参数
      setTeachData (data) {
        if (!data) return;
        this.teaValidate.id = data.teacherId;
        this.teaValidate.sceneId = data.sceneId;
        this.teaValidate.stationId = data.stationId;

        this.teaListMessTitle.ajaxParams.params = Object.assign(this.teaListMessTitle.ajaxParams.params, this.teaValidate);
        this.teaListMessTitle.ajaxParams.url = this.url.teacherGet + data.teacherId;
        this.ajax(this.teaListMessTitle);
      },

      //教师获取列表成功回调
      teaListData (responseData) {
        let data = responseData.data;
        if (!data) return;
        if (!data.detailsList) return;
        this.teachData = data;
        this.contentDataList = this.conductListData(data);
//        this.teachData = this.conduct(data);
//        this.tableData = this.teachData.detailsList;
      },

      //处理获取到列表数据
      conductListData (data) {
        let listData = {};
        //处理列表外层数据
        let deductListArr = []; // 扣分项
        let detailsListArr = []; // 评分项
        let detailsList = data.detailsList;
        let length = detailsList.length;
        for (let i = 0; i < length; i++) {
          let temp = detailsList[i];
          temp.mark = Number(temp.mark) || 0;
          Array.push.call(null, temp.isPoints ? deductListArr : detailsListArr, temp);
        }
        detailsListArr.push({
          classify: '总分',
//          content: data.evaluate,
          content: '',
          score: data.totalScore || 0,
          mark: data.totalMark || 0
        });
        listData.detailsList = detailsListArr;
        listData.deductList = deductListArr;
        return listData;
      },

      //处理获取到的教师列表
      conduct (data) {
        data.detailsList.push({
          classify: '教师评价',
//          content: data.evaluate,
          content: '',
          score: data.totalScore,
          mark: data.totalMark
        });
        return data;
      },

      /*--点击--添加--按钮--*/
      add () {
        this.openModel('add');
      },
      /*--点击--修改--按钮--*/
      edit (data) {
        this.operailityData = data;
        this.openModel('edit');
      },
      /*--点击--删除--按钮--*/
      remove () {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },

      //返回
      goBack () {
        this.$emit('cancel');
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *    }
       * @param udata boolean 默认false  是否不需要刷新当前表格数据
       * */
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },

      //行被点击的时候
      rowClick (row, event, column) {
        if (row.index == this.operailityListData.index) return;
        this.operailityListData = row;
        this.setTeachData(row);
      },

      //高亮最后一行
      tableRowClassName (row, index) {
        return (index === this.contentDataList.detailsList.length - 1) ? 'info-row' : '';
      },
      // 获取头像地址
      getPhotoPath (path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png';
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    components: {
      ViewExamineVideo,
      DownloadExamineVideo,
      //当前组件引入的子组件
      paperShow
    }
  };

</script>

<style>
  .examineeUserPic {
    width: 120px;
    height: 120px;
    display: block;
    margin: 10px auto;
  }

</style>
