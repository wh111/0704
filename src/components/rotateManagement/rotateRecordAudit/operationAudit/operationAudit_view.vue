<template>

  <div>
    <el-form :model="formValidate" ref="formValidate"  class="demo-form-inline" label-width="100px">

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="科室名称:" prop="depName">
            {{formValidate.depName}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="手术名称:" prop="surgeryName">
            {{formValidate.surgeryName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="手术日期:" prop="surgeryTime">
            {{formValidate.surgeryTime}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="病人姓名:" prop="patientName">
            {{formValidate.patientName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="病历号:" prop="recordNo">
            {{formValidate.recordNo}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="术中职务:" prop="intraoperativePosition">
            {{formValidate.intraoperativePosition | opDuty}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="生源:" prop="podClass">
            {{formValidate.podClass | userType}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="状态:" prop="state">
            {{formValidate.state | typeText}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="创建人:" prop="createUserName">
            {{formValidate.createUserName}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间:" prop="createTime">
            {{formValidate.createTime}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="相关证明材料:" prop="createTime">
            <upload-file :uploadFiles="formValidate.surgeryOperationFiles" :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="备注:" prop="note">
            <el-input v-model="formValidate.note" readonly type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
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
              prop="createUserName"
              label="审核人">
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
  </div>
</template>
<script>
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
          "id":111,
          "depName":"科室",
          "createUserName":"名称",
          "createTime":"2014-01-01 10:10:10",
          "clinicalName":"病名",
          "clinicalType":"WATCH",
          "clinicalTime":"2016-01-01",
          "note":"备注说明",
          "teacherName":"指导老师",
          "state":"NO_SUBMIT"
        },

        tableData:[],
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url:this.url.operationGet.path+this.operailityData.id, //向后台请求数据的地址

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
        this.formValidate = data;
        if(data.reviewMess){
            this.tableData = data.reviewMess;
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



      }
    }
  }
</script>

