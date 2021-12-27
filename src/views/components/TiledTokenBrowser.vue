<template>
  <div  >

    <div v-if="currentFilter && currentFilter.traitName" class="bg-gray-100 mb-2 p-2 rounded border-gray-800 border-2 inline-block  text-black"> {{currentFilter.traitName}}: {{currentFilter.traitValue}}  </div>
          <div class="" style="min-height:400px">
              <NftTile
                v-for="tokenData in activeNFTDataArray"
                v-bind:key="tokenData.tokenId"
              
                v-bind:collectionName="tokenData.collectionName"
                v-bind:nftTokenId="tokenData.tokenId"

                v-bind:nftData="tokenData"
 

                v-bind:clickedTileCallback="clickedTileCallback"
               />

            </div>

            <PaginationBar 
              :currentPage="currentPage"
              :maxPages="maxPages"
              :setCurrentPageCallback="setCurrentPageCallback"
             />


           </div>


</template>


<script> 
import StarflaskApiHelper from '../../js/starflask-api-helper.js'

import NftTile from './NftTile.vue';
import PaginationBar from './PaginationBar.vue';


const envName = process.env.NODE_ENV

const FrontendConfig = require('../../config/FrontendConfig.json')[envName]

export default {
  name: 'TiledTokenBrowser',
  props: [ 'collectionName', 'currentFilter' ],
  components: {NftTile,PaginationBar},
  watch: {
    currentFilter: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        
        this.fetchFilteredTokensArray()
      }
    }
  },

  data() {
    return {
     // collectionName: null,
      //tokenArray: [],

      resultsDataArray : [],
    //  activeTokenIdArray: [],
      activeNFTDataArray: [],
      currentPage: 0,
      maxPages: 0,
      itemsPerPage: 25

    }
  },
  created(){

  },
  mounted(){
    this.fetchFilteredTokensArray()

  },
  methods: {
      async fetchFilteredTokensArray(){
        console.log('fetching results  - new current filter ', this.currentFilter)
        // this.currentFilter 

         let uri = FrontendConfig.marketApiRoot+'/api/v1/apikey'
          
 
         let inputQuery = Object.assign( {collectionName: this.collectionName }, this.currentFilter   )

 
         let result = await StarflaskApiHelper.resolveStarflaskQuery(uri,{"requestType": "NFTTiles_by_trait_value", "input": inputQuery})
           
           let input = result.input 
           let output = result.output 

         
 
           if(input && input.traitValue == this.currentFilter.traitValue && output){
               
              this.resultsDataArray = output
             
              this.currentPage = 1

                this.maxPages = Math.ceil( this.resultsDataArray.length / this.itemsPerPage ) + 1
                this.activeNFTDataArray = this.filterTokensForCurrentPage(this.resultsDataArray)

 
           }
        
      },

      filterTokensForCurrentPage(allTokenData){
        //sort 

        //slice 
        let startIndex = (this.currentPage-1) * this.itemsPerPage;
        let endIndex = startIndex+this.itemsPerPage

        console.log('start,end', startIndex, endIndex)

        return allTokenData.slice(startIndex,endIndex)
        
      },

      setCurrentPageCallback(newPage){
        console.log('newPage',newPage)
        this.currentPage = newPage 


        this.activeNFTDataArray = this.filterTokensForCurrentPage(this.resultsDataArray)


      },

      clickedTileCallback(row){
        //this.clickedTileCallback(row)
      }
  }
}
</script>
