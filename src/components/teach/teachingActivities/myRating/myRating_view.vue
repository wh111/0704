<template>
  <div>
      <fieldset class="layui-elem-field">
        <legend>未评对象</legend>
        <el-row>
          <el-col :span="24">

          <div style="width: 120px;margin: 10px 15px;display: inline-block" v-for="item in 7">
           <div @click="add({id:1})" style="width: 120px;height: 120px;background: #000"></div>
            <p style="text-align: center">{{'张三'}}</p>
          </div>
          </el-col>
        </el-row>

      </fieldset>
    </br>
      <fieldset class="layui-elem-field">
        <legend>已评对象</legend>
        <el-row>
          <el-col :span="24">

            <div style="width: 120px;margin: 10px 15px;display: inline-block" v-for="item in 7">
             <div  @click="add({id:1})" style="width: 120px;height: 120px;background: #000"></div>
              <p style="text-align: center">{{'zhansa'}}</p>
            </div>
          </el-col>
        </el-row>

      </fieldset>
    <!--选择人员-->
    <!--新建教学活动-->
    <Modal
      width="800"
      v-model="addModal"
      title="新建教学活动"
      class-name="vertical-center-modal"
      >
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal"  @cancel="cancel" :url="url" @add="subCallback" :operailityData="operailityAdd"></add>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import add from './myRating_add.vue'
  export default{
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],

    data(){
        return{

          //获取的数据
          "data":{
            "id":1,
            "depId":2,
            "depName":"内科",
            "activityName":"教学查房",
            "activityType":"理论",
            "hostUserId":2,
            "hostUserName":"张三",
            "activityTime":"2017-03-31",
            "activitySite":"教学楼三楼301室",
            "activityUser":"呼吸科-住院医师",
            "whetherNeedCases":"YES",
            "casesName":"穿刺术",
            "activityContent":"活动内容",
            "activityUserType":"rotarydep",
            "activityUserTypeValue":"2,3, 4",
            "activityUserTypeValueName":"呼吸内科,消化内科, 血液内科",
            "activityDepUserType":"",
            "shouldUserCount":30,
            "actuallyUserCount":10,
            "timeIds":"1,2,3",
            "recordTimes":"8:00-9:00,10:00-11:00，11:10-12:00",
            "activityState":"nosubmit",
            "fileList":[
              {
                "fileId":"2",
                "fileName":"文件名称",
                "fileUrl":"www.baidu.com",
                "fileType":"txt"
              }
            ],
            participantSubject:'ALL' //参加主体对象（默认ALL）(新增2017-11-13)(SXS-实习生、YJS-研究生、ZYY-住院医、JXS-进修生、ALL所有类型)
          },
          addId:{id:'add',title:'添加'},
          operailityAdd:'',
          //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
          listMessTitle: {
            ajaxSuccess: 'oneDataSuccess',
            ajaxParams: {
              url: this.url.teachctivityGet+'/'+this.operailityData.id,
              params: {},
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
        this.ajax(this.listMessTitle)
      },


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * 注:当前为添加页面暂时未用到,属于预留
       * */
      oneDataSuccess(responseData){
        let data = responseData.data;
        this.data = data;
      },
      add(data){
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
