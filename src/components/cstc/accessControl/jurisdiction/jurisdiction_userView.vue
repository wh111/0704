<template>
  <div>
    <el-row>
      <el-form>
        <el-col :span="18">
          <el-col :span="12">
            <el-form-item label="姓名：">
              {{ formValidate.userName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门：">
              {{ formValidate.depName }}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="卡号：">
              {{ formValidate.cardNumber }}
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="6">
          <img :src="getPhotoPath(formValidate.userPhoto)" class="cajuPhoto">
        </el-col>
        <el-col>
          <el-form-item label="授权期限：" style="margin-top:20px;">
            {{ formValidate.startDate + ' 至 ' + formValidate.endDate }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="刷卡时段：">
            <el-col :span="20">
              <template v-for="(item,index) in formValidate.accessDoorJurisdictionTimeList">
                <div :key="index" class="ajTimeSlot">
                  {{ item.startTime + ' 至 ' + item.endTime }}
                </div>
              </template>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授权人：">
            {{ formValidate.createrName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授权时间：">
            {{ formValidate.createTime }}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import api from "./api";
  export default {
    props: ['operailityData'],
    data() {
      return {
        formValidate: {
          "id": "",
          "accessDoorId": "",
          "userId": "",
          "userName": "",
          "cardNumber": "",
          "userPhoto": "",
          "depName": "",
          "startDate": "",
          "endDate": "",
          "createrId": "",
          "createrName": "",
          "createTime": "",
          "accessDoorJurisdictionTimeList": []
        },
      }
    },
    methods: {
      init() {
        this.getUserInfo()
      },
      // 获取头像地址
      getPhotoPath(path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png'
      },
      // 获取数据
      getUserInfo() {
        let opt = {
          ajaxSuccess: res => {
            this.formValidate = res.data
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
    },
    created() {
      this.init()
    }
  }

</script>

<style>
  .cajuPhoto {
    width: 116px;
    height: 116px;
  }

</style>
