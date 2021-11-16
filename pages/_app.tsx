import "tailwindcss/tailwind.css";

import type { AppProps } from "next/app";
import Web3Context from "context/Web3";
import useWeb3 from "hooks/useWeb3";

function MyApp({ Component, pageProps }: AppProps) {
  const web3 = useWeb3();

  return (
    <Web3Context.Provider value={web3}>
      <Component {...{ ...pageProps }} />
    </Web3Context.Provider>
  );
}
export default MyApp;
