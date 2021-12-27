 
import FileHelper from '../lib/file-helper.js'

//import MongoInterface from '../lib/mongo-interface.js'
 
 

let outputConfig = FileHelper.readJSONFile('./market-api-server/output/outputconfig.json')
 
export default class PopulateCachedNFTTilesTask {


static async runTask( mongoInterface ){

  //  const dbName = 'toadz_market'

 //const mongoInterface = new MongoInterface()
 //await mongoInterface.init( dbName )

// console.log('outputConfig',outputConfig)

let tokenDataArray = []
  

for(let [tokenId,traitsArray] of Object.entries(outputConfig)){

    tokenDataArray.push({collectionName: "Cryptoadz", tokenId: tokenId})

}   
 
const nftTilesModel =  mongoInterface.cachedNFTTileModel
//await traitsModel.deleteMany({collectionName:'Cryptoadz'})


try{
    await nftTilesModel.insertMany(tokenDataArray,{ ordered: false })
}catch(e){
      console.log(e)
  } 

 
  
 console.log('PopulateCachedNFTTilesTask: task complete.')
    

}


} 


 