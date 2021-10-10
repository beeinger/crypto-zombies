import React, { useEffect, useState } from "react";

import Web3 from "web3";
import ZombieOwnershipContract from "build/contracts/ZombieOwnership.json";

export default function About() {
  const [web3, setWeb3] = useState(null),
    [address, setAddress] = useState(null),
    [cryptoZombies, setCryptoZombies] = useState(null),
    [zombies, setZombies] = useState([]);

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

    web3.eth.net.getId().then((id) => {
      const deployedNetwork = ZombieOwnershipContract.networks[id],
        instance = new web3.eth.Contract(
          ZombieOwnershipContract.abi,
          deployedNetwork && deployedNetwork.address
        );
      setCryptoZombies(instance);
    });
  }, [web3]);

  useEffect(() => {
    if (!address) return;
    console.log(address);
    if (!cryptoZombies) return;
    console.log(cryptoZombies);

    getZombiesByOwner(address).then(async (results) => {
      let zombies = await Promise.all(
        results.map((zombieId, idx) =>
          getZombieDetails(zombieId).then((details) => details)
        )
      );
      console.log(zombies);
      setZombies(zombies);
    });
  }, [address, cryptoZombies]);

  return (
    <div>
      {JSON.stringify(zombies)}
      <button
        onClick={() => {
          cryptoZombies.methods
            .createRandomZombie("Mikolaj")
            .send({ from: address });
        }}
      >
        AAAA
      </button>
    </div>
  );
}
