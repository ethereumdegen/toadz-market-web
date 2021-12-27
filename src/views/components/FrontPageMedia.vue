<template> 



<div class="pt-8 relative pb-2 mb-12" style="min-height:200px">
              
            
            
            <div  class="   text-white text-2xl p-2" style="top:35%; left:30%; background: #222b" > Open Source Cryptoadz Marketplace </div>


 </div>
 </template>



<script>
    export default {
    name: 'FrontPageMedia',
    props: [ ],
    data() {
        return {
            startTime: 0
        }
    },
    created(){
        this.startTime= Date.now()

        setInterval(this.update,500)
    },
    methods: {
         update(){
             this.$forceUpdate()
         },
         getTimeElapsed(){
             return Date.now() - this.startTime
         }
    }
    }
</script>
