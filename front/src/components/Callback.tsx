import { useSearchParams } from "react-router-dom";
import axios from "../api/axios";

const Callback = async () => {
    const [ searchParams ] = useSearchParams();
    const code = searchParams.get("code");

    try {
        const response = await axios.post('/auth/login',
            {
                code
            }, 
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );
        console.log(response);
    } catch (err) {
        console.log(err);
    }
    
    return (
        <div className="h-screen flex items-center justify-center">Coucou c'est le callback</div>
    )
}

export default Callback;