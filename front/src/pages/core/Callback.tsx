import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../api/axios';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import jwtDecode from 'jwt-decode';
import { useUser } from '../../hooks/useUser';

type JwtDecoded = {
  id: number;
  name: string;
  avatar: string;
  level: number;
  login: string;
};

export function Callback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { setMyId, setMyName, setMyLogin, setMyAvatar, setMyLevel } = useUser();
  const [loading, setLoading] = useState(false);

  console.log({ callback: window.location.origin });

  useEffect(() => {
    const controller = new AbortController(); // to cancel our request if the component unMount

    async function getCode() {
      setLoading(true);
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
          console.log({ access_token: response.data.access_token });
          const user: JwtDecoded = jwtDecode(response.data.access_token);
          setMyId(user.id);
          setMyName(user.name);
          setMyLogin(user.login);
          setMyAvatar(user.avatar);
          setMyLevel(user.level);
          setAuth(response.data);
        }
        setLoading(false);
        navigate('/2FApage');
      } catch (err) {
        // console.log(err);
      }
    }

    getCode();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <p className="text-[25px]">Waiting for connection</p>
      <br />
      {loading ? <div className="spinner"></div> : <div></div>}
    </div>
  );
}

export default Callback;
