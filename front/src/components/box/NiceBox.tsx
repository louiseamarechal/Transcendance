import { PropsWithChildren } from 'react';

type NiceBoxProps = PropsWithChildren<{
  title: string;
}>;

function NiceBox({ children, title }: NiceBoxProps) {
  return (
    <div className="w-3/5 text-center border rounded-[50px] border-[#0000001C] shadow-lg py-3">
      {title && <p className="text-xl font-semibold">{title}</p>}
      <div className="py-1" />
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

export default NiceBox;
