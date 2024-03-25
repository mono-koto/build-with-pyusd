import { ReactNode } from "react";

interface MintButtonViewProps {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export default function MintButtonView({
  onClick,
  disabled,
  children,
}: MintButtonViewProps) {
  return (
    <button
      className='mintButton'
      onClick={onClick}
      disabled={Boolean(disabled)}
    >
      {children}
    </button>
  );
}
