<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/12/1
****--@author   gx
----------------------------------->
<template>
  <div>
    <add v-if="viewType=='add'" :url="url" :dept="dept" @add="add" @cancel="cancel" :operailityData="operailityData"></add>
    <selectCase v-if="viewType=='temp'" @cancel="cancel" @selectTemp="selectTemp" :url="url"></selectCase>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import selectType from './userClassicCase_add-select.vue';
  import add from './userClassicCase_add-sub.vue';
  import selectCase from './userClassicCase_temp/userClassicCase_temp-list.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['url','type','dep'],
    data() {
      return {
        operailityData:'',
        viewType:this.type,
        dept:{},
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        if(this.dep)this.dept = this.dep;

      },
      selectTemp(item){
        this.operailityData = item;
        this.viewType = 'add'
      },
      cancel(){
        this.$emit('cancel','add')
      },

      add(type,mess){
        this.$emit(type,type,mess);
      }


    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      add,selectCase,selectType
    }
  }
</script>
