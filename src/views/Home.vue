<template>

<div>

   <div class="section    border-b-2 border-black px-0 lg:px-1">

     <div class=" ">
        <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>

  
   <div class="section  border-b-2 border-black ">


     <div class=" container mb-16 margin-center">
      
       <div class="grid md:grid-flow-col mt-32">

         


         <div class="  mt-8 py-8">


            <div class="w-row">
              <ToadzTileGrid 
              
              />
            </div>

          <div class="w-row text-center"> 


            
               <router-link to="/collection/cryptoadz" class='text-gray-200 text-xl inline text-align:center' style="margin:0 auto;"> Shop All Toadz </router-link>
               
                
            
           </div>

            <div class="w-row text-center mt-16"> 

 
              <router-link to="/collection/cryptoflyz" class='text-gray-200 text-xl inline text-align:center ' style="margin:0 auto;"> Shop Cryptoflyz </router-link>
               
            
           </div>

 

         </div>

 
         <div class="   column-2 w-col w-col-6 text-center ">

              <div class="py-32 " style="width:50%; margin: 0 auto;"> 
              
                  <img src="@/assets/images/swampz.png" width="300"  /> 
              
                  <FrontPageMedia />
              </div>
 
         </div>
       </div>
     </div>
   </div>


   <div class="section  bg-white border-b-2 border-black hidden ">
     <div class=" w-container">
       <div class="w-row">

       </div>
       <div class="w-row">

         


         <div class="column w-col w-col-6 mt-8 py-8">

            <div>
               <SearchBar    /> 
            </div>

              <router-link to="/newbid" class='text-gray-800 text-xl block'>-> Place a Bid for an NFT</router-link>
 

               <router-link to="/startselling" class='text-gray-800 text-xl block'>-> View and Sell your NFTs</router-link>
            <br>
           
           <br>

      


         </div>
         <div class="column-2 w-col w-col-6  ">
           
              <FrontPageMedia />

             



         </div>
       </div>
     </div>
   </div>


   



    
  <Footer/>

</div>
</template>


<script>



import Web3Plug from '../js/web3-plug.js' 


import SearchBar from './components/legacy/SearchBar.vue';
import Navbar from './components/Navbar.vue';
 
import Footer from './components/Footer.vue';
import ToadzTileGrid from './components/ToadzTileGrid.vue';
 
import FrontPageMedia from './components/FrontPageMedia.vue';
 
 

export default {
  name: 'Home',
  props: [],
  components: {Navbar, Footer, ToadzTileGrid,FrontPageMedia,SearchBar},
  data() {
    return {
      web3Plug: new Web3Plug() ,
      activePanelId: null 
        
      
    }
  },

  created(){

 
    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);
         
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
 

         
      }.bind(this));
   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);
         
        this.web3error = errormessage
       
      }.bind(this));

      this.web3Plug.reconnectWeb()

         
    
  },
  mounted: function () {
    
   
   
  }, 
  methods: {
          setActivePanel(panelId){
              if(panelId == this.activePanelId){
                this.activePanelId = null;
                return 
              }
               this.activePanelId = panelId ;
          },
          onTabSelect(tabname){
            console.log(tabname)

              this.selectedTab = tabname.toLowerCase()


          },
          

  }
}
</script>
