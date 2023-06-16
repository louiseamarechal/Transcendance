import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

export function Callback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    // let isMounted = true;
    const controller = new AbortController(); // to cancel our request if the component unMount

    async function getCode() {
      try {
        const response = await axios.post(
          "/auth/login",
          {
            code,
          },
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );
        if (response) {
          if (response.data) {
            // console.log({ response_data: response.data });
            // const access_token = response.data.access_token;
            // const refresh_token = response.data.refresh_token;
            // console.log({ access_token });
            // console.log({ refresh_token });
            setAuth(response.data);
          }
        }
        navigate("/game");
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
