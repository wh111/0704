<!--
****--@file     index
****--@date     2018/4/18 9:48
****--@author   YC
****--@describe 考站设置权重
-->
<template>
  <div>
    <table class="el-table el-table--border">
      <thead>
      <tr>
        <td>
          <div class="cell">考站名称</div>
        </td>
        <td width="200px">
          <div class="cell">权重(合计必须为100%)</div>
        </td>
      </tr>
      </thead>
      <tbody>
      <template v-for="(roomArr,type) in rooms">
        <tr v-for="(roomItem,index) in roomArr" :key="roomItem.index" class="setWeightItemBox">
          <td>
            <div class="cell">{{ roomItem.stationName === '' ? '未命名' : roomItem.stationName }}</div>
          </td>
          <td v-if="type ==='noDraw'">
            <div class="cell">
              <el-form :ref="'stationWeight'+index" :rules="rules" :model="roomItem" onsubmit="return false">
                <el-form-item prop="stationWeight">
                  <el-input v-model="roomItem.stationWeight" placeholder="请输入权重"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </td>
          <td v-else-if="type !=='noDraw' && index < 1" :rowspan="roomArr.length">
            <div class="cell">
              <el-form :ref="'stationWeight'+index" :rules="rules" :model="rooms" onsubmit="return false">
                <el-from-item prop="stationWeight">
                  <el-input v-model="roomItem.stationWeight" placeholder="请输入权重"></el-input>
                </el-from-item>
              </el-form>
            </div>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <el-row class="setWeightBtnBox">
      <el-col align="right">
        <el-button size="small" type="success" @click="saveWight">保存</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss">
  .setWeightBtnBox {
    margin-top: 20px;
  }

  .setWeightItemBox {

  }
</style>
<script>
  /*当前组件必要引入*/
  import { examineIntervalSetWeight as rules } from '../../rules'
  import { getWeigthRooms, checkWeigthRoomsData } from './formatData'
  //当前组件引入全局的util
  let Util = null
  export default {
    name: 'examineIntervalSetWeightIndex',
    data () {
      return {
        rules,
        self: this,
        rooms: {}
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.rooms = getWeigthRooms(this.self)
        console.log(this.rooms)
      },
      // 保存权重
      saveWight () {
        let formRefs = this.$refs
        let checkRes = [];
        (Object.keys(formRefs) || []).map(key => checkRes.push(this.submitForm(key)))
        if (!checkRes.every(item => !!item)) {
          return
        }
        if (checkWeigthRoomsData(this.rooms)) {
          Object.keys(this.rooms).map(key => {
            this.rooms[key].map(station => this.$store.commit('examineInterval/room/updateRoomWeight', {
              index: station.index,
              stationWeight: key === 'noDraw' ? station.stationWeight : this.rooms[key][0].stationWeight
            }))
          })
          this.$emit('set')
        } else {
          this.errorMess('请检查权重是否合计为100且权重不能为0')
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName][0].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      // 取消设置权重
      cancel () {
        this.$emit('cancel', 'setWeight')
      }
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {}
  }

</script>
