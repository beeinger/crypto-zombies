import { useEffect, useState } from "react";

import Web3Context from "context/Web3";
import ZombieOwnershipContract from "build/contracts/ZombieOwnership.json";
import { useContext } from "react";

const useCryptoZombies = () => {
  const { web3, address } = useContext(Web3Context),
    [cryptoZombies, setCryptoZombies] = useState<any>(null),
    [ready, setReady] = useState(false);

  const getZombiesByOwner = (owner: string) =>
      cryptoZombies && cryptoZombies.methods.getZombiesByOwner(owner).call(),
    getZombieDetails = (id: number) =>
      cryptoZombies && cryptoZombies.methods.zombies(id).call(),
    getAllZombies = () =>
      address && cryptoZombies
        ? getZombiesByOwner(address).then(async (results: any) => {
            let zombies = await Promise.all(
              results.map((zombieId: number, idx: number) =>
                getZombieDetails(zombieId).then((details: any) => details)
              )
            );
            return zombies;
          })
        : new Promise((resolve) => resolve([])),
    zombieToOwner = (id: number) =>
      cryptoZombies && cryptoZombies.methods.zombieToOwner(id).call(),
    createAZombie = (name: string) => {
      cryptoZombies.methods
        .createRandomZombie(name)
        .send({ from: address })
        .then(getAllZombies);
    };

  useEffect(() => {
    if (!web3 || !address) return;
    web3.eth.net.getId().then((id) => {
      const deployedNetwork =
        ZombieOwnershipContract.networks[
          String(id) as keyof typeof ZombieOwnershipContract.networks
        ];

      if (!deployedNetwork) {
        console.log("Contract not deployed to detected network.");
        return;
      }

      const instance = new web3.eth.Contract(
        ZombieOwnershipContract.abi as any,
        deployedNetwork.address
      );
      setCryptoZombies(instance);
      setReady(true);
    });
  }, [web3, address]);

  return { ready, getAllZombies, createAZombie };
};

export default useCryptoZombies;
