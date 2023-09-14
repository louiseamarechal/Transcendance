import { MouseEventHandler, PropsWithChildren } from 'react';

type NiceButtonProps = PropsWithChildren<{
  onClick: MouseEventHandler<HTMLButtonElement>;
}>;

function NiceButton({ children, onClick }: NiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className="border rounded-[50px] border-[#0000001C] shadow-lg m-3 p-3 hover:font-bold hover:border-black"
    >
      {children}
    </button>
  );
}

export default NiceButton;
