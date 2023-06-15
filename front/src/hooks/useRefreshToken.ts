import axios from "../api/axios";
import useAuth from './useAuth'

// we use this function when the access token has expired
const useRefreshToken = () => {

    const { setAuth } = useAuth();

    // refresh function gives us a Refresh Token
    const refresh = async() => {
        const response = await axios.get('/refresh', {
            withCredentials: true
                // `withCredentials` indique si les requêtes inter-site usant des headers
                // Access-Control doivent inclure des informations d’identification.
        }); // this allow to get the secure cookie
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accesToken);
            console.log({
                prev,
            });
            return { ...prev, accesToken: response.data.accesToken } // we return the previous state and we overwrite the accesToken
        });
        console.log(response.data.accesToken);
        return response.data.accesToken;
    }

    return refresh;
};

export default useRefreshToken;