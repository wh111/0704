<template>
  <!-- 考站icon -->
  <el-col :xs="8" :sm="6" :md="4" :lg="2" :offset="options.hasOffSet ? 1 : 0" class="examineRoom" :class="{'hasMore': options.hasMore}">
    <el-row class="roomButtonList">
      <el-col :span="12" align="left">
        <template v-if="options.hasAdd === true">
          <el-tooltip class="item" effect="dark" :content="options.addTip" placement="top-start" :open-delay="1000">
            <el-button icon="plus" size="mini" type="success" @click="add"></el-button>
          </el-tooltip>
        </template>
      </el-col>
      <el-col :span="options.span" align="right" style="float:right;">
        <template v-if="options.hasRemove === true">
          <el-tooltip class="item" effect="dark" :content="options.removeTip" placement="top-start" :open-delay="1000">
            <el-button icon="minus" size="mini" type="danger" @click="remove"></el-button>
          </el-tooltip>
        </template>
      </el-col>
    </el-row>
    <!-- 进度条 -->
    <el-progress v-if="options.type === 'monitor'" :text-inside="true" :stroke-width="16" :percentage="roomInfo.percentage" status="success"></el-progress>
    <div class="roomInfo" @click="eDo('roomClick')" :class="options.icon">
      <img src="../../../assets/ambuf/images/roomBG.png">
      <p class="roomNum" v-if="roomInfo.roomNum">{{ roomInfo.roomNum }}</p>
      <p class="roomSpecialty" v-if="roomInfo.roomSpecialty">{{ roomInfo.roomSpecialty }}</p>
      <div class="carouselContent" v-if="roomInfo.carousel && roomInfo.carousel.length">
        <template v-if="roomInfo.carousel && roomInfo.carousel.length > 1">
          <el-carousel height="20px" arrow="never" indicator-position="none">
            <el-carousel-item v-for="item in roomInfo.carousel" :key="item">
              <h3>{{ item[roomInfo.carouselKey] || '' }}</h3>
            </el-carousel-item>
          </el-carousel>
        </template>
        <template v-else>
          <h3>{{ roomInfo.carousel[0][roomInfo.carouselKey] || '' }}</h3>
        </template>
      </div>
      <p class="roomType" v-if="roomInfo.roomType">{{ roomInfo.roomType }}</p>
    </div>
    <!-- 查看 -->
    <p class="name" v-if="options.type === 'view' || options.type === 'monitor'">{{ roomInfo.name || '未命名' }}</p>
    <!-- 编辑 -->
    <el-input placeholder="请输入考站名称" style="margin-top:10px;" :maxlength="20" size="small" v-else-if="options.type === 'edit'"
              @input="inputRoomName" v-model="roomInfo.name"></el-input>
  </el-col>
</template>

<script>
  export default {
    props: {
      option: {
        type: Object,
        default: () => {},
      },
      initData: { // 初始化数据
        type: Object,
        require: true,
      },
    },
    data () {
      return {
        roomInfo: {},
        options: {},
      }
    },
    methods: {
      eDo (type) { // 事件处理
        this.$emit(type, { // 触发父级组件的事件并传递当前索引
          index: this.roomInfo.index,
          cIndex: this.roomInfo.cIndex,
        })
      },
      // 添加
      add () {
        this.$emit('iconAdd')
      },
      // 删除
      remove () {
        this.$emit('iconRemove')
      },
      // 更新考站名称
      inputRoomName () {
        let {
          index,
          name,
        } = this.roomInfo;
        this.$store.commit('examineInterval/room/updateStationName', {
          index,
          name,
        })
      },
      // 初始化配置
      initOption () {
        this.options = {
          hasMore: false, // 是否是平行考站
          hasOffSet: false, // 是否有间距
          hasAdd: true, // 是否有增加图标
          hasRemove: true, // 是否有移除图标
          icon: '', // 考站图标 ERROR 异常 FINISH 结束 ONGOING 进行中
          span: 12,
          addTip: '添加', // add图标提示
          removeTip: '删除', // remove图标提示
          type: 'view', // 类型 view:查看|edit:编辑|monitor:监控}
        };
        Object.keys(this.option).map(key => {
          this.options[key] = this.option[key]
        });
      },
      // 初始化数据
      initRoomInfo () {
        this.roomInfo = {
          index: 0, // roomList索引
          cIndex: 0, // roomList[index].children索引
          name: '', // 房间名称
          percentage: 0, // 进度条
          roomNum: 0, // 房间号
          roomSpecialty: '', // 考站专业
          roomType: '', // 考站类型
          carousel: [], // 滚动数据
          carouselKey: '', // 滚动显示的键
        };
        Object.keys(this.initData).map(key => {
          this.roomInfo[key] = this.initData[key]
        })
      },
    },
    created () {
      this.initOption();
      this.initRoomInfo()
    },
    watch: {
      initData () {
        this.initRoomInfo();
      },
      option () {
        this.initOption()
      },
    },
  }

</script>

<style lang="scss">
  @import '../../../assets/ambuf/css/examineInterval_v1.0/roomIcon';

</style>
