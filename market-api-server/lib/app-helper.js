 
    import web3utils from 'web3-utils'
    import ObjectId from 'mongodb';
 
    export default class AppHelper  {
    
      

        static toChecksumAddress(address){            
            return web3utils.toChecksumAddress(address)
        }

         //fix me !! convert nftContractAddress
        static contractAddressToCollectionName(contractAddress){
            return 'Cryptoadz'
        }  
        
        
        static mongoIdToNumber(mongoId){
            return mongoId.valueOf()

        }

        static numberToMongoId(n){
            return ObjectId(n)
        }
    }