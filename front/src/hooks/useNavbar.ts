import { useContext } from "react";
import NavbarContext from "../context/NavbarProvider";

const useNavbar = () => {
    return useContext(NavbarContext);
}

export default useNavbar;