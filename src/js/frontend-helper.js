 




export default class FrontendHelper {


  static lookupContractAddress(contractName, contractData){

    if(!contractData)return null 

    for(let key of Object.keys(contractData)){
      if(key.toLowerCase() == contractName.toLowerCase()){
        return contractData[key].address
      }
    }

    return null
  }

  

  



}