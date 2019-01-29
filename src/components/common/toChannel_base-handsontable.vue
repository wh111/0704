<template>
  <div>
    <div class="">
      <!--<el-table v-if="body[0]" :data="body" border @cell-click="cellClick" :max-height="500"-->
      <!--:row-class-name="tableRowClassName"-->
      <!--style="width: 100%">-->
      <!--<el-table-column type="index" label="序号" align="center" fixed width="80"></el-table-column>-->
      <!--&lt;!&ndash;<el-table-column&ndash;&gt;-->
      <!--&lt;!&ndash;label="操作"&ndash;&gt;-->
      <!--&lt;!&ndash;width="180">&ndash;&gt;-->
      <!--&lt;!&ndash;<template scope="scope">&ndash;&gt;-->
      <!--&lt;!&ndash;<el-button size="small" type="danger" @click="remove(scope.$index,scope.row)">删除</el-button>&ndash;&gt;-->
      <!--&lt;!&ndash;</template>&ndash;&gt;-->
      <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
      <!--<el-table-column v-for="(item,index) in header" :key="index" :prop="item.key" :label="item.label" align="center"-->
      <!--:min-width="180">-->
      <!--<template scope="scope">-->
      <!--<span v-if="!scope.row[item.key+'edit']">{{scope.row[item.key]}}</span>-->
      <!--<el-input v-else v-model="scope.row[item.key]"></el-input>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--</el-table>-->
      <div id="example" style="border: 1px solid #dfe6ec;"></div>
      <br>
      <el-table v-if="!unShowError&&error[0]" :max-height="300" :data="error" style="width: 100%">
        <el-table-column prop="seq" label="行数" align="center" width="200">
        </el-table-column>
        <el-table-column prop="errorMessage" label="错误提示">
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="10" :offset="10">
          <div style="margin-top: 20px">
            <load-btn @handleToChannel="confirm" :btnData="loadBtn"></load-btn>
            <el-button @click="cancel">取消</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  // 参考网站 https://docs.handsontable.com/0.35.0/tutorial-introduction.html （版本 0.35.0）
  import Handsontable from 'Handsontable';
  import 'handsontable/dist/handsontable.full.css'

  export default {

    /*title ：按钮文字
     *
     * format：格式化数据  把中文转换成英文
     *
     * 如 {
     //        "设备名称":"deviceTypeName",
     //        "设备编号":"deviceIdentifier",
     //        "单价":"price",
     //        "购买日期":"purchaseTime",
     //        "厂商电话":"manufacturerPhone",
     //        "维修电话":"servicingPhone",
     //        "所在位置":"storageLocation",
     //        "购买地址":"buyAdderss",
     //        "生产日期":"manufactureDate",
     //        "保修截止日期":"guaranteeDate",
     //        //"状态":"status",
     //        "描述":"describes"
     //      }
     *
     *
     * width :  单元格宽度
     * height :  最小高度
     *
     * ch2en 值中英文替换
     * 如 {
     *    sex:{ // 格式化数据中文对应的英文
     *      "男": "BOY", // 对应的中文会被替换成英文
     *      "女": "GIRL",
     *    }
     * }
     *
     * addData 附加值（该对象在提交的时候会追加在每一行数据之后）注：该对象会覆盖导入的数据
     * 如 {key:val}
     *
     * validate：验证
     * handsontableOptions {object} handsontable的其他属性
     * unFormat  不需要格式化 默认为空（需要格式化）
     * unSelfHeader  不需要自定义 布尔类型（默认false  表头为自定义 值为 ’性别‘ ’姓名‘ 表的第一列 ）
     * errorBefFun  处理接收到的错误信息
     * unShowError 不显示错误信息 默认为空 显示错误信息
     * */
    props: ['format', 'height', 'url', 'data', 'extra', 'id', 'date', 'deptId', 'treeRoad', 'ch2en', 'commitBefFun', 'addData', 'validate', 'handsontableOptions', 'unFormat', 'unSelfHeader','errorBefFun','unShowError'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn: {
          title: '确定',
          callParEvent: 'handleToChannel'
        },
        //        widths:'',
        body: [],
        header: [],
        formats: [],
        oldErrorList: [], //保存的是错误的行号
        row: this.rows || 0, //省略头部行数
        old: {
          oldRow: {}, //上一次点击的row
          oldKey: '', //上一次点击的key
        },
        tempArr: [], // 初始的时候临时body
        error: [],
        errorHeader: [{
          label: '行数',
          key: 'seq'
        },
          {
            label: '错误提示',
            key: 'errorMessage'
          }
        ],
        hot: '',

        //        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        //        toMessTitle:{
        //          type:'edit',
        //          successTitle:'导入成功',
        //          errorTitle:'导入失败,请修改',
        //          ajaxSuccess:'ajaxSuccess',
        //          ajaxParams:{
        //            jsonString:true,
        //            url:'/user/import/user',
        //            method:'post',
        //            data:[]
        //          }
        //        },

      }
    },
    created() {
      if (this.format) {
        this.formats = this.format
      }
      if (!this.url) {
        this.showMess('地址不能为空');
        return;
      }


    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
          let merges = [];
          if (this.data.merges) { //处理合并单元格的数据
            this.data.merges.map(item => {
              merges.push({ // item.s 开始的单元格  item.e结束的单元格
                row: this.unSelfHeader ? item.s.r : item.s.r - 1, //如果需要格式化，那就减去一行
                col: item.s.c,
                rowspan: item.e.r - item.s.r + 1,
                colspan: item.e.c - item.s.c + 1,
              })
            })
          }
          let container = document.getElementById('example');
//          columns: [  //验证   （或者其他单元格数据类型 请到文档 ‘Cell types’ 里面找）
//            {data: 'ip', validator: ipValidatorRegexp, allowInvalid: true},
//            {data: 'email', validator: emailValidator, allowInvalid: false},
//          {
//            type: 'autocomplete',  //从里面选择
//              source: ['BMW', 'Chrysler', 'Nissan', 'Suzuki', 'Toyota', 'Volvo'], 数据源
//            strict: false //是否是严格模式，严格模式就只允许从数据源里面选择
//          },
//          {
//            type: 'dropdown',  //可搜索的selecr
//              source: ['yellow', 'red', 'orange', 'green', 'blue', 'gray', 'black', 'white']
//          },
//          ]
          //其他属性是否有 columns（长度必须和导入的长度一样，一一对应）
          if (this.handsontableOptions) {
            if (this.handsontableOptions.columns) {
              if (this.handsontableOptions.columns.length < this.data.header.length) {
                this.handsontableOptions.columns.length = this.data.header.length
              }
            }
          }
          //是否需要自定义表头
          let data = {}
          if (this.unSelfHeader) {
            data.data = this.data.xlsxArr;
          } else {

            data.data = this.data.body;
            data.colHeaders = this.data.header;
          }
          //初始化 Handsontable
          let hot = new Handsontable(container, {
//          data: this.data.xlsxArr,
            height: 400,
            className: "htCenter htMiddle", //单元格样式， 宽度居中 ， 高度居中
            rowHeaders: true,    //显示列头
            colHeaders: true,   //显示表头
//          autoColumnSize:true,
            contextMenu: true, //开启菜单
            fillHandle: true, //可水平或者垂直拖动，创建新行 // possible values: true, false, "horizontal", "vertical"
//            fillHandle: {
//              direction: 'horizontal', //拖动方向 horizontal 水平，vertical 垂直
//              autoInsertRow: false,  //是否创建新航
//            },
            mergeCells: merges, //合并单元格
            wordWrap: false,
            fixedRowsTop: 0,   //固定表头
            fixedColumnsLeft: 0,//固定左侧
            manualColumnMove: false,//可拖动列
            manualRowMove: false,//可拖动行

            stretchH: 'all',//延伸列的宽度 last/all/none //last:延伸最后一列,all:延伸所有列,none默认不延伸。
            ...data,
            ...this.handsontableOptions,
          });
          this.hot = hot;

          //把当前创建的实例返回出去
          this.$emit('hot',hot)

        }
      )

    },
    methods: {
      /*  确定
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      confirm(isLoadingFun) {
        //        this.$emit('toChannel',this.body);   //发送body
        let that = this;
        let _data = '';
        let data =  _data = this.hot.getData();
        this.hot.validateCells((valid) => {
          if (!valid) {
            this.errorMess('数据错误，请重写');
            return;
          }
          if (this.unFormat) {

          } else {
            this.header = this.formatHeader(this.data.header);
            this.formatBody(data);
            data = this.body;
          }
          if (this.validate) { // 存在验证规则
            let errorData = this.validate(data, this.data.header) //如果返回的有值则有错误信息，没有会返回空；
            if (errorData) {
              that.conductError(errorData);
              return;
            }
          }
          //        this.tableModal = false;
          isLoadingFun(true);
          that.ajaxCreateLoading(true);
          data = this.$util._.defaultsDeep([], data);

          // 中英文值转换
          if (this.ch2en && this.ch2en instanceof Object) {
            data.map(item => {
              for (let key in this.ch2en) {
                // 只对有中英文的键值对进行转换
                this.ch2en[key][item[key]] && (item[key] = this.ch2en[key][item[key]])
              }
            })
          }

          // 附加值
          if (this.addData && this.addData instanceof Object) {
            data.map(item => Object.assign(item, this.addData))
          }

          //父页面的处理将要发送的data
          if (this.commitBefFun) {
            data = this.commitBefFun(data, this.data.header,this.header);
          }

          //处理服务数据
          let myPromise = that.$util.queryData({
            jsonString: true,
            url: (this.url),
            method: 'post',
            data,
          })();
          myPromise.then(function (res) {
            let responseData = res.data;
            let data = responseData.data
            if (that.$util._.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
              that.$emit('success', that.body);
              that.successMess('导入成功')
            } else if (that.$util._.isObject(responseData["status"]) && responseData["status"]["code"] == 11003) {
              that.errorMess("导师编号系统中不存在，请新建对应的账号或联系系统管理员！")
            }else if (that.$util._.isObject(responseData["status"]) && responseData["status"]["code"] == 52) {
              if(that.errorBefFun){
                data = that.errorBefFun(data,_data,that.body,that.data.header,that.header);
              }
              if(data){
                that.conductError(data);
              }
              that.errorMess('导入失败，请修改')
            } else {
              that.errorMess('系统错误')
            }
            isLoadingFun(false);
            that.ajaxCreateLoading(false);
          }).catch(function (response) {
            if (response instanceof Error) {
              // 意外发生在设置要求引发一个错误
              that.errorMess(response.message);
              isLoadingFun(false);
              that.ajaxCreateLoading(false);
            } else {
              that.errorMess(response.status + "错误!");
              isLoadingFun(false);
              that.ajaxCreateLoading(false);
            }
          })
        })

      },

      //处理错误
      conductError(data) {
        let error = [];
        for (let i = 0; i < data.length; i++) {
          //添加错误列表
          error.push({
            seq: data[i].seq + 1,
            errorMessage: data[i].errorMsgList.join(' , '),
          })
        }
        this.error = error
      },

      //双击打开输入框并获取焦点
      cellClick(row, col, obj, a) {
        let old = this.old;
        if (old.oldRow) {
          old.oldRow[old.oldKey + 'edit'] = false;
        }
        let key = col['property']; // 当前点击的key值
        row[key + 'edit'] = true;
        old.oldRow = row;
        old.oldKey = key;
      },

      //      //点击上传
      //      handleSelectedFile (convertedData) {
      //
      //        this.tableModal = true;
      //      },

      //格式化Header 把中文转换成英文
      formatHeader(data) {
        let format = this.formats;
        if (!format) {
          this.showMess('format未定义');
          return data;
        }
        let formats = [];
        let tempArr = [];
        for (let i = 0; i < data.length; i++) {
          tempArr.push({
            key: format[data[i]],
            label: data[i]
          })
          formats.push(format[data[i]])
        }
        this.formats = formats;
        return tempArr;
      },

      //格式化body 把中文转换成英文
      formatBody(data) {
        let format = this.formats;
        let treeId = this.id;
        let deptId = this.deptId;
        let treeRoad = this.treeRoad;
        if (!format) return data;
        let tempArr = [];
        for (let i = 0; i < data.length; i++) {
          let tempObj = {};
          for (let key in format) {
            if (typeof format[key] == 'function') continue;
            // tempObj[format[key]]  = data[i][key].replace(/(^\s*)|(\s*$)/g, "");
            tempObj[format[key]] = data[i][key];
            tempObj[format[key] + 'edit'] = false;
          }
          if (this.extra) {
            for (let k = 0; k < this.extra.length; k++) {
              tempObj[this.extra[i].key] = this.extra[i].label
            }
          }
          if (this.date) {
            for (let l = 0; l < this.date.length; l++) {
              if (tempObj[this.date[l]]) {
                tempObj[this.date[l]] = tempObj[this.date[l]].replace(/\//g, "-");
              }
            }
          }
          // tempObj.status='';
          if (treeId) tempObj.treeId = treeId;
          if (deptId) tempObj.depId = deptId;
          if (treeRoad) tempObj.treeRoad = treeRoad;
          tempObj.error = false;
          tempArr.push(tempObj);
        }
        this.tempArr = tempArr;
        // this.confirm(function(){})
        //分段添加数据
        let len = tempArr.length;
        let that = this;
        that.body = [];

//        for (let i = 0, n = 0; i < tempArr.length; i += 100, n++) {
//          setTimeout(() => {
//            that.body = that.body.concat(tempArr.splice(0, 100));
//          }, n * 10)
//        }
        that.body = tempArr;

        this.formats = this.format;
      },

      //取消弹窗
      cancel() {
        this.$emit('cancel')
      },

      remove(index, row) {
        this.body.splice(index, 1)
      },

      tableRowClassName(row, index) {
        if (row.error) {
          return 'positive-row'
        }
      },


      //处理读取的数据
      xlsxArrToTableArr(xlsxArr) {
        let tableArr = []
        let length = 0;
        let maxLength = 0;
        let maxLengthIndex = 0;
        xlsxArr.forEach((item, index) => {
          length = Object.keys(item).length;
          if (maxLength < length) {
            maxLength = length
            maxLengthIndex = index
          }
        })
        let tempheader = [];
        tempheader = xlsxArr[0];
        let tableHeader = Object.keys(xlsxArr[maxLengthIndex]);
        let rowItem = {}
        xlsxArr.forEach((item) => {
          rowItem = {}
          for (let i = 0; i < maxLength; i++) {
            rowItem[tableHeader[i]] = item[tableHeader[i]] || ''
          }
          tableArr.push(rowItem)
        })
        return {
          header: tempheader,
          data: tableArr,
        }
      },
      tableArrToXlsxArr({data, header}) {
        let xlsxArr = []
        let tempObj = {}
        data.forEach((rowItem) => {
          tempObj = {}
          rowItem.forEach((item, index) => {
            tempObj[header[index]] = item
          })
          xlsxArr.push(tempObj)
        })
        return xlsxArr
      },
      initTable({data, header}) {
//        data.splice(0,1);
        this.tableData.header = header;
        this.tableData.body = data;
        this.tableData.xlsxArr = this.xlsxArr;
        this.tableData.merges = this.xlsxArr['!merges'];
      },
    }
  }

</script>
