import { ConnectButton } from "@rainbow-me/rainbowkit";
import Mint from "./Mint";

export default function HelloPyusd() {
  return (
    <div className='container max-w-4xl p-4 md:p-8 mx-auto flex flex-col min-h-screen gap-8'>
      <nav className='flex flex-row gap-4 items-center justify-between'>
        <div>
          <h1 className='text-xl font-black'>Hello PYUSD!</h1>
          <p className='text-sm text-gray-500'>Open edition PYUSD NFT</p>
        </div>
        <ConnectButton />
      </nav>
      <div className='flex-1'>
        <Mint />
      </div>
    </div>
  );
}
