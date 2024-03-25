import { useMetadata } from "../hooks/helloPyusd";

export default function TokenImage({
  tokenId,
}: {
  tokenId: bigint | undefined;
}) {
  const { data: metadata, error, isLoading } = useMetadata(tokenId!);
  if (isLoading) {
    return <span>Loading Metadata...</span>;
  }
  if (!metadata) {
    return <span>Error: {error?.message}</span>;
  }
  return <img src={metadata.image} className='w-full h-full aspect-auto' />;
}
