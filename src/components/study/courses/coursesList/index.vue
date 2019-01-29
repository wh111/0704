<template>
  <!-- 课程列表页 -->
  <div class="coursesListBox">
    <el-row>
      <el-col :span="12">
        <el-breadcrumb separator="/" class="coursesListNavInfo">
          <el-breadcrumb-item @click.native="show('index')">首页</el-breadcrumb-item>
          <el-breadcrumb-item><span @click="allClick">全部课程</span></el-breadcrumb-item>
          <el-breadcrumb-item v-if="navData.pName">{{navData.pName}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12" align="right">
        <el-input placeholder="请输入关键词" style="max-width:300px;">
          <el-button slot="append" icon="search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 导航 -->
    <courses-nav class="coursesListNav" :count="count" @getRoot="getRoot" @navChange="navChange" :operaility-data="operailityData" :navUrl="'criterionCourseType/tree'"></courses-nav>
    <!-- 条件 -->
    <el-row class="coursesListCondition">
      <el-col :span="18">
        <el-button size="small" :class="{coursesListCondition1:(formValidate.type=='ALL')}" @click="changeType('ALL')" :type="formValidate.type=='ALL'?'primary':'text'">全部</el-button>
        <el-button size="small" :class="{coursesListCondition1:(formValidate.type=='PROGRESS')}" @click="changeType('PROGRESS')" type="text" :type="formValidate.type=='PROGRESS'?'primary':'text'">正在进行</el-button>
        <span class="coursesListDelimiter">|</span>
        <el-button size="small" :class="{coursesListCondition1:(formValidate.type=='BEGIN')}" @click="changeType('BEGIN')" type="text" :type="formValidate.type=='BEGIN'?'primary':'text'">即将开始</el-button>
        <span class="coursesListDelimiter">|</span>
        <el-button size="small" :class="{coursesListCondition1:(formValidate.type=='END')}" @click="changeType('END')" type="text" :type="formValidate.type=='END'?'primary':'text'">已结束</el-button>
      </el-col>
      <el-col :span="6" align="right">
        <el-button size="small" :class="{coursesListCondition1:(formValidate.type=='HOT')}" @click="changeType('HOT')" type="text" :type="formValidate.type=='HOT'?'primary':'text'">热门</el-button>
        <span class="coursesListDelimiter">|</span>
        <el-button size="small" :class="{coursesListCondition1:(formValidate.type=='NEWS')}" @click="changeType('NEWS')" type="text" :type="formValidate.type=='NEWS'?'primary':'text'">最新</el-button>
      </el-col>
    </el-row>
    <!-- 列表项 -->
    <div v-if="tableData!=0">
      <div class="coursesListMain">
        <div @click="videoClick(item)" style="cursor: pointer" class="coursesListItem" v-for="(item,index) in tableData" :key="index">
          <img :src="item.logo?http+item.logo:''" style="width: 270px;height: 160px;" class="coursesListItemPic">
          <div class="coursesListInfo">
            <h3 class="overflow-txt1">{{item.title}}</h3>
            <p class="coursesListInfoItem overflow-txt1">{{item.teacher}}</p>
            <p class="coursesListInfoItem overflow-txt1">课程简介：</p>
            <div class="coursesListInfoItemIntro coursesListInfoItem overflow-txt" style="height: 55px;">
              <div v-html="item.remark"></div>
            </div>
            <!--<p class="coursesListInfoItem overflow-txt1">授课对象：全部人员</p>-->
            <el-row class="coursesListInfoItem">
              <el-col :span="8" class="overflow-txt1">观看次数:{{item.viewNum }}</el-col>
              <el-col :span="8" class="overflow-txt1">学习人数:{{item.userNum}}</el-col>
              <el-col :span="8" class="overflow-txt1">有效时间:{{item.start||'~' }}至{{item.end||'~' }}</el-col>
            </el-row>
          </div>
        </div>
      </div>
      <!-- 分页按钮 -->
      <div style="float: right;margin-top:10px;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
      </div>
    </div>

    <p v-else class="coursesStudyItemTips" style="font-size: 24px">暂无课程</p>
    <!-- 详情弹窗 -->
    <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="showId"></modal-header>
      <show style="height: 600px;" v-if="showModal" :operaility-data="showData" showType="more"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util;
  /*当前组件必要引入*/

  import show from '../webCourses/webCourses_view.vue'
  import api from './api'
  import coursesNav from '../../common/nav';
  export default {
    props: ['operailityData'],
    data() {
      return {
        count: 0,
        totalCount: 0,
        navData: this.operailityData,
        formValidate: {
          typeId: '', //分类ID
          type: 'ALL', //分类
        },
        rootId: '',
        tableData: [],
        http: "",
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.queryByType.path,
            params: {}
          }
        },

        showModal: false,
        showId: {
          id: 'showId',
          title: '查看'
        },

      }
    },
    methods: {
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.setTableData()

      },

      //通过get请求列表数据并渲染表格数据
      updateListData(responseData) {
        let data = responseData.data;
        this.tableData = data;
        this.totalCount = responseData.totalCount || 0;
      },

      //初始化加载列表数据
      setTableData() {
        if (this.navData.id && this.navData.id != '全部') {
          this.formValidate.typeId = this.navData.id;
        } else {
          this.formValidate.typeId = this.navData.pid;
        }
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params,
          this.formValidate);
        this.ajax(this.listMessTitle)
      },

      //切换选项卡
      navChange(data) {
        this.navData = data;
        this.init()
      },

      // 视图切换
      show(viewType, data) {
        this.$emit('show', viewType, data)
      },

      //点击全部
      allClick() {
        this.navData = {
          pid: '',
          id: '',
          pName: ''
        };
        this.count++;
        let formValidate = {
          typeId: '', //分类ID
          type: 'ALL', //分类
        }
        this.formValidate = formValidate;
        this.init();
      },

      //查询条件
      changeType(type) {
        this.formValidate.type = type;
        this.init();
      },

      //点击视频
      videoClick(data) {
        let opt = {
          ajaxSuccess: res => {
            this.showData = data;
            this.showModal = true;
          },
          ajaxParams: {
            url: api.mainInfo.path + data.id,
            method: api.mainInfo.method
          }
        }
        this.ajax(opt)
      },

      getRoot(data) {
        this.rootId = data.id
      },
    },
    components: {
      coursesNav,
      show
    },
    created() {
      let env = this.$store.getters.getEnvPath;
      this.http = env['http'];
      this.init()
    },
  }

</script>

<style lang="scss">
  @import"../../../../assets/ambuf/css/coursesStudy_v1.0/list";

</style>
