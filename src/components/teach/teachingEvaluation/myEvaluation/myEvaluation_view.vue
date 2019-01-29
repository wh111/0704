<template>
  <div >
    <fieldset class="layui-elem-field">
      <legend>未评对象</legend>
      <el-row>
        <el-col :span="24">

          <div style="width: 120px;margin: 10px 15px;display: inline-block" :key="index" v-if="data.noScoreList!=0" v-for="(item,index) in data.noScoreList">
            <div  @click="add(item,'noScoreList')" style="width: 120px;height: 120px;border: 1px solid #dedede;">
              <img v-if="item.headPhoto" style="width: 118px;height: 118px;cursor: pointer" :src="item.headPhoto "  alt="">
              <img v-else style="width: 118px;height: 118px;cursor: pointer"  src="../../../../assets/ambuf/images/physician.png" alt="">
            </div>
            <el-tooltip v-if="item.userName.length>9" effect="dark" :content="`${item.userName}(${item.score})`" placement="bottom">
              <p style="text-align: center" class="overflow-txt1">{{item.userName }}({{item.score}})</p>
            </el-tooltip>
            <p v-else style="text-align: center;" class="overflow-txt1">{{item.userName }}({{item.score}})</p>

          </div>
          <div  v-if="data.noScoreList==0" style="text-align: center;font-size: 18px;line-height: 40px">
            <strong>
              暂无可评价对象
            </strong>
          </div>
        </el-col>
      </el-row>
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination
            v-if="data.noScoreList!=0"
            @size-change="changeNoPageSize"
            @current-change="changeNoPage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="noTotalCount">
          </el-pagination>
        </div>
      </div>
    </fieldset>
    <br>

    <fieldset class="layui-elem-field">
      <legend>已评对象</legend>
      <el-row>
        <el-col :span="24">
          <div style="width: 120px;margin: 10px 15px;display: inline-block" :key="index" v-if="data.haveScoreList!=0" v-for="(item,index) in data.haveScoreList">
            <div @click="add(item,'haveScoreList')" style="width: 120px;height: 120px;cursor: pointer;border: 1px solid #dedede;">
              <img v-if="item.headPhoto" style="width: 118px;height: 118px;cursor: pointer" :src="item.headPhoto"   alt="">
              <img v-else style="width: 118px;height: 118px;cursor: pointer"  src="../../../../assets/ambuf/images/physician.png"  alt="">
            </div>
            <el-tooltip v-if="item.userName.length>9" effect="dark" :content="`${item.userName}(${item.score/100})`" placement="bottom">
              <p style="text-align: center;" class="overflow-txt1">{{item.userName }}({{item.score/100}})</p>
            </el-tooltip>
            <p v-else style="text-align: center;" class="overflow-txt1">{{item.userName }}({{item.score/100}})</p>
          </div>
          <div v-if="data.haveScoreList==0" style="text-align: center;font-size: 18px;line-height: 40px">
            <strong>
              暂无已评价对象
            </strong>
          </div>
        </el-col>
      </el-row>
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination
            v-if="data.haveScoreList!=0"
            @size-change="changeHavePageSize"
            @current-change="changeHavePage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="haveTotalCount">
          </el-pagination>
        </div>
      </div>
    </fieldset>
    <!--选择人员-->
    <!--新建教学活动-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="addModal"
      title="新建教学活动"
      class-name="vertical-center-modal"
      >
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" :type="type"  @cancel="cancel" :url="url" @add="subCallback" :activityId="operailityData.id" :operailityData="operailityAdd"></add>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import add from './myEvaluation_add.vue'
  let Util;
  export default{
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],

    data(){
        return{
          //获取的数据
          "data":{
            haveScoreList:[],
            noScoreList:[],
          },
          type:'',
          addId:{id:'add',title:'评分'},
          operailityAdd:'',
          //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
          listMessTitle: {
            ajaxSuccess: 'oneDataSuccess',
            ajaxParams: {
              url: this.url.queryByUser,
              params: {
                activityId:this.operailityData.id,
              },
            }
          },

          noTotalCount:0,
          haveTotalCount:0,
          //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
          noScoreMessTitle: {
            ajaxSuccess: 'noScoreSuccess',
            ajaxParams: {
              url: this.url.noScore,
              params: {
                activityId:this.operailityData.id,
              },
            }
          },
          //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
          haveScoreMessTitle: {
            ajaxSuccess: 'haveScoreSuccess',
            ajaxParams: {
              url: this.url.haveScore,
              params: {
                activityId:this.operailityData.id,
              },
            }
          },
        }
      },
    mounted(){
      //暂时没有初始化,预留初始化入口
      this.init();
    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        Util = this.$util;
        this.myPages =  Util.pageInitPrams;

        this.noScoreQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        }
        this.haveScoreQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        }

//        this.ajax(this.listMessTitle)
        this.getNoScore()
        this.getHaveScore()
      },

      /*
       * 改变每页显示条数调用
       * @param n number  当前要设置的显示条数
       * */
      changeNoPageSize (n){
        this.noScoreQptions.pageSize = n;
        this.getNoScore()
      },
      /*
       * 改变页码调用
       * @param n number  当前要设置的页码
       * */
      changeNoPage (n) {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.noScoreQptions.curPage = n;
        this.getNoScore()
      },

      //获取未评列表
      getNoScore(){
        this.noScoreMessTitle.ajaxParams.params = Object.assign(this.noScoreMessTitle.ajaxParams.params,this.noScoreQptions);
        this.ajax(this.noScoreMessTitle);
      },

      noScoreSuccess(responseData){
        let data = responseData.data;
        if(!data)return;
        let env = this.$store.getters.getEnvPath;
        let http = env['http'];
        for(let i=0;i<data.length;i++){
          let item = data[i];
          if(item.headPhoto){
            item.headPhoto = http+ item.headPhoto;
          }
        }
        this.noTotalCount = responseData.totalCount;
        this.data.noScoreList = data;
      },


      /*
       * 改变每页显示条数调用
       * @param n number  当前要设置的显示条数
       * */
      changeHavePageSize (n){
        this.noScoreQptions.pageSize = n;
        this.getHaveScore()
      },
      /*
       * 改变页码调用
       * @param n number  当前要设置的页码
       * */
      changeHavePage (n) {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.noScoreQptions.curPage = n;
        this.getHaveScore()
      },

      //获取未评列表
      getHaveScore(){
        this.haveScoreMessTitle.ajaxParams.params = Object.assign(this.haveScoreMessTitle.ajaxParams.params,this.haveScoreQptions);
        this.ajax(this.haveScoreMessTitle);
      },

      haveScoreSuccess(responseData){
        let data = responseData.data;
        if(!data)return;
        let env = this.$store.getters.getEnvPath;
        let http = env['http'];
        for(let i=0;i<data.length;i++){
          let item = data[i];
          if(item.headPhoto){
            item.headPhoto = http+ item.headPhoto;
          }
        }
        this.haveTotalCount = responseData.totalCount;
        this.data.haveScoreList = data;
      },


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * 注:当前为添加页面暂时未用到,属于预留
       * */
      oneDataSuccess(responseData){
        let data = responseData.data;
        if(!data)return;
        let env = this.$store.getters.getEnvPath;
        let http = env['http'];
        let haveScoreList = data.haveScoreList;
        let noScoreList = data.noScoreList;
        for(let i=0;i<noScoreList.length;i++){
          let item = noScoreList[i];
          if(item.headPhoto){
            item.headPhoto = http+ item.headPhoto;
          }
        }

        for(let k=0;k<haveScoreList.length;k++){
          let item = haveScoreList[k];
          if(item.headPhoto){
            item.headPhoto = http+ item.headPhoto;
          }
        }


        this.data = data;
      },
      add(data,type){
          console.log(data)
          if(!data.timFrame&&type=='noScoreList'){
            this.errorMess('不在时间范围之内，不能评分');
            return;
          }
          this.type = type;
        this.operailityAdd = data;
        this.addModal = true;
      },
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
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
      subCallback(target,title,updata){
        this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.init();
        }
      },
    },
    components:{
      add
    }
  }
</script>
