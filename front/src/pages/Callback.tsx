import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useUser } from "../context/UserProvider";
import jwtDecode from "jwt-decode";

type JwtDecoded = {
  name: string;
  avatar: string;
  level: number;
};

export function Callback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { setName, setAvatar, setLevel } = useUser();

  useEffect(() => {
    // let isMounted = true;
    const controller = new AbortController(); // to cancel our request if the component unMount

    async function getCode() {
      try {
        const response = await axios.post(
          '/auth/login',
          {
            code,
          },
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        );
        if (response?.data?.access_token) {
          // console.log({ response_data: response.data });
          // const access_token = response.data.access_token;
          // const refresh_token = response.data.refresh_token;
          console.log({access_token: response.data.access_token});
          // console.log({ refresh_token });
          const user: JwtDecoded = jwtDecode(response.data.access_token);
          setName(user.name);
          setAvatar(user.avatar);
          setLevel(user.level);
          setAuth(response.data);
        }
        navigate('/game');
      } catch (err) {
        console.log(err);
      }
    }

    getCode();

    return () => {
      // isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      Coucou c'est le callback
    </div>
  );
}

export default Callback;
