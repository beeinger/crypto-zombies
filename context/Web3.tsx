import { createContext } from "react";
import useWeb3 from "hooks/useWeb3";

const Web3Context = createContext<ReturnType<typeof useWeb3>>({
  address: null,
  web3: null,
  ethereum: null,
  connect: null,
});

export default Web3Context;
