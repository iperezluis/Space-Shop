import axios from "axios";

const spaceApi = axios.create({
  baseURL: "/api",
});

spaceApi.interceptors.request.use(async (config) => {
  //  await const token= Cookies.get("token");
  // if(!token){
  //   return;
  // }
  config;

  return config;
});

export default spaceApi;
