<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/12/1
****--@author   gx
----------------------------------->
<template>
  <div>
    <div v-if="!showWhat" align="center">
      <div style="font-size: 18px">
        <el-radio class="radio" v-model="radio" :label="'temp'">从审批通过的大病历库中选择</el-radio>
        <el-radio class="radio" v-model="radio" :label="'add'">新建</el-radio>
      </div>
      <div style="margin-top:20px;">
        <el-button type="primary" @click="selectType">确定</el-button>
      </div>
    </div>
    <div v-else>
      <el-row>
        <el-col :span="18">
          <el-form ref="formValidate" label-width="80px">
            <el-form-item label="科室:" prop="dep">
              <el-select v-model="dep" placeholder="请选择">
                <el-option v-for="item in optionData" :key="item.id" :label="item.label"
                           :value="item.depId+'-'+item.depName+'-'+item.podId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-button @click="podIdChange(dep)">确定</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['url'],
    data() {
      return {
        showWhat: '',
        radio: 'temp',
        dep: '',
        optionData:[],
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '', //向后台请求数据的地址
          }
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        let userInfo = this.$store.getters.getUserInfo;
        let role = userInfo.studentTypes;
        this.listMessTitle.ajaxParams.url = this.url.userRotaryDeptlistTree +role+'-' + userInfo.id;
      },
      selectType() {
        //添加的话就需要再选科室
        if (this.radio == 'add') {
          this.showWhat = 'add';
          this.ajax(this.listMessTitle);
          return;
        }
        this.$emit('select', this.radio)
      },

      //获取科室列表
      updateListData(res) {
        let data = res.data;
        if (!data) return;
        this.optionData = this.getQTBObj(res.data);
        for(let i=0;i<data.length;i++){
          let item = data[i];
          if(item.arrangeDepState=='P'){
            data.splice(i,1);
            i--;
          }else {
            if(item.podState==99){
              this.dep = item.depId+'-'+item.depName+'-'+item.podId
            }
          }
        }

      },

      // 处理科室数据结构（三级以下）
      getQTBObj(arr,res,depth=-1){
        depth++;
        let t = res || [];
        if(arr && arr.length) {
          arr.map(item => {
            item.label='　'.repeat(depth)+item.depName+'('+(item.beginTime||'')+')';
            t.push(item);
            if (item.childList){
              return t.concat(this.getQTBObj(item.childList,t,depth))
            }
          })
        }
        return t
      },

      podIdChange(val) {
        if (!val) {
          this.errorMess('请选择科室')
          return;
        }
        let dep = val.split('-');
        this.$emit('select', this.radio, {
            depId: dep[0],
            depName: dep[1],
            podId: dep[2],
          }
        )
        this.showWhat = 'largeCase';
      },
    },
      created() {
      this.init();
      },
      mounted() {
      },
      components: {}
    }
</script>
