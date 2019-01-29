<template>
  <div ref="content" class="printTable">
    <h1 style="margin: 0 auto; width: 100%;text-align: center;height: 50px;line-height: 50px">培训学员培训时间缩减方案</h1>
    <div style="height: 500px; overflow: auto">
      <!--<h1 style="text-align: center;height: 50px;line-height: 50px;margin-bottom: 20px;">临床技能测评申请审批表</h1>-->
      <el-form>
        <table class="el-table" style="margin:0 auto;">
          <!--<thead>-->
          <!--<tr class="place">-->
          <!--<td width="80" colspan="7" align="center">-->
          <!--<h1 style="height: 50px;line-height: 50px">培训学员培训时间缩减方案</h1>-->
          <!--</td>-->
          <!--</tr>-->
          <!--</thead>-->
          <tbody>
          <tr>
            <td><p class="cell td-right">姓名 :</p></td>
            <td><p class="cell">{{info.userName }}</p></td>
            <td><p class="cell td-right">性别 :</p></td>
            <td><p class="cell">{{info.sex | typeText}}</p></td>
            <td><p class="cell td-right">出生年月 :</p></td>
            <td colspan="2"><p class="cell">{{info.birth}}</p></td>
          </tr>
          <tr>
            <td><p class="cell">本科 </p></td>
            <td><p class="cell">毕业院校：</p></td>
            <td><p class="cell"><input v-model="info.underGraduateSchool" type="text" :disabled="type=='show'||type=='break'"
                                       style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/></p></td>
            <td><p class="cell"> 专业：</p></td>
            <td colspan="3"><p class="cell"><input type="text" v-model="info.underSpecialty" :disabled="type=='show'||type=='break'"
                                                   style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/></p></td>
          </tr>
          <tr>
            <td><p class="cell">硕士 </p></td>
            <td><p class="cell">毕业院校：</p></td>
            <td><p class="cell"><input type="text" v-model="info.masterGraduateSchool" :disabled="type=='show'||type=='break'"
              style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/></p></td>
            <td><p class="cell"> 专业：</p></td>
            <td><p class="cell"><input type="text" :disabled="type=='show'||type=='break'"
                                       style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"
                                       v-model="info.masterSpecialty"/></p></td>
            <td><p class="cell"> 类型：</p></td>
            <td>
              <p class="cell">
                <template>
                  <el-radio v-model="info.masterType" label="KY" :disabled="info.state!='NO_SUBMIT'">科研</el-radio>
                  <el-radio v-model="info.masterType" label="LC" :disabled="info.state!='NO_SUBMIT'">临床</el-radio>
                </template>
              </p>
            </td>
          </tr>
          <tr>
            <td><p class="cell">博士 </p></td>
            <td><p class="cell">毕业院校：</p></td>
            <td><p class="cell"><input type="text" v-model="info.doctorGraduateSchool" :disabled="type=='show'||type=='break'"
                                       style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/></p></td>
            <td><p class="cell"> 专业：</p></td>
            <td><p class="cell"><input type="text" v-model="info.doctorSpecialty" :disabled="type=='show'||type=='break'"
              style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/></p></td>
            <td><p class="cell"> 类型：</p></td>
            <td>
              <p class="cell">
                <template>
                  <el-radio v-model="info.doctorType" :disabled="info.state!='NO_SUBMIT'" label="KY">科研</el-radio>
                  <el-radio v-model="info.doctorType" :disabled="info.state!='NO_SUBMIT'" label="LC">临床</el-radio>
                </template>
              </p>
            </td>
          </tr>
          <tr>
            <td rowspan="2"><p class="cell">基地信息 </p></td>
            <td colspan="3"><p class="cell">基地名称：</p></td>
            <td colspan="3"><p class="cell"><input type="text" v-model="cutsDetail.jdName" :disabled="!(type=='break')"
                                                   style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/></p></td>
          </tr>
          <tr>
            <td colspan="3"><p class="cell">专业基地名称：</p></td>
            <td colspan="3"><p class="cell"><input type="text" v-model="cutsDetail.jdRotaryName" :disabled="!(type=='break')"
                                                       style="width: 100%;height: 100%;border: none;outline: none;margin-left: 5px"/></p></td>
          </tr>


          <tr>
            <td><p class="cell">测评内容</p></td>
            <td colspan="6">
              <div class="cell indent">
  <pre>
  专业理论分数：<template><input type="text" v-model="cutsDetail.theoryMark" :disabled="!(type=='break')"
                          style="width: 30px;border: none;outline: none;margin-left: 5px"/> </template>   分；测评形式：<template><el-radio :disabled="!(type=='break')" v-model="cutsDetail.theoryTestForm" label="pen">笔试</el-radio><el-radio v-model="cutsDetail.theoryTestForm" label="mouse" :disabled="!(type=='break')">口试</el-radio></template>

  实践技能分数：<template><input type="text" v-model="cutsDetail.skillMark" :disabled="!(type=='break')"
                          style="width: 30px;border: none;outline: none;margin-left: 5px"/> </template>    分；

  测评形式: <template><el-radio v-model="cutsDetail.skillTestForm" :disabled="!(type=='break')" label="1">接诊病人</el-radio><el-radio :disabled="!(type=='break')" v-model="cutsDetail.skillTestForm" label="2">体格检查</el-radio><el-radio :disabled="!(type=='break')" v-model="cutsDetail.skillTestForm" label="3">病历书写</el-radio><el-radio
    v-model="cutsDetail.skillTestForm" :disabled="!(type=='break')" label="4">基本临床技能操作</el-radio></template>

  基本临床技能操作内容：
  <textarea rows="4" v-model="cutsDetail.basicClinicalSkill" :disabled="!(type=='break')"
            style="width: 100%;height: 100%;border: none;outline: none;"></textarea>
  </pre>

              </div>
            </td>
          </tr>

          <tr>
            <td><p class="cell">测评结果</p></td>
            <td colspan="6">
              <div class="cell indent">
  <pre>
  测评时间： <el-date-picker  v-if="!(type=='show')"  v-model="testTime" type="date" @change="changetestTime" :disabled="!(type=='break')"
                          placeholder="选择时间"></el-date-picker><template v-else>{{cutsDetail.testTime}}</template>
  测评结果：（<template><el-radio :disabled="type=='show'" v-model="cutsDetail.testResult" label="Y">是</el-radio><el-radio :disabled="!(type=='break')" v-model="cutsDetail.testResult" label="N">否</el-radio></template>）一致通过。



 全部专家签名：<input type="text" v-model="cutsDetail.testExperts" :disabled="!(type=='break')"  style="width: 100%;border: none;outline: none;margin-left: 5px">
  </pre>

              </div>
            </td>
          </tr>
          <tr>
            <td><p class="cell">缩减方案</p></td>
            <td colspan="6">
              <div class="cell indent">
  <pre>
 原定培训时间： <input type="text"  v-model="cutsDetail.oldRotaryAdmrank" :disabled="!(type=='break')" style="width: 30px;border: none;outline: none;margin-left: 5px"/>       年；    现定培训时间：  <input type="text" :disabled="!(type=='break')" v-model="cutsDetail.newRotaryAdmrank"  style="width: 30px;border: none;outline: none;margin-left: 5px"/>        年
缩减具体内容：
    <textarea rows="4" v-model="cutsDetail.cutsContent" :disabled="!(type=='break')"
              style="width: 100%;height: 100%;border: none;outline: none;"></textarea>
  </pre>

              </div>
            </td>
          </tr>
          <tr>
            <td><p class="cell">备注</p></td>
            <td colspan="6">
              <textarea :disabled="!(type=='break')"
                style="width: 100%"
                :rows="4"
                v-model="cutsDetail.note">
              </textarea>
            </td>
          </tr>
          </tbody>
        </table>
      </el-form>
      <div align="center" style="margin-top: 20px">
        <el-button type="primary" v-if="type=='break'" @click="toServe">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'rdyApplicationRemission_view',
    props:['info','type','showType'],
    data () {
      return {
        testTime:'',
        textarea: '',
        cutsDetail:{
          "jdName":"",
          "jdRotaryName":"",
          "theoryTestForm":"pen",
          "theoryMark":"",
          "skillMark":"",
          "skillTestForm":"1",
          "basicClinicalSkill":"",
          "testTime":this.conductDate(new Date(),'yyyy-MM-dd'),
          "testResult":"",
          "testExperts":"",
          "oldRotaryAdmrank":"",
          "newRotaryAdmrank":"",
          "cutsContent":"",
          "note":"",
          "createTime":"",
          "createUserName":""
        }
      };
    },
    methods:{
      changetestTime(val){
        this.cutsDetail.testTime=val;
      },
      toServe(){
        this.successMess('缩减方案保存成功')
        this.$emit("cancel",'show',this.cutsDetail);
      }
    },
    created(){
      for (var i in this.info.cutsDetail){
        this.cutsDetail[i]=this.info.cutsDetail[i]
        this.cutsDetail.testTime='2012-08-07'
      }
    },
  };
</script>

<style scoped>
  .el-table {
    border: none;
  }

  .printTable td {
    border: 1px solid #dfe6ec;
    border-collapse: collapse;
  }
</style>
