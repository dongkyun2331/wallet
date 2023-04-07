import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

import ConnectButton from "./components/ConnectButton";

function App() {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [walletAddress, setWalletAddress] = useState(undefined);
  const [currentBalance, setCurrentBalance] = useState(undefined);
  const [chainId, setChainId] = useState(undefined);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = useCallback(async () => {
    try {
      //메타마스크 설치 된 경우
      if (typeof window.ethereum !== "undefined") {
        await getMetamaskData();

        setIsConnected(true);
        //메타마스크 설치 안된 경우
      } else {
        alert("please install MetaMask");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getMetamaskData = async () => {
    const _provider = await getProvider();
    const _signer = await getSigner(_provider);
    await getWalletData(_signer);
  };

  const getProvider = async () => {
    //메타마스크에서 제공하는 provider를 ethers 모듈에 저장
    const provider = await new ethers.providers.Web3Provider(window.ethereum);

    //상태변수 저장
    setProvider(provider);

    return provider;
  };

  const getSigner = async (provider) => {
    //메타마스크에 홈페이지 연동 승인 요청
    await provider.send("eth_requestAccounts", []);

    //메타마스크로 서명 요청
    const signer = provider.getSigner();
    //서명 저장
    setSigner(signer);

    return signer;
  };

  const getWalletData = async (signer) => {
    const result = await Promise.all([
      signer.getAddress(),
      signer.getBalance(),
      signer.getChainId(),
    ]);
    setWalletAddress(result[0]);
    setCurrentBalance(Number(ethers.utils.formatEther(result[1])));
    setChainId(result[2]);
  };

  return (
    <div className="App">
      <nav className="nav">
        <div className="leftNav">
          <img src="images/profile.png" className="img" />
          <h1>KYUNswap</h1>
        </div>
        <div className="rightNav">
          <div className="connectButtonContainer">
            <ConnectButton
              isConnected={isConnected}
              connectWallet={connectWallet}
              walletAddress={walletAddress}
              currentBalance={currentBalance}
              chainId={chainId}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;
