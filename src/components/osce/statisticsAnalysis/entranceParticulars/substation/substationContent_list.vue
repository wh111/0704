<template>
  <!-- 考生考核表信息 -->
  <div class="modalContent" ref="content">
    <div class="text-headline ">考核内容总览</div>
    <hr>
    <div class="leftCon" style="top: 50px;border-top: 1px solid #dfe6ec;">
      <p class="infoItem bottom">考站名称：{{showData.stationName || ''}}</p>
      <p class="infoItem bottom">考核内容：{{showData.contentName || ''}}</p>
      <p class="infoItem bottom">最高分：{{showData.maxMark}}</p>
      <p class="infoItem bottom">最低分：{{showData.minMark}}</p>
    </div>
    <div class="contentMain">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in contentList" :key="index" :label="item.scoreTableName"
                     :name="index+''"></el-tab-pane>
      </el-tabs>
      <div>
        <!--表格数据-->
        <div id="myTable" ref="myTable">
          <el-table v-if="showData.stationType === 'THEORY'" align="center" :height="400"
                    :data="scoreTableDetailsList" tooltip-effect="dark"
                    highlight-current-row style="width: 100%;height: 100%">
            <el-table-column align="center" label="编号" type="index" width="100">
            </el-table-column>
            <el-table-column prop="subject" label="试题题干" show-overflow-tooltip>
              <template scope="scope">
                <p>{{ scope.row.subject | delHtmlTag(true) }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="optionScore" label="分值" align="center" width="100">
            </el-table-column>
            <el-table-column prop="scoringRate" label="正确率" align="center" width="130">
              <template scope="scope">
                {{ Number(((scope.row.scoringRate||0) * 100).toFixed(2)) }}%
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template scope="scope">
                <el-button size="small" type="success" @click="show(scope.row)">预览</el-button>
              </template>
            </el-table-column>
          </el-table>
          <template v-else>
            <el-table align="center" :height="300" :data="contentDataList.detailsList" tooltip-effect="dark"
                      highlight-current-row style="width: 100%;height: 100%">
              <el-table-column label="编号" type="index" width="90"></el-table-column>
              <el-table-column prop="content" label="评分项目" show-overflow-tooltip></el-table-column>
              <el-table-column prop="score" label="分值" align="right" width="100"></el-table-column>
              <el-table-column prop="avgMark" label="平均分" align="right" width="100"></el-table-column>
              <el-table-column label="得分率" align="right" width="100">
                <template scope="scope">
                  {{ scope.row.avgMark/scope.row.score == scope.row.avgMark/scope.row.score?+(scope.row.avgMark/scope.row.score).toFixed(2):''}}
                </template>
              </el-table-column>
            </el-table>
            <!--扣分项-->
            <el-table v-if="contentDataList.deductList.length" align="center" max-height="200"
                      :data="contentDataList.deductList" tooltip-effect="dark" highlight-current-row
                      style="width: 100%;height: 100%" class="add-scope">
              <el-table-column type="index" label="编号" width="90">
              </el-table-column>
              <el-table-column prop="content" label="扣分标准及要求">
              </el-table-column>
              <el-table-column prop="score" label="分值" align="center" width="100">
              </el-table-column>
              <!--<el-table-column prop="score" label="扣分率" align="right" width="100">-->
                <!--<template scope="scope">-->
                  <!--&lt;!&ndash;{{ scope.row.avgMark/scope.row.score ==&ndash;&gt;-->
                  <!--&lt;!&ndash;scope.row.avgMark/scope.row.score?+(scope.row.avgMark/scope.row.score).toFixed(2):''&ndash;&gt;-->
                  <!--&lt;!&ndash;}}&ndash;&gt;-->
                  <!-- - -->
                <!--</template>-->
              <!--</el-table-column>-->
            </el-table>
          </template>
          <br>
          <el-table align="center" :height="200" :data="markList" tooltip-effect="dark" highlight-current-row
                    style="width: 100%;height: 100%">
            <el-table-column align="center" label="姓名" prop="userName" width="300">
            </el-table-column>
            <el-table-column prop="teacherName" label="考官姓名" align="center" v-if="showData.stationType !== 'THEORY'">
            </el-table-column>
            <el-table-column prop="totalMark" label="得分" align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!--查看弹窗-->
    <Modal width="1000" v-model="showModal" class-name="vertical-center-modal" :loading="loading">
      <modal-header slot="header" :content="showId"></modal-header>
      <paper-show v-if="showModal" @cancel="cancel" :show-data="operailityShowData" showType='answer' showRight="Show"></paper-show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import paperShow from '../../../examineInterval/examineIntervalSetInfo/paperContent/view';

  let Util = null;
  export default {
    props: ['operailityData', 'url'],

    data () {
      return {
        stationId: '',
        scoreTableId: '',
        loading: false,
        formValidate: {
//          stationId: this.operailityData.stationId //统计id
        },
        //评分表
        scoreValidate: {
          scoreTableId: '' //评分表
        },
        isShowList: true,
        //tab列表
        contentList: [],
        scoreTableDetailsList: [], //评分内容
        contentDataList: { // 右侧评分列表
          detatilsList: [],
          deductList: []
        },
        markList: [], //成绩列表
        operailityShowData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        //获取到的数据
        tableData: [],
        showData: {},
        showId: {
          id: 'showId',
          title: '预览试题'
        },

        loading: false,
        totalCount: 0,
        //标签切换
        oldIndex: 0, //保存切换的值
        activeName: '0',
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        leftListMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.eContentGet + this.operailityData.contentId,
            params: {}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        scoreListMessTitle: {
          ajaxSuccess: 'scoreListData',
          ajaxParams: {
            url: this.url.contentGet,
            params: {}
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        console.log(this.operailityData);
        //ajax请求参数设置
        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 0;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        if (!data) return;
        this.showData = data;
        this.stationId = data.stationId;
        if (data.scoreTableList) {
          this.contentList = data.scoreTableList;
          this.scoreTableId = data.scoreTableList[0].scoreTableId;
        }
        this.setScoreData();
      },

      //获取左侧内容
      setTableData () {
        this.leftListMessTitle.ajaxParams.params = Object.assign(this.leftListMessTitle.ajaxParams.params, this.formValidate);
        this.ajax(this.leftListMessTitle);
      },

      //获取评分表数据
      scoreListData (responseData) {
        let data = responseData.data;
        if (!data) return;
        this.markList = data.markList;
//        this.scoreTableDetailsList = data.detatilsList;
        this.contentDataList = this.conductListData(data);
      },

      //处理获取到列表数据
      conductListData (data) {
        let listData = {};
        //处理列表外层数据
        let deductListArr = []; // 扣分项
        let detailsListArr = []; // 评分项
        let detailsList = data.detatilsList;
        let length = detailsList.length;
        for (let i = 0; i < length; i++) {
          let temp = detailsList[i];
          temp.mark = Number(temp.mark) || 0;
          Array.push.call(null, temp.isPoints ? deductListArr : detailsListArr, temp);
        }
        listData.detailsList = detailsListArr;
        listData.deductList = deductListArr;
        console.log(listData);
        return listData;
      },

      // 获取试卷内容（理论考核专用）
      setScoreDataByPaper () {
        let opt = {
          ajaxSuccess: res => {
            (res.data.paperContentList || []).map(item => item.userOptions = item.options);
            this.scoreTableDetailsList = res.data.paperContentList || [];
            this.markList = res.data.markList;
            console.log(this.scoreTableDetailsList);
          },
          ajaxParams: {
            url: this.url.paperContentGet,
            params: {
              contentId: this.showData.contentId, // 考核内容id
              stationId: this.stationId // 考站id
            }
          }
        };
        this.ajax(opt);
      },
      //获取评分表内容
      setScoreData () {
        if (this.showData.stationType === 'THEORY') { // 理论考核
          this.setScoreDataByPaper();
          return;
        }
        if (!this.scoreTableId) {
          return;
        }
        this.scoreListMessTitle.ajaxParams.params = Object.assign(this.scoreListMessTitle.ajaxParams.params, {
          scoreTableId: this.scoreTableId,
          stationId: this.stationId
        });
        this.ajax(this.scoreListMessTitle);
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
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (data) {
        this.operailityShowData = [data];
        this.openModel('show');
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

      //tab切换
      handleClick (tab) {
        let index = tab.index;
        if (index == this.oldIndex) return;
        this.oldIndex = index;
        this.scoreTableId = this.showData.scoreTableList[index].scoreTableId;
        this.setScoreData();
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
      paperShow
    }
  };

</script>
