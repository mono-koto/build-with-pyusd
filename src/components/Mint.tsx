import MintPreview from "./MintPreview";
import MintInfo from "./MintInfo";
import MintButton from "./MintButton";

export default function Mint() {
  return (
    <div className='flex flex-col md:flex-row gap-16 items-center'>
      <div className='w-full md:w-3/5'>
        <MintPreview />
      </div>
      <div className='w-full md:w-2/5 space-y-4'>
        <MintButton />
        <MintInfo />
      </div>
    </div>
  );
}
