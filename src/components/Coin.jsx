import chainIds from "../chainList/chainIds";

// 외부 API 또는 블록체인 데이터를 조회하여 현재 코인의 가격 정보를 얻습니다.
async function getCoinPrice(coinSymbol) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinSymbol}&vs_currencies=usd`
  );
  const data = await response.json();
  return data[coinSymbol].usd;
}

const Coin = (props) => {
  const { isConnected, currentBalance, chainId } = props;

  const displayCurrentBalance = `${currentBalance?.toFixed(4)}`;

  return (
    <>
      {isConnected ? (
        <ul className="coin">
          <li>
            <span>
              <div className="icon">{chainIds[chainId].icon}</div>
            </span>
            <span>
              <div className="name">{chainIds[chainId].name}</div>
              <div className="symbol">{chainIds[chainId].symbol}</div>
            </span>
          </li>
          <li>
            <div className="balance">{displayCurrentBalance}</div>
          </li>
        </ul>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Coin;
