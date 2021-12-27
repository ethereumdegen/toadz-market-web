            import FileHelper from './file-helper.js'


    import web3utils from 'web3-utils'
    import ObjectId from 'mongodb';
 

    const envmode = process.env.NODE_ENV
   const contractData = FileHelper.readJSONFile('./market-api-server/config/contractdata.json')
         
    export default class AppHelper  {
    
      

        static toChecksumAddress(address){  
            if(!address)return address          
            return web3utils.toChecksumAddress(address)
        }

         //fix me !! convert nftContractAddress
        static contractAddressToCollectionName(contractAddress){

             let networkName = AppHelper.getNetworkName() 

            let contractDataForNetwork = contractData[networkName].contracts

            for(let [contractName,data] of Object.entries(contractDataForNetwork)){
                let address = data.address

                if( contractAddress.toLowerCase() == address.toLowerCase()   ){
                    return data.name
                } 
            } 

            return 'Cryptoadz'
        }  

        static getNetworkName(){

            if(envmode == 'production') return 'mainnet'

            return 'rinkeby'
        }
        
        
        static mongoIdToNumber(mongoId){
            return mongoId.valueOf()

        }

        static numberToMongoId(n){
            return ObjectId(n)
        }
    }