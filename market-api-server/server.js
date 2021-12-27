


import MongoInterface from './lib/mongo-interface.js'

import DataGhost from './lib/dataghost.js' 

import FileHelper from './lib/file-helper.js'

import ExpressServer from './lib/express-server.js'

import PopulateTraitsTask from './tasks/populateTraitsDB.js'
import PopulateCachedNFTTilesTask from './tasks/populateCachedNFTTiles.js'

//import PacketReceiver from './lib/packet-receiver.js'
//import PacketCustodian from './lib/packet-custodian.js'

import Web3 from 'web3'
import NFTTileManager from './lib/nft-tile-manager.js'

let envmode = process.env.NODE_ENV

let serverConfigFile = FileHelper.readJSONFile('./market-api-server/config/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let dataghostConfigFile = FileHelper.readJSONFile('./market-api-server/config/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]

  async function start(){


      
    console.log('server config: ',serverConfig)


    let mongoInterface = new MongoInterface() 
    await mongoInterface.init(  serverConfig.dbName )

 
    await PopulateTraitsTask.runTask(mongoInterface)
    await PopulateCachedNFTTilesTask.runTask(mongoInterface)
 

    console.log('boot vibegraph interface ', dataghostConfig.vibeGraphConfig.dbName)

    let vibegraphInterface =  new MongoInterface() 
    await vibegraphInterface.init( dataghostConfig.vibeGraphConfig.dbName )
 

    //let web3 = new Web3( serverConfig.web3provider  )

    let web3 = new Web3(new Web3.providers.WebsocketProvider( serverConfig.web3provider, {
      clientConfig: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
      }
    }));


    let dataghost = new DataGhost()
    dataghost.init(web3  ) 

    //let packetReceiver = new PacketReceiver(web3, mongoInterface, wolfpackInterface, serverConfig)
 

    let nftTileManager = new NFTTileManager(web3,mongoInterface,vibegraphInterface,serverConfig)
    await nftTileManager.init() 


    //TODO: DO NOT pass vibegraph interface into this -> use the nft-tile-manager to coalesce all of the data into mongoInterface 
    let expressServer = new ExpressServer(web3,mongoInterface,vibegraphInterface, serverConfig )
      
    
    console.log('web3 ready with provider ',serverConfig.web3provider )
    

    //add this back in later 
    //let packetCustodian = new PacketCustodian(web3,mongoInterface, wolfpackInterface, serverConfig)



}

 
 start()