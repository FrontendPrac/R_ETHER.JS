import "./App.css";
import { useCallback, useState } from "react";
import ConnectButton from "./components/ConnectButton";
import chainIds from "./chainList/chainIds";
const ethers = require("ethers");

function App() {
  const [isConnected, setIsConnected] = useState(undefined);
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [walletAddress, setWalletAddress] = useState(undefined);
  const [currentBalance, setCurrentBalance] = useState(undefined);
  const [chainId, setChainId] = useState(undefined);

  //! 메타마스크 설치 확인
  const connectWallet = useCallback(async () => {
    try {
      // 메타마스크가 설치 된 경우
      if (typeof window.ethereum !== "undefined") {
        setIsConnected(true);

        const _provider = await getProvider();
        const _signer = await getSigner(_provider);
        await getWalletData(_signer);
      } else {
        // 메타마스크가 설치되어 있지 않은 경우
        alert("메타마스크를 설치해주세요");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  //! RPC 표준 변환
  const getProvider = async () => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    return provider;
  };

  //! 암호화된 개인키 가져오기
  const getSigner = async (provider) => {
    await provider.send("eth_requestAccounts", []);
    // await window.ethereum.request({ method: "eth_requestAccounts" });

    // 메타마스크로 서명 요청
    const signer = provider.getSigner();

    // 서명 저장
    setSigner(signer);
    return signer;
  };

  //! 지갑 정보 가져오기
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
      <ConnectButton isConnected={isConnected} connectWallet={connectWallet} />

      <h1>주소 : {walletAddress}</h1>
      <h1>잔액 : {currentBalance}</h1>
      <h1>코인 : {chainId ? chainIds[chainId].symbol : ""}</h1>
      <h1>네트워크 : {chainId ? chainIds[chainId].name : ""}</h1>
    </div>
  );
}

export default App;
