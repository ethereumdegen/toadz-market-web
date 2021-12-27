import axios from 'axios'

import fs from 'fs'
import path from 'path'
 
import MerkleTree from 'merkletreejs'
 
import keccak256 from 'keccak256'

import Web3 from 'web3'
import FileHelper from '../lib/file-helper.js'
 
let web3 = new Web3() 
 

let fetchConfig = FileHelper.readJSONFile('./tasks/fetchConfig.json')
 

async function runTask(){




let totalSupply = fetchConfig.totalSupply

let collectionName = fetchConfig.collectionName
 
let contractData


let tokenIds = [] 


let traitsMap = {} 
 


for(let offset=0; offset<totalSupply; offset+=50){


    let URI = `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${offset}&limit=50&collection=${collectionName}`
 
    const res = await axios.get( URI )

    console.log(res)

    

    for(let asset of res.data.assets){

        tokenIds.push(asset.token_id)


        await downloadImage(asset.token_id, asset.image_url)

      //  console.log('asset', asset )

        //console.log('traits', asset.traits )
        traitsMap[asset.token_id] = asset.traits 


    }

    if(!contractData){
        contractData = res.data.assets[0].asset_contract

        console.log(contractData)
    }
       

} 


/*
 tokenIds =["51201088056672189460196012059775003102151447965530397152643423201759844106241", 
 "51201088056672189460196012059775003102151447965530397152643423205058378989569",
"51201088056672189460196012059775003102151447965530397152643423206157890617345"]*/

 // artblox (rinkeby)

// 0x388f486dbcbe05029ba7adf784459b580b427032
// 0x1ae795286c5dd0cad1dd38aef9a3015558e9d303ec7474e5e59abc16a43abbd6


//duckies  (rinkeby) 
//0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656
//0x5d19e0d8a40af2b78a71042065480c76daa8765c08a97c76e32e27e6f8f87b16



//duckies  (mainnet) 
//0x495f947276749ce646f68ac8c248420045cb7b5e
//0x1f3ad541610ae5e7768e8f37148ec6e78a50ce87b49dd2fb6bf914d1e3680365

/*
const leaves = tokenIds.map((x ) => Web3.utils.keccak256( web3.eth.abi.encodeParameter('uint256', x ) ))
const tree = new MerkleTree(leaves, keccak256, {sortPairs: true})

const hexRoot = tree.getHexRoot()



let data = {
    contractData: contractData,
    tokenIds: tokenIds,
    hexRoot: hexRoot

}*/

//console.log("found token ids ", tokenIds.length )
//console.log("hexRoot is ", hexRoot )


 // fs.writeFileSync( path.join ( "./output/outputconfig.json" ) , JSON.stringify( traitsMap ) );
 



}


runTask() 




async function  downloadImage(tokenId, url){

    let image_path = path.join ( `./output/${tokenId}.jpg` )

    return new Promise(async (resolve, reject) => {
        const writer = fs.createWriteStream(image_path)


        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })

        response.data.pipe(writer)

        writer.on('finish', () => resolve())
        writer.on('error', reject)
    })

}