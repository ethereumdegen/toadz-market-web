



export default class MathHelper {

static rawAmountToFormatted(amount,decimals)
{
  return (amount * Math.pow(10,-1 * decimals)).toFixed(decimals);
}

static formattedAmountToRaw(amountFormatted,decimals)
{

  var multiplier = new BigNumber( 10 ).exponentiatedBy( decimals ) ;


  return multiplier.multipliedBy(amountFormatted).toFixed() ;
}

static formatFloat(f){
  return parseFloat(parseFloat(f).toFixed(3))
}

static expirationTimeFormatted(currentBlock, expirationBlock){
  let blockDelta = expirationBlock - currentBlock

  //let timeEstimateSeconds = blockDelta * 15 
  let days = MathHelper.getDaysFromBlocks(blockDelta)

  if(days < 30){
    return days.toString().concat(' days')
  }else{
    return Math.ceil(days/30).toString().concat(' months')
  }
  
}



static getDaysFromBlocks(blocks){
  return parseFloat(blocks / 5760).toFixed(2)
} 



}