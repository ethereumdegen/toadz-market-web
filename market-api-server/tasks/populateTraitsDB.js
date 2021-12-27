 
import FileHelper from '../lib/file-helper.js'

//import MongoInterface from '../lib/mongo-interface.js'
 
 

let outputConfig = FileHelper.readJSONFile('./market-api-server/output/outputconfig.json')
 
export default class PopulateTraitsTask {


static async runTask( mongoInterface ){

  //  const dbName = 'toadz_market'

 //const mongoInterface = new MongoInterface()
 //await mongoInterface.init( dbName )

// console.log('outputConfig',outputConfig)

let traitsTokenIdMap = { } 
 


for(let [tokenId,traitsArray] of Object.entries(outputConfig)){

   // console.log('row value', tokenId, traitsArray )

    for(let trait of traitsArray){
        let traitType = trait.trait_type.toString()
        let traitValue = trait.value
        
        if(!traitsTokenIdMap[traitType]){   
            traitsTokenIdMap[traitType] = {} 
        } 

        if(!traitsTokenIdMap[traitType][traitValue]){ 
            traitsTokenIdMap[traitType][traitValue] = []  
         
        }
        
        traitsTokenIdMap[traitType][traitValue].push(tokenId)
         
    }
    
    

}   
 
const traitsModel =  mongoInterface.traitsModel
await traitsModel.deleteMany({collectionName:'Cryptoadz'})


 for(let traitType of Object.keys(traitsTokenIdMap)){
      for(let traitValue of Object.keys(traitsTokenIdMap[traitType])){
  

                const instance =  new traitsModel({
                    collectionName:'Cryptoadz',
                    traitType: traitType,
                    value: traitValue,
                    tokenIdArray: traitsTokenIdMap[traitType][traitValue] 
                })
                await instance.save()


    }
 }

 console.log('PopulateTraitsTask: task complete.')
    

}


} 


 