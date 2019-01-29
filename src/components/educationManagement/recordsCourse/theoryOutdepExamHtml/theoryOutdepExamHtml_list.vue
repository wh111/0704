<!----------------------------------
****--@name     理论出科试卷设置（2017-12-15 新增）
****--@role     ${*}
****--@date     2017/12/15
****--@author   gx
----------------------------------->
<template>
  <div class="cert-content">
    <table border="1" style="width: 100%">
      <thead>
        <th width="20%">科室名称</th>
        <th width="60%">时间</th>
        <th width="20%">操作</th>
      </thead>
      <tbody>
        <tr>
          <td rowspan="3">呼吸内科</td>
          <td>
            <span class="left-td">第一年</span>
            <span class="right-td">呼吸内科一年出科试卷1</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">更改</el-button>
          </td>
        </tr>
        <tr>
          <td>
            <span class="left-td">第二年</span>
            <span class="right-td">暂无</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">设置</el-button>
          </td>
        </tr>
        <tr>
          <td>
            <span class="left-td">第三年</span>
            <span class="right-td">呼吸内科三年出科试卷</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">设置</el-button>
          </td>
        </tr>
        <tr>
          <td rowspan="3">普外科</td>
          <td>
            <span class="left-td">第一年</span>
            <span class="right-td">普外科一年出科试卷1</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">更改</el-button>
          </td>
        </tr>
        <tr>
          <td>
            <span class="left-td">第二年</span>
            <span class="right-td">暂无</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">设置</el-button>
          </td>
        </tr>
        <tr>
          <td>
            <span class="left-td">第三年</span>
            <span class="right-td">普外科三年出科试卷1</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">设置</el-button>
          </td>
        </tr>
        <tr>
          <td rowspan="3">急诊内科</td>
          <td>
            <span class="left-td">第一年</span>
            <span class="right-td">急诊内科一年出科试卷1</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">更改</el-button>
          </td>
        </tr>
        <tr>
          <td>
            <span class="left-td">第二年</span>
            <span class="right-td">暂无</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">设置</el-button>
          </td>
        </tr>
        <tr>
          <td>
            <span class="left-td">第三年</span>
            <span class="right-td">急诊内科三年出科试卷1</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">设置</el-button>
          </td>
        </tr>
        <tr>
          <td rowspan="3">内分泌科</td>
          <td>
            <span class="left-td">第一年</span>
            <span class="right-td">内分泌科一年出科试卷1</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">更改</el-button>
          </td>
        </tr>
        <tr>
          <td>
            <span class="left-td">第二年</span>
            <span class="right-td">暂无</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">设置</el-button>
          </td>
        </tr>
        <tr>
          <td>
            <span class="left-td">第三年</span>
            <span class="right-td">内分泌科三年出科试卷1</span>
          </td>
          <td>
            <el-button size="mini" @click="chioce">设置</el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <!--设置-->
    <Modal
      close-on-click-modal="false"
      width="1000"
      v-model="addModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <div>
        <img width="100%" src="../../../../../static/image/hospital/testpaper.png" alt="">
        <p style="text-align: center">
          <el-button type="success" @click="cancel">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </p>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        loading:false,
        addId:{
          id:'addId',
          title:'设置试卷'
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init() {

      },
      chioce(){
        this.addModal = true
      },
      subCallback(){

      },
      cancel(){
        this.addModal = false
      }

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {},
  };
</script>
<style lang="scss">
  .cert-content{
    th{
      height: 40px;
      text-align: center;
    }
    tr{
      .left-td{
        float: left;
        margin-left: 20px;
      }
      .right-td{
        float: right;
        margin-right: 20px;
      }
      height: 40px;
      text-align: center;
    }
  }
</style>
