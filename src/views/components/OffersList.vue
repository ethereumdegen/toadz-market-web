<template>
 <div class="p-4 m-4 bg-gray-200 rounded font-boring">
     <!--  view pertinent offchain orders .. depending on who you are  --> 
       
         <div class="mb-8 ">
              <label  class="block text-md font-medium font-bold font-fun text-gray-800  ">Buy Offers</label>
 
         </div>

         <div v-if="validBuyOffers.length==0"> None found. </div>


         <div> 
           <div v-for="offer of validBuyOffers" v-bind:key="offer.signature" class="px-2 border-2 border-gray-300" > 
              <div class="autospacing w-container flex">
                     <div class="truncate " style="max-width:50%"> Bid from {{ offer.orderCreator  }} </div> 
                        
                      <div class="flex-grow"> </div>
                     <div v-if=" ownedByLocalUser() " class="px-1 bg-blue-500 hover:bg-blue-700 cursor-pointer text-white text-sm rounded " @click="acceptOffer(offer)"> Sell for {{ formatCurrencyAmount( offer.currencyTokenAmount ) }} ETH </div>
                     
                     <div v-if=" !ownedByLocalUser() " class="px-1 bg-gray-200    text-sm rounded "  > Bid for {{ formatCurrencyAmount( offer.currencyTokenAmount ) }} ETH </div> 
               </div>
           </div>


         </div>


         <div v-if="!hasApprovedAll && ownedByLocalUser()">


                    
                <div class="my-8 ">

                  <div class="p-2 px-8 border-2 text-black border-black inline cursor-pointer bg-green-400 rounded hover:bg-green-200" @click="approveAllNFT"> Approve All </div>
                </div>


              </div> 

     
     
     </div> 
</template>


<script>
import StarflaskAPIHelper from '../../js/starflask-api-helper'

const StoreContractABI = require( '../../contracts/BlockStoreABI.json'  )


const envName = process.env.NODE_ENV

const FrontendConfig = require('../../config/FrontendConfig.json')[envName]


const web3utils = require('web3').utils

const BN = web3utils.BN 

export default {
  name: 'OffersList',
  props: ['nftContractAddress',  'nftTokenId', 'web3Plug', 'tokenOwnerAddress', 'activeAccountAddress'],
  data() {
    return {
      validBuyOffers: [] ,

      hasApprovedAll: true,
      
    }
  },
  async created(){

   

  },

   async mounted (){

    //await this.fetchBuyOffers() 
 
    //await this.checkForApproval()

  },
  methods: {
      
      async fetchBuyOffers(){

         console.log(' fetchBuyOffers  ', this.nftContractAddress )


          let response = await StarflaskAPIHelper.resolveStarflaskQuery( FrontendConfig.marketApiRoot+'/api/v1/apikey',
           {"requestType": "get_orders_for_token", "input":{"contractAddress":this.nftContractAddress,"tokenId":  this.nftTokenId}  }    )

            console.log(' fetchBuyOffers response',response)

            let ordersForNFT = response.output.slice(0,5000)

          //let ordersFromOwner = ordersForNFT.filter(x => x.orderCreator.toLowerCase() == this.tokenOwnerAddress.toLowerCase()  )

            let buyOrders = ordersForNFT.filter(x => x.isSellOrder == false  ) 

            try{ 
             let currentBlockNumber = await this.web3Plug.getBlockNumber()
             let unexpiredBuyOrders = buyOrders.filter(x => x.expires > currentBlockNumber)
             this.validBuyOffers = unexpiredBuyOrders.sort( (a,b) => {return b.currencyTokenAmount - a.currencyTokenAmount}  )

            
            }catch(e){
              this.validBuyOffers = buyOrders.sort( (a,b) => {return b.currencyTokenAmount - a.currencyTokenAmount}  )
                console.error('could not fetch block number')
            }


            console.log('validBuyOffers',this.validBuyOffers)
 
 
      },

      formatCurrencyAmount(amountRaw){

        return parseFloat( this.web3Plug.rawAmountToFormatted(amountRaw,18) )

      },

      ownedByLocalUser(){
        if(!this.tokenOwnerAddress || !this.activeAccountAddress ) return false 
 
        return this.tokenOwnerAddress.toLowerCase() == this.activeAccountAddress.toLowerCase()
      },


      async acceptOffer(orderToFulfill){


        //check for approval 
        let hasApproval = await this.checkForApproval()

        console.log('has approval', hasApproval)
        if(!hasApproval)return; 



        let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

        let storeContractAddress = contractData['blockstore'].address
 
        let orderInputs = [
          orderToFulfill.orderCreator, 
          orderToFulfill.nftContractAddress,
          orderToFulfill.nftTokenId,
          orderToFulfill.currencyTokenAddress,
          new BN( orderToFulfill.currencyTokenAmount.toString()),
          orderToFulfill.nonce,
          orderToFulfill.expires,
          orderToFulfill.signature
        ]

        let txEthValue = 0 
 

        let storeContract = this.web3Plug.getCustomContract( StoreContractABI, storeContractAddress )
  
        let response = await storeContract.methods.sellNFTUsingBuyOrder(  ...orderInputs  )
        .send({from: this.web3Plug.getActiveAccountAddress()   })



      },




        async checkForApproval(){ 

          let activeNetworkId = this.web3Plug.getActiveNetId() 

          if(!activeNetworkId) activeNetworkId = 1;   

          let contractData = this.web3Plug.getContractDataForNetworkID(activeNetworkId)

          let storeContractAddress = contractData['blockstore'].address

          if(!this.nftContractAddress || !this.web3Plug.getActiveAccountAddress()){
            console.error('invalid network connection')
            return 
          }else(
            console.log('addy is ', this.nftContractAddress)
          )

          let response = await this.web3Plug.getNFTAllowance(  this.nftContractAddress, storeContractAddress, this.web3Plug.getActiveAccountAddress() )

           
          if(response){
            this.hasApprovedAll = true 
          }else{
            this.hasApprovedAll = false 
          }

        return this.hasApprovedAll
          


        },

        async approveAllNFT(){
          console.log('approve all ')

          let contractData = this.web3Plug.getContractDataForActiveNetwork() ;

          let storeContractAddress = contractData['blockstore'].address
  


          let response = await this.web3Plug.getNFTContract(this.nftContractAddress).methods
          .setApprovalForAll( storeContractAddress, true )
          .send( {from: this.web3Plug.getActiveAccountAddress()}  )


        },

        
        connectedToWeb3(){
          return this.web3Plug.connectedToWeb3()
        },

        connectToWeb3(){
          this.web3Plug.connectWeb3()
        }

  }
}
</script>
