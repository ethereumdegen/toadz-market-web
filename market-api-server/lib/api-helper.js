 
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'
    
    import EIP712Utils from '../../src/js/EIP712Utils.js'
 
    import AppHelper from './app-helper.js'
    //import ApplicationManager from './application-manager.js'
    
 
    export default class APIHelper  {
    
        constructor(   ){
           
           
        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, appId, vibegraphInterface, mongoInterface){
           
            let inputData = request.body 


            if(inputData.requestType == 'recent_activity'){
 
                let inputParameters = inputData.input
   
                let results = await APIHelper.findRecentActivity(inputParameters.filterCollections, mongoInterface)
 
                return {success:true, input: inputParameters, output: results  }
            } 


            if(inputData.requestType == 'personal_activity'){
 
                let inputParameters = inputData.input
   
                let results = await APIHelper.findPersonalActivity(inputParameters.publicAddress , inputParameters.filterCollections, mongoInterface)
 
                return {success:true, input: inputParameters, output: results  }
            } 

            
            

            //save a new buy or sell order to the server 
            if(inputData.requestType == 'save_new_order'){
 
                let inputParameters = inputData.input
   
                let results = await APIHelper.saveNewOrder(inputParameters , mongoInterface)

                if(!results.success){
                    return results 
                }

                //await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            } 


            if(inputData.requestType == 'get_vibegraph_status'){
                let inputParameters = inputData.input
   
                let results = await APIHelper.getVibegraphStatus( vibegraphInterface)

                return {success:true, input: inputParameters, output: results  }
            }


            if(inputData.requestType == 'get_orders_for_token'){
                let inputParameters = inputData.input
   
                let results = await APIHelper.findAllOrdersByToken(inputParameters.contractAddress, inputParameters.tokenId , mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'get_orders_for_token_range'){
                let inputParameters = inputData.input
 
   
                let results = await APIHelper.findAllOrdersByTokenRange(inputParameters.contractAddress, inputParameters.tokenIdStart, inputParameters.tokenIdEnd , mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'get_orders_for_account'){
                let inputParameters = inputData.input
   
                let results = await APIHelper.findAllOrdersByAccount(inputParameters.accountAddress , mongoInterface)

                return {success:true, input: inputParameters, output: results  }

            }



            // ERC 721 

            if(inputData.requestType == 'ERC721_balance_by_owner'){
 
                let inputParameters = inputData.input
 

                let results = await APIHelper.findAllERC721ByOwner(inputParameters.publicAddress, inputParameters.filterNFTcontracts  , vibegraphInterface)

              
                return {success:true, input: inputParameters, output: results  }
            } 



            if(inputData.requestType == 'ERC721_balance_by_contract'){
 
                let inputParameters = inputData.input
 

                let results = await APIHelper.findAllERC721ByContract(inputParameters.contractAddress , vibegraphInterface)

              
                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC721_by_token'){
 
                let inputParameters = inputData.input
  
                let results = await APIHelper.findAllERC721ByTokenId(inputParameters.contractAddress,inputParameters.tokenId , vibegraphInterface)

                
                return {success:true, input: inputParameters, output: results  }
            }

            //traits data 
 
            if(inputData.requestType == 'all_collection_traits'){
 
                let inputParameters = inputData.input
  
                let results = await APIHelper.getTraitsListForCollection( inputParameters.collectionName , mongoInterface)
 
                return {success:true, input: inputParameters, output: results  }
            }


            if(inputData.requestType == 'ERC721_by_trait_value'){
 
                let inputParameters = inputData.input
  
                let results = await APIHelper.findAllERC721ByTraitValue( inputParameters.collectionName, inputParameters.traitName ,inputParameters.traitValue, mongoInterface)
 
                return {success:true, input: inputParameters, output: results  }
            }


            

            if(inputData.requestType == 'NFTTile_by_token_id'){
 
                let inputParameters = inputData.input
  
                let results = await APIHelper.findNFTTileByTokenId( inputParameters.collectionName, inputParameters.tokenId,  mongoInterface)
 
                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'NFTTiles_by_trait_value'){
 
                let inputParameters = inputData.input
  
                let results = await APIHelper.findAllNFTTilesByTraitValue( inputParameters.collectionName, 
                    inputParameters.traitName ,
                    inputParameters.traitValue,
                    inputParameters.page,
                    inputParameters.maxItemsPerPage,
                     mongoInterface)
 
                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'NFTTiles_by_owner'){
 
                let inputParameters = inputData.input
  
                let results = await APIHelper.findAllNFTTilesByOwner(  inputParameters.publicAddress ,inputParameters.filterNFTcontracts, mongoInterface)
 
                return {success:true, input: inputParameters, output: results  }
            }

            
 
             
        }


       
 


        static validateOrderData(orderData){

            if(typeof orderData.chainId == 'undefined') return false; 
            if(typeof orderData.storeContractAddress == 'undefined') return false; 


            if(typeof orderData.orderCreator == 'undefined') return false; 
            if(typeof orderData.nftContractAddress == 'undefined') return false; 
            if(typeof orderData.nftTokenId == 'undefined') return false; 
            if(typeof orderData.currencyTokenAddress == 'undefined') return false; 
            if(typeof orderData.currencyTokenAmount == 'undefined') return false; 
            
            if(typeof orderData.nonce == 'undefined') return false;  
            if(typeof orderData.expires == 'undefined') return false;  
            if(typeof orderData.signature == 'undefined') return false;  

            return true
        }
             
        static async saveNewOrder( inputParameters, mongoInterface ){
            //validate the order 

            let recoveredSigner = EIP712Utils.recoverOrderSigner(  inputParameters   )

           


            let isValid = APIHelper.validateOrderData(inputParameters)

            if(!isValid){
                return { success:false, message:"invalid input parameters for order" }
            }

            let newOrderData = {
                chainId: parseInt(inputParameters.chainId),
                storeContractAddress: AppHelper.toChecksumAddress(inputParameters.storeContractAddress),

                orderCreator: AppHelper.toChecksumAddress(inputParameters.orderCreator),
                isSellOrder: !!inputParameters.isSellOrder,
                nftContractAddress: AppHelper.toChecksumAddress(inputParameters.nftContractAddress),
                nftTokenId: parseInt(inputParameters.nftTokenId),
                currencyTokenAddress: AppHelper.toChecksumAddress(inputParameters.currencyTokenAddress),
                currencyTokenAmount:  (inputParameters.currencyTokenAmount).toString(),
                nonce: inputParameters.nonce.toString(),
                expires: parseInt(inputParameters.expires),
                signature: inputParameters.signature.toString()            
            } 

            newOrderData.createdAt = Date.now()
            newOrderData.combinedAssetId = AppHelper.getCombinedAssetId( newOrderData.nftContractAddress, newOrderData.nftTokenId  )

            //check the signature for validity here 

            let signerIsValid = recoveredSigner.toLowerCase() == newOrderData.orderCreator.toLowerCase()

            if(!signerIsValid) return {success:false,  message: "Invalid signature"}
 
           

            let existingOrder = await mongoInterface.marketOrdersModel.findOne({signature: newOrderData.signature} )
            if(existingOrder)  return {success:false,  message: "Order already saved"}

            let inserted = await mongoInterface.marketOrdersModel.insertMany([newOrderData])
            
            return {success:true,  insertion: inserted}
        }





        static async getVibegraphStatus(vibegraphInterface){
            return await vibegraphInterface.contractStateModel.find()
        }
        //   add limits 

        static async findAllOrdersByToken(contractAddress, tokenId, mongoInterface){
            contractAddress = AppHelper.toChecksumAddress(contractAddress)
            tokenId = parseInt(tokenId)
            return await mongoInterface.marketOrdersModel.find({nftContractAddress: contractAddress, nftTokenId:tokenId, status: "valid"   })
        }

        static async findAllOrdersByTokenRange(contractAddress, tokenIdMin, tokenIdMax, mongoInterface){
            contractAddress = AppHelper.toChecksumAddress(contractAddress)
            tokenIdMin = parseInt(tokenIdMin)
            tokenIdMax = parseInt(tokenIdMax)
            return await mongoInterface.marketOrdersModel.find({nftContractAddress: contractAddress, nftTokenId:{$gte:tokenIdMin,$lte:tokenIdMax},  status: "valid"  })
        } 

        static async findAllOrdersByAccount(accountAddress, mongoInterface){
            accountAddress = AppHelper.toChecksumAddress(accountAddress)
            return await mongoInterface.marketOrdersModel.find({accountAddress: accountAddress,  status: "valid" })
        }


 
        static async findAllERC721ByOwner(publicAddress,filterNFTContracts, mongoInterface){
            publicAddress = AppHelper.toChecksumAddress(publicAddress)

           

            if(filterNFTContracts && filterNFTContracts.length > 0){
 
                filterNFTContracts = filterNFTContracts.map( x => AppHelper.toChecksumAddress(x) )
                return await mongoInterface.erc721BalancesModel.find({accountAddress: publicAddress, contractAddress: {$in:  filterNFTContracts  } })
            }

             
            return await mongoInterface.erc721BalancesModel.find({accountAddress: publicAddress })
        }



        static async findAllERC721ByContract(contractAddress,mongoInterface){
            contractAddress = AppHelper.toChecksumAddress(contractAddress)
            return await mongoInterface.erc721BalancesModel.find({contractAddress: contractAddress })
        }

        static async findAllERC721ByTokenId(contractAddress,tokenId,mongoInterface){
            contractAddress = AppHelper.toChecksumAddress(contractAddress)
            return await mongoInterface.erc721BalancesModel.find({contractAddress: contractAddress, tokenIds:tokenId })
        }

        
       
        static async getTraitsListForCollection(collectionName,mongoInterface){

            collectionName = APIHelper.sanitizeString(collectionName)

            
            let results = await mongoInterface.traitsModel.find({collectionName: collectionName })   // mongoInterface.findAll('nft_traits',{collectionName: collectionName })
            
            return results.map((x) =>  {
                return {collectionName: x.collectionName,traitType: x.traitType, value: x.value}
             })
        }

        

        static async findAllERC721ByTraitValue(collectionName,traitName,traitValue,mongoInterface){
            collectionName = APIHelper.sanitizeString(collectionName)
            traitName = APIHelper.sanitizeString(traitName)
            traitValue = APIHelper.sanitizeString(traitValue)

            traitName = (traitName).toLowerCase()
            traitValue = (traitValue).toLowerCase() 
            
            console.log('find ', collectionName, traitName , traitValue)
            return await mongoInterface.traitsModel.findOne({collectionName: collectionName, traitTypeLower: traitName, valueLower: traitValue })
             
        }



        static async findRecentActivity(filterCollections, mongoInterface){
            let filterContractAddresses = filterCollections.map(name =>  AppHelper.contractCollectionNameToContractAddress(name))
            filterContractAddresses = filterContractAddresses.map(address => AppHelper.toChecksumAddress(address))

            let ONE_DAY =24*60*60*1000
            let RECENT_TIME = Date.now() - ONE_DAY 

            let allOrders = await mongoInterface.marketOrdersModel
            .find({nftContractAddress: {$in: filterContractAddresses}, createdAt: {$gte: RECENT_TIME} })
            .sort({'createdAt': -1}) //sort DESC 
            .limit(100)

            return {recentOrders: allOrders}
        }


        static async findPersonalActivity(publicAddress, filterCollections, mongoInterface){
            
            publicAddress = AppHelper.toChecksumAddress(publicAddress)
            
            let filterContractAddresses = filterCollections.map(name =>  AppHelper.contractCollectionNameToContractAddress(name))
            filterContractAddresses = filterContractAddresses.map(address => AppHelper.toChecksumAddress(address))

            let ONE_MONTH = 30*24*60*60*1000
            let RECENT_TIME = Date.now() - ONE_MONTH 

            let personalSellOrders = await mongoInterface.marketOrdersModel
            .find({status:'valid', isSellOrder:true, orderCreator:publicAddress,nftContractAddress: {$in: filterContractAddresses}, createdAt: {$gte: RECENT_TIME} })
            .sort({'createdAt': -1}) //sort DESC 
            .limit(100)




            let ownedAssetIds = await APIHelper.getAllOwnedAssetIds( publicAddress,mongoInterface )


            let personalBidOrders = await mongoInterface.marketOrdersModel
            .find({status:'valid', isSellOrder:false, combinedAssetId: {$in: ownedAssetIds}  , createdAt: {$gte: RECENT_TIME} })
            .sort({'createdAt': -1}) //sort DESC 
            .limit(100)

            return {recentOrders: personalSellOrders.concat(personalBidOrders)   }
        }


        static async getAllOwnedAssetIds( publicAddress, mongoInterface  ){

            let nftTiles = await mongoInterface.cachedNFTTileModel.find({
                ownerPublicAddress: publicAddress
            })


            let combinedAssetIds = nftTiles.map(tile => tile.combinedAssetId )

            return combinedAssetIds
        }

        static async findNFTTileByTokenId(collectionName,tokenId,mongoInterface){
            let tile = await mongoInterface.cachedNFTTileModel.findOne({collectionName: collectionName, tokenId: tokenId })

            return tile
        }

        static async findAllNFTTilesByTraitValue(collectionName,traitName,traitValue, currentPage, maxItemsPerPage,  mongoInterface){
            
            let allTiles = []

           if( traitName && traitValue){

            traitName = APIHelper.sanitizeString(traitName)
            traitValue = APIHelper.sanitizeString(traitValue)

            let traitsRecord = await APIHelper.findAllERC721ByTraitValue(collectionName,traitName,traitValue,mongoInterface)

            let tokenIdArray = traitsRecord.tokenIdArray

            
            let filterArray = []
            for(let entry of tokenIdArray){
                filterArray.push(parseInt(entry))
            }
  

             allTiles = await mongoInterface.cachedNFTTileModel.find({collectionName: collectionName, tokenId: {$in:filterArray} })
         
            }else{
           
            allTiles = await mongoInterface.cachedNFTTileModel.find({collectionName: collectionName  })

           }
           
            //sort the tiles by buyout price, whatever 

           
            const nftTileBuyoutSort = (a,b)=> {

                if(a.lowestBuyoutPriceWei && !b.lowestBuyoutPriceWei){
                    return -1
                 }
                 if(b.lowestBuyoutPriceWei && !a.lowestBuyoutPriceWei){
                     return 1
                  }
                 
                 return (a.lowestBuyoutPriceWei) - (b.lowestBuyoutPriceWei)
              }

            allTiles.sort(nftTileBuyoutSort)

            let totalGroupLength = allTiles.length
 
            let {startIndex,endIndex} = APIHelper.getPagesStartEnd(currentPage, maxItemsPerPage )

            return {tiles: allTiles.slice(startIndex,endIndex), totalTilesInGroup: totalGroupLength }
        }   

        static async findAllNFTTilesByOwner(ownerAddress, filterNFTCollections, mongoInterface){
            ownerAddress = AppHelper.toChecksumAddress(ownerAddress)

            let allTiles = await mongoInterface.cachedNFTTileModel.find({ownerPublicAddress: ownerAddress, collectionName: {$in: filterNFTCollections}})
 

            return allTiles
        }


        static getPagesStartEnd(currentPage, maxItemsPerPage){

            let startIndex = (currentPage-1) * maxItemsPerPage;
            let endIndex = startIndex+maxItemsPerPage

            return {startIndex,endIndex}
        }


        static sanitizeString(s){
            if(!s) return s

            return s.replace('$','')
        }
         
    }