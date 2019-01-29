<template>

 <th slot="name" class="cell">
    <slot  row="a ">

    </slot>
 </th>




</template>

<script type="text/javascript">
  export default {
    name:"cell",
    props: {
      prop:String,
      label:String
    },
    data(){

      return{

      }
    },
    created(){

        console.log(this.label);

    },
    mounted(){
      this.$nextTick(function () {
        console.log(this);

      })
    }

  }


</script>
