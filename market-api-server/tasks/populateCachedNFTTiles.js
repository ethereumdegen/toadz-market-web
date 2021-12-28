 
import FileHelper from '../lib/file-helper.js'

 import AppHelper from '../lib/app-helper.js'

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

    let contractAddress = AppHelper.contractCollectionNameToContractAddress(collectionName)
    contractAddress = AppHelper.toChecksumAddress(contractAddress)

    tokenDataArray.push({
          collectionName:  collectionName,
          contractAddress: contractAddress,
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


  let tilesMissingContractAddress = await nftTilesModel.find({contractAddress: {$exists:false}})
  for(let tile of tilesMissingContractAddress){

    let contractAddress = AppHelper.contractCollectionNameToContractAddress(tile.collectionName)
    contractAddress = AppHelper.toChecksumAddress(contractAddress)

    await nftTilesModel.updateOne({_id:tile._id}  , {contractAddress:contractAddress} )

  }

  let tilesMissingCombinedAssetId = await nftTilesModel.find({combinedAssetId: {$exists:false}})
  for(let tile of tilesMissingCombinedAssetId){

    let combinedAssetId = AppHelper.getCombinedAssetId(tile.contractAddress,tile.tokenId)

    await nftTilesModel.updateOne({_id:tile._id}  , {combinedAssetId:combinedAssetId} )

  }
 
  
 console.log(`PopulateCachedNFTTilesTask ${collectionName}: task complete.`)
    

}


} 


 