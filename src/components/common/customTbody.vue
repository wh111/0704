<template>

  <tr >
      <!--<slot name="name" row="row" v-for="(item,index) in keys">1</slot>-->
  <slot></slot>

  </tr>




</template>

<script type="text/javascript">
//  import customCell from './customCell.vue'
  export default {
    props:['row'],

    data(){
      return{
        keys:[1]
      }
    },


    components:{
    },

    created(){
//      this.keys = Object.keys(this.row)


    }

  }



</script>
