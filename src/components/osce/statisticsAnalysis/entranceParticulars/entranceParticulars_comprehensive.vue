<!--综合统计-->
<template>
  <div id="content" ref="content" class="modal">
    <el-row>
      <el-form :inline="true">
        <el-col :span="12">
          <el-form-item>
            <b>{{showData.name}}</b>
          </el-form-item>
          <el-form-item>
            <el-button @click="derive" type="info">{{ 'export' | sysLan }}</el-button>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12" align="right">-->
        <!--<el-form-item label="考生姓名：">-->
        <!--<el-input v-model="searchObj.name"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-button @click="search" type="info">{{ 'search' | sysLan }}</el-button>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
      </el-form>
    </el-row>
    <!--<div class="text-headline">{{data.name}}</div>-->
    <div>
      <!--表格数据-->
      <div id="myTable" ref="myTable">
        <!--<el-table v-if="data.header" align="center" :height="dynamicHt" :data="data.tableData" tooltip-effect="dark" highlight-current-row-->
        <!--style="width: 100%;height: 100%">-->
        <!--<el-table-column align="center" label="排名" type="index" width="100">-->
        <!--</el-table-column>-->
        <!--<el-table-column v-for="(item,index) in  data.header.headerData" align="center" :prop="item.key" :label="item.label" :key="index">-->
        <!--</el-table-column>-->
        <!--</el-table>-->
        <el-table border align="center" :height="dynamicHt" :context="self" :data="showData.userList" tooltip-effect="dark" class="tableShowMoreInfo"
                  style="width: 100%;">
          <el-table-column label="排名" show-overflow-tooltip min-width="70px" fixed>
            <template scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="考生姓名" prop="userName" show-overflow-tooltip min-width="100px" fixed></el-table-column>
          <!--<el-table-column label="部门" prop="sceneId" show-overflow-tooltip></el-table-column>-->
          <el-table-column label="考生编号" prop="userNum" show-overflow-tooltip min-width="100px"></el-table-column>
          <el-table-column label="性别" prop="sex" show-overflow-tooltip min-width="80px">
            <template scope="scope">
              {{ scope.row.sex | typeText }}
            </template>
          </el-table-column>
          <el-table-column label="考官评分" prop="userNum" show-overflow-tooltip align="center">
            <el-table-column v-for="(item,index) in stationHeader" :key="index" :label="item.stationName+'('+item.stationWeight+')'"
                             show-overflow-tooltip min-width="120px">
              <template scope="scope">
                {{ scope.row.stationList.scoreList[index].examStatus == 'MISS' ? '缺考' : scope.row.stationList.scoreList[index].totalMark }}
              </template>
            </el-table-column>
            <el-table-column label="合计" show-overflow-tooltip min-width="80px" align="center">
              <template scope="scope">
                <el-col align="left">
                  {{ showData.stationSize ? scope.row.stationList.staionSum : 0 }}
                </el-col>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="SP评分" prop="userNum" show-overflow-tooltip align="center">
            <el-table-column v-for="(item,index) in stationSpHeader" :key="index" :label="item.stationName+'('+item.stationWeight+')'"
                             show-overflow-tooltip min-width="120px">
              <template scope="scope">
                {{ scope.row.spStationList.scoreList[index].examStatus == 'MISS' ? '缺考' : scope.row.spStationList.scoreList[index].totalMark }}
              </template>
            </el-table-column>
            <el-table-column label="合计" show-overflow-tooltip min-width="80px" align="center">
              <template scope="scope">
                <el-col align="left">
                  {{ showData.stationSpSize ? scope.row.spStationList.staionSum : 0 }}
                </el-col>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="成绩汇总" prop="sumMark" show-overflow-tooltip min-width="100px"></el-table-column>
        </el-table>
      </div>
    </div>
    <!--导出弹窗-->
    <Modal :mask-closable="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="headerContent.deriveId"></modal-header>
      <div>
        <div class="remove">确定导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="exportUrl">
              <el-button @click="cancel('derive')" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('derive')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'url'],
    data () {
      return {
        self: this,
        deriveModal: false,
        //查询表单
        formValidate: {
          sceneId: this.operailityData.sceneId || '', //场次id
          statisticsId: this.operailityData.statisticsId || '' //统计id
        },
        dynamicHt: 100,
        showData: {
          name: '',
          stationSize: 0,
          stationSpSize: 0,
          userList: []
        },
        stationHeader: [], // 教师评分
        stationSpHeader: [], // SP评分

//        data: {
//          header: ''
//        },
        searchObj: {
          name: ''
        },
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.comprehensiveGet,
            params: {}
          }
        },
        exportUrl: '',
        headerContent: {
          deriveId: {
            id: 'deriveId',
            title: '导出'
          }
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.setTableData();
      },
      search () {
        this.setTableData();
      },
      //导出
      derive () {
        this.getDeriveURL()
        this.openModel('derive')
      },

      // 获取导出URL
      getDeriveURL () {
        let params = []
        Object.keys(this.formValidate).map(key => params.push(key + '=' + this.formValidate[key]))
        this.exportUrl = '/api/scene/statistics/comprehensive/exportExcel?' + params.join('&')
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      //通过get请求列表数据
      updateListData (res) {
//        this.data.name = responseData.data.name;
//        this.data.header = this.conductHeader(responseData.data.title);
//        this.data.tableData = this.conductTable(responseData.data.data);
        let data = res.data
        if (data.stationSize && data.userList.length) {
          data.userList[0].stationList.scoreList.map(item => this.stationHeader.push({
            stationName: item.stationName,
            stationWeight: Number((item.stationWeight * 100).toFixed(2)) + '%'
          }))
        }
        if (data.stationSpSize && data.userList.length) {
          data.userList[0].spStationList.scoreList.map(item => this.stationSpHeader.push({
            stationName: item.stationName,
            stationWeight: Number((item.stationWeight * 100).toFixed(2)) + '%'
          }))
        }
        this.showData = res.data
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //处理表格头部
      conductHeader (data) {
        let temArr = [];
        let keys = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i] == '序号') {
            continue
          }
          temArr.push({
            label: data[i],
            key: '_key' + i
          });
          keys.push('_key' + i);
        }
        return {
          headerData: temArr,
          keys: keys
        }
      },

      //处理表格数据
      conductTable (data) {
        let keys = this.data.header.keys;
        let sex = {
          GIRL: '女',
          BOY: '男'
        }
        let temArr = [];
        for (let i = 0; i < data.length; i++) {
          temArr[i] = {};
          for (let k = 0; k < data[i].length; k++) {
            temArr[i][keys[k]] = data[i][k] === null ? '-' : (sex[data[i][k]] || data[i][k]);
          }
        }
        return temArr
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
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {
      //当前组件引入的子组件
    }
  }

</script>
