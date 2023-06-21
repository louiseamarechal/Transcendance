import { InternalAxiosRequestConfig } from 'axios';
import useAuth from '../../hooks/useAuth';

const RequestIntercept = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const { auth } = useAuth();

  config.headers['Authorization'] = `Bearer ${auth.access_token}`; // if it doesnt exist we set the Authorization headers ourselves with the token inside the auth (from our Context)
  return config;
};
export default RequestIntercept;
