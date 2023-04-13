import { useState } from "react";
import chainIds from "../chainList/chainIds";

const ConnectButton = (props) => {
  const { isConnected, connectWallet, walletAddress, chainId } = props;

  const displayWalletAddress = `0x${walletAddress?.substring(
    2,
    5
  )}...${walletAddress?.substring(38)}`;

  const [isNetworkOpen, setIsNetworkOpen] = useState(false); // isNetworkOpen 상태를 추가합니다.

  const handleAddressClick = () => {
    setIsNetworkOpen(true); // setIsNetworkOpen으로 isNetworkOpen 상태값 변경
  };

  const handleCloseClick = () => {
    setIsNetworkOpen(false);
  };

  const switchToEth = async () => {
    try {
      setIsNetworkOpen(false);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const switchToKlay = async () => {
    try {
      setIsNetworkOpen(false);
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x2019",
            chainName: "Klaytn Mainnet Cypress",
            rpcUrls: ["https://public-node-api.klaytnapi.com/v1/cypress"],
            blockExplorerUrls: ["https://scope.klaytn.com"],
            nativeCurrency: {
              name: "KLAY",
              symbol: "KLAY",
              decimals: 18,
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const switchToGanache = async () => {
    try {
      setIsNetworkOpen(false);
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x539",
            chainName: "Ganache",
            rpcUrls: ["http://127.0.0.1:8545"],
            nativeCurrency: {
              name: "Ganache",
              symbol: "ETH",
              decimals: 18,
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* isNetworkOpen이 true일 때 dimm과 network 보여주기 */}
      {isNetworkOpen && (
        <>
          <div className="dimm" onClick={handleCloseClick}></div>
          <div className="network">
            <article className="modal-title">네트워크 변경</article>
            <img
              className="close"
              onClick={handleCloseClick}
              src="./images/ic-modal-close.svg"
              alt=""
            />
            <button className="deposit" onClick={switchToEth}>
              Ethereum mainnet
            </button>
            <button className="deposit" onClick={switchToKlay}>
              Klaytn Mainnet Cypress
            </button>
            <button className="deposit" onClick={switchToGanache}>
              Ganache Ethereum Testnet
            </button>
          </div>
        </>
      )}
      {isConnected ? (
        <div className="buttonContainer">
          <span
            className="pageButtonBold connectButton"
            onClick={handleAddressClick}
          >
            {chainIds[chainId].network}
          </span>
          <span
            className="pageButtonBold connectButton"
            onClick={handleAddressClick}
          >
            {displayWalletAddress}
          </span>
        </div>
      ) : (
        <div className="btn connectButton" onClick={() => connectWallet()}>
          지갑 연결
        </div>
      )}
    </>
  );
};

export default ConnectButton;
