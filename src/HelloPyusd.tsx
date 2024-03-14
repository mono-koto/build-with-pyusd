import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function HelloPyusd() {
  return (
    <>
      <div className='flex flex-col gap-4 items-center justify-center min-h-screen'>
        <h1 className='text-xl'>Hello PYUSD!</h1>
        <ConnectButton />
      </div>
    </>
  );
}
