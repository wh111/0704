<!----------------------------------
****--以科室角度查看(autoArrangeByDep_list)
****--@date     2017/7/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <!--<div>
    <el-table
      v-if="tableData.tbody.length>0"
      :data="tableData.tbody"
      border
      align="center"
      :height="params.dynamicHt+40"
      style="width: 100%;height: 100%">
      <el-table-column
        v-for="(item,idx) in tableData.thead"
        :key="idx"
        :fixed="idx<1?true:false"
        :prop="item.prop"
        :label="item.weekName"
        align="center"
        :class-name="''"
        :width="idx<1?wdt[idx]:tableData.thead.length>5?otherWdt:''">
        <el-table-column
          :key="idx"
          :fixed="idx<1?true:false"
          :prop="item.prop"
          :class-name="item.isHead=='true'&&idx==0?'tabBiasLine':''"
          :label="item.label"
          align="center"
          :width="idx<1?wdt[idx]:tableData.thead.length>5?otherWdt:''"
          :render-header="handleRenderHeader"
        >
          <template scope="scope">
            <div v-if="idx>0">
              <div v-html="formatUserName(scope.row[item.prop])"></div>
            </div>
            <div v-else>
              {{scope.row[item.prop]}}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div v-else style="text-align: center;font-size: 20px;padding: 50px;">
      <p>{{mess}}</p>
    </div>
  </div>-->
  <!---->
  <div>
    <myHandsontable style="width: 100%" class="autoArrangeByDep" :height="dynamicWt" v-if="tableData.tbody.length>0"
                    :handsontableOptions="handsontableOptions"
                    @hot="setHot" :body="tableData.tbody"></myHandsontable>
    <div v-else style="text-align: center;font-size: 20px;padding: 50px;">
      <p>{{mess}}</p>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import myHandsontable from '../../../common/myHandsontable.vue'

  import api from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['params', 'url', 'dynamicWt'],
    data () {
      return {
        handsontableOptions: {},
        mess: '数据加载中!',
        wdt: [120],
        otherWdt: 120,
        tableData: {'thead': [], 'tbody': []},
        //当前组件默认请求(list)数据时,ajax处理的 按部门展示列表
        listMessByDepTitle: {
          ajaxSuccess: 'updateListDataByDep',
          ajaxParams: {
            url: (this.url ? this.url : api).rotaryListByDep.path,
            params: Object.assign({
              userName: '',
              schoolName: '',
              year: '',
              rtState: '',
            }, this.params)
          }
        },
        hot: {},
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.ajax(this.listMessByDepTitle);
        /*let mydata = {
          "times":[
            {
              "beginTime":"2017-01-01",
              "endTime":"2017-01-15"
            },
            {
              "beginTime":"2017-01-16",
              "endTime":"2017-01-31"
            },
            {
              "beginTime":"2017-02-01",
              "endTime":"2017-02-15"
            }
          ],
          "deps":[
            {
              "depId":111,
              "depName":"呼吸内科"
            },
            {
              "depId":112,
              "depName":"消化内科"
            },
            {
              "depId":113,
              "depName":"肾内科"
            }
          ],
          "rotaryData":[
            {
              "userName":"张三",
              "beginTime":"2017-01-01",
              "endTime":"2017-01-15",
              "depId":111
            },
            {
              "userName":"张三",
              "beginTime":"2017-01-16",
              "endTime":"2017-01-31",
              "depId":112
            },
            {
              "userName":"李四",
              "beginTime":"2017-02-01",
              "endTime":"2017-02-15",
              "depId":113
            }
          ]
        }

        this.formatTableData(mydata)*/

      },

      updateListDataByDep (responseData) {
        this.tableData.tbody = [];
        //页面dom稳定后调用
        this.$nextTick(() => {
          let data = responseData.data;
          this.formatTableData(data);
        })

      },

      //格式化人员展示
      formatUserName (data) {
        let users = '';
        if (typeof data != 'undefined') {
          data = data + '';
          let tempArr = data.split('##');
          for (var i = 0, item; i < tempArr.length; i++) {
            item = tempArr[i];
            users += '<div style=\'padding: 3px 0;\'>' + item + '</div>';
          }
        }
        return users;
      },

      //格式化排班表数据
      formatTableData (data) {
        //this.tableData.thead  this.tableData.tbody
        let fixedInfo = [{'prop': 'depName', 'label': '科室', 'weekName': '周序', 'isHead': 'true'}]
        let thead = [];
        let tbody = [];
        let tempArr = [];
        for (var i = 0, item; i < data["times"].length; i++) {
          item = data['times'][i];
          tempArr.push({
            'prop': item['beginTime'] + item['endTime'],
            'label': item['beginTime'] + '~' + item['endTime'],
            'weekName': (i + 1) + '',
            'isHead': 'false',
          })
        }
        thead = fixedInfo.concat(tempArr);
        /*for(var i=0,item;i<data["rotaryData"].length;i++){
         item = data["rotaryData"][i];
         bodyRight[item["beginTime"]+item["endTime"]+item["userId"]] = item;
         }*/
        for (var i = 0, item; i < data["deps"].length; i++) {
          item = data['deps'][i];
          for (var k = 0, subItem; k < data["rotaryData"].length; k++) {
            subItem = data['rotaryData'][k];
            if (item['depId'] == subItem['depId']) {
              if (typeof item[subItem['beginTime'] + subItem['endTime']] == 'undefined') {
                item[subItem['beginTime'] + subItem['endTime']] = subItem['userName'];
              } else {
                item[subItem['beginTime'] + subItem['endTime']] += ' 、' + subItem['userName'];
              }
            }
          }
        }
        tbody = data['deps'];
//        this.tableData = {'thead': [], 'tbody': []};
//        this.tableData.thead = thead;
        let columns = []
        let colHeaders = []
        let headBody = []
        let first = {}//第一行
        let second = {}//第二行
        if (tbody.length !== 0) {
          thead.map((item, index) => {
            if (index === 0) {
              first['depName'] = '周序'
              second['depName'] = '科室'
            } else {
              first[item.prop] = index;
              second[item.prop] = item.label;
            }
            columns.push({
              data: item.prop
            })
          })
          tbody = [first, second].concat(tbody)
        } else {
          this.mess = '没查到相关的轮转安排!';
          this.tableData.tbody = []
          return;
        }
        this.tableData.tbody = tbody;

        let that = this;
        this.handsontableOptions = {
          rowHeaders: false,    //显示列头
          colHeaders: false,
          columns,
          colWidths: 160,
          fixedRowsTop: 2,   //固定表头
          fixedColumnsLeft: 1,//固定左侧
          stretchH: 'last',//延伸列的宽度 last/all/none //last:延伸最后一列,all:延伸所有列,none默认不延伸。
          cells: function (row, col, prop) {
            let cellProperties = {};
            if (row === 1 && col === 0) {
              cellProperties.renderer = that.tabBiasLine;//调用自定义渲染方法(斜线)
              return cellProperties
            } else if (row < 2) {
              cellProperties.renderer = that.setHeaderRender;//调用自定义渲染方法（背景）
              return cellProperties
            } else if (col < 1) {
              cellProperties.renderer = that.setLeftRender;//调用自定义渲染方法（背景）
              return cellProperties
            }
          }
        }
      },

      //设置斜线
      tabBiasLine (instance, td, row, col, prop, value, cellProperties) {
//        this.hot.renderers.TextRenderer.apply(null, arguments);
        if (col === 0) {
          td.className += 'autoArrangeByDep-tabBiasLine autoArrangeByDep-header'
          td.innerHTML = '<div style=\'text-align: right;float: right;margin-right: 25px\'>时间</div><div style=\'padding: 0;float: left;margin-top: 10px;margin-left: 25px\'>科室</div>';
        } else {
          td.innerText = value
        }
      },

      //设置头部样式
      setHeaderRender (instance, td, row, col, prop, value, cellProperties) {
        td.className += ' autoArrangeByDep-header'
        td.innerText = value
      },
      //设置左侧固定的样式
      setLeftRender (instance, td, row, col, prop, value, cellProperties) {
        td.className += ' autoArrangeByDep-left'
        td.innerText = value
      },
      //格式化表头显示
      handleRenderHeader (h, {column, $index}) {
        let label = column.label;
        if ($index == 0) {
          let htlFirst = h('div');
          htlFirst.text = 'temp';
          setTimeout(() => {
            let elmFirst = htlFirst['elm'];
            elmFirst.innerHTML = '<div style=\'text-align: right;float: right;\'>时间</div><div style=\'padding: 0;float: left;margin-top: 10px;\'>科室</div>';
          }, 10)

          label = htlFirst;
        }
        return label;
      },

      setHot (hot) {
        this.hot = hot;
      },

    },
    watch: {
      params (val) {
        if (val) {
          val = this.formDate(Util._.defaultsDeep({}, val), ['year'], 'yyyy');
        }

        let option = Util._.defaultsDeep({}, this.listMessByDepTitle);
        option.ajaxParams.params = Object.assign(option.ajaxParams.params, val);
        this.ajax(option);
      }
    },
    created () {
      Util = this.$util;
      this.init();
    },
    mounted () {
    },
    components: {
      myHandsontable
    }
  }
</script>
<style>
  .autoArrangeByDep .autoArrangeByDep-header {
    background-color: #f3f3f3;
    color: #222;
    text-align: center;
    vertical-align: middle;
    font-weight: bold;
  }

  .autoArrangeByDep .autoArrangeByDep-left {
    background-color: #f9f9f9;
    color: #565656;
    text-align: center;
    vertical-align: middle;
    font-weight: bold;
  }

  .autoArrangeByDep .autoArrangeByDep-tabBiasLine :before {
    content: "";
    position: absolute;
    width: 1px;
    height: 161px;
    top: 30px;
    left: 0;
    background-color: #c6c8cd;

    display: block;
    -webkit-transform: rotate(-63deg);
    transform: rotate(-79deg);
    -webkit-transform-origin: top;
    transform-origin: top;
  }
</style>
