import axios from 'axios';
const BASE_URL = 'http://localhost:3000';

export default axios.create({
  baseURL: BASE_URL,
});

// we want two of those because we're going to attach intereceptos to axios Private that will attach
// the JWT Token for us and retry when we get a failure on the ifrst time
// intereceptors work with JWT Token to refresh tokens if our initial request is denied du to an expired
//token (this happens in the background, user won't see what's ahppening but it will keep everything secure
// and we'll continue to refresh this token on schedule)
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }, //, "Access-Control-Allow-Origin": "http://localhost:5173" },
  // withCredentials: true,
});
// all this options will be attached to all the private axios instance requests
