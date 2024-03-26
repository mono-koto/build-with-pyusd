import { Helmet } from "react-helmet-async";
import { useMetadata, useTotalIssued } from "../hooks/helloPyusd";
import TokenImage from "./TokenImage";

export default function MintPreview() {
  const { data: totalIssued, error } = useTotalIssued();

  const { data: metadata } = useMetadata((totalIssued || 0n) + 1n);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='text-sm text-gray-500 h-auto aspect-square flex flex-row items-center justify-center'>
      <Helmet>
        {metadata && (
          <link rel='icon' type='image/svg+xml' href={metadata.image} />
        )}
      </Helmet>
      {totalIssued !== undefined ? (
        <TokenImage tokenId={totalIssued + 1n} />
      ) : (
        <div>Loading Token ID...</div>
      )}
    </div>
  );
}
