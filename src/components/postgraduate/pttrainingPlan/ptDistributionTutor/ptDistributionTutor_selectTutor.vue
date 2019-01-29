<!----------------------------------
****--@name     分配导师-选择导师
****--@role     ${*}
****--@date     2017/10/18
****--@author   gx
----------------------------------->
<template>
    <div>
      选择导师
      <select-teacher @cancel="$emit('cancel')" :url="treeUrl" :ajaxData="{rootId:-102}" :unSelect="unSelect" @setUsers="selectHostCallback" :initUser="selectUserMentor"></select-teacher>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import selectTeacher from "../../ptResearchSelections/openingMentor/setMentor_base/selectUser.vue"
    //当前组件引入全局的util
    let Util = null;
    export default {
      props:['operailityData','url'],
        data() {
            return {
              loadBtn:{title:'确定',callParEvent:'listenSubEvent'},
              formValidate: {
                userId:'',
                teacherIds:'',
              },
              unSelect:[],
              treeUrl: '/teacherType/tree/', //目录树结构请求地址
              selectUserMentor:[],
              editMessTitle:{
                type:'select',
                successTitle:'分配成功',
                errorTitle:'分配失败',
                ajaxSuccess:'ajaxSuccess',
                ajaxError:'ajaxError',
                ajaxParams:{
                  url:this.url.addTeacher.path,
                  method:this.url.addTeacher.method,
                  data:{
                  },
                }
              },

            }
        },
        methods: {
          //初始化请求列表数据
          init() {
            let userInfo = this.$store.getters.getUserInfo;
            this.unSelect = [userInfo.id];
            this.formValidate.userId = this.assemblingId(this.operailityData);
          },
          listenSubEvent(isLoadingFun){
              if(!isLoadingFun) isLoadingFun=function(){};
              isLoadingFun(true);
              let formValidate = this.formValidate;
              this.editMessTitle.ajaxParams.data= formValidate;
              this.ajax(this.editMessTitle,isLoadingFun)

          },
          assemblingId(data){
            let myUrl = []
            for (var i = 0; i < data.length; i++) {
              myUrl.push(data[i].userId);
            }
            return myUrl.join(',')
          },

          //选择人员的回调函数
          selectHostCallback(data){
            if(data==0){
              this.errorMess('最少选择一个');
              return;
            }
            //this.rowData.planActivityHost = data
            let ids = [];
            data.map((item=>{
              ids.push(item.key)
            }))
            this.formValidate.teacherIds = ids.join(',');
            this.listenSubEvent()
          },
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
          selectTeacher
        }
    }
</script>
