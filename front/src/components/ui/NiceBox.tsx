import { PropsWithChildren } from 'react';

type NiceBoxProps = PropsWithChildren<{
  title?: string;
}>;

function NiceBox({ children, title = '' }: NiceBoxProps) {
  return (
    <div className="w-3/5 text-center border rounded-[50px] border-[#0000001C] shadow-lg m-3 p-3">
      {title && <p className="text-xl font-semibold pb-4">{title}</p>}
      <div className="flex-col-center">{children}</div>
    </div>
  );
}

export default NiceBox;
