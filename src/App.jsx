import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import ConnectButton from "./components/ConnectButton";
import Coin from "./components/Coin";

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

  const handleChainChanged = async () => {
    await getMetamaskData();
  };

  const getMetamaskData = async () => {
    const _provider = await getProvider();
    const _signer = await getSigner(_provider);
    await getWalletData(_signer);
    // 메타마스크 계정의 네트워크 ID가 변경되었을 때
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // 계정이 없는 경우 처리
    } else {
      // 메타마스크로 선택된 계정 가져오기
      const selectedAddress = accounts[0];

      // provider, signer 업데이트
      const _provider = await getProvider();
      const _signer = await getSigner(_provider);

      await getWalletData(_signer);

      // 해당 계정으로 업데이트
      setWalletAddress(selectedAddress);
    }
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

  useEffect(() => {
    const interval = setInterval(async () => {
      await getWalletData(signer);
    }, 5000);

    return () => clearInterval(interval);
  }, [signer]);

  const getWalletData = async (signer) => {
    const result = await Promise.all([
      signer.getAddress(),
      signer.getBalance(),
      signer.getChainId(),
    ]);
    const newBalance = Number(ethers.utils.formatEther(result[1]));
    if (newBalance !== currentBalance) {
      setCurrentBalance(newBalance);
    }

    setWalletAddress(result[0]);
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
              chainId={chainId}
            />
          </div>
        </div>
      </nav>
      <div className="title">
        거래소↔내 지갑 간 간편하게 <strong>입출금</strong>하세요
      </div>
      <div className="wallet">
        <h2>wallet</h2>
        <ul className="menu">
          <li>토큰</li>
          <li>수량</li>
          <li>가격</li>
          <li>평가금액</li>
        </ul>
        <Coin
          isConnected={isConnected}
          currentBalance={currentBalance}
          chainId={chainId}
          walletAddress={walletAddress}
        />
      </div>
    </div>
  );
}

export default App;
