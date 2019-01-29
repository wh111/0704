<template>

  <div class="modal-show" >
    <!-- 一 -->
    <div class="headline-wrap">
      <!--标题-->
      <div class="headline"><span class="daily-icon">1</span>基本情况</div >
      <!---->
      <el-row class="backgrd-one2">
        <el-col :span="8" >
          <p ><span class="name">姓名</span><span>{{show.userName}}</span></p>
        </el-col>
        </el-col >
        <el-col :span="8">
          <p ><span class="name">性别</span><span>{{show.depName}}</span></p>
        </el-col >
        <el-col :span="8">
          <p ><span class="name">出生年月</span><span>{{show.depName}}</span></p>
        </el-col >
      </el-row >

      <el-row class="backgrd-two2">
        <el-col :span="8" >
          <p ><span class="name">政治面貌</span><span>{{show.userName}}</span></p>
        </el-col>
        </el-col >
        <el-col :span="8">
          <p ><span class="name">民族</span><span>{{show.depName}}</span></p>
        </el-col >
        <el-col :span="8">
          <p ><span class="name">入学时间</span><span>{{show.depName}}</span></p>
        </el-col >
      </el-row >

      <el-row class="backgrd-one2">
        <el-col :span="8" >
          <p ><span class="name">专      业</span><span>{{show.userName}}</span></p>
        </el-col>
        </el-col >
        <el-col :span="8">
          <p ><span class="name">学制</span><span>{{show.depName}}</span></p>
        </el-col >
        <el-col :span="8">
          <p ><span class="name">联系电话</span><span>{{show.depName}}</span></p>
        </el-col >
      </el-row >

      <el-row class="backgrd-two">
        <el-col :span="24" >
          <p ><span class="name">身份证号</span><span>510525-1994-0113-1681</span></p>
        </el-col>
        </el-col >
      </el-row >
    </div>
    <!---->

    <!--二-->
    <div class="headline-wrap">
      <!--标题-->
      <div class="headline"><span class="daily-icon">2</span>家庭经济情况</div >
      <!---->
      <el-row class="backgrd-one2">
        <el-col :span="8" >
          <p ><span class="name">家庭户口</span><span>{{show.userName}}</span></p>
        </el-col>
        </el-col >
        <el-col :span="8">
          <p ><span class="name">人口总数</span><span>{{show.depName}}</span></p>
        </el-col >
        <el-col :span="8">
          <p ><span class="name">月总收入</span><span>{{show.depName}}</span></p>
        </el-col >
      </el-row >

      <el-row class="backgrd-two2">
        <el-col :span="8" >
          <p ><span class="name">人均月入</span><span>{{show.userName}}</span></p>
        </el-col>
        </el-col >
        <el-col :span="8">
          <p ><span class="name">收入来源</span><span>{{show.depName}}</span></p>
        </el-col >
        <el-col :span="8">
          <p ><span class="name">邮政编码</span><span>{{show.depName}}</span></p>
        </el-col >
      </el-row >
      <el-row class="backgrd-one">
        <el-col :span="24" >
          <p ><span class="name">家庭住址</span><span>  </span></p>
        </el-col>
        </el-col >
      </el-row >
    </div>
    <!---->
    <!--三-->
    <div class="headline-wrap">
      <!--标题-->
      <div class="headline"><span class="daily-icon">3</span>学习情况</div >
      <!---->
      <el-row class="backgrd-one2">
        <el-col :span="12" >
          <p ><span class="name">成绩排名</span><span>{{show.userName}}</span></p>
        </el-col>
        </el-col >
        <el-col :span="12">
          <p ><span class="name" style="line-height: 20px">实行综合考评排名</span><span>{{show.depName}}</span></p>
        </el-col >
      </el-row >

      <el-row class="backgrd-two">
        <el-col :span="12" >
          <p ><span class="Case-study">必修课 &nbsp; {{1}} &nbsp; 门，其中及格以上 &nbsp;  {{2}} &nbsp;  门</span></p>
        </el-col>
        </el-col >
        <el-col :span="12">
          <p ><span class="Case-study">如是，排名</span></p>
        </el-col >
      </el-row >
    </div>
    <!---->
    <!--四-->
    <div class="headline-wrap">
      <!--标题-->
      <div class="headline"><span class="daily-icon">4</span>获奖情况</div >
      <!---->
      <el-row class="backgrd-one2">
        <el-col :span="6" >
          <p class="awards">日期</p>
        </el-col>
        </el-col >
        <el-col :span="11">
          <p class="awards">名称</p>
        </el-col >
        <el-col :span="7" >
          <p class="awards">颁奖单位</p>
        </el-col >
      </el-row >
      <el-row class="backgrd-two2">
        <el-col :span="6" >
          <p class="awards">2017-05</p>
        </el-col>
        </el-col >
        <el-col :span="11">
          <p class="awards">国家励志奖学金</p>
        </el-col >
        <el-col :span="7" >
          <p class="awards">协和医学院</p>
        </el-col >
      </el-row >

      <el-row class="backgrd-one">
        <el-col :span="6" >
          <p class="awards">2017-05</p>
        </el-col>
        </el-col >
        <el-col :span="11">
          <p class="awards">国家励志奖学金</p>
        </el-col >
        <el-col :span="7" >
          <p class="awards">协和医学院</p>
        </el-col >
      </el-row >
    </div>
    <!---->
    <!--五-->
    <div class="headline-wrap">
      <!--标题-->
      <div class="headline"><span class="daily-icon">5</span>申请理由</div >
      <!---->
      <el-row  style="height: 300px;" >
        <el-col :span="24" >
          <p class="backgrd-one" style="height: 300px;"></p>
        </el-col>
      </el-row >
    </div>
    <!---->
    <el-row  class="btn">
      <el-col :span="18" :offset="2">
        <Button type="primary" @click="confirm()">确定</Button>
      </el-col >
    </el-row >
  </div>
</template>
<script >
  import util from "../../../../libs/util";
  const getList = util.getList;
  const url = 'data1.json'
  export default {
    props: ['showData'],
    data (){
      return{
        formValidate: {
          name: '',
          school: '',
          status: ''
        },
        show:{},
      }
    },
    watch:{
      showData(){

        let that = this;
        let parm = this.showData;
        let response = getList(url,parm);
        response.then(function (res) {
          let responseData = res.data;
          if (_.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
            that.show = responseData.data[0];
            that.$emit('loading')

          }
        })
          .catch(function (err) {
            //捕获错误异常

            console.log("err"
              , err);
          });
      }
    },
    computed:{
      countDate(){
        if(!this.show.beginTime)return
        let beginTime = this.show.beginTime;
        let endTime = this.show.endTime;
        beginTime =  Date.parse(new Date(beginTime))
        endTime =  Date.parse(new Date(endTime))
        if(endTime+1<beginTime)return;
        let time = endTime- beginTime;
        var time2 = time/86400000+1;
        return time2
      }
    },
    methods:{
      confirm(){
        alert('确定');
        this.$emit('show')
      }
    }

  }
</script>
<style rel="stylesheet/scss" lang="scss">


</style>
