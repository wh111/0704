<template>
  <!-- 考生考核表信息 -->
  <div class="modalContent" ref="content">
    <div v-show="isShowList" class="text-headline ">分站得分总览</div>
    <!-- 单/多次场次考核的考生详情的查看 -->
    <div v-show="isShowList" class="leftCon" style="top: 50px;border-top: 1px solid #dfe6ec;">
      <img :src="getPhotoPath(data.userPhoto)" class="examineeUserPic" onerror="javascript:this.src='/static/image/defAvatar.png';">
      <p class="infoItem bottom">考生姓名：{{data.userName}}</p>
      <p class="infoItem bottom">总分：{{data.sceneTotalMark}}</p>
      <p class="infoItem bottom">排名：{{data.ranking}}</p>
      <p class="infoItem">标准分：{{data.standardMark}}</p>
    </div>
    <div v-show="isShowList" class="contentMain">
      <!--表格数据-->
      <div id="myTable" ref="myTable">
        <el-table align="center" :data="tableData" :height="450" tooltip-effect="dark" highlight-current-row>
          <el-table-column label="序号" type="index" width="90"></el-table-column>
          <el-table-column prop="stationName" label="分站名称" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="contentName" label="考核内容" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="totalMark" label="得分" align="center"></el-table-column>
          <el-table-column prop="timeLength" label="考核时间" align="center" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.sceneType == 'STANDARD' ? (scope.row.timeLength * (scope.row.basicsTime / 60)) : scope.row.timeLength }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)" type="info">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <grade @cancel="goBack" v-if="!isShowList" :operaility-data="operailityShowData" :url="url"></grade>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import grade from './examinee_grade.vue';

  let Util = null;
  export default {
    props: ['operailityData', 'url'],

    data () {
      return {
        formValidate: { // statisticsId 与 sceneId 二传一
          userId: this.operailityData.userId //考生id
          // statisticsId: this.operailityData.statisticsId, //统计id
          // sceneId: this.operailityData.sceneIds, //场次id
        },
        isShowList: true,

        operailityShowData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        //获取到的数据
        tableData: [],
        data: {},

        loading: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.userGet + this.operailityData.userId,
            params: {}
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
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
        this.data = data;
        if (!data.markList) return;
        this.tableData = responseData.data.markList;

      },
      setTableData () {
        if (this.operailityData.statisticsId) { // 有统计id则只传统计id，否则只传场次id
          this.formValidate.statisticsId = this.operailityData.statisticsId; //统计id
        } else {
          this.formValidate.sceneId = this.operailityData.sceneIds; //场次id
        }
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.formValidate);
        this.ajax(this.listMessTitle);
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
        this.operailityShowData = data;
        this.operailityShowData.userPhoto = this.data.userPhoto;
        this.isShowList = false;
      },

      //返回
      goBack () {
        this.isShowList = true;
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
      // this.$nextTick(function () {
      //初始表格高度及分页位置
      // this.setTableDynHeight();
      //为窗体绑定改变大小事件
      // let Event = Util.events;
      // Event.addHandler(window, 'resize', this.setTableDynHeight);
      // });
    },
    components: {
      //当前组件引入的子组件
      grade
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
