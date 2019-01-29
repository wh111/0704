<template>
  <!-- 安排 -->
  <div class="modalContent">
    <div class="leftCon">
      <img src="http://iph.href.lu/120x120" alt="">
      <el-form style="padding-right:16px;padding-left:16px;">
        <el-form-item label="考生姓名：">
          <el-input size="small" v-model="queryData.userName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：">
          <el-input size="small" v-model="queryData.idCard"></el-input>
        </el-form-item>
        <el-form-item label="考生编号：">
          <el-input size="small" v-model="queryData.userNum"></el-input>
        </el-form-item>
      </el-form>
      <p class="buttonBox">
        <el-button type="info" @click="searchData">查询</el-button>
      </p>
    </div>
    <div class="contentMain">
      <el-row style="padding-top:10px;">
        <el-col :span="10" style="float:right;">
          <el-input placeholder="请输入考站名称筛选" v-model="searchObj.stationName">
            <!--<el-button slot="append" icon="search"></el-button>-->
          </el-input>
        </el-col>
      </el-row>
      <!-- 考站列表 -->
      <div class="stationList">
        <template v-if="stationList.length">
          <fix-room v-for="(item,index) in stationList" :option="{hasAdd:false,hasRemove:false}" :initData="{index:item.stationId,cIndex:item.roomId,name:item.stationName}"
            :key="index" style="width:80px;margin-right:20px;" @roomClick="fixToThis">
          </fix-room>
        </template>
        <p class="tip" v-else>暂无数据</p>
      </div>
    </div>
    <!-- 安排 -->
    <Modal :mask-closable="false" width="600" v-model="fixStudenListModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.fixStudenListId"></modal-header>
      <fix-studen-list v-if="fixStudenListModal" @cancel="cancel" @fix="fix" :userId="userId" :sceneId="sceneId" :stationId="stationId"
        :roomId="roomId"></fix-studen-list>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;
  import api from './api';
  import fixRoom from '../examineInterval/examineInterval_room'; // 考站
  import fixStudenList from './examinePlan_studenList'; // 考生状态列表
  export default {
    props: ['sceneId'],
    data() {
      return {
        userId: '', // 人员id
        roomId: '', // 房间id
        stationId: '', // 站点id
        searchObj: {
          stationName: ''
        },
        fixStudenListModal: false,
        fixData: {}, // 数据
        stationList: this.filterStation(), // 考站列表
        contentHeader: {
          fixStudenListId: {
            id: "fixStudenListId",
            title: "考站考生状态"
          }
        },
        queryData: { // 查询信息
          sceneId: this.sceneId,
          userName: '',
          userNum: '',
          idCard: ''
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.manualList.path,
          params: {}
        }
        // this.setData();
      },
      /*
       * 设置数据
       */
      setData() {
        Object.assign(this.queryQptions.params, this.queryData);
        this.ajax({
          ajaxSuccess: res => {
            this.fixData = res.data;
            this.queryData.userName = res.data.userName;
            this.queryData.idCard = res.data.idCard;
            this.queryData.userNum = res.data.userNum;
            this.userId = res.data.userId || '';
            // this.filterStation();
          },
          ajaxParams: this.queryQptions
        })
      },
      // 搜索
      searchData() {
        this.setData()
      },
      // 筛选
      filterStation() {
        let list = [];
        if (this.fixData) {
          this.$util._.map(this.fixData.stationList, item => {
            if (item.stationName.indexOf(this.searchObj.stationName) > -1) {
              list.push(item)
            }
          })
        }
        return list
      },
      /************************************** 模态框处理 **************************************************/
      fix() {
        this.cancel('fixStudenList');
        this.$emit('setFix', 'planFix', '安排成功')
      },
      // 安排
      fixToThis(res) {
        this.stationId = res.index;
        this.roomId = res.cIndex;
        // console.log(res)
        this.openModel('fixStudenList')
      },
      // 取消
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
      // 获取头像地址
      getPhotoPath(path) {
        return path && this.$store.getters.getEnvPath.http + path || ''
      },
    },
    components: {
      fixRoom,
      fixStudenList
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  $boderColor:#dfe6ec; // 边框颜色
  .modalContent {
    margin: -16px 0;
    position: relative;
    .leftCon {
      width: 25%;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border-right: 1px solid $boderColor;
      img {
        width: 60%;
        max-width: 120px;
        display: block;
        margin: 10px auto;
      }
      .el-form-item {
        margin-bottom: 0
      }
      .buttonBox {
        text-align: center;
        margin-top: 20px;
      }
    }
    .contentMain {
      min-height: 450px;
      margin-left: 25%;
      .stationList {
        min-height: 400px;
        max-height: 600px;
        padding: 10px;
        padding-right: 0;
        overflow: hidden;
        .tip {
          text-align: center;
          line-height: 400px;
        }
      }
    }
  }

</style>
