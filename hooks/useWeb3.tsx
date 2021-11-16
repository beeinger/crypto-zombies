import { useEffect, useState } from "react";

import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

const useWeb3 = () => {
  const [ethereum, setEthereum] = useState<any>(null),
    [address, setAddress] = useState<string | null>(null),
    [web3, setWeb3] = useState<Web3 | null>(null),
    [chainId, setChainId] = useState<any>(null);

  /*****************************************/
  /* Detect the MetaMask Ethereum provider */
  /*****************************************/

  useEffect(() => {
    detectEthereumProvider().then((provider) => setEthereum(provider));
  }, []);

  useEffect(() => {
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (!ethereum) return;
    else if (ethereum !== window.ethereum)
      console.error("Do you have multiple wallets installed?");
    else if (!web3) {
      let _web3 = new Web3(ethereum);
      setWeb3(_web3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereum]);

  /**********************************************************/
  /* Handle chain (network) and chainChanged (per EIP-1193) */
  /**********************************************************/

  const handleChainChanged = (_chainId: any) => {
    // We recommend reloading the page, unless you must do otherwise
    if (chainId) window.location.reload();
    else setChainId(_chainId);
  };

  useEffect(() => {
    if (ethereum) {
      ethereum.request({ method: "eth_chainId" }).then(handleChainChanged);
      ethereum.on("chainChanged", handleChainChanged);
    }
    return () => {
      if (ethereum) ethereum.removeListener("chainChanged", handleChainChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereum]);

  /***********************************************************/
  /* Handle user accounts and accountsChanged (per EIP-1193) */
  /***********************************************************/

  // For now, 'eth_accounts' will continue to always return an array
  const handleAccountsChanged = (accounts: any[]) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else setAddress(accounts[0]);
  };

  useEffect(() => {
    if (ethereum && window.ethereum) {
      ethereum.request({ method: "eth_accounts" }).then(handleAccountsChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
    }
    return () => {
      if (ethereum)
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereum]);

  /*********************************************/
  /* Access the user's accounts (per EIP-1102) */
  /*********************************************/

  // You should only attempt to request the user's accounts in response to user
  // interaction, such as a button click.
  // Otherwise, you popup-spam the user like it's 1999.
  // If you fail to retrieve the user's account(s), you should encourage the user
  // to initiate the attempt.
  // While you are awaiting the call to eth_requestAccounts, you should disable
  // any buttons the user can click to initiate the request.
  // MetaMask will reject any additional requests while the first is still
  // pending.
  const connect = (() => {
    ethereum &&
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleAccountsChanged)
        .catch((err: any) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("Please connect to MetaMask.");
          } else {
            console.error(err);
          }
        });
  }) as null | (() => void);

  return { connect, address, web3, ethereum };
};

export default useWeb3;
