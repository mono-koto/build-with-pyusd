import { useHelloPyusdAddress } from "../hooks/helloPyusd";
import { useToken } from "../hooks/erc20";
import { usePaymentTokenAddress } from "../hooks/paymentToken";
import BlockExplorerLink from "./BlockExplorerLink";

export default function Footer() {
  const helloPyusdAddress = useHelloPyusdAddress();
  const paymentTokenAddress = usePaymentTokenAddress();
  const paymentToken = useToken(paymentTokenAddress);

  return (
    <footer className='overflow-clip text-sm text-gray-500 space-y-1 border-2 border-zinc-500 border-opacity-50 p-3'>
      <p>
        This is an <a href=''>open source</a> project that you can create and
        hack on yourself!
      </p>
      <p>
        Check out our <a href='asds'>PYUSD builders guides</a> to get started.
      </p>
      <p>
        Created with 💛 by <a href='https://mono-koto.com'>Mono Koto</a> in
        collaboration with <a href='https://gardenlabs.xyz'>Garden Labs</a>.
      </p>
      <p>
        HelloPYUSD: <BlockExplorerLink address={helloPyusdAddress} />
      </p>
      {paymentToken.data && (
        <p>
          {paymentToken.data.symbol}:{" "}
          <BlockExplorerLink address={paymentTokenAddress} />
        </p>
      )}
    </footer>
  );
}
