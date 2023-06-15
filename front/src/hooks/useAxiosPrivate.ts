// this hoook will attach the interceptors to the axios instance
import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

// this function is to attach the axios interceptors to the axios instance
const useAxiosPrivate = () => {

    const refresh = useRefreshToken(); // return the refreshed token
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) // if this configuration headers does not exists we know it's not a retry but the first attempt so the configuration headers was not set
                {
                    config.headers['Authorization'] = `Bearer ${auth?.access_token}`; // if it doesnt exist we set the Authorization headers ourselves with the token inside the auth (from our Context)
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response, // if the response is good we rturn the response
            async (error) => { // otherwise we have an async error handler if for exemple our acces has expired (if it has a short life span)
                const prevRequest = error?.config; // we're getting the prev request
                // we check the error response status (we expect it to be a 403 if our failure is du to an expired access_token)
                // we also check a custom property on the request that we'll set call sent (if sent does'nt exist or is not true)
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true; // avoid to get in en endless loop that can happen with 403 so we only want to check it once
                    const newAccessToken = await refresh(); // we get the new access token from our refresh function (see useRefreshToken)
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                // if first part not true we nee to return the error
                return Promise.reject(error);
            }
        );

        // cleanup fct to clean up the response interceptors because they can keep on chaining up and cause confusions
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh]) // => dependancy array 

    return axiosPrivate; // return the axios instance with the interceptors attached
}

export default useAxiosPrivate;