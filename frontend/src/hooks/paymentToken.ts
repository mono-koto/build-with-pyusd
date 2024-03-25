import { Address } from "viem";
import { useAccount } from "wagmi";
import { paymentTokenAddress } from "../config";

export function usePaymentTokenAddress(): Address {
  const { chain } = useAccount();
  return paymentTokenAddress(chain);
}
