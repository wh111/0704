<template>
  <!-- 待选考站列表 -->
  <div>
    <el-form onsubmit="return false">
      <el-row>
        <!-- 顶部标题 -->
        <el-col align="center"><span style="font-size:16px;padding-bottom:10px;">待选考站</span></el-col>
        <!-- 搜索框 -->
        <el-input placeholder="输入考站名称进行筛选" icon="search" v-model="searchRoom">
        </el-input>
        <!-- 考站列表 -->
        <div style="margin-top:10px;">
          <div style="height:320px;overflow:auto;">
            <template v-if="selectDatas.length > 0">
              <room v-for="item in selectDatas" :option="{hasOffSet: true,hasMore: false, hasRemove:false, span:20,type:'view'}" :initData="{index: item.index,name:item.name}"
                :key="item.index" style="width:40%;margin-left:8%;" @iconAdd="add(item.index)"></room>
            </template>
            <template v-else>
              <p style="line-height:320px;text-align:center;">没有符合的数据</p>
            </template>
          </div>
        </div>
      </el-row>
    </el-form>

  </div>
</template>

<script>
  import room from '../examineInterval_room'; // 考站icon

  export default {
    props:{
      disShow:{
        type:Array,
        default:()=>[]
      }
    },
    data() {
      return {
        searchRoom: '', // 考站筛选
        roomList: this.$store.state.examineInterval.room.roomList, // 获取状态中的所有考站
        roomData: this.$store.state.examineInterval.room.roomInfo, // 获取状态中的考站信息数据
        selectData: [], // 组装之后的选择数据源（未通过命名筛选）
      }
    },
    computed: {
      // 考站名称筛选数据
      selectDatas() {
        let arr = [];
        this.selectData.map(item => {
          if (item.name.indexOf(this.searchRoom) > -1) {
            arr.push(item)
          }
        })
        return arr
      }
    },
    methods: {
      // 初始化数据 已不显示的索引
      initSelectRoomData() {
        let i = 0;
        let t = [];
        let o = {};
        let roomList = this.roomList
        let roomListLen = roomList.length;
        let arrLen = this.disShow.length || 0;
        // 不管是否是平行站，只会出现一个
        for(i;i<roomListLen;i++){
          // 排除不显示的索引
          if(arrLen && this.disShow.indexOf(i) > -1){
            continue;
          }
          t.push({
            index: i,
            name: this.roomData[i].stationName,
            isSP: this.roomData[i].stationType,
          });
        }
        this.selectData = t;
      },
      // 添加按钮
      add(index) {
        // 返回该考站在状态中的索引值
        this.$emit('add', index)
      },
    },
    created() {
      this.initSelectRoomData();
    },
    watch:{
      disShow(val){
        this.initSelectRoomData()
      }
    },
    components: {
      room
    }
  }

</script>

<style>


</style>
