# Toadz Market Web


 Finished: 
 -can place bids and asks, can fulfill them with contract . 


### TODO NOW 
 
TODO: 
-make tiles on the index look better !  show the current user and buyout price 
        * populated the cachedNFTTile data in mongo with the buyout and owner data !! so then it will show through in the frontend data from GET 
 

-make the API more ironclad against direct access/attacks/injection 

 


### TODO LATER
- add merkle proof type bids to smart contract (testnet) 
- build a bot that can be run locally (easily) with html frontend for placing bids on certain types of toadz [bid 10 eth for any wild-white w merkle proofing ]


- throw toadz metadata into mongo, also store the traits and an array of toadIds with those traits.    this will be used to build the merkle proofs for bidding. 


 


Toadz on rinkeby: 
0x70BC4cCb9bC9eF1B7E9dc465a38EEbc5d73740FB

 

### Development commands
```
npm install
npm run server-dev  (in terminal 1 - backend server)
npm run dev  (in terminal 2 - frontend server)
```

### Packaging commands
```
npm run build
npm run server
```
 
