<!----------------------------------
****--调查报告
****--@role     实习生、研究生、住院医、进修生
****--@date     2017/7/9
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <div id="myTable"
         ref="myTable" :style="{height:dynamicHt+'px'}" style="overflow: auto">
    <div style="font-size: 22px;text-align: center" v-if="what==''">
      加载中
    </div>
    <el-form v-else-if="what=='view'"  :model="formValidate" ref="formValidate"  class="demo-form-inline" label-width="120px" >
      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="填写人:" prop="diseaseName">
            {{formValidate.userName}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="填写时间:" prop="diseaseName">
            {{formValidate.createTime}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="报告经验与总结:" prop="diseaseName">
              <viewUEditor :name="'ud2'" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row>
        <el-col :span="20" :offset="2">
          <el-table
            v-if="tableData!=0"
            align="center"
            :max-height="250"
            :data="tableData"
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;height: 100%">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="100">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="createTime"
              label="审核时间">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="reviewMess"
              label="审核意见">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="spState"
              label="审核状态">
              <template scope="scope">
                {{scope.row.spState | typeText}}
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="10" :offset="4">
          <div style="margin-left: 100px">
            <el-button v-if="formValidate.state!='SUBMIT' && formValidate.state!='PASS'"  @click="edit">修改</el-button>
            <el-button  v-if="formValidate.state!='SUBMIT' && formValidate.state!='PASS' "   @click="reported">上报</el-button>
          </div>
        </el-col>
      </el-row >
    </el-form>
    <add :url="url"  @add="subCallback" v-else-if="what=='add'"></add>
    <edit :url="url" :operailityData="formValidate" @edit="subCallback" v-else-if="what=='edit'"></edit>
    <!--上报弹窗-->
    <Modal
      close-on-click-modal="false"
      v-model="reportedModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="reportedId"></modal-header>
      <operate v-if="reportedModal" :type="'reported'" :operateUrl="url.medicalEthicsModifySubmit"   @operate="subCallback" @cancel="cancel" :operaility-data="[formValidate]"></operate>
      <div slot="footer"></div>
    </Modal>
    <!---->
  </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import viewUEditor from '../../../common/showUeditor.vue';
  /*当前组件必要引入*/
  import url from '../api'
  /*当前组件必要引入*/
  import add from './surveyReportWrite_add.vue';
  import edit from './surveyReportWrite_edit.vue';
  //当前组件引入全局的util
  let Util = null;
  export default{
    data() {
      return {
        url,
        what:"",
        UE:{},
        ueditorVal:{
          ud2:"",
        },  //
        ueditorConfig:{
          //详细配置参考UEditor 官网api
          initialFrameHeight:220,  //初始化编辑器高度,默认320
        },
        formValidate:{
//          "id":11,
//          "userName":"张三",
//          "state":"SUBMIT",
//          "createTime":"2017-01-01 10:20:08",
//          "content":"12312312312312312123",
//          "reviewMess":[
//            {
//              "reviewId":111,
//              "spState":"PASS",
//              "reviewMess":"审批意见",
//              "createTime":"2014-05-06",
//              "createUserName":"张三"
//            }
//          ]
        },
        reportedModal:false,
        dynamicHt:'',
        reportedId : {id:'reportedId',title:'上报'},
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:url.medicalEthicsGet,
          }
        }
      }
    },
    methods:{
      SuccessGetCurrData(res) {
        let data = res.data;
        if (!data){
          this.what = 'add';
          return;
        }

        this.ueditorVal.ud2 = data.content;
        this.formValidate = data;
        if(data.id){
          this.what = 'view';
        }else {
          this.what = 'add';
        }
        if(data.reviewMess){
          this.tableData = data.reviewMess
        }
      },

      //上报
      reported(data){
        this.operailityData = data;
        this.reportedModal =  true;
      },

      subCallback(target,title,updata){
        this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.setTableData();
        }
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
      },

      edit(){
        this.what = 'edit';
      },

      setTableData(){
        this.ajax(this.listMessTitle)
      },


      /**
       *
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       *
       * @param val  {string}  编辑器的内容
       *
       */
      getUeditorVal(name,val){
        this.ueditorVal[name] = val;

      },

      //保存 改变url
      save(isLoadingFun){
        this.addMessTitle.ajaxParams.url = this.url.thematicReviewAdd;
        this.listenSubEvent(isLoadingFun);
      },

      //保存上报 改变url
      saveReportedEvent(isLoadingFun){
        this.addMessTitle.ajaxParams.url = this.url.thematicReviewAddSubmit;
        this.listenSubEvent(isLoadingFun);
      },

      /**
       *
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       *
       * @param editor {}      编辑器的对象
       *
       */
      storeUE(name,editor){
        this.UE[name] = editor;
        editor.setDisabled()
      },

      setMyVal(name,v){
        this.UE[name].setContent(v);
      },


      //设置表格及分页的位置
      setTableDynHeight(){
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

    },
    created(){
      this.setTableData();
    },
    mounted(){
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })

    },
    components: {
      add,edit,viewUEditor
    }
  }
</script>

