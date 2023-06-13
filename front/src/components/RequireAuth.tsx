import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { auth }  = useAuth();
    const location = useLocation();

    console.log({requireauth: auth.access_token});

    return (
        auth.access_token // is the user logged in ?
            ? <Outlet /> // it is a placeholder that enables RequireAuth component to render its child Routes (see the app for all routes)
            : <Navigate to="/" state={{ from: location }} replace/> // else replace its current location with the Login page
    );
}

export default RequireAuth;