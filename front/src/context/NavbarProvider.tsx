import { createContext, useState } from "react";
import React from "react";
import { NavbarState } from "../types/NavbarState.dto";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NavbarContext = createContext<NavbarState>({
  navbarState: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setNavbarState: () => {},
});

export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [navbarState, setNavbarState] = useState<boolean>(false);

  return (
    <NavbarContext.Provider value={{ navbarState, setNavbarState }}>
      {children}
    </NavbarContext.Provider>
  );
};

export default NavbarContext;
