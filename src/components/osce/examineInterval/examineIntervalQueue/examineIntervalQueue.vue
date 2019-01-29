<template>
  <!--队列设置-->
  <div class="queue">
    <layout-tree>
      <selectRoom slot="left" style="height:400px;" @add="roomAdd" :disShow="disShowRoom"></selectRoom>
      <div slot="right" style="height:100%;border-left:1px solid #d1dbe5;">
        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" style="padding-left:10px;">
          <el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title + (index + 1)" :name="item.name">
            <div style="height:342px;overflow:auto;" :key="index">
              <template v-if="item.room.length">

                <template v-for="(rooms,moveIndex) in item.room">

                  <room v-for="(roomIndex,cIndex) in rooms" :option="{hasRemove: cIndex===0,hasMore: false, hasAdd:false,type:'view'}"
                        :initData="{index: roomIndex,name:roomInfo[roomIndex].stationName}"
                        :key="moveIndex + '-' + roomIndex + '-' + cIndex" style="width:88px;margin-left:10px;" @iconRemove="roomRemove(index,moveIndex)"></room>

                  <template v-if="item.room.length > 1 && moveIndex < item.room.length - 1">
                    <div class="move">
                      <img src="../../../../assets/ambuf/images/left.png" class="moveImg moveLeft" @click="moveLeftOrRight(index,moveIndex)"/>
                      <img src="../../../../assets/ambuf/images/right.png" class="moveImg moveRight" @click="moveLeftOrRight(index,moveIndex)"/>
                    </div>
                  </template>

                </template>
              </template>
              <template v-else>
                <p style="padding-left:10px;">请添加考站</p>
              </template>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </layout-tree>
    <el-row style="padding-top:10px;border-top:1px solid #d1dbe5;">
      <el-col :span="4" :offset="7" align="center">
        <el-button type="info" @click="addTab">添加队列组</el-button>
      </el-col>
      <el-col :span="3" align="center">
        <el-button type="success" @click="save">确定</el-button>
      </el-col>
      <el-col :span="3" align="center">
        <el-button type="danger" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import layoutTree from '../../../common/layoutTree'; // 左右结构
  import selectRoom from '../examineIntervalSelectRoom/examineIntervalSelectRoom'; // 选择考站
  import room from '../examineInterval_room'; // 考站

  export default {
    data () {
      return {
        drawStationObj: {}, // 记录抽签组
        usedDrawIndex: [], // 队列中已经使用了的抽签
        disShowRoom: [], // 不显示在待选框中的考站
        editableTabsValue: '1', // 标签激活
        editableTabs: [{
          name: '1',
          title: '队列组',
          room: [] // undefined 占位，队列内顺序从1开始
        }], // 标签组
        roomInfo: [] // 考站信息
      };
    },
    methods: {
      /***************** 考站 ***************************/
      // 增加
      roomAdd (index) {
//        let tabIndex = this.editableTabsValue - 1; // 当前打开的队列组
        let tabIndex = -1; // 当前打开的抽签组
        for (let ti = 0; ti < this.editableTabs.length; ti++) {
          if (this.editableTabs[ti].name == this.editableTabsValue) {
            tabIndex = ti;
            break
          }
        }
        let tab = this.editableTabs[tabIndex]; // 标签组
        // 该标签不存在
        if (!tab) {
          this.showMess('请先添加队列组');
          return;
        }

        // 不重复添加
        if (tab.room.indexOf(index) > -1) {
          return;
        }

        if (!!~this.usedDrawIndex.indexOf(this.roomInfo[index].drawNum)) {
          this.showMess('该考站所属的抽签组已经有考站在队列中，不能添加！');
          return;
        }

        let addIndex = [];
        if (this.roomInfo[index].isDraw === 'YES') { // 考站属于抽签组
          // 把新添加的抽签组索引记录下来
          this.usedDrawIndex.push(this.roomInfo[index].drawNum);
          // 把该标签组加入到队列中
          addIndex = this.$util._.defaultsDeep([], this.drawStationObj[this.roomInfo[index].drawNum]);
        } else {
          // 单个考站（非抽签组）
          addIndex = [index];
        }

        console.log(addIndex);

        // 把点击的考站加入到该标签中
        tab.room.push(addIndex);
        this.disShowRoom.push(...addIndex); // 隐藏该考站
      },
      // 移除
      roomRemove (index, roomIndex) {
        let room = this.editableTabs[index].room; // 该考站所在的标签组
        room[roomIndex].map(room => {
          this.removeDrawNumIndex(room);
          this.showRoom(room);
        });
        room.splice(roomIndex, 1); // 从标签组中删除该考站
      },
      // 删除房间对应的抽签组
      removeDrawNumIndex (room) {
        // 如果删除的考站属于抽签组的，需要删除对应的缓存记录
        if (this.roomInfo[room].isDraw === 'YES') {
          let removeDrawNumIndex = this.usedDrawIndex.indexOf(this.roomInfo[room].drawNum);
          // 如果考站的抽签组索引之前存在则需要删除
          !!~removeDrawNumIndex && this.usedDrawIndex.splice(removeDrawNumIndex, 1);
        }
        console.log(this.roomInfo[room].drawNum, this.usedDrawIndex);
      },
      // 显示考站
      showRoom (roomIndex) {
        let disShowIndex = this.disShowRoom.indexOf(roomIndex);
        disShowIndex > -1 && this.disShowRoom.splice(disShowIndex, 1); // 显示该考站
      },
      /******************  组操作 ************************/
      // 添加
      addTab () {
        let len = this.editableTabs.length;
        let name = (len && (+this.editableTabs[len - 1].name + 1).toString()) || '1'; // 如果存在分组，则下一个分组标识将+1，否则从1开始
        this.editableTabs.push({
          name,
          title: '队列组',
          room: [] // 记录当前组内的考站索引
        });
        this.editableTabsValue = name;
      },
      // 移除
      removeTab (targetName) {
        let tabs = this.editableTabs;
        let activeName = '';
        let room = []; // 该标签中的考站
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            room = tabs[index].room; // 记录该标签中的考站
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        if (room.length) {
          room.map(roomItem => {
            roomItem.map(roomIndex => {
              this.showRoom(roomIndex); // 显示该标签中的所有考站
              this.removeDrawNumIndex(roomIndex); // 删除考站对应的抽签组
            });
          });
        }
      },
      /****************** 初始化数据 ********************************/
      // 初始化标签组
      initEditableTabs () {
        let tabs = {};
        let drawStationObj = {};
        let roomInfo = this.roomInfo;
        for (var i = 0, l = roomInfo.length; i < l; i++) {
          let queueOrder = roomInfo[i].queueOrder; // 队列内顺序
          if (roomInfo[i].isDraw === 'YES') { // 该考站为抽签考站
//            this.disShowRoom.push(i); // 在待选框中不显示该考站
//            continue;
            if (!drawStationObj[roomInfo[i].drawNum]) {
              drawStationObj[roomInfo[i].drawNum] = [];
            }
            // 把每个抽签组的考站都记录下来
            drawStationObj[roomInfo[i].drawNum].push(i);
          }

          // 如果没有队列编号或者不是队列项则跳过
          if (roomInfo[i].isQueue === 'NO' || !roomInfo[i].queueNum) {
            continue;
          }
          let queueNum = (roomInfo[i].queueNum).toString(); // 队列组编号
          if (!tabs[queueNum]) {
            // 根据队列编号初始化队列组
            tabs[queueNum] = {
              name: queueNum,
              title: '队列组',
              room: {}
            };
          }
          if (!tabs[queueNum].room[queueOrder - 1]) {
            tabs[queueNum].room[queueOrder - 1] = [];
          }
          tabs[queueNum].room[queueOrder - 1].push(i);
          this.disShowRoom.push(i); // 在待选框中不显示该考站
          roomInfo[i].isDraw === 'YES' && this.usedDrawIndex.push(roomInfo[i].drawNum); // 把考站的抽签组索引缓存起来防止在队列中重复加入抽签组中的考站
        }

        let tabArr = [];
        let noTabs = true; // 记录是否有值初始化
        for (var item in tabs) {
          let room = Object.keys(tabs[item].room);
          let rooms = [];
          // 避免重新修改抽签组影响到队列，此处重新进行一次队列排序
          room.sort((a, b) => a - b).map(k => rooms.push(tabs[item].room[k]));
          tabs[item].room = rooms;
          tabArr.push(tabs[item]);
          noTabs = false;
        }

        if (noTabs) { // 如果没有初始化则此处进行默认值初始化
          tabArr[0] = {
            name: '1',
            title: '队列组',
            room: [] // undefined 占位，队列内顺序从1开始
          };
        }
        console.log(drawStationObj, tabs);
        this.editableTabs = tabArr;
        this.drawStationObj = drawStationObj;
        this.editableTabsValue = tabArr[0].name;
      },
      /****************** 左右移动 **********************************/
      // 左移动、右移动
      moveLeftOrRight (index, moveIndex) {
        let room = this.editableTabs[index].room;
        let moveData = room[moveIndex]; // 记录删除之前的值
        room.splice(moveIndex, 1); // 先删
        room.splice(moveIndex + 1, 0, moveData); // 再加
      },
      /****************** 底部按钮 **********************************/
      // 取消，不保存任何操作并关闭模态窗
      cancel () {
        this.$emit('cancel', 'setQueue');
      },
      // 确定，保存操作数据并关闭模态窗
      save () {
        let tabs = this.editableTabs;
        // 更新已经设置了队列的考站信息
        tabs.map((item, drawIndex) => {
          let room = item.room;
          room.map((roomItem, orderIndex) => roomItem.map(index => {
            this.$store.commit('examineInterval/room/updateRoomInfo', {
              index,
              value: {
                isQueue: 'YES',
                queueNum: drawIndex + 1,
                queueOrder: orderIndex + 1
              }
            });
          }));
        });
        // 更新未设置队列的考站
        let infoLen = this.roomInfo.length; // 考站信息
        let isDraw = this.disShowRoom; // 已经设置为队列考站
        let i = 0;
        while (i < infoLen) {
          if (isDraw.indexOf(i) === -1) { // 更新为未设置队列考站
            this.$store.commit('examineInterval/room/updateRoomInfo', {
              index: i,
              value: {
                isQueue: 'NO',
                queueNum: '',
                queueOrder: ''
              }
            });
          }
          i++;
        }
        this.$emit('set');
      }
    },
    created () {
      this.roomInfo = this.$store.state.examineInterval.room.roomInfo;
      this.initEditableTabs();
    },
    components: {
      layoutTree,
      selectRoom,
      room
    }
  };

</script>
<style lang="scss">
  @import '../../../../assets/ambuf/css/examineInterval_v1.0/queue';

</style>
