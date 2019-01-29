<!--
****--@file     examineInterval_copyScene
****--@date     2018/8/14 17:23
****--@author   YC
****--@describe 复制场次
-->
<template>
  <div class="examineIntervalCopyScene">
    <template v-if="!copying">
      <div>
        <el-button type="info" @click="add">{{ 'new' | sysLan }}</el-button>
      </div>
      <br>
      <el-table align="center" height="300" :context="self" :data="sceneData" tooltip-effect="dark"
                style="width: 100%;">
        <el-table-column label="操作" width="70" align="center">
          <template scope="scope">
            <el-button size="small" type="danger" :disabled="sceneData.length===1" @click="remove(scope.$index)">{{ 'delete' | sysLan }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="复制类型" prop="copyType">
          <template scope="scope">
            <br>
            <el-form ref="form" :model="scope.row">
              <el-form-item>
                <el-select v-model="scope.row.copyType" placeholder="请选择">
                  <el-option v-for="item in copyType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="考核名称" prop="sceneName" show-overflow-tooltip>
          <template scope="scope">
            <br>
            <el-form ref="form" :model="scope.row">
              <el-form-item>
                <el-input v-model="scope.row.sceneName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" show-overflow-tooltip>
          <template scope="scope">
            <br>
            <el-form ref="form" :model="scope.row">
              <el-form-item>
                <el-date-picker v-model="scope.row.startTime" :editable="false" type="datetime"
                                placeholder="选择开始时间">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip v-if="copySceneData.sceneType==='FREE'">
          <template scope="scope">
            <br>
            <el-form ref="form" :model="scope.row">
              <el-form-item>
                <el-date-picker v-model="scope.row.endTime" :editable="false" type="datetime"
                                placeholder="选择结束时间">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-else>
      <h2>提示</h2>
      <h3>1、复制成功后，请对复制的场次进行相关数据完善操作</h3>
      <h3>2、整个复制过程将随着复制场次的数量增加而时间变长，请耐心等待</h3>
      <br>
      <el-progress :text-inside="true" :stroke-width="20" :percentage="getPercentage()" status="success"></el-progress>
      <br>
      <p>复制成功 {{ copySuccessNum }} 个场次， {{ copyErrorNum }} 个复制失败，还剩余 {{ sceneData.length-(copySuccessNum+copyErrorNum) }} 个场次。</p>
    </template>
    <br>
    <el-row>
      <el-col align="center">
        <template v-if="copying">
          <el-button :disabled="copySuccessNum+copyErrorNum<sceneData.length" type="info" @click="copyDone">确定</el-button>
          <el-button type="danger" @click="cancelCopy" :disabled="copySuccessNum+copyErrorNum!==sceneData.length">取消</el-button>
        </template>
        <template v-else>
          <el-button type="info" @click="startCopy">确定</el-button>
          <el-button type="danger" @click="cancelCopy" :disabled="copying && copySuccessNum+copyErrorNum!==sceneData.length">取消</el-button>
        </template>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss">
  .examineIntervalCopyScene {
    position: relative;
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'examineIntervalCopyScene',
    props: ['copySceneData'],
    data () {
      return {
        self: this,
        copyType: [{
          value: 'NO_STUDENT',
          label: '不复制考生'
        }, {
          value: 'NO_TABLE',
          label: '不复制考生，不复制评分表'
        }, {
          value: 'ONLY_STATION',
          label: '只复制考站结构'
        }],
        sceneData: [], // 复制的场次数据
        copying: false, // 是否正在复制
        copySuccessNum: 0, // 已经复制成功的场次
        copyErrorNum: 0 // 复制失败的场次
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.add();
      },
      // 获取进度
      getPercentage () {
        return Number((((this.copySuccessNum + this.copyErrorNum) / this.sceneData.length) * 100).toFixed(2));
      },
      // 新建场次
      add () {
        this.sceneData.push({
          id: this.copySceneData.id, // 场次id
          copyType: '', // 复制类型
          sceneName: '', // 场次名称
          startTime: '', // 开始时间
          endTime: '' // 结束时间
        });
      },
      // 删除
      remove (index) {
        this.sceneData.splice(index, 1);
      },
      // 取消
      cancelCopy () {
        this.$emit('cancel');
      },
      // 复制
      startCopy () {
        if (!this.checkData()) {
          return false;
        }
        this.copying = true;
        this.copyData(0);
      },
      // 复制数据
      copyData (index) {
        let data = this.$util._.defaultsDeep({}, this.sceneData[index]);
        // 时间格式化
        data.startTime = this.conductDate(data.startTime, 'yyyy-MM-dd HH:mm:ss').replace(/\d{2}$/, '00') || '';
        data.endTime = this.conductDate(data.endTime, 'yyyy-MM-dd HH:mm:ss').replace(/\d{2}$/, '00') || '';
        this.saveData(data, res => {
          index++;
          if (res.status.code == 4) {
            this.errorMess('登录超时，请重新登录！');
            this.$cookie.delete('Token');
            this.$router.push('/login');
          } else {
            res.status.code == 0 ? this.copySuccessNum++ : this.copyErrorNum++;
            if (index < this.sceneData.length) {
              this.copyData(index);
            }
          }
        });
      },
      // 保存数据
      saveData (data, ajaxCall) {
        let opt = {
          ajaxCall,
          ajaxParams: {
            url: api.copy.path,
            method: api.copy.method,
            data
          }
        };
        this.ajax(opt);
      },
      // 检查数据
      checkData () {
        let flag = true;
        let data = this.sceneData;
        let str = {
          copyType: '复制类型',
          sceneName: '场次名称',
          startTime: '开始时间'
        };
        if (this.copySceneData.sceneType === 'FREE') {
          str.endTime = '结束时间';
        }
        let tipKey = '';
        let keys = Object.keys(str);
        for (let i = 0; i < data.length; i++) {
          if (keys.some(key => {
            tipKey = key;
            return data[i][key] === '';
          })) {
            flag = false;
            this.errorMess(`第 ${i + 1} 行 ${str[tipKey]} 必须填写！`);
            break;
          }
        }
        return flag;
      },
      // 确定
      copyDone () {
        this.$emit('copy', 'copyScene', `复制${this.copySuccessNum}个场次成功！`);
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
