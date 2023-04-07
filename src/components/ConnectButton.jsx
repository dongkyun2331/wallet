import chainIds from "../chainList/chainIds";

const ConnectButton = (props) => {
  const { isConnected, connectWallet, currentBalance, walletAddress, chainId } =
    props;

  const displayWalletAddress = `0x${walletAddress?.substring(
    2,
    5
  )}...${walletAddress?.substring(38)}`;

  const displayCurrentBalance = `${currentBalance?.toFixed(4)}`;

  return (
    <>
      {isConnected ? (
        <div className="buttonContainer">
          <span className="pageButtonBold connectButton">
            {displayCurrentBalance} {chainIds[chainId].symbol}
          </span>
          <span className="pageButtonBold connectButton">
            {chainIds[chainId].name}
          </span>
          <span className="pageButtonBold connectButton">
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
