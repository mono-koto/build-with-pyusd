import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import HelloPyusd from "./components/HelloPyusd";
import { wagmiConfig } from "./config";

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <HelloPyusd />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
