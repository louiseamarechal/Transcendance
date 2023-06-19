import { ReactNode } from 'react';
import useNavbar from '../hooks/useNavbar.ts';

function Page(props: { node: () => ReactNode }) {
  const { navbarState } = useNavbar();

  return (
    <>
      {/* <NavBar/> */}
      <div className="h-screen flex justify-center items-center"></div>
    </>
  );
}

export default Page;
