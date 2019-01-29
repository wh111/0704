<!----------------------------------
****--新建周历(myRotateTables_view)
****--@date     2017/9/18
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <rotation-view :operailityData="operailityData"></rotation-view>
</template>
<script>
/*当前组件必要引入*/
import rotationView from "../../../zyy/rdyRotationArrangement/rdyArrangeRotation/rdyArrangeRotation_view.vue";
//当前组件引入全局的util
let Util = null;
export default{
    props:["operailityData"],
    data() {
        return {}
    },
    methods: {
        //初始化请求列表数据
        init(){

        },

    },
    created(){
        this.init();
    },
    mounted(){
    },
    components: {
      rotationView
    }
}
</script>
