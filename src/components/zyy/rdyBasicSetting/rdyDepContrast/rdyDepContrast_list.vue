<!----------------------------------
****--科室对照(rdyDepContrast_list)
****--@date     2017/7/21
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div id="content" ref="content" class="modal rdyDepContrast">
    <div class="listUpAreaBox" v-if="isShowRt==0">
      <div class="listUpArea-menus">
        <div class="add-remove">
          <el-row>
            <el-col style="width: 125px;">
              <div class="cal-schoolTit" style="text-align: right;">选择培训标准：</div>
            </el-col>
            <el-col style="width: 200px;">
              <el-select v-model="sltedRtId" placeholder="请选择活动区域">
                <el-option v-for="item in rtOptions" :key="item.rtId" :label="item.rtName"
                           :value="item.rtId"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <br v-if="isShowRt==0"/>
    <div
      id="myTable"
      ref="myTable"
    >
      <el-table
        ref="multipleTable"
        align="center"
        v-if="showTable"
        :context="self"
        :data="tableData1"
        tooltip-effect="dark"
        highlight-current-row
        :height="dynamicHt"
        border
        :row-class-name="rowClass"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          prop="index"
          width="75">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="cdepName"
          label="标准科室"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="ts"
          label="周期"
          class-name="ts "
          width="70">
          <template scope="scope">
            {{!scope.row.isRandomRotaryDep || scope.row.hasValue ? scope.row.ts + '月' : ''}}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          align="center"
          width="120">
          <template scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="edit(scope.$index, scope.row)">配置
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          label="实际院内科室"
          align="center"
          width="280"
          class-name="clearPadding">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.hospitalDep">
              <div :class="{'div-noborder':scope.row.hospitalDep.length-1==index&&item.hospitalDeps.length-1==subIndex}"
                   class="div-border" v-for="(subItem, subIndex) in item.hospitalDeps">
                {{subItem.hospitalDepName}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="规则"
          align="center"
          class-name="clearPadding"
          width="150">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.hospitalDep">
              <div v-if="item.deType==0">
                <div class="div-border" :class="{'div-noborder':scope.row.hospitalDep.length-1==index}"
                     v-for="(subItem, subIndex) in item.hospitalDeps">
                  固定
                </div>
              </div>
              <div class="div-border" :class="{'div-noborder':scope.row.hospitalDep.length-1==index}"
                   :style="'height:'+item.hospitalDeps.length*45+'px;line-height:'+item.hospitalDeps.length*45+'px'"
                   v-else>任选其{{item.depRandomNum}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalChTs"
          label="3年时间"
          align="center"
          class-name="clearPadding"
          width="120">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.hospitalDep">
              <div v-if="item.deType==0">
                <div class="div-border" :class="{'div-noborder':scope.row.hospitalDep.length-1==index}"
                     v-for="(subItem, subIndex) in item.hospitalDeps">
                  {{subItem.chTs}}月
                </div>
              </div>
              <div class="div-border" :class="{'div-noborder':scope.row.hospitalDep.length-1==index}"
                   :style="'height:'+item.hospitalDeps.length*45+'px;line-height:'+item.hospitalDeps.length*45+'px'"
                   v-else>{{item.hospitalDeps[0].chTs}}月
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalCh2Ts"
          label="2年时间"
          align="center"
          class-name="clearPadding"
          width="120">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.hospitalDep">
              <div v-if="item.deType==0">
                <div class="div-border" :class="{'div-noborder':scope.row.hospitalDep.length-1==index}"
                     v-for="(subItem, subIndex) in item.hospitalDeps">
                  {{subItem.ch2Ts}}月
                </div>
              </div>
              <div class="div-border" :class="{'div-noborder':scope.row.hospitalDep.length-1==index}"
                   :style="'height:'+item.hospitalDeps.length*45+'px;line-height:'+item.hospitalDeps.length*45+'px'"
                   v-else>{{item.hospitalDeps[0].ch2Ts}}月
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalCh1Ts"
          label="1年时间"
          align="center"
          class-name="clearPadding"
          width="120">
          <template scope="scope">
            <div v-for="(item, index) in scope.row.hospitalDep">
              <div v-if="item.deType==0">
                <div class="div-border" :class="{'div-noborder':scope.row.hospitalDep.length-1==index}"
                     v-for="(subItem, subIndex) in item.hospitalDeps">
                  {{subItem.ch1Ts}}月
                </div>
              </div>
              <div class="div-border" :class="{'div-noborder':scope.row.hospitalDep.length-1==index}"
                   :style="'height:'+item.hospitalDeps.length*45+'px;line-height:'+item.hospitalDeps.length*45+'px'"
                   v-else>{{item.hospitalDeps[0].ch1Ts}}月
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--配置弹窗-->
      <Modal
        :mask-closable="false"
        v-model="editModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="960">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="editId"></modal-header>
        <setDepList v-if="editModal" @cancel="cancel" @add="subCallback"
                    :editOperailityData="editOperailityData"></setDepList>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js";
  import setDepList from "./setDepList.vue";
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      rtModelType: {   //各个生源类型判断ZYY(住院医)、YJS(研究生)、JXS(进修生)
        type: String,
        default: 'ZYY',
      },
      isShowRt: {
        type: Number,
        default: 0
      },
      isRefresh: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        formValidate: {
          depName: "",
        },
        showTable: true,

        //存储选择的培训细则
        sltedRtId: this.isShowRt,
        rtOptions: [],

        /*--按钮button--*/
        editId: {
          id: 'edit',
          title: '配置院内科室与标准科室对应关系'
        },

        //表格数据
        editOperailityData: '',
        dynamicHt: 100,
        self: this,
        tableData1: [
//          {"status":{"code":"0","msg":""},"data":[{"depPhaseNum":1,"depPhase":"第一阶段","mustRotaryDep":[{"rdId":2097,"cdepId":1,"cdepName":"心血管内科","depType":"Y","ts":1.0,"depRandomNum":null,"hospitalDep":[{"hgId":536,"rdId":2097,"hgGroup":0,"deType":0,"depRandomNum":1,"depIsCou":0,"chTs":1.0,"ch2Ts":1.0,"ch1Ts":1.0,"hospitalDeps":[{"hospitalDepId":117,"hospitalDepName":"普通外科","chTs":0.5,"ch2Ts":0.5,"ch1Ts":0.5,"chId":null}]}]},{"rdId":2098,"cdepId":2,"cdepName":"呼吸内科","depType":"Y","ts":1.0,"depRandomNum":null,"hospitalDep":null},{"rdId":2099,"cdepId":4,"cdepName":"血液内科","depType":"Y","ts":1.0,"depRandomNum":null,"hospitalDep":null}],"randomRotaryDep":[{"rdId":2100,"cdepId":8,"cdepName":"感染科","depType":"N","ts":1.0,"depRandomNum":2,"hospitalDep":null},{"rdId":2101,"cdepId":9,"cdepName":"神经内科","depType":"N","ts":1.0,"depRandomNum":2,"hospitalDep":null},{"rdId":2102,"cdepId":10,"cdepName":"急诊科","depType":"N","ts":1.0,"depRandomNum":2,"hospitalDep":null},{"rdId":2103,"cdepId":11,"cdepName":"重症监护病房","depType":"N","ts":1.0,"depRandomNum":2,"hospitalDep":null},{"rdId":2104,"cdepId":12,"cdepName":"儿童保健","depType":"N","ts":1.0,"depRandomNum":2,"hospitalDep":null},{"rdId":2105,"cdepId":13,"cdepName":"重症监护室(ICU)","depType":"N","ts":1.0,"depRandomNum":2,"hospitalDep":null}]}]}
        ],
        loading: false,
        listTotal: 0,

        //获取培训细则options rulesgetList
        getRtOptionsTitle: {
          ajaxSuccess: 'getRtOptions',
          ajaxParams: {
            url: api.rulesgetList.path,
            params: {
              rtProclass: '', rtModelType: this.rtModelType,
            }
          }
        },

        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.getRulesDepContrastTable.path,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        if (this.isShowRt == 0) {
          this.ajax(this.getRtOptionsTitle);
        } else {
          this.setTableData();
        }
//      this.initFormateData();
      },

      getRtOptions(responseData) {
        let data = responseData.data;
        this.rtOptions = [];
        this.rtOptions = data;
        this.setInitRtId(this.rtOptions);
      },

      /**
       * 设置默认选择的细则
       * @param options {[]}  细则的option
       * */
      setInitRtId(options) {
        if (options.length > 0) {
          this.sltedRtId = options[0]["rtId"] || "";
        } else {
          this.sltedRtId = "";
          return;
        }
      },

      //格式化表格下面的统计
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        console.log(data);
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计:';
            return;
          }
          if (index === 1) {
            sums[index] = '标准科室';
            return;
          }
          if (index === 3) {
            sums[index] = ' ';
            return;
          }
          if (index === 4) {
            sums[index] = '院内科室';
            return;
          }
          const values = data.map(item => {
            if (column.property === 'ts' && item.noBorder) return 0;
            return Number(item[column.property]);
          });
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (index === 6) {
                console.log(prev, curr);
              }
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '月';
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },

      //格式化server传输过来的数据
      initFormateData(data) {
        /*data = [
          {
            "depPhaseNum":1,
            "depPhase":"第一阶段",
            "mustRotaryDep":[
              {
                "rdId":11,
                "cdepId":11,
                "cdepName":"神经内科",
                "depType":"安排类型(N/1任选 Y/0必须轮转)",
                "ts":2,
                "depRandomNum":0,
                "hospitalDep":[
                ]
              }
            ],
            "randomRotaryDep":[
              {
                "rdId":22,
                "cdepId":22,
                "cdepName":"内科",
                "depType":"安排类型(N任选 Y必须轮转)",
                "ts":12,
                "depRandomNum":0,
                "hospitalDep":[
                  {
                    "hgId":"组主键ID",
                    "hgGroup":"组号",
                    "deType":0,
                    "depRandomNum":0,
                    "depIsCou":"是否按顺序(1不按顺序 0不按顺序)",
                    "chTs":3,
                    "ch2Ts":2,
                    "ch1Ts":1,
                    "hospitalDeps":[
                      {
                        "hospitalDepId":1,
                        "hospitalDepName":"院内科室名称",
                        "chTs":3,
                        "ch2Ts":2,
                        "ch1Ts":1
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]*/

        let tempArr = [];
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          tempArr = tempArr.concat(item["mustRotaryDep"]);
          let length = item["randomRotaryDep"].length - 1;
          item["randomRotaryDep"].map((obj, index) => {
            obj.isRandomRotaryDep = true;//是可选科室
            if (index !== length) {
              obj.noBorder = true;//可选科室样式设置
            }
            if (parseInt(length / 2) === index) {
              obj.hasValue = true;//可以显示出来值
            }
          })
          tempArr = tempArr.concat(item["randomRotaryDep"]);
        }

        //设置院内周期统计
        for (var i = 0, item, totalChTs, totalCh2Ts, totalCh1Ts; i < tempArr.length; i++) {

          item = tempArr[i];
          totalChTs = totalCh2Ts = totalCh1Ts = 0;
          if (item["hospitalDep"] === null) {
            item["hospitalDep"] = [];
          }
          for (var k = 0, subItem; k < item["hospitalDep"].length; k++) {
            subItem = item["hospitalDep"][k];
            if (subItem["hospitalDeps"] === null) {
              subItem["hospitalDeps"] = [];
            }
            if (item["depRandomNum"] === null) {
              item["depRandomNum"] = 0;
            }
            if (subItem.deType == 0) {
              for (var j = 0, ssItem; j < subItem["hospitalDeps"].length; j++) {
                ssItem = subItem["hospitalDeps"][j];
                if (ssItem["depRandomNum"] === null) {
                  ssItem["depRandomNum"] = 0;
                }
                totalChTs += Number(ssItem["chTs"]);
                totalCh2Ts += Number(ssItem["ch2Ts"]);
                totalCh1Ts += Number(ssItem["ch1Ts"]);
              }
            } else {
              totalChTs += Number(subItem["hospitalDeps"][0]["chTs"]);
              totalCh2Ts += Number(subItem["hospitalDeps"][0]["ch2Ts"]);
              totalCh1Ts += Number(subItem["hospitalDeps"][0]["ch1Ts"]);
            }
          }
          item["totalChTs"] = totalChTs;
          item["totalCh2Ts"] = totalCh2Ts;
          item["totalCh1Ts"] = totalCh1Ts;
        }

        if (this.tableData1 == 0) {
          this.showTable = false;//重新刷新
          this.$nextTick(() => {
            this.showTable = true;
            this.tableData1 = tempArr;
          })
        } else {
          this.tableData1 = tempArr;
        }
      },

      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        this.initFormateData(data);
      },

      setTableData() {
        //this.setAjaxParams();
        let option = Util._.defaultsDeep({}, this.listMessTitle);
        if (this.isShowRt != 0) {
          option.ajaxParams.url += this.isShowRt;
        } else {
          option.ajaxParams.url += this.sltedRtId;
        }
        if (this.isShowRt != "" || this.sltedRtId != "") {
          this.ajax(option);
        }
      },

      //设置提交的参数
      setAjaxParams() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, this.formValidate);
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        this.setTableData();
      },

      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(index, row) {
        if (typeof index == 'undefined') {
          if (!this.isSelected(true)) return;
          this.editOperailityData = {rtId: this.sltedRtId, rdId: row["rdId"]};
          this.openModel('edit')
        } else {
          this.editOperailityData = {rtId: this.sltedRtId, rdId: row["rdId"]};
          this.openModel('edit')
        }
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 20;
        if (this.isShowRt != 0) {
          paginationHt = 0;
        }
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
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
      subCallback(target, title, updata) {
        /*this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.setTableData();
        }*/
        this.setTableData();
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },

      rowClass(row, index) {
        if (row.noBorder) return 'noBorder';
      }

    },
    watch: {
      sltedRtId() {
        this.setTableData();
      },
      isRefresh() {
        this.setTableData();
      }
    },
    created() {
      Util = this.$util;

    },
    mounted() {
      this.init();

      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })

    },
    components: {
      setDepList
    }
  }
</script>
<style lang="scss">
  .rdyDepContrast .noBorder .ts {
    border-bottom: none;
  }
</style>
