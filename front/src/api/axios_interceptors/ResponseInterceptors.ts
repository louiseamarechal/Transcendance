// import { AxiosError } from "axios";
import useRefreshToken from "../../hooks/useRefreshToken";
import { axiosPrivate } from "../axios";

async function ResponseErrorIntercept(error) {
  const refresh = useRefreshToken();

  const prevRequest = error.config;
  // we check the error response status (we expect it to be a 403 if our failure is du to an expired access_token)
  // we also check a custom property on the request that we'll set call sent (if sent does'nt exist or is not true)
  if (error.response.status === 401 && !prevRequest.sent) {
    prevRequest.sent = true; // avoid to get in en endless loop that can happen with 403 so we only want to check it once
    const newAccessToken = await refresh(); // we get the new access token from our refresh function (see useRefreshToken)
    prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
    return axiosPrivate(prevRequest);
  }
  return Promise.reject(error);
}

export default ResponseErrorIntercept;
