<template>

<div>

   <div class="section  bg-white border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>

  

   <div class="section  bg-white border-b-2 border-black">
     <div class="margin-center  container mb-32">
        
       


      <div class="w-column text-center py-8"   >
           <div class="text-lg font-bold text-black"> Recent Activity  </div>
 
         
       </div>

  

       <div class="w-column  mb-16 "  >
          <div class="text-lg font-bold text-green-600"> Recent Sales Offers  </div>
          
           
          <div  class=" "  > 
            

            <div  class="mb-4 ">

              <GenericTable
                v-bind:labelsArray="['Collection Name','Token Id','Buyout' ]"
                v-bind:rowsArray="recentOffersArray"
                v-bind:clickedRowCallback="clickedRowCallback"
                
               />

           </div>


          </div> 
       </div>


       <div class="w-column mb-16  "  >
          <div class="text-lg font-bold text-green-600" > Recent Bids  </div>
          
           
          <div  class=" "  > 
            

            <div class="mb-4 ">

              <GenericTable
                 v-bind:labelsArray="['Collection Name','Token Id','Bid Amount' ]"
                v-bind:rowsArray="recentBidsArray"
                  v-bind:clickedRowCallback="clickedRowCallback"
               />


           </div>


          </div> 
       </div>

        


     </div>
   </div>


    


    
  <Footer/>

</div>
</template>


<script>
 
 

import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue'; 
import GenericTable from './components/GenericTable.vue';
 
import Web3Plug from '../js/web3-plug.js'

const envName = process.env.NODE_ENV

const FrontendConfig = require('../config/FrontendConfig.json')[envName]
 
 
import StarflaskAPIHelper from '../js/starflask-api-helper'
 import AssetDataHelper from '../js/asset-data-helper'
 
 import MathHelper from '../js/math-helper'

export default {
  name: 'RecentActivity',
  props: [],
  components: {Navbar, Footer,   GenericTable },
  data() {
    return {
      
      web3Plug: new Web3Plug() ,

      recentOffersArray: [],
      recentBidsArray: []

     
    }
  },
  watch: {
   
  },
  created(){

    

  },
  
  mounted: function () {
    
   

      this.fetchRecentActivity()
   
  }, 
   beforeDestroy(){
    
  },
  methods: {
          
 

          async fetchRecentActivity(){

            this.recentOrdersArray = []

            
            let filterCollections  = ['Cryptoadz','Cryptoflyz'] 

            let inputRequest = {  "filterCollections": filterCollections  } 
 
            let results = await StarflaskAPIHelper.resolveStarflaskQuery( 
               FrontendConfig.tokenDataApiRoot+ '/api/v1/apikey',             
            {"requestType": "recent_activity",
             "input":inputRequest }   )

            console.log('results',results )
 

            for(let result of results.output.recentOrders){ 

              let collectionName = AssetDataHelper.getCollectionNameForAsset( result.nftContractAddress )

              let decimals = 18 
              let currencyAmountFormatted = MathHelper.rawAmountToFormatted(result.currencyTokenAmount,decimals)
                currencyAmountFormatted = MathHelper.formatFloat(currencyAmountFormatted)
               currencyAmountFormatted = currencyAmountFormatted.toString().concat(' ♦')


                let row = { 
                  collectionName: collectionName, 
                  tokenId: result.nftTokenId , 
                  currencyAmountFormatted:  (currencyAmountFormatted),

                }  

                if(result.isSellOrder){
                  this.recentOffersArray.push(row)
                }else{
                  this.recentBidsArray.push(row)
                }
                
              
            }

          },

          async clickedRowCallback(row){
            console.log('clicked,',row)

             this.$router.push(`collection/${row.collectionName}/${row.tokenId}`)
          }
        

           
          
  }
}
</script>
