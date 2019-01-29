<!----------------------------------
****--以人员角度查看(autoArrangeByUser_list.vue)
****--@date     2017/7/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <!-- <div>
     <el-table
       v-if="tableData.tbody.length>0"
       :data="tableData.tbody"
       border
       :height="params.dynamicHt+40"
       style="width: 100%;height: 100%">
       <el-table-column
         v-for="(item,idx) in tableData.thead"
         :key="idx"
         :fixed="idx<3?true:false"
         :prop="item.prop"
         :label="item.label"
         :width="idx<3?wdt[idx]:otherWdt">
       </el-table-column>
     </el-table>
     <div v-else style="text-align: center;font-size: 20px;padding: 50px;">
       <p>{{mess}}</p>
     </div>
   </div>-->
  <div>
    <myHandsontable style="width: 100%" class="autoArrangeByUser" :height="dynamicWt" v-if="tableData.tbody.length>0"
                    :handsontableOptions="handsontableOptions"
                    :body="tableData.tbody"></myHandsontable>
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
        wdt: [120, 120, 120],
        otherWdt: 120,
        tableData: {'thead': [], 'tbody': []},
        //当前组件默认请求(list)数据时,ajax处理的 按人展示列表
        listMessByUserTitle: {
          ajaxSuccess: 'updateListDataByUser',
          ajaxParams: {
            url: (this.url ? this.url : api).rotaryListByUser.path,
            params: Object.assign({
              userName: '',
              schoolName: '',
              year: '',
              rtState: '',
            }, this.params)
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.ajax(this.listMessByUserTitle);
        /*let mydata = {
          "times":[
            {
              "beginTime":"2017-01-01",
              "endTime":"2017-01-15"
            },
            {
              "beginTime":"2017-01-01",
              "endTime":"2017-01-15"
            }
          ],
          "userInfo":[
            {
              "userId":111,
              "userName":"呼吸内科",
              "specialty":"专业",
              "highestEdu":"学历"
            }
          ],
          "rotaryData":[
            {
              "userId":111,
              "depName":"科室",
              "beginTime":"2017-01-01",
              "endTime":"2017-01-15"
            },
            {
              "userId":111,
              "depName":"科室",
              "beginTime":"2017-01-16",
              "endTime":"2017-01-31"
            },
            {
              "userId":112,
              "depName":"科室2",
              "beginTime":"2017-01-16",
              "endTime":"2017-01-31"
            }
          ]
        }

        this.formatTableData(mydata);*/

      },

      updateListDataByUser (responseData) {
        let data = responseData.data;
        this.formatTableData(data);
      },

      //格式化排班表数据
      formatTableData (data) {
        //this.tableData.thead  this.tableData.tbody
        let fixedInfo = [{'prop': 'userName', 'label': '姓名'}, {
          'prop': 'schoolName',
          'label': '学校'
        }, {'prop': 'specialty', 'label': '培训方向'}]
        let thead = [];
        let tbody = [];
        let tempArr = [];
        for (var i = 0, item; i < data["times"].length; i++) {
          item = data['times'][i];
          tempArr.push({
            'prop': item['beginTime'] + item['endTime'],
            'label': item['beginTime'] + '~' + item['endTime'],
          })
        }
        thead = fixedInfo.concat(tempArr);
        /*for(var i=0,item;i<data["rotaryData"].length;i++){
         item = data["rotaryData"][i];
         bodyRight[item["beginTime"]+item["endTime"]+item["userId"]] = item;
         }*/
        for (var i = 0, item; i < data["userInfo"].length; i++) {
          item = data['userInfo'][i];
          for (var k = 0, subItem; k < data["rotaryData"].length; k++) {
            subItem = data['rotaryData'][k];
            if (item['userId'] == subItem['userId']) {
              item[subItem['beginTime'] + subItem['endTime']] = subItem['depName'];
            }
          }
        }
        tbody = data['userInfo'];
        this.tableData = {'thead': [], 'tbody': []};
//        this.tableData.thead = thead;
        this.tableData.tbody = tbody;
//        if (this.tableData.thead.length * this.otherWdt < this.params.dynamicWt) {
//          this.otherWdt = '';
//        }
//        this.tableData.thead

        let columns = []
        let colHeaders = []
        thead.map((item) => {
          columns.push({
            data: item.prop
          })
          colHeaders.push(item.label)
        })
        let that = this;
        this.handsontableOptions = {
          rowHeaders: true,    //显示列头
          colHeaders,
          columns,
//          rowHeaderWidth:120,
          widths: 120,
//          colWidths: 160,
          rowWidths: 120,
          autoColumnSize: true,//自适应列大小
          stretchH: 'last',//延伸列的宽度 last/all/none //last:延伸最后一列,all:延伸所有列,none默认不延伸。
          fixedRowsTop: 0,   //固定表头
          fixedColumnsLeft: 3,//固定左侧
          cells: function (row, col, prop) {
            if (col < 3) {
              let cellProperties = {};
              cellProperties.renderer = that.setLeftRender;//调用自定义渲染方法（背景）
              return cellProperties
            }
          }
        }

        if (this.tableData.tbody.length == 0) {
          this.mess = '没有查到相关轮转安排!';
        }
      },
      //设置左侧固定的样式
      setLeftRender (instance, td, row, col, prop, value, cellProperties) {
        td.className += ' autoArrangeByUser-left'
        td.innerText = value
      },

    },
    watch: {
      params (val) {
        if (val) {
          val = this.formDate(Util._.defaultsDeep({}, val), ['year'], 'yyyy');
        }
        let option = Util._.defaultsDeep({}, this.listMessByUserTitle);
        option.ajaxParams.params = Object.assign(option.ajaxParams.params, val);
        this.ajax(option);
      }
    },
    created () {
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
  .autoArrangeByUser .autoArrangeByUser-left {
    background-color: #f9f9f9;
    color: #565656;
    text-align: center;
    vertical-align: middle;
    font-weight: bold;
  }

</style>
