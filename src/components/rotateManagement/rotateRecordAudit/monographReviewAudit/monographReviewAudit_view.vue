<template>

  <div>
    <el-form   :model="formValidate" ref="formValidate"  class="demo-form-inline" label-width="100px" >
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
        <el-col :span="18" :offset="2">
          <el-form-item label="专题综述:" prop="diseaseName">
            <viewUEditor v-if="isShow" style="width: 700px;" :name="'ud2'" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>
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
    </el-form>



  </div>
</template>
<script>
  import viewUEditor from '../../../common/showUeditor.vue';
  //当前组件引入全局的util
  let Util=null;
  export default {
    props:['operailityData','url'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
//          "id":111,
//          "depName":"科室",
//          "createUserName":"名称",
//          "createTime":"2014-01-01 10:10:10",
//          "clinicalName":"病名",
//          "clinicalType":"WATCH",
//          "clinicalTime":"2016-01-01",
//          "note":"备注说明",
//          "teacherName":"指导老师",
//          "state":"NO_SUBMIT"
        },

        isShow:false,

        UE:{},
        ueditorVal:{
          ud2:"",
        },  //
        ueditorConfig:{
          //详细配置参考UEditor 官网api
          initialFrameHeight:220,  //初始化编辑器高度,默认320
        },

        tableData:[],
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url:this.url.thematicReviewGetId+this.operailityData.id, //向后台请求数据的地址

          }
        },
        optionData:[]
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      this.init()
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{

      updateListData(res) {
        let data = res.data;
        if (!data) return;
        this.ueditorVal.ud2 = data.content;
        this.formValidate = data;
        this.isShow = true;
        if(data.reviewMess){
          this.tableData = data.reviewMess
        }

      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.addMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //请求科室数据
        this.ajax(this.listMessTitle)
      },

      podIdChange(){



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
        editor.setDisabled();
        if(this.formValidate.content){
          this.ueditorVal.ud2 = this.formValidate.content;
        }
      },

      setMyVal(name,v){
        this.UE[name].setContent(v);
      }


    },
    components:{
      //当前组件引入的子组件
      viewUEditor
    },
  }
</script>

