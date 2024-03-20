import { useTotalIssued } from "../hooks/helloPyusd";
import TokenImage from "./TokenImage";

export default function MintPreview() {
  const { data: totalIssued, error } = useTotalIssued();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='text-sm text-gray-500 h-auto aspect-square flex flex-row items-center justify-center'>
      {totalIssued !== undefined ? (
        <TokenImage tokenId={totalIssued + 1n} />
      ) : (
        <div>Loading Token ID...</div>
      )}
    </div>
  );
}
