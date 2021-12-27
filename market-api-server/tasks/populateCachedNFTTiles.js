 
import FileHelper from '../lib/file-helper.js'

 

let outputConfig = FileHelper.readJSONFile('./market-api-server/output/toadzOutputData.json')
 
export default class PopulateCachedNFTTilesTask {


static async runTask(inputs, mongoInterface ){

    
let collectionName = inputs.collectionName 

if(collectionName.toLowerCase() == 'cryptoadz'){
    outputConfig = FileHelper.readJSONFile('./market-api-server/output/toadzOutputData.json')
}
if(collectionName.toLowerCase() == 'cryptoflyz'){
    outputConfig = FileHelper.readJSONFile('./market-api-server/output/flyzOutputData.json')
}



let tokenDataArray = []
  

for(let [tokenId,traitsArray] of Object.entries(outputConfig)){

    tokenDataArray.push({
        collectionName:  collectionName,
         tokenId: tokenId,
          nftTraits:traitsArray
 })

}   
 
const nftTilesModel =  mongoInterface.cachedNFTTileModel
 

try{
    await nftTilesModel.insertMany(tokenDataArray,{ ordered: false })
}catch(e){
      console.log(e)
  } 

 
  
 console.log(`PopulateCachedNFTTilesTask ${collectionName}: task complete.`)
    

}


} 


 