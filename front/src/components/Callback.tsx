import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

export function Callback () {
    const [ searchParams ] = useSearchParams();
    const code = searchParams.get("code");
    const navigate = useNavigate();
    const setAuth = useAuth();

    useEffect(() => {
        // let isMounted = true;
        const controller = new AbortController(); // to cancel our request if the component unMount

        async function getCode () {
            try {
                const response = await axios.post('/auth/login',
                    {
                        code
                    }, 
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }
                    );
                    const tokens = response?.data;
                    console.log(tokens);
                    setAuth{ access_token: tokens.access_token, refresh_token: tokens.refresh_token };
                    navigate('/game');
                    // return (response.data)
                }
                catch (err) {
                    console.log(err);
                }
        }

        getCode();

        return ( () => {
                // isMounted = false;
                controller.abort()
            });
    }, []);
    
    return (
        <div className="h-screen flex items-center justify-center">Coucou c'est le callback</div>

    )
}

export default Callback;