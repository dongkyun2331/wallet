import { useState, useEffect } from "react";
import chainIds from "../chainList/chainIds";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Web3 from "web3";
import TradingViewWidget, { Themes } from "react-tradingview-widget";

const web3 = new Web3(Web3.givenProvider);

const Coin = (props) => {
  const { isConnected, currentBalance, chainId, walletAddress } = props;

  const [coinPrice, setCoinPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCoinChartOpen, setIsCoinChartOpen] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCopyClick = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

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
  }, [chainId]);

  const displayCurrentBalance = `${currentBalance?.toFixed(4)}`;

  const evaluation = coinPrice ? currentBalance * coinPrice : 0;
  const displayEvaluation = evaluation ? evaluation.toFixed(2) : "0.00";

  const handleDepositClick = () => {
    setIsDepositOpen(true);
  };

  const handleWithdrawClick = () => {
    setIsWithdrawOpen(true);
  };

  const handleCloseClick = () => {
    setIsDepositOpen(false);
    setIsWithdrawOpen(false);
    setInputValue(false);
    setIsCoinChartOpen(false);
  };

  const handleMaxClick = () => {
    setInputValue(displayCurrentBalance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    await web3.eth.sendTransaction({
      from: account,
      to: e.target.withdrawAddress.value,
      value: web3.utils.toWei(e.target.withdrawAmount.value, "ether"),
    });
    handleCloseClick();
  };

  const handleCoinnameClick = () => {
    setIsCoinChartOpen(true);
  };

  return (
    <>
      {isConnected ? (
        <div>
          <ul className="coin">
            <li className="coin-name" onClick={handleCoinnameClick}>
              <span>
                <div className="icon">{chainIds[chainId].icon}</div>
              </span>
              <span>
                <div className="name">{chainIds[chainId].name}</div>
                <div className="symbol">{chainIds[chainId].symbol}</div>
              </span>
            </li>
            <li className="li-box">
              <div>{displayCurrentBalance}</div>
            </li>
            <li className="li-box">
              <div>{coinPrice ? Number(coinPrice).toFixed(4) : ""}</div>
            </li>
            <li className="li-box">
              <div>{displayEvaluation}</div>
            </li>
            <li className="button">
              <button className="deposit" onClick={handleDepositClick}>
                입금
              </button>
              <button className="withdraw" onClick={handleWithdrawClick}>
                출금
              </button>
            </li>
          </ul>
          {(isDepositOpen || isWithdrawOpen || isCoinChartOpen) && (
            <div>
              <div className="dimm" onClick={handleCloseClick}></div>
              {isDepositOpen && (
                <div className="depositpage">
                  <article className="modal-title">입금</article>
                  <img
                    className="close"
                    onClick={handleCloseClick}
                    src="./images/ic-modal-close.svg"
                    alt=""
                  />
                  <p className="text-gray">
                    아래 지갑 주소로 입금해주세요. 거래소(개인지갑)에서 보유
                    중인 자산을 입금할 수 있습니다.
                  </p>
                  <strong>입금 주소</strong>
                  <div className="wallet-address">
                    <div className="address">
                      <span className="three">{walletAddress.slice(0, 3)}</span>
                      <span>{walletAddress.slice(3, -3)}</span>
                      <span className="three">{walletAddress.slice(-3)}</span>
                    </div>
                    <CopyToClipboard
                      text={walletAddress}
                      onCopy={handleCopyClick}
                    >
                      <button className="copy-button">
                        {isCopied ? "복사 완료" : "복사"}
                      </button>
                    </CopyToClipboard>
                  </div>
                  <div className="line"></div>
                  <strong>입금 안내</strong>
                  <ul className="warning">
                    <li className="warning_item">
                      <span className="three">
                        다른 암호화폐를 입금하는 경우
                      </span>
                      <span>자산 복구가 불가능합니다.</span>
                    </li>
                    <li className="warning_item">
                      <span>블록체인 특성 상 </span>
                      <span className="three"> 입금주소 오입력</span>
                      <span>으로 인해 발생하는 자산 손실에 대해</span>
                      <span className="three">복구가 불가능합니다.</span>
                    </li>
                  </ul>
                </div>
              )}
              {isWithdrawOpen && (
                <form className="withdrawpage" onSubmit={handleSubmit}>
                  <div className="box">
                    <article className="modal-title">출금</article>
                    <img
                      className="close"
                      onClick={handleCloseClick}
                      src="./images/ic-modal-close.svg"
                      alt=""
                    />
                    <p className="text-gray">
                      유저가 선택한 네트워크로 출금합니다.
                    </p>
                    <strong>출금 수량</strong>
                    <input
                      type="number"
                      id="withdrawAmount"
                      placeholder="0"
                      step="0.0001"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    <div className="exchange-value-input">
                      <span>출금 가능</span>
                      <span className="pointer">{displayCurrentBalance}</span>
                      <button
                        className="exchange-value-input-max"
                        onClick={handleMaxClick}
                      >
                        max
                      </button>
                    </div>
                    <strong>출금 주소</strong>
                    <input
                      type="text"
                      id="withdrawAddress"
                      placeholder="자산을 전송 받을 주소를 입력해주세요"
                    />
                    <strong>출금 안내</strong>
                    <ul className="warning">
                      <li className="warning_item">
                        출금 신청이 완료되면 취소가 불가능하며, 다른 디지털 자산
                        지갑으로 잘못 출금하는 경우 자산 복구가 불가능합니다.
                      </li>
                      <li className="warning_item">
                        블록체인 특성 상{" "}
                        <span className="three">입금주소 오입력</span> 으로 인해
                        발생하는 자산 손실에 대해{" "}
                        <span className="three">복구가 불가능합니다.</span>
                      </li>
                      <li className="warning_item">
                        거래소로 전송하려는 경우, 해당 거래소가 컨트랙트를
                        사용하여 입금 가능한 거래소인지 반드시 확인해주세요.
                        컨트랙트 입금이 불가능한 경우, 먼저 개인 지갑으로 자산을
                        전송한 후, 다시 거래소로 입금하시는 것을 권장합니다
                      </li>
                    </ul>
                  </div>
                  <input type="submit" className="submit" value="다음 단계로" />
                </form>
              )}
              {isCoinChartOpen && (
                <div className="chart-wrapper">
                  <TradingViewWidget
                    symbol={`${chainIds[chainId].symbol}/USDT`}
                    theme={Themes.DARK}
                    locale="ko"
                    autosize
                    enable_publishing
                  />
                </div>
              )}
            </div>
          )}
        </div>
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
          <li className="li-box">
            <div>0.0000</div>
          </li>
          <li className="li-box">
            <div>{coinPrice ? Number(coinPrice).toFixed(2) : ""}</div>
          </li>
          <li className="li-box">
            <div>{displayEvaluation}</div>
          </li>
        </ul>
      )}
    </>
  );
};

export default Coin;
