 
import FileHelper from '../lib/file-helper.js'
 
import fs from 'fs'
import path from 'path'

const assetDataTable =FileHelper.readJSONFile('./src/config/contractdata.json')


 
export default class GenerateContractDataLookupTask {




static generateAssetDataLookup(dataTable){
    let records = {} 
    console.log('dataTable',dataTable)
  
    for(let [networkName,contractsList] of Object.entries(dataTable)){
     
      for(let [contractName,contractInfo] of Object.entries(contractsList.contracts)){
  
        console.log('contractInfo',contractInfo)
  
        let contractAddress = contractInfo.address.toLowerCase()
  
          records[contractAddress] = {name: contractInfo.name, address: contractInfo.address, networkName: networkName}
  
      }  
   
    } 

    return records
  }

  

static async runTask( ){ 

   let dataLookup =  GenerateContractDataLookupTask.generateAssetDataLookup(assetDataTable)
   console.log('dataLookup',dataLookup)

   fs.writeFileSync( path.join ( "./src/config/generated/contractlookup.json" ) , JSON.stringify( dataLookup ) );
  
   console.log(`generateAssetDataLookup: task complete.`) 
     

}


} 


 