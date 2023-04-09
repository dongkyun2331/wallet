import { useState, useEffect } from "react";
import chainIds from "../chainList/chainIds";
import axios from "axios";

const Coin = (props) => {
  const { isConnected, currentBalance, chainId } = props;

  const [coinPrice, setCoinPrice] = useState(null);
  const [setLoading] = useState(true);
  const [setError] = useState(null);

  useEffect(() => {
    const fetchCoinPrice = async () => {
      try {
        const symbol = chainIds[chainId]?.symbol || "ETH"; // 체인 ID에 맞는 코인 심볼을 선택합니다. 없으면 "ETH"를 기본값으로 사용합니다.
        const response = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
        );
        setCoinPrice(response.data.price);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchCoinPrice();
  }, []);

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
          <li>
            <div className="price">
              {coinPrice ? Number(coinPrice).toFixed(2) : ""}
            </div>
          </li>
        </ul>
      ) : (
        <ul className="coin">
          <li>
            <span>
              <div className="icon">
                <img src="./images/ethereum.webp" alt="" />
              </div>
            </span>
            <span>
              <div className="name">이더리움</div>
              <div className="symbol">ETH</div>
            </span>
          </li>
          <li>
            <div className="balance">0.0000</div>
          </li>
          <li>
            <div className="price">
              {coinPrice ? Number(coinPrice).toFixed(2) : ""}
            </div>
          </li>
        </ul>
      )}
    </>
  );
};

export default Coin;
