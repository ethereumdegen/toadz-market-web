
 import axios from 'axios'

const assetLookup = {

    "0x1CB1A5e65610AEFF2551A50f76a87a7d3fB649C6":{name:"Cryptoadz",chainId:1}, 
  
    "0x70BC4cCb9bC9eF1B7E9dc465a38EEbc5d73740FB":{name:"Cryptoadz",chainId:4} 
 


} 


export default class AssetDataHelper {


  static getCollectionNameForContractAddress(contractAddress, chainId){

    return 'Cryptoadz'

  }

    static getCollectionNameForAsset( contractAddress, tokenId   )
    {

      console.log('alalla',contractAddress)
        if(!contractAddress) return 'Unknown'
        
        let assetLookupData = assetLookup[contractAddress]


        console.log('alalla2',assetLookupData)

        if(assetLookupData){
            let contractName = assetLookupData.name 

            return contractName
        }
  
          return 'Unknown'
  
      }

    /*  static getProjectNameForProjectId( projectId   )
  {

        let projectName = abProjectLookup[projectId]
        
        if(projectName){
            return projectName 
        }

        return 'Unknown'    
  }*/

  static getProjectNameForAsset( contractAddress, tokenId   )
  {

    if(!contractAddress) return 'Unknown'

    let assetLookupData = assetLookup[contractAddress]

    console.log('assetLookupData',assetLookupData)

    if(assetLookupData){
        let contractName = assetLookupData.name 

       
        if(contractName) return contractName
 

        return 'Unknown'

    }

    contractAddress = contractAddress.toLowerCase()

     
  }


  static getProjectDataForProjectId(projectId){

    return {name: AssetDataHelper.getProjectNameForProjectId(projectId) }

  }
/*
  static async fetchProjectDataForProjectId(projectId){
    let previewTokenId = projectId * 1000000 

    return await  AssetDataHelper.fetchProjectDataForTokenId( previewTokenId  )

    
    }


  static async fetchProjectDataForTokenId(tokenId){

    return axios.get(`https://token.artblocks.io/${tokenId}`);

  }*/
 





}