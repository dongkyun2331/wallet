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
