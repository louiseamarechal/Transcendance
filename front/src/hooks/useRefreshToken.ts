import axios from "../api/axios";
import useAuth from "./useAuth";

// we use this function when the access token has expired
const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  // refresh function gives us a Refresh Token
  const refresh = async () => {
    console.log("Refresh function called !");
    const response = await axios.post("/auth/refresh", {}, {headers: {
        'Authorization': `Bearer ${auth.refresh_token}`,
      }}
    ); // this allow to get the secure cookie
    setAuth({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    }); // we return the previous state and we overwrite the accesToken
    return response.data.access_token;
  };
  console.log({insideRefresh: auth.access_token});
  console.log({insideRefresh: auth.refresh_token});

  return refresh;
};

export default useRefreshToken;