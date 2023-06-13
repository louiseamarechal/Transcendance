import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import { useEffect, useState } from "react";

export async function Callback () {
    const [ searchParams ] = useSearchParams();
    const code = searchParams.get("code");
    // const [ flag, setFlag ] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        async function getCode () : Promise<{ access_token: string, refresh_token: string}> {
            try {
                // if (flag === true)
                // {
                const response = await axios.post('/auth/login',
                    {
                        code
                    }, 
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }
                    );
                    
                    // setFlag(false)
                    console.log(response);
                    navigate('/game');
                    return (response.data)
                }
                catch (err) {
                    console.log(err);
                    return ()
                };
        }

    }, []);
    
    return (
        // <div className="h-screen flex items-center justify-center">Coucou c'est le callback</div>

    )
}

export default Callback;