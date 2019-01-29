<!----------------------------------
****--@name     点击 合格|不合格（实习情况）
****--@role     ${*}
****--@date     2018/3/7
****--@author   gx
----------------------------------->
<template>
    <div>
      <div style="font-size: 20px;text-align: center;margin:10px "><strong>实习情况汇总表</strong></div>

      <el-row>
        <el-col :span="24">
          <span>姓名：{{showData.userName}} </span> &nbsp;   &nbsp;
          <span>实习时间：{{showData.beginTime}}至{{showData.endTime}} </span>  &nbsp; &nbsp;
          <span> 周期：{{showData.ts}} </span>
        </el-col>
      </el-row>
      <fieldset class="layui-elem-field" style="margin: 20px 0" v-for="(item,index) in showData.outDeppagelist" :key="index">
        <legend style="font-size:16px">&nbsp;&nbsp;{{item.depName}}出科情况汇总&nbsp;&nbsp;</legend>
          <givenTheApplicationShow :operailityData="item" :viewByPodId="item.podId"></givenTheApplicationShow>
        <br>
        <el-row>
          <el-col :span="24" style="text-align: center;font-size: 20px;">
           <strong>出科结果 ：<span :style="{color:item.depQualified=='QUALIFIED'?'#13ce66':item.depQualified=='NO_QUALIFIED'?'#f7ba2a':'#20a0ff'}"> {{ item.depQualified | typeText }}</span></strong>
          </el-col>
        </el-row>
      </fieldset>
    </div>
</template>
<script>
	/*当前组件必要引入*/
  import givenTheApplicationShow from '../../rotateRecordWrite/givenTheApplication/givenTheApplication_look.vue'//出科查看，出科鉴定按钮用
  import api from './api'
	//当前组件引入全局的util
	let Util = null;
	export default {
	  props:['operailityData'],
		data() {
			return {
        showData:{
          outDeppagelist:[],
        }
      }
		},
		methods: {
			//初始化请求列表数据
			init() {
        this.getInfo()
			},
      // 获取结业资料
      getInfo() {
        this.ajax({
          ajaxSuccess: res => {
            let data = res.data;
            if(!data)return;
            this.showData = res.data;
          },
          ajaxParams: {
            url: api.getListByUserId.path,
            params:{
              userId:this.operailityData.userId,
            }
          }
        })
      },

		},
		created() {
			this.init();
		},
		mounted() {
		},
		components: {
      givenTheApplicationShow
    }
	}
</script>
