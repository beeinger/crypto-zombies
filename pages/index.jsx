import React, { useEffect, useState } from "react";

import Web3 from "web3";
import cryptoZombiesABI from "cryptozombies_abi.json";

const cryptoZombiesAddress = "YOUR_CONTRACT_ADDRESS";

export default function About() {
  const [web3, setWeb3] = useState(null),
    [address, setAddress] = useState(null),
    [cryptoZombies, setCryptoZombies] = useState(null);

  const getZombieDetails = (id) =>
      cryptoZombies && cryptoZombies.methods.zombies(id).call(),
    zombieToOwner = (id) =>
      cryptoZombies && cryptoZombies.methods.zombieToOwner(id).call(),
    getZombiesByOwner = (owner) =>
      cryptoZombies && cryptoZombies.methods.getZombiesByOwner(owner).call();

  const handleAddresses = (accounts) => setAddress(accounts[0]);

  useEffect(() => {
    if (!window.ethereum) {
      console.log("Please install MetaMask");
      return;
    }
    let _web3 = new Web3(ethereum);
    setWeb3(_web3);

    ethereum
      .request({ method: "eth_requestAccounts" })
      .then(handleAddresses)
      .catch((err) => console.log(err));

    ethereum.on("accountsChanged", handleAddresses);
  }, []);

  useEffect(() => {
    if (!web3) return;

    setCryptoZombies(
      new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress)
    );
  }, [web3]);

  useEffect(() => {
    if (!address) return;
    console.log(address);
    if (!cryptoZombies) return;
    console.log(cryptoZombies);

    getZombiesByOwner(address).then(async (results) => {
      console.log(results);
      let zombies = await Promise.all(
        results.map((zombieId, idx) =>
          getZombieDetails(zombieId).then((details) => details)
        )
      );
      console.log(zombies);
    });
  }, [address, cryptoZombies]);

  return <div>About</div>;
}
