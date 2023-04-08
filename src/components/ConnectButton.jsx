const ConnectButton = (props) => {
  const { isConnected, connectWallet, walletAddress } = props;

  const displayWalletAddress = `0x${walletAddress?.substring(
    2,
    5
  )}...${walletAddress?.substring(38)}`;

  return (
    <>
      {isConnected ? (
        <div className="buttonContainer">
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
