<template>

  <div class="volunteerActivity_view">
    <!--一-->
    <div>
       <div>
         <div  class="headline"><span class="headline-text">1</span><span> . &nbsp;活动主题</span></div>
       </div>
       <div class="content-wrap">
         <p class="content">{{data.volunteSubject}}</p>
       </div>
    </div>
    <!---->

    <!--二-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">2</span><span> . &nbsp;活动目的</span></div>
      </div>
      <div class="content-wrap">
        <p class="content"> {{data.aim}}</p>
      </div>
    </div>
    <!---->
    <!--三-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">3</span><span> . &nbsp;活动口号</span></div>
      </div>
      <div class="content-wrap">
        <p class="content"> {{data.slogan}}</p>
      </div>
    </div>
    <!---->
    <!--四-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">4</span><span> . &nbsp;活动时间</span></div>
      </div>
      <div class="content-wrap">
        <p class="content"> {{data.beginTime}}  ~  {{data.endTime}}</p>
      </div>
    </div>
    <!---->
    <!--五-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">5</span><span> . &nbsp;活动地点</span></div>
      </div>
      <div class="content-wrap">
        <p class="content">  {{data.place}}</p>
      </div>
    </div>
    <!---->
    <!--六-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">6</span><span> . &nbsp;活动内容</span></div>
      </div>
      <div class="content-wrap">
        <p class="content">{{data.substance}}</p>
      </div>
    </div>
    <!---->
    <!--七-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">7</span><span> . &nbsp;活动步骤</span></div>
      </div>
      <div class="content-wrap">
        <p class="content"> {{data.step}}</p>
      </div>
    </div>
    <!---->
    <!--8-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">8</span><span> . &nbsp;注意事项</span></div>
      </div>
      <div class="content-wrap">
        <p class="content"> {{data.matterNeedingAttention}}</p>
      </div>
    </div>
    <!--9-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">9</span><span> . &nbsp;人员分工</span></div>
      </div>
      <div class="content-wrap">　　　　
        <p class="content">{{data.divisionOfLabor}}</p>
      </div>
    </div>
    <!---->
    <!--10-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">10</span><span> . &nbsp;招募对象</span></div>
      </div>
      <div class="content-wrap">　　　　
        <p class="content">{{data.recruits}}</p>
      </div>
    </div>
    <!---->
    <!--11-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">11</span><span> . &nbsp;宣传图片</span></div>
      </div>
      <div class="content-wrap">　
        <img style="width:146px;height: 146px;margin: 5px;border: 1px solid #dadada" v-for="(item,index) in data.pictureList" :key="index" :src="config.urlPrefix + '/file/download/'+item.fileId" alt="">
      </div>
    </div>
    <!---->
    <!--11-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">11</span><span> . &nbsp;相关证明材料</span></div>
      </div>
      <div class="content-wrap">　
        <upload-file :uploadFiles="data.fileList" :show="true"></upload-file>
      </div>
    </div>
    <!---->
    <!--12-->
    <div>
      <div>
        <div  class="headline"><span class="headline-text">12</span><span> . &nbsp;已报名人员</span></div>
      </div>
      <div class="content-wrap">　
        <el-table
          align="center"
          :data="data.applicantList"
          tooltip-effect="dark"
          style="width: 100%"
          >
          <el-table-column
            prop="userName"
            label="姓名"
            align="center"
            width="300">
          </el-table-column>
          <el-table-column
            prop="userSex"
            label="性别"
            align="center"
            width="300">
            <template scope="scope">
              {{ scope.row.userSex | typeText }}
            </template>
          </el-table-column>
          <el-table-column
            prop="userCtel"
            label="联系电话"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!---->

  </div>
</template>
<script >
  import util from "../../../../libs/util";
  const getList = util.getList;
  const url = 'data1.json'
  import config from "../../../../config/config.js";
  export default {
    props: ['operailityData'],
    data (){
      return {
        config,
        formValidate: {
          name: '',
          school: '',
          status: ''
        },
        show: {},

        "data":{
          "divisionOfLabor":"", //人员分工
          "aim":"",                 //活动目的
          "applicantList":[

          ],
          "volunteSubject":"",  //活动主题
          "substance":"",           //活动内容
          "matterNeedingAttention":"",  //注意事项
          "maxNum":"",
          "minNum":"",
          "step":"",              //活动步骤
          "id":'',
          "place":"",           //活动地点
          "beginTime":"",     //开始时间
          "endTime":"",        //结束时间
          "slogan":"",              //活动口号
          "recruits":"",         //招录对象
          pictureList:[],
          fileList:[]
        },


        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url:'volunteering/get/'+this.operailityData.id,
          }
        }
      }
    },
    computed:{

    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        if(!data)return;
        data.pictureList= data.pictureList || [];
        this.data = data;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
      confirm(){
        this.$emit('cancel','show')
      }
    }

  }
</script>
