<template>
  <!--事项增加-->
  <div class="editForm">
    <el-form :model="showData" ref="showData" class="demo-form-inline" label-width="130px">

      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="日期：" prop="registerDate">{{ showData.registerDate }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="时间段：" prop="timeInterval">{{ showData.timeInterval }}
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="类型：" prop="affairType">{{ showData.affairType | affairsType }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="课时：" prop="classhour">{{ showData.classhour }}
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="人次：" prop="peopleNum">{{ showData.peopleNum }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="教师/考官：" prop="teacher">{{ showData.teacher }}
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="登记人：" prop="creater">{{ showData.creater }}
          </el-form-item>
        </el-col>

        <el-col :span="21" :offset="1">
          <el-form-item label="培训地点：">
            <span style="display:inline;">{{ (roomNums.join('，')) || '暂无' }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="21" :offset="1">
          <el-form-item label="培训/考核对象：">{{ showData.trainingObject | userType }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="使用部门：">{{ showData.department || '未指定' }}
          </el-form-item>
        </el-col>

        <el-col :span="22" :offset="1">
          <el-form-item label="培训/考核内容：">{{ showData.trainingContent || '暂无' }}
          </el-form-item>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-form-item label="备注：">{{ showData.remark || '暂无' }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>
<script>
  import api from './api';

  export default {
    props: ['operailityData'],
    data() {
      return {
        roomNums: [],
        //form表单bind数据
        showData: {
          registerDate: "",
          timeInterval: "",
          classhour: "",
          affairType: "",
          trainingObject: "ALL",
          peopleNum: "",
          teacher: "",
          department: "",
          creater: "",
          trainingContent: "",
          remark: "",
          roomList: [ //
            // {
            //   "roomId": "1",
            //   "roomNum": "101"
            // }
          ],
          userList: [ // 
            // {
            //   userId: 1,
            //   userName: '666'
            // }
          ]
        },
      }
    },
    created() {
      this.getDataForServer()
    },
    methods: {
      getDataForServer() {
        this.ajax({
          ajaxSuccess: res => {
            this.showData = res.data;
            (res.data.roomList || []).map(item => this.roomNums.push(item.roomNum))
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        })
      }
    },
  }

</script>
<style lang="scss">
  @import '../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
