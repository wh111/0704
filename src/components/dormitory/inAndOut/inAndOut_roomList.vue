<!---楼房信息管理-->
<template >
  <div id="content1" ref="content1" >

    <!--列表操作按钮-->
    <div style="margin-right:20px;padding-top:10px;text-align: right;float: right">
      <el-button type="primary" @click="goBack">返回大楼列表</el-button>
    </div>
    <div class="text-headline">{{parentDara.name}}</div>

    <fieldset class="layui-elem-field">
      <legend>男宿舍</legend>
      <div class="layui-field-box">
        <div v-for="(room,index) in roomData[0]" :key="index" class="build-room">
          <div class="room-operate">
            <span class="room-text">{{room.no}}</span>
            <img src="../../../assets/ambuf/images/immigration.png" class="room-image" @click="batchImmigration(room)" title="批量入住" alt="迁入"><!---->
            <img src="../../../assets/ambuf/images/migration.png" class="room-image" @click="batchMigration(room)" title="批量迁出" alt="迁出"><!--迁出-->
            <img src="../../../assets/ambuf/images/RoomKeeper.png" class="room-image" @click="roomKeeper(room)" title="房间资料"  alt="房间资料"><!--迁入-->
            <img src="../../../assets/ambuf/images/checkIn.png" class="room-image" @click="checkIn(room)" title="房间历史入住情况"  alt="房间历史入住情况"><!--迁入-->
          </div>
          <div class="room-content">
            <div class="room-no" v-for="(item,i) in room.userList" :style="{background:item.isClick?'#cbe3e6':''}"> <span class="room-user" @click="userClick(item,room,index,0)">{{item.userName}}</span></div>
            <div class="room-img" v-show="showImgIndex == index && operailityData">
              <img src="../../../assets/ambuf/images/immigration.png"  v-show="!clickSex" class="room-image" @click="immigration(room)" title="入住" alt="入住"><!---->
              <img src="../../../assets/ambuf/images/migration.png" v-show="!clickSex && operailityData.id" class="room-image" @click="migration()" title="迁出" alt="迁出"><!--迁出-->
              <img src="../../../assets/ambuf/images/InData.png" v-show="!clickSex &&operailityData.id" class="room-image" @click="InData()" title="入住者资料" alt="入住者资料"><!--迁出-->
              <img src="../../../assets/ambuf/images/changeRoom.png" v-show="!clickSex &&operailityData.id" class="room-image" @click="changeRoom()" title="更换房间" alt="更换房间"><!--迁出-->
            </div>
          </div>
        </div>
        <div v-if="roomData[0]==0">暂无数据</div>
      </div>
    </fieldset>
    </br>

    <fieldset class="layui-elem-field">
      <legend>女宿舍</legend>
      <div class="layui-field-box">
        <div v-for="(room,index) in roomData[1]" :key="index" class="build-room">
          <div class="room-operate">
            <span class="room-text">{{room.no}}</span>
            <img src="../../../assets/ambuf/images/immigration.png" class="room-image" @click="batchImmigration(room)" title="批量入住" alt="迁入"><!---->
            <img src="../../../assets/ambuf/images/migration.png" class="room-image" @click="batchMigration(room)" title="批量迁出" alt="迁出"><!--迁出-->
            <img src="../../../assets/ambuf/images/RoomKeeper.png" class="room-image" @click="roomKeeper(room)" title="房间资料"  alt="房间资料"><!--迁入-->
            <img src="../../../assets/ambuf/images/checkIn.png" class="room-image" @click="checkIn(room)" title="房间历史入住情况"  alt="房间历史入住情况"><!--迁入-->
          </div>
          <div class="room-content">
            <div>
              <div class="room-no" v-for="(item,i) in room.userList" :style="{background:item.isClick?'#cbe3e6':''}"> <span class="room-user" @click="userClick(item,room,index,1)">{{item.userName}}</span></div>

            </div>
            <div class="room-img" v-show="girlImgIndex == index && operailityData">
              <img src="../../../assets/ambuf/images/immigration.png" v-show="clickSex"  class="room-image" @click="immigration(room)" title="入住" alt="入住"><!---->
              <img src="../../../assets/ambuf/images/migration.png" v-show="clickSex&&operailityData.id" class="room-image" @click="migration()" title="迁出" alt="迁出"><!--迁出-->
              <img src="../../../assets/ambuf/images/InData.png" v-show="clickSex&&operailityData.id" class="room-image" @click="InData()" title="入住者资料" alt="入住者资料"><!--迁出-->
              <img src="../../../assets/ambuf/images/changeRoom.png" v-show="clickSex&&operailityData.id" class="room-image" @click="changeRoom()" title="更换房间" alt="更换房间"><!--迁出-->
            </div>
          </div>
        </div>
        <div v-if="roomData[1]==0">暂无数据</div>
      </div>

    </fieldset>
    <div>


      <!--批量迁入-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="batchImmigrationModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="batchImmigrationId"></modal-header>
        <batchImmigration v-if="batchImmigrationModal" :rules="rules" @cancel="cancel" :build="parentDara" @batchImmigration="subCallback" :selectRoom="selectRoom" :operaility-data="operailityData" :url="url"></batchImmigration>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--批量迁出-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="batchMigrationModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="batchMigrationId"></modal-header>
        <batchMigration v-if="batchMigrationModal" :rules="rules" @cancel="cancel" :build="parentDara" @batchMigration="subCallback" :selectRoom="selectRoom" :operaility-data="operailityData" :url="url"></batchMigration>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--房间资料-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="roomKeeperModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="roomKeeperId"></modal-header>
        <roomKeeper v-if="roomKeeperModal" :rules="rules" @cancel="cancel" :build="parentDara" @roomKeeper="subCallback" :selectRoom="selectRoom" :operaility-data="operailityData" :url="url"></roomKeeper>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--房间历史入住情况-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="checkInModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="checkInId"></modal-header>
        <checkIn v-if="checkInModal" :rules="rules" @cancel="cancel" :build="parentDara" @checkIn="subCallback" :selectRoom="selectRoom" :operaility-data="operailityData" :url="url"></checkIn>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--单人迁入-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="immigrationModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="immigrationId"></modal-header>
        <immigration v-if="immigrationModal" :rules="rules" @cancel="cancel" :build="parentDara" @immigration="subCallback" :selectRoom="selectRoom" :operaility-data="operailityData" :url="url"></immigration>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--单人迁出-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="migrationModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="migrationId"></modal-header>
        <migration v-if="migrationModal" :rules="rules" @cancel="cancel" :build="parentDara" @migration="subCallback" :selectRoom="selectRoom" :operaility-data="operailityData" :url="url"></migration>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--入住者资料-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="InDataModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="InDataId"></modal-header>
        <InData v-if="InDataModal" :rules="rules" @cancel="cancel" :build="parentDara" @InData="subCallback" :selectRoom="selectRoom" :operaility-data="operailityData" :url="url"></InData>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--更换房间-->
      <Modal
        close-on-click-modal="false"
        width="1000"
        v-model="changeRoomModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="changeRoomId"></modal-header>
        <change-room :rules="rules" v-if="changeRoomModal" @cancel="cancel" :build="parentDara" @changeRoom="subCallback" :selectRoom="selectRoom" :operaility-data="operailityData" :url="url"></change-room>
        <div slot="footer"></div>
      </Modal>
      <!---->
    </div>
  </div>
</template>
<script>
  //

  /*当前组件必要引入*/
  import url from '../app'
  //引入--批量迁入--组件
  import batchImmigration from "./inAddOut_batchImmigration.vue";
  //引入--批量迁出--组件
  import batchMigration from "./inAddOut_batchMigration.vue";
  //引入--房间资料--组件
  import roomKeeper from "./inAddOut_roomKeeper.vue";
  //引入--房间历史入住情况--组件
  import checkIn from "./inAddOut_checkIn.vue";
  //引入--单人迁入--组件
  import immigration from "./inAddOut_immigration.vue";
  //引入--单人迁出--组件
  import migration from "./inAddOut_migration.vue";
  //引入--入住者资料--组件
  import InData from "./inAddOut_InData.vue";
  //引入--更换房间--组件
  import changeRoom from "./inAddOut_changeRoom.vue";

  //当前组件引入全局的util
  let Util=null;
  export default{
      props:['parentDara','rules'],
    data() {
      return {
        showImgIndex:-1,
        girlImgIndex:-1,
        clickSex:'',
        url:url,
        //查询表单
        batchOperailityData:'',
        operailityData:'', // 人员信息
        selectRoom:'',     //选中的房间
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        roomData: [[],[]],
        loading:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.bedPersonList,
            params:{
              buildId:this.parentDara.id
            }
          }
        },
        //弹窗开关
        batchImmigrationModal:false,  //批量迁入
        batchMigrationModal:false,  //批量迁出
        roomKeeperModal:false,  //房间资料
        checkInModal:false,  //房间历史入住情况
        immigrationModal:false,  //单人迁入
        migrationModal:false,  //单人迁出
        InDataModal:false,  //入住者资料
        changeRoomModal:false,  //更换房间

        /*--按钮button--*/
        batchImmigrationId:{id:'batchImmigrationId',title:'批量迁入'},
        batchMigrationId:{id:'batchMigrationId',title:'批量迁出'},
        roomKeeperId:{id:'roomKeeperId',title:'房间资料'},
        checkInId:{id:'checkInId',title:'房间历史入住情况'},
        immigrationId:{id:'immigrationId',title:'单人迁入'},
        migrationId:{id:'migrationId',title:'单人迁出'},
        InDataId:{id:'InDataId',title:'入住者资料'},
        changeRoomId:{id:'changeRoomId',title:'更换房间'},

      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置

        this.setTableData();
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly){
        let len = this.multipleSelection.length;
        let flag = true;
        if(len==0){
          this.showMess("请选择数据!");
          flag = false;
        }
        if(len>1 && isOnly){
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData){
          let data = responseData.data;
        if(data){
          this.roomData = this.conductGetData(data)
        }
      },


      setTableData(){
        this.ajax(this.listMessTitle);
      },


      //
      conductGetData(data){
        let tempArr = [[],[]];
        let index ;
        let bedNum;
        let length = data.length;
        for (let i=0;i<length;i++){
            let no = 1 ;  //床号
           let room = data[i]; //房间对象
          let userListIndex = 0;
           let roomList = [];     //临时房间人数列表
          let userList = {};
          let yetBedNum = 0;      //待入住人数
           index =room.sex.toUpperCase()=='BOY'?'0':'1';  //0 ：boy;1:girl
            bedNum = room.bedNum;      //房间总人数
               for (let k = 0;k<bedNum;k++){
                 if(!room.userList[k]){
                   roomList.push({
                     userName:'空床',
                   })
                   yetBedNum++;
                 }else {
                   userList[room.userList[k].userId] = room.userList[k].userName;
                   roomList.push(room.userList[k]);
                 }
               }

              room.userList = roomList;
              room._userList = userList;
              room.yetBedNum = yetBedNum;
          tempArr[index].push(room)
        }
        return tempArr
      },

      //搜索监听回调
      searchEvent(isLoading){
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if(isSubmit){
          this.setTableData()
        }
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        let flag =false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag =true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag
      },


      /*--点击--添加--按钮--*/
      add(){
        this.openModel("add");
      },
      /*--点击--修改--按钮--*/
      edit(data){
        this.operailityData = data;
        this.openModel("edit");
      },
      /*--点击--删除--按钮--*/
      remove(){
        if(!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove') ;
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data){
        this.operailityData = data;
        this.openModel("show");
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
          this.operailityData = '';
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      },

      //回退到大楼列表
      goBack(){
          this.$emit('cancel')
      },



      //点击人员
      userClick(data,room,index,sex){
          if(sex){
            this.girlImgIndex = index;
          }else {
            this.showImgIndex = index;
          }
        this.clickSex = sex;
        data.isClick=true;
        if(this.operailityData&&this.operailityData.isClick){
          this.operailityData.isClick = false;
        }
        this.operailityData = data;

        this.selectRoom = room;
      },

      //批量迁入
      batchImmigration(data){
          if(!data.yetBedNum){
              this.showMess('入住人员已满');
              return;
          }
          this.selectRoom = data;
        this.openModel("batchImmigration");
      },
      //批量迁出
      batchMigration(data){
        if(!(data.bedNum-data.yetBedNum)){
          this.showMess('无入住人员');
          return;

        }
        this.selectRoom = data;
        this.openModel("batchMigration");
      },

      //房间资料
      roomKeeper(data){
        this.selectRoom = data;
        this.openModel("roomKeeper");
      },


      //房间历史入住情况
      checkIn(data){
        this.selectRoom = data;
        this.openModel("checkIn");
      },
      /* @click="immigration(room)" title="入住" alt="入住">
    <img src="../../../assets/ambuf/images/migration.png" class="room-image" @click="migration(room)" title="迁出" alt="迁出"><!--迁出-->
    <img src="../../../assets/ambuf/images/InData.png" class="room-image" @click="InData(room)" title="入住者资料" alt="入住者资料"><!--迁出-->
    <img src="../../../assets/ambuf/images/changeRoom.png" class="room-image" @click="changeRoom(room)
*/

      //单个迁入
      immigration(data){
        if(!data.yetBedNum){
          this.showMess('入住人员已满');
          return;
        }
        this.selectRoom = data;
        this.openModel("immigration");
      },

      //单个迁出
      migration(data){
        this.openModel("migration");
      },

      //入住者资料
      InData(data){
        this.openModel("InData");
      },

      //更换房间
      changeRoom(data){
        this.openModel("changeRoom");
      },
    },
    created(){
      this.init();
    },
    mounted(){
    },
    components:{
      //当前组件引入的子组件
      batchImmigration,batchMigration,roomKeeper,checkIn,immigration,migration,InData,changeRoom
    }
  }
</script>
